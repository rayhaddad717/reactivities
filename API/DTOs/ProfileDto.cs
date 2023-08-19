

using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ProfileDto
    {
        [Required]
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }
}