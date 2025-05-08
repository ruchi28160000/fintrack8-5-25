using System.Text.Json;
using PortfolioTrackerApi.Models;

namespace PortfolioTrackerApi.Services
{
    public class UserService : IUserService
    {
        private readonly string _filePath = "Data/user.json";

        public async Task<User?> ValidateCredentialsAsync(string userName, string password)
        {
            var users = await LoadUsersAsync();
            return users.FirstOrDefault(u => 
            (u.UserName == userName || u.Email == userName) && u.Password == password);
        }

                public async Task<bool> RegisterUserAsync(User newUser)
        {
            var users = await LoadUsersAsync();
        
            // Check if email already exists
            if (users.Any(u => u.Email == newUser.Email))
                return false;
        
            // Check password confirmation
            if (newUser.Password != newUser.ConfirmPassword)
                return false;
        
            // Assign a new ID by incrementing the highest existing ID
            newUser.userId = users.Any() ? users.Max(u => u.userId) + 1 : 1;
        
            // Add user to list
            users.Add(newUser);
            await SaveUsersAsync(users);
            return true;
        }

                // filepath: c:\Users\shama.k\Documents\backend 4.0\Services\UserService.cs
        private async Task<List<User>> LoadUsersAsync()
        {
            if (!File.Exists(_filePath))
                return new List<User>();
        
            try
            {
                var json = await File.ReadAllTextAsync(_filePath);
                return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
            }
            catch (JsonException)
            {
                // Log the error (optional) and return an empty list
                return new List<User>();
            }
        }

        private async Task SaveUsersAsync(List<User> users)
        {
            var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}
