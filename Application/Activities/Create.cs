using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //commands dont return anything this is why there is no generic type passed to IRequest
        public class Command : IRequest{
            //this is what we receive in api request
            public Activity Activity{get;set;}
        }

        public class Handler : IRequestHandler<Command>{
        private readonly DataContext _context;
            public Handler(DataContext context){
            _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken){
                //only adds it in memory
                _context.Activities.Add(request.Activity);
                //save changes to database
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}