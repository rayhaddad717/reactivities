using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {   //only in cloudinary=> nothing to do with database
        Task<PhotoUploadResult> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}