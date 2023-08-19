using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Activity = Domain.Activity;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> HandleV1(Query request, CancellationToken cancellationToken)
            {
                var result = await _context.Users
                .Include(u => u.Activities)
                .ThenInclude(u => u.Activity)
                .SingleOrDefaultAsync(x => x.UserName == request.Username, cancellationToken);
                if (result == null) return null;
                var userActivitiesDto = new List<UserActivityDto>();
                var userActivities = new List<Domain.Activity>();
                userActivities = result.Activities.Select(x => x.Activity).ToList();
                switch (request.Predicate)
                {
                    case "past":
                        userActivities = result.Activities.Where(x => x.Activity.Date < DateTime.UtcNow).Select(x => x.Activity).ToList();

                        break;
                    case "future":
                        userActivities = result.Activities.Where(x => x.Activity.Date > DateTime.UtcNow).Select(x => x.Activity).ToList();
                        break;
                    case "hosting":
                        userActivities = result.Activities.Where(x => x.IsHost).Select(a => a.Activity).ToList();
                        break;
                }
                foreach (var activity in userActivities)
                {
                    userActivitiesDto.Add(new UserActivityDto
                    {
                        Category = activity.Category,
                        Date = activity.Date,
                        HostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName,
                        Id = activity.Id,
                        Title = activity.Title
                    });
                }

                if (userActivitiesDto == null || userActivitiesDto.Count == 0) return null;
                userActivitiesDto.OrderByDescending(a => a.Date);
                return Result<List<UserActivityDto>>.Success(userActivitiesDto);

            }
            public async Task<Result<List<UserActivityDto>>> HandleV1Improved(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                .Where(a => a.Attendees.Any(x => x.AppUser.UserName == request.Username))
                .OrderByDescending(a => a.Date)
                .AsQueryable();
                var userActivitiesDto = new List<UserActivityDto>();
                switch (request.Predicate)
                {
                    case "past":
                        query = query.Where(x => x.Date < DateTime.UtcNow);

                        break;
                    case "future":
                        query = query.Where(x => x.Date > DateTime.UtcNow); break;
                    case "hosting":
                        query = query.Where(x => x.Attendees.Any(x => x.IsHost && x.AppUser.UserName == request.Username)); break;
                }
                var result = await query.ToListAsync();

                userActivitiesDto = result.Select(activity => new UserActivityDto
                {
                    Category = activity.Category,
                    Date = activity.Date,
                    HostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName,
                    Id = activity.Id,
                    Title = activity.Title
                }
                ).ToList();

                if (userActivitiesDto == null) return null;
                return Result<List<UserActivityDto>>.Success(userActivitiesDto);

            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .OrderByDescending(d => d.Date)
                    .Where(d => d.Attendees.Any(u => u.AppUser.UserName == request.Username))
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(x => x.Date <= DateTime.UtcNow),
                    "hosting" =>
                         query.Where(x => x.HostUsername == request.Username),
                    _ => query.Where(x => x.Date >= DateTime.UtcNow)
                };

                var activities = await query.ToListAsync(cancellationToken);
                return Result<List<UserActivityDto>>.Success(activities);
            }


        }
    }
}