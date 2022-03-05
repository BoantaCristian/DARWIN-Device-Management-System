using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DeviceManagementSystem.Models.DbModels
{
    public class DeviceDetails
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string Type { get; set; }
        public string OperatingSystem { get; set; }
        public string Processor { get; set; }
        public string RamAmmount { get; set; }
        public virtual User User { get; set; }
    }
}
