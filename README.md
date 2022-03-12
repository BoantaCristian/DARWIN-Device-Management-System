### DARWIN-Device-Management-System

Demo video: [Device Management System](https://www.youtube.com/watch?v=s-CMQloGCl8&list=PL6ntedEPd4LNxf9-jg7oqmyWHoSElMgAV&index=9)

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
 
 - Estimations
  * total time: 7 days from start to finish
  * 4 days of work: 
      * 1st day (~3h): project interpretation + api basics -> configure project, add db connection, authentication, models, migrations, database, user controler basics (crud)
      * 2nd day (~3h): user interface -> initialize components, set graphics, add routing, add guards, assign desired components to web pages, develop login and register
      * 3rd day (~6h): user interface + device controller -> update home page (logged client) dynamically (devices list, manage client's device) and develop view device details
      * 4th day (~9h): user interface + controllers methods -> update admin dashboard page dinamically (user list, add and delete user, device list, add,update, delete, (un)assign and change device)
 
- Challanges
  * choosing a minimal user interface style
  * deal with every error handling, every case and exceptions
  * integration of device management in device list
  
- Improvements
  *  change and assign device from same method in api (currently separated because null reference exception of old device when assign)
  *  code optimization: 
      *  add interfaces to all local data
      *  use async methods everywhere and remove setInterval methods (ex: after getUser, the initialization of sorting and pagination should be done async after assigning received users in a local variable)
