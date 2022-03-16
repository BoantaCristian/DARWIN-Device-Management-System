using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
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
using Microsoft.IdentityModel.Tokens;

namespace DeviceManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private ApplicationContext _context;
        private UserManager<User> _userManager;
        private ApplicationSettings _appSettings;

        public UserController(ApplicationContext context, UserManager<User> userManager, IOptions<ApplicationSettings> appSettings)
        {
            _context = context;
            _userManager = userManager;
            _appSettings = appSettings.Value;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<Object> Register(RegisterDTO model)
        {
            var newUser = new User
            {
                UserName = model.UserName,
                Email = model.Email,
                Location = model.Location
            };
            try
            {
                var emailExists = await _userManager.FindByEmailAsync(model.Email);

                if (emailExists != null)
                    return BadRequest(new { message = "Email already taken" });

                var result = await _userManager.CreateAsync(newUser, model.Password);
                await _userManager.AddToRoleAsync(newUser, model.Role);

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var role = await _userManager.GetRolesAsync(user);
                IdentityOptions _options = new IdentityOptions();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserId", user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(10),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
            {
                return BadRequest(new { message = "Incorrect username or password" });
            }
        }

        [HttpGet]
        [Authorize]
        [Route("GetUser")]
        public async Task<Object> GetUser()
        {
            var userId = User.Claims.First(c => c.Type == "UserId").Value;

            var user = await _userManager.FindByIdAsync(userId);
            var roleObject = await _userManager.GetRolesAsync(user);
            var role = roleObject.First();


            if (user != null)
            {
                return new
                {
                    user.UserName,
                    user.Email,
                    user.Location,
                    role,
                };
            }
            else
            {
                return BadRequest(new { message = "User not found!" });
            }
        }

        [HttpDelete("{userName}")]
        [Route("DeleteUser/{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var userToDelete = await _userManager.FindByNameAsync(userName);
            var roleObject = await _userManager.GetRolesAsync(userToDelete);
            var role = roleObject.FirstOrDefault();

            if (userToDelete != null)
            {
                if (role == "Admin")
                {
                    var admins = await _userManager.GetUsersInRoleAsync("Admin");
                    if (admins.Count() == 1)
                        return BadRequest(new { message = "Cannot delete last admin!" });

                }

                try
                {
                    foreach (DeviceDetails device in _context.DeviceDetails.Include(i => i.User))
                    {
                        if(device.User == userToDelete)
                            return BadRequest(new { message = "User has device!" });
                    }

                    await _userManager.RemoveFromRoleAsync(userToDelete, role);
                    await _userManager.DeleteAsync(userToDelete);

                    return Ok(userToDelete);
                }
                catch (Exception e)
                {

                    throw e;
                }
            }
            else
            {
                return BadRequest(new { message = "User not found!" });
            }
        }

        [HttpGet]
        [Route("GetUsers")]
        [Authorize(Roles = "Admin")]
        public async Task<Object> GetUsers()
        {
            var admins = (await _userManager.GetUsersInRoleAsync("Admin")).Select(s => new { s.Id, s.UserName, s.Email, s.Location, Role = "Admin" }).ToList();
            var clients = (await _userManager.GetUsersInRoleAsync("Client")).Select(s => new { s.Id, s.UserName, s.Email, s.Location ,Role = "Client" }).ToList();

            var users = new List<Object>();

            foreach (var admin in admins)
                users.Add(admin);

            foreach (var client in clients)
                users.Add(client);

            return users;
        }
        
        [HttpGet]
        [Route("GetFreeUsers")]
        [Authorize(Roles = "Admin")]
        public Object GetFreeUsers()
        {
            try
            {
                var freeUsers =
                    from user in _context.Users
                    join device in _context.DeviceDetails on user.Id equals device.User.Id into ps
                    from free in ps.DefaultIfEmpty()
                    where user.Location != ""
                    select new { user.UserName, DeviceName = free == null ? "No device" : free.Name};

                return freeUsers;
            }
            catch (Exception e)
            {

                throw e;
            }
        }
    }
}