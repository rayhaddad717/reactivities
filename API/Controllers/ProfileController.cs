using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile([FromBody] ProfileDto profileDto)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { DisplayName = profileDto.DisplayName, Bio = profileDto.Bio }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetProfileActivities(string username, [FromQuery] string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate }));
        }
    }
}