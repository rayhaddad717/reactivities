# reactivities
# About
Reactivities is a community-driven web application where people can create, share, and participate in various activities. Users can organize events, join others' activities, and engage in social interactions.

# Features
* User registration and authentication
* Create, edit, and delete activities
* View and join activities created by others
* Real-time updates using SignalR
* Interactive map integration for activity locations
* Activity feed showcasing recent updates
* User profiles with activity history

# Technologies Used
* React.js
* ASP.NET Core
* SignalR (for real-time updates)
* Entity Framework Core (ORM)
* Sqlite, PostgreSQL
* HTML, CSS, JavaScript/TypeScript

# Getting Started
## Prerequisites
* Node.js and npm (Node Package Manager)
* .NET Core SDK
* PostgreSQL

## Installation
* clone the repository
<br/> git clone https://github.com/your-username/reactivities.git
<br/> cd reactivities
* Install frontend dependencies:
<br/> cd client-app
<br/> npm install
* Install backend dependencies:
<br/> cd API/
<br/> dotnet restore

## Usage
* Start the frontend development server:
<br/> cd client-app
<br/> npm start
<br/> This will run the React application on http://localhost:3000.
* Start the backend server:
<br/> cd API
<br/> dotnet run
<br/> This will launch the .NET Core API on http://localhost:5000

# License
* This project is licensed under the MIT License.

# Acknowledgements

This project was developed as a part of the course "Complete guide to building an app with .Net Core and React" by Neil Cummings.
