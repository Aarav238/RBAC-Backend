# SecureAccess: Authentication & RBAC System

## Table of Contents

- [SecureAccess: Authentication \& RBAC System](#secureaccess-authentication--rbac-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
      - [Backend:](#backend)
      - [Authentication \& Authorization:](#authentication--authorization)
      - [Validation:](#validation)
      - [Security:](#security)
      - [Utilities:](#utilities)
      - [Logging:](#logging)
      - [Testing:](#testing)
  - [Architecture](#architecture)
  - [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
        - [1. Clone the Repository](#1-clone-the-repository)
        - [2. Install Dependencies](#2-install-dependencies)
      - [Environment Variables](#environment-variables)
      - [Seeding the Database](#seeding-the-database)
        - [1. Navigate to the Project Directory](#1-navigate-to-the-project-directory)
        - [2. Run the Seed Script](#2-run-the-seed-script)
        - [3. Expected Output:](#3-expected-output)
      - [Running the Application](#running-the-application)

## Overview
SecureAccess is a robust backend application built with Node.js, Express, and MongoDB, implementing Authentication, Authorization, and Role-Based Access Control (RBAC). Leveraging Zod for schema validation, SecureAccess ensures secure user management and controlled access to resources based on user roles.

## Features

- **User Authentication**: Secure registration, login, logout, and token refresh mechanisms.
- **Role-Based Access Control (RBAC)**: Define and manage user roles (Admin, Moderator, User) with specific permissions.
- **Protected Routes**: Access to routes is restricted based on user roles and authentication status.
- **Data Validation**: Robust input validation using Zod to ensure data integrity.
- **Security Enhancements**:
  - Password hashing with bcrypt.
  - Data sanitization to prevent NoSQL injection.
  - HTTP headers secured with Helmet.
  - Rate limiting to prevent brute-force attacks.
- **Logging**: Detailed logging of events and errors using a custom logger.
- **Error Handling**: Centralized error handling to manage and respond to errors gracefully.


## Technologies Used

#### Backend:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

#### Authentication & Authorization:
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

#### Validation:
- [Zod](https://zod.dev/)

#### Security:
- [Helmet](https://helmetjs.github.io/)
- [express-mongo-sanitize](https://github.com/fiznool/express-mongo-sanitize)
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit)

#### Utilities:
- [dotenv](https://github.com/motdotla/dotenv)
- [cors](https://github.com/expressjs/cors)
- [morgan](https://github.com/expressjs/morgan)

#### Logging:
- [Winston (Custom implementation)](https://github.com/winstonjs/winston)

#### Testing:
**Note**: Testing is currently set up for future integration using [Postman](https://www.postman.com/).

## Architecture
The application follows a Model-View-Controller (MVC) architecture with the following structure:
```bash

SecureAccess/
├── config/
│   ├── db.js
│   └── seed.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   ├── authorize.js
│   └── errorHandler.js
├── models/
│   ├── Role.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── protected.js
├── utils/
│   ├── logger.js
│   └── validators.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Getting Started

#### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Git](https://git-scm.com/) (for version control)
- [Postman](https://www.postman.com/) (for API testing)


#### Installation 

##### 1. Clone the Repository

```bash

git clone https://github.com/<yourusername>/SecureAccess.git
cd SecureAccess
```


##### 2. Install Dependencies

```bash
npm install
```


#### Environment Variables


Create a .env file in the root directory and configure the necessary environment variables.
`.env`:
```bash
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/secureaccess_db
# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key

# Environment
NODE_ENV=development
```
Notes:

- Replace your_jwt_secret_key and your_refresh_token_secret_key with secure, randomly generated strings.
- Ensure that MONGO_URI_TEST points to a separate database to isolate test data.


#### Seeding the Database
##### 1. Navigate to the Project Directory
```bash
cd SecureAccess
```

##### 2. Run the Seed Script
```bash
node config/seed.js
```

##### 3. Expected Output:
```bash
Roles seeded successfully.
Admin user seeded successfully.
```


Details:

- Roles: Inserts "Admin", "Moderator", and "User" roles with respective permissions.
- Admin User: Creates an Admin user with the following credentials:
   - Username: admin
   - Email: admin@example.com
   - Password: AdminPass123
   - Note: Ensure to change the Admin password in production environments.


#### Running the Application
Start the server using the following command:

```bash
npm run dev
```

terminal Output: 

```bash
[INFO] Connected to MongoDB Database
[INFO] Roles seeded successfully.
[INFO] Admin user seeded successfully.
[INFO] Server started on port 5000
```

Access the Application: 
Open your browser or API client (e.g., Postman) and navigate to: `http://localhost:5000/`

You should see : 
```bash
SecureAccess is Running
```

