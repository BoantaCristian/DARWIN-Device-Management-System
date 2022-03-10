using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeviceManagementSystem.Models.DbModels
{
    public class User : IdentityUser
    {
        public string Location { get; set; }
        public virtual ICollection<DeviceDetails> DeviceDetails { get; set; }
    }
}
