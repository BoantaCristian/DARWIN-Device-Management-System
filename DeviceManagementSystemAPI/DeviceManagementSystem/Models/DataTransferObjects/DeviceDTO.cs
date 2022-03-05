using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeviceManagementSystem.Models.DataTransferObjects
{
    public class DeviceDTO
    {
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string Type { get; set; }
        public string OperatingSystem { get; set; }
        public string Processor { get; set; }
        public double RamAmount { get; set; }
    }
}
