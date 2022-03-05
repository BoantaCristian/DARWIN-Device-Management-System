using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DeviceManagementSystem.Models;
using DeviceManagementSystem.Models.ApplicationContext;
using DeviceManagementSystem.Models.DataTransferObjects;
using DeviceManagementSystem.Models.DbModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DeviceManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceManagementController : ControllerBase
    {
        private ApplicationContext _context;
        private UserManager<User> _userManager;
        private ApplicationSettings _appSettings;

        public DeviceManagementController(ApplicationContext context, UserManager<User> userManager, IOptions<ApplicationSettings> appSettings)
        {
            _context = context;
            _userManager = userManager;
            _appSettings = appSettings.Value;
        }

        [Route("api/[controller]")]
        [ApiController]
        public class UserController : ControllerBase
        {
            private ApplicationContext _context;
            private UserManager<User> _userManager;

            public UserController(ApplicationContext context, UserManager<User> userManager)
            {
                _userManager = userManager;
                _context = context;
            }

            [HttpGet]
            [Route("GetDevicesWithUsers")]
            public IActionResult GetDevicesWithUsers()
            {
                var devicesWithUsers = _context.Users.Include(i => i.Device).Select(s => new { s.UserName, s.Email, DeviceId = s.Device.Id, DeviceName = s.Device.Name});
                //linq:
                //var devicesWithUsersLinq = (from deviceWithUsers in _context.Users
                //                            join deviceDetails in _context.DeviceDetails on deviceWithUsers.Device.Id equals deviceDetails.Id
                //                            select new
                //                            {
                //                                deviceWithUsers.UserName,
                //                                deviceWithUsers.Email,
                //                                DeviceId = deviceWithUsers.Device.Id,
                //                                DeviceName = deviceWithUsers.Device.Name
                //                            });

                return Ok(devicesWithUsers);
            }

            [HttpGet]
            [Route("GetAllDevices")]
            public IEnumerable<DeviceDetails> GetAllDevices()
            {
                return _context.DeviceDetails;
            }

            [HttpGet("{deviceId}")]
            [Route("GetDeviceById/{deviceId}")]
            public IActionResult GetDevicesWithUsers(int deviceId)
            {
                var device = _context.DeviceDetails.Where(w => w.Id == deviceId);

                return Ok(device);
            }

            [HttpPost]
            [Authorize(Roles = "Admin, Client")]
            [Route("AddDevice")]
            public async Task<IActionResult> AddAssociation(DeviceDTO model)
            {
                var newDevice = new DeviceDetails
                {
                    Name = model.Name,
                    Manufacturer = model.Manufacturer,
                    Type = model.Type,
                    OperatingSystem = model.OperatingSystem,
                    Processor = model.Processor,
                    RamAmmount = model.RamAmount
                };

                try
                {
                    var result = await _context.DeviceDetails.AddAsync(newDevice);
                    await _context.SaveChangesAsync();

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex);
                    throw ex;
                }


            }

            [HttpDelete("{deviceId}")]
            [Authorize(Roles = "Admin")]
            [Route("DeleteDevice/{deviceId}")]
            public async Task<IActionResult> DeleteDevice(int deviceId)
            {
                var deviceToDelete = await _context.FindAsync<DeviceDetails>(deviceId);

                if (deviceToDelete != null)
                {
                    var deviceHasUser = false;
                    foreach (User user in _context.Users.Include(i => i.Device).Where(w => w.Device.Id == deviceId))
                    {
                        if (user.Device.Id == deviceId)
                        {
                            deviceHasUser = true;
                            break;
                        }
                    }
                    if (deviceHasUser)
                        return BadRequest(new { message = "Device is assigned to users!" });
                    else
                    {
                        try
                        {
                            _context.DeviceDetails.Remove(deviceToDelete);
                            await _context.SaveChangesAsync();

                            return Ok(deviceToDelete);
                        }
                        catch (Exception e)
                        {

                            throw e;
                        }
                    }
                }
                else
                    return BadRequest(new { message = "Device not found!" });
            }

            [HttpPut("{deviceId}")]
            [Route("UpdateDevice/{deviceId}")]
            [Authorize(Roles = "Admin")]
            public async Task<IActionResult> UpdateDevice(int deviceId, DeviceDTO model)
            {
                try
                {
                    var currentDevice = await _context.DeviceDetails.FindAsync(deviceId);

                    if (currentDevice != null)
                    {
                        currentDevice.Name = model.Name;
                        currentDevice.Manufacturer = model.Manufacturer;
                        currentDevice.Type = model.Type;
                        currentDevice.OperatingSystem = model.OperatingSystem;
                        currentDevice.Processor = model.Processor;
                        currentDevice.RamAmmount = model.RamAmount;

                        _context.Entry(currentDevice).State = EntityState.Modified;
                        await _context.SaveChangesAsync();

                        return Ok(currentDevice);
                    }
                    else
                    {
                        return BadRequest(new { message = "Device not found!" });
                    }
                }
                catch (Exception ex)
                {

                    throw ex;
                }

            }
        }
    }
}