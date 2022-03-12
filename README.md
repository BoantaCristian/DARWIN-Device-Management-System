### DARWIN-Device-Management-System

The application has a REST architecture (Representational State Transfer):

- Back-end
  * ASP.NET Core Web Api
  * Entity Framework Core
  * SQL Server
 
 - Front-end
  * AngularJS running on Node through npm (node package manager)
  * Angular Material
  * Bootstrap
  * Toastr Notification
  
- Languages
  * Backend: C#, SQL, LINQ
  * Frontend: JS/TS, HTML, CSS
  
- Tools
  * Visual Studio for Api
  * Visual Studio Code as the code editor for the client side
  * SQL Server Management Studio for database
  * Postman to check Api http methods
  
- Challanges
  * choosing a minimal user interface style
  * deal with every error handling, every case and exceptions
  * integration of device management in device list
  
- Improvements
  *  change and assign device from same method in api (currently separated because null reference exception of old device when assign)
  *  code optimization: 
      *  add interfaces to all local data
      *  use async methods everywhere and remove setInterval methods (ex: after getUser, the initialization of sorting and pagination should be done async after assigning received users in a local variable)
