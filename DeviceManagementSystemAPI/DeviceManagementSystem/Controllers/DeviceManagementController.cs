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


        [HttpGet]
        [Route("GetDevicesWithUsers")]
        public IActionResult GetDevicesWithUsers()
        {
            var devicesWithUsers = _context.DeviceDetails.Include(i => i.User).Select(s => new { s.Id, DeviceName = s.Name, s.User.UserName, s.User.Email });
            //linq:
            //var devicesWithUsersLinq = (from deviceWithUsers in _context.DeviceDetails
            //                            join users in _context.Users on deviceWithUsers.User.Id equals users.Id
            //                            select new
            //                            {
            //                                users.UserName,
            //                                users.Email,
            //                                deviceWithUsers.Id,
            //                                DeviceName = deviceWithUsers.Name
            //                            });

            return Ok(devicesWithUsers);
        }
        
        [HttpGet("{userName}")]
        [Route("GetLoggedUserDevice/{userName}")]
        public IActionResult GetLoggedUserDevice(string userName)
        {
            var device = _context.DeviceDetails.Include(i => i.User).Where(w => w.User.UserName == userName).Select(s => new { s.Id, DeviceName = s.Name, s.User.UserName, s.User.Email });

            return Ok(device);
        }

        [HttpGet]
        [Route("GetAllDevices")]
        public IEnumerable<DeviceDetails> GetAllDevices()
        {
            return _context.DeviceDetails;
        }

        [HttpGet("{deviceId}")]
        [Route("GetDeviceDetails/{deviceId}")]
        public async Task<IActionResult> GetDeviceDetails(int deviceId)
        {
            var device = await _context.DeviceDetails.Where(w => w.Id == deviceId).FirstAsync();

            return Ok(device);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("AddDevice")]
        public async Task<IActionResult> AddDevice(DeviceDTO model)
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

            foreach (DeviceDetails device in _context.DeviceDetails)
            {
                if (device.Name == newDevice.Name)
                    return BadRequest(new { message = "device already exists!" });
            }

            try
            {
                var result = await _context.DeviceDetails.AddAsync(newDevice);
                await _context.SaveChangesAsync();

                return Ok();
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
            var deviceToDelete = await _context.DeviceDetails.Include(i => i.User).Where(w => w.Id == deviceId).FirstAsync();

            if (deviceToDelete != null)
            {
                if (deviceToDelete.User != null)
                    return BadRequest(new { message = "Device is assigned to a user!" });
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

        [HttpDelete("{deviceId}")]
        [Authorize(Roles = "Admin, Client")]
        [Route("RemoveDevice/{deviceId}")]
        public async Task<IActionResult> RemoveDevice(int deviceId)
        {
            var deviceToRemove = await _context.DeviceDetails.Include(i => i.User).Where(w => w.Id == deviceId).FirstAsync();

            if (deviceToRemove != null)
            {
                try
                {
                    deviceToRemove.User = null;

                    _context.Entry(deviceToRemove).State = EntityState.Modified;

                    await _context.SaveChangesAsync();

                    return Ok(deviceToRemove);
                }
                catch (Exception)
                {

                    throw;
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

        [HttpGet("{deviceId}/{userName}")]
        [Route("AssignDevice/{deviceId}/{userName}")]
        [Authorize(Roles = "Admin, Client")]
        public async Task<IActionResult> AssignDevice(int deviceId, string userName)
        {
            var currentUser = await _userManager.FindByNameAsync(userName);
            var newDevice = await _context.FindAsync<DeviceDetails>(deviceId);

            try
            {
                if (currentUser != null && newDevice != null)
                {
                    newDevice.User = currentUser;

                    _context.Entry(newDevice).State = EntityState.Modified;

                    await _context.SaveChangesAsync();

                    return Ok(newDevice);
                }
                else
                    return BadRequest(new { message = "Device or user not found!" });
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Something went wrong!" });
                throw;
            }
        }
        
        [HttpGet("{deviceId}/{userName}")]
        [Route("ChangeDevice/{deviceId}/{userName}")]
        [Authorize(Roles = "Admin, Client")]
        public async Task<IActionResult> ChangeDevice(int deviceId, string userName)
        {
            var currentUser = await _userManager.FindByNameAsync(userName);
            var newDevice = await _context.FindAsync<DeviceDetails>(deviceId);
            var oldDevice = await _context.DeviceDetails.Include(i => i.User).Where(w => w.User.UserName == userName).FirstAsync();

            try
            {
                if (currentUser != null && newDevice != null && oldDevice != null)
                {
                    newDevice.User = currentUser;
                    oldDevice.User = null;

                    _context.Entry(oldDevice).State = EntityState.Modified;
                    _context.Entry(newDevice).State = EntityState.Modified;

                    await _context.SaveChangesAsync();

                    return Ok(newDevice);
                }
                else
                    return BadRequest(new { message = "Device or user not found!" });
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Something went wrong!" });
                throw;
            }
        }
    }
    
}