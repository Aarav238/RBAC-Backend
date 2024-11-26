# SecureAccess: Authentication & RBAC System

## Table of Contents

- [SecureAccess: Authentication \& RBAC System](#secureaccess-authentication--rbac-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Architecture](#architecture)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Database Setup](#database-setup)
    - [Seeding the Database](#seeding-the-database)
    - [Running the Application](#running-the-application)
  - [API Documentation](#api-documentation)
    - [Authentication Routes](#authentication-routes)
      - [Register](#register)
      - [Login](#login)
      - [Refresh Token](#refresh-token)
      - [Logout](#logout)
    - [User Management Routes](#user-management-routes)
      - [Get All Users](#get-all-users)
      - [Get User by ID](#get-user-by-id)
      - [Update User](#update-user)
      - [Delete User](#delete-user)
    - [Protected Routes](#protected-routes)
      - [Admin Route](#admin-route)
      - [Moderator Route](#moderator-route)
      - [User Route](#user-route)
  - [Testing with Postman](#testing-with-postman)
    - [Setting Up Postman](#setting-up-postman)
    - [Importing the Collection](#importing-the-collection)
    - [Example Requests](#example-requests)
      - [1. Register a New User](#1-register-a-new-user)
      - [2. Login as the Registered User](#2-login-as-the-registered-user)
      - [3. Access a Protected User Route](#3-access-a-protected-user-route)
      - [4. Access an Admin-Only Route as a Regular User](#4-access-an-admin-only-route-as-a-regular-user)
      - [5. Refresh Access Token](#5-refresh-access-token)
      - [6. Logout](#6-logout)
  - [Security Considerations](#security-considerations)
  - [Logging](#logging)
    - [Features](#features-1)
    - [Configuration](#configuration)
  - [Error Handling](#error-handling)
    - [Middleware](#middleware)
    - [Features](#features-2)
  - [Contributing](#contributing)
    - [Code of Conduct](#code-of-conduct)
  - [License](#license)
  - [Contact](#contact)

---

## Overview

**SecureAccess** is a robust backend application built with **Node.js**, **Express**, and **MongoDB**, implementing **Authentication**, **Authorization**, and **Role-Based Access Control (RBAC)**. Leveraging **Zod** for schema validation, SecureAccess ensures secure user management and controlled access to resources based on user roles.

---

## Features

- **User Authentication**: Secure registration, login, logout, and token refresh mechanisms.
- **Role-Based Access Control (RBAC)**: Define and manage user roles (**Admin**, **Moderator**, **User**) with specific permissions.
- **Protected Routes**: Access to routes is restricted based on user roles and authentication status.
- **Data Validation**: Robust input validation using **Zod** to ensure data integrity.
- **Security Enhancements**:
  - Password hashing with **bcrypt**.
  - Data sanitization to prevent NoSQL injection.
  - HTTP headers secured with **Helmet**.
  - Rate limiting to prevent brute-force attacks.
- **Logging**: Detailed logging of events and errors using a custom logger.
- **Error Handling**: Centralized error handling to manage and respond to errors gracefully.

---

## Technologies Used

- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)
- **Authentication & Authorization**:
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Validation**:
  - [Zod](https://github.com/colinhacks/zod)
- **Security**:
  - [Helmet](https://helmetjs.github.io/)
  - [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
  - [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- **Utilities**:
  - [dotenv](https://www.npmjs.com/package/dotenv)
  - [cors](https://www.npmjs.com/package/cors)
  - [morgan](https://www.npmjs.com/package/morgan)
- **Logging**:
  - [Winston](https://github.com/winstonjs/winston) *(Custom implementation)*

---

## Architecture

The application follows a **Model-View-Controller (MVC)** architecture with the following structure:

```
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
├── tests/
│   └── *(Testing to be implemented)*
├── utils/
│   ├── logger.js
│   └── validators.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Git](https://git-scm.com/) (optional, for version control)
- [Postman](https://www.postman.com/) (for API testing)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/SecureAccess.git
   cd SecureAccess
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the necessary environment variables.

**`.env`**

```dotenv
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/secureaccess_db
MONGO_URI_TEST=mongodb://localhost:27017/secureaccess_db_test

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key

# Environment
NODE_ENV=development
```

**Notes:**

- Replace `your_jwt_secret_key` and `your_refresh_token_secret_key` with secure, randomly generated strings.
- Ensure that `MONGO_URI_TEST` points to a separate database to isolate test data.

### Database Setup

Ensure that your MongoDB server is running. If using a local instance, you can start it using:

```bash
mongod
```

For cloud-based MongoDB services like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), update the `MONGO_URI` and `MONGO_URI_TEST` accordingly.

### Seeding the Database

Before running the application, seed the database with predefined roles and an Admin user.

1. **Navigate to the Project Directory**

   ```bash
   cd SecureAccess
   ```

2. **Run the Seed Script**

   ```bash
   node config/seed.js
   ```

   **Expected Output:**

   ```
   Roles seeded successfully.
   Admin user seeded successfully.
   ```

   **Details:**

   - **Roles**: Inserts "Admin", "Moderator", and "User" roles with respective permissions.
   - **Admin User**: Creates an Admin user with the following credentials:
     - **Username**: `admin`
     - **Email**: `admin@example.com`
     - **Password**: `AdminPass123`
     - **Note**: Ensure to change the Admin password in production environments.

### Running the Application

Start the server using the following command:

```bash
npm run dev
```

**Server Output:**

```
[INFO] Connected to MongoDB Database
[INFO] Roles seeded successfully.
[INFO] Admin user seeded successfully.
[INFO] Server started on port 5000
```

**Access the Application:**

Open your browser or API client (e.g., Postman) and navigate to:

```
http://localhost:5000/
```

You should see:

```
Authentication and RBAC System is Running
```

---

## API Documentation

The API follows RESTful principles and communicates using JSON. Below are the available endpoints categorized by their functionality.

### Authentication Routes

#### Register

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Headers**: `Content-Type: application/json`
- **Body Parameters**:

  | Parameter | Type   | Description                                   |
  | --------- | ------ | --------------------------------------------- |
  | username  | String | Unique username for the user.                 |
  | email     | String | Unique email address for the user.            |
  | password  | String | Password for the account (min 6 characters).  |
  | role      | String | Role of the user (`Admin`, `Moderator`, `User`). Defaults to `User` if not specified. |

- **Response**:
  - **Success (201)**:

    ```json
    {
      "msg": "Registration successful."
    }
    ```

  - **Error (400)**:

    ```json
    {
      "msg": "User already exists"
    }
    ```

    ```json
    {
      "msg": "Invalid role specified"
    }
    ```

#### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Logs in an existing user.
- **Headers**: `Content-Type: application/json`
- **Body Parameters**:

  | Parameter | Type   | Description                |
  | --------- | ------ | -------------------------- |
  | email     | String | Registered email address. |
  | password  | String | Password for the account.  |

- **Response**:
  - **Success (200)**:

    ```json
    {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
    ```

  - **Error (400)**:

    ```json
    {
      "msg": "Invalid Credentials"
    }
    ```

#### Refresh Token

- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Description**: Refreshes the access token using a valid refresh token.
- **Headers**: `Content-Type: application/json`
- **Body Parameters**:

  | Parameter    | Type   | Description              |
  | ------------ | ------ | ------------------------ |
  | refreshToken | String | Valid JWT refresh token. |

- **Response**:
  - **Success (200)**:

    ```json
    {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_jwt_refresh_token"
    }
    ```

  - **Error (403)**:

    ```json
    {
      "msg": "Invalid or expired refresh token"
    }
    ```

#### Logout

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: Logs out the user by invalidating the refresh token.
- **Headers**:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Body Parameters**: None

- **Response**:
  - **Success (200)**:

    ```json
    {
      "msg": "Logged out successfully."
    }
    ```

  - **Error (401)**:

    ```json
    {
      "msg": "No token, authorization denied"
    }
    ```

### User Management Routes

> **Note**: These routes require authentication. **Admin** and **Moderator** roles have elevated permissions.

#### Get All Users

- **URL**: `/api/users`
- **Method**: `GET`
- **Description**: Retrieves a list of all users. Accessible by **Admin** and **Moderator** roles.
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Response**:
  - **Success (200)**:

    ```json
    [
      {
        "_id": "60f7f2f4e1d3c814c8d4f0a9",
        "username": "admin",
        "email": "admin@example.com",
        "role": "Admin",
        "isVerified": true,
        "createdAt": "2023-10-01T12:00:00Z",
        "updatedAt": "2023-10-01T12:00:00Z"
      },
      {
        "_id": "60f7f2f4e1d3c814c8d4f0aa",
        "username": "user1",
        "email": "user1@example.com",
        "role": "User",
        "isVerified": true,
        "createdAt": "2023-10-02T12:00:00Z",
        "updatedAt": "2023-10-02T12:00:00Z"
      }
    ]
    ```

  - **Error (403)**:

    ```json
    {
      "msg": "Access denied: insufficient permissions"
    }
    ```

#### Get User by ID

- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Description**: Retrieves a user's information by their ID.
  - **Admin** and **Moderator** roles can retrieve any user's information.
  - **User** role can retrieve only their own information.
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Response**:
  - **Success (200)**:

    ```json
    {
      "_id": "60f7f2f4e1d3c814c8d4f0a9",
      "username": "admin",
      "email": "admin@example.com",
      "role": "Admin",
      "isVerified": true,
      "createdAt": "2023-10-01T12:00:00Z",
      "updatedAt": "2023-10-01T12:00:00Z"
    }
    ```

  - **Error (403)**:

    ```json
    {
      "msg": "Access denied"
    }
    ```

#### Update User

- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Description**: Updates a user's information.
  - **Admin** role can update any user's information.
  - **User** role can update only their own information.
- **Headers**:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Body Parameters** (all optional):

  | Parameter | Type   | Description                                         |
  | --------- | ------ | --------------------------------------------------- |
  | username  | String | New username for the user.                          |
  | email     | String | New email address for the user.                     |
  | password  | String | New password for the user.                          |
  | role      | String | New role for the user (`Admin`, `Moderator`, `User`). **Admin only**.

- **Response**:
  - **Success (200)**:

    ```json
    {
      "msg": "User updated successfully"
    }
    ```

  - **Error (403)**:

    ```json
    {
      "msg": "Access denied"
    }
    ```

#### Delete User

- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Description**: Deletes a user by their ID. **Admin** role only.
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Response**:
  - **Success (200)**:

    ```json
    {
      "msg": "User deleted successfully"
    }
    ```

  - **Error (403)**:

    ```json
    {
      "msg": "Access denied: insufficient permissions"
    }
    ```

### Protected Routes

These routes are accessible based on user roles. Ensure that you include the `Authorization` header with a valid JWT access token when accessing these routes.

#### Admin Route

- **URL**: `/api/protected/admin-route`
- **Method**: `GET`
- **Description**: Accessible only by users with the **Admin** role.
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Response**:
  - **Success (200)**:

    ```json
    {
      "msg": "Welcome Admin! You have access to this route."
    }
    ```

  - **Error (403)**:

    ```json
    {
      "msg": "Access denied: insufficient permissions"
    }
    ```

#### Moderator Route

- **URL**: `/api/protected/moderator-route`
- **Method**: `GET`
- **Description**: Accessible by users with **Admin** and **Moderator** roles.
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Response**:
  - **Success (200)**:

    ```json
    {
      "msg": "Welcome Moderator! You have access to this route."
    }
    ```

  - **Error (403)**:

    ```json
    {
      "msg": "Access denied: insufficient permissions"
    }
    ```

#### User Route

- **URL**: `/api/protected/user-route`
- **Method**: `GET`
- **Description**: Accessible by any authenticated user.
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Response**:
  - **Success (200)**:

    ```json
    {
      "msg": "Welcome User! You have access to this route."
    }
    ```

  - **Error (401)**:

    ```json
    {
      "msg": "No token, authorization denied"
    }
    ```

---

## Testing with Postman

Testing your API with **Postman** allows you to interact with the endpoints, verify responses, and ensure that the RBAC system functions as intended. Below are the steps to set up and execute tests using Postman.

### Setting Up Postman

1. **Download and Install Postman**

   - [Download Postman](https://www.postman.com/downloads/) for your operating system.
   - Follow the installation instructions.

2. **Create a New Collection**

   - Open Postman.
   - Click on `Collections` in the left sidebar.
   - Click `New Collection` and name it `SecureAccess API`.

3. **Add Environment Variables (Optional)**

   - Click on the gear icon in the top right and select `Manage Environments`.
   - Click `Add` to create a new environment named `SecureAccess`.
   - Add the following variables:

     | Variable       | Initial Value           | Current Value            |
     | -------------- | ----------------------- | ------------------------ |
     | `base_url`     | `http://localhost:5000` | `http://localhost:5000`  |
     | `access_token` |                         |                          |
     | `refresh_token`|                         |                          |

   - Click `Add` to save.

4. **Import the Collection (Optional)**

   - If you have a pre-defined Postman collection (e.g., `SecureAccess.postman_collection.json`), you can import it.
   - Click on `Import` in Postman, select the file, and import.

### Importing the Collection

If you have a Postman collection file, follow these steps:

1. **Obtain the Collection File**

   - Create a JSON file named `SecureAccess.postman_collection.json` with the necessary endpoints.

2. **Import into Postman**

   - Open Postman.
   - Click on `Import` in the top left.
   - Select `File` and choose `SecureAccess.postman_collection.json`.
   - Click `Import`.

### Example Requests

Below are example requests to test the major functionalities of the **SecureAccess** system.

#### 1. Register a New User

- **Endpoint**: `POST /api/auth/register`
- **URL**: `{{base_url}}/api/auth/register`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (JSON):

  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "TestPass123",
    "role": "User"
  }
  ```

- **Expected Response**:

  ```json
  {
    "msg": "Registration successful."
  }
  ```

#### 2. Login as the Registered User

- **Endpoint**: `POST /api/auth/login`
- **URL**: `{{base_url}}/api/auth/login`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (JSON):

  ```json
  {
    "email": "testuser@example.com",
    "password": "TestPass123"
  }
  ```

- **Expected Response**:

  ```json
  {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
  ```

- **Actions**:
  - Save the `accessToken` and `refreshToken` in environment variables for subsequent requests.

#### 3. Access a Protected User Route

- **Endpoint**: `GET /api/protected/user-route`
- **URL**: `{{base_url}}/api/protected/user-route`
- **Headers**:
  - `Authorization: Bearer {{access_token}}`

- **Expected Response**:

  ```json
  {
    "msg": "Welcome User! You have access to this route."
  }
  ```

#### 4. Access an Admin-Only Route as a Regular User

- **Endpoint**: `GET /api/protected/admin-route`
- **URL**: `{{base_url}}/api/protected/admin-route`
- **Headers**:
  - `Authorization: Bearer {{access_token}}`

- **Expected Response**:

  ```json
  {
    "msg": "Access denied: insufficient permissions"
  }
  ```

#### 5. Refresh Access Token

- **Endpoint**: `POST /api/auth/refresh-token`
- **URL**: `{{base_url}}/api/auth/refresh-token`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (JSON):

  ```json
  {
    "refreshToken": "{{refresh_token}}"
  }
  ```

- **Expected Response**:

  ```json
  {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
  ```

#### 6. Logout

- **Endpoint**: `POST /api/auth/logout`
- **URL**: `{{base_url}}/api/auth/logout`
- **Headers**:
  - `Authorization: Bearer {{access_token}}`

- **Expected Response**:

  ```json
  {
    "msg": "Logged out successfully."
  }
  ```

---

## Security Considerations

Ensuring the security of your application is paramount. **SecureAccess** implements several security best practices:

- **Password Hashing**: User passwords are hashed using **bcrypt** before storage.
- **JWT Authentication**: Secure token-based authentication with access and refresh tokens.
- **Data Validation**: Inputs are validated using **Zod** schemas to prevent malformed data.
- **Data Sanitization**: Prevents NoSQL injection attacks using **express-mongo-sanitize**.
- **Secure HTTP Headers**: Configured using **Helmet** to protect against well-known vulnerabilities.
- **Rate Limiting**: Limits the number of requests per IP to mitigate brute-force attacks.
- **CORS Configuration**: Restricts resource access to trusted origins.
- **Environment Variables**: Sensitive configurations are managed using environment variables and excluded from version control.

**Additional Recommendations:**

- **HTTPS**: Always use HTTPS in production to encrypt data in transit.
- **Secure JWT Secrets**: Use strong, unpredictable secrets for JWT signing.
- **Regular Dependency Updates**: Keep all dependencies up-to-date to patch known vulnerabilities.
- **Input Sanitization**: Continuously validate and sanitize all user inputs.

---

## Logging

Logging is essential for monitoring and debugging your application. **SecureAccess** uses a custom **Winston** logger to capture and store logs.

### Features

- **Log Levels**: Differentiates between info, warning, error, etc.
- **Transports**: Configured to log to the console and files.
- **Formatters**: Consistent log formatting for readability.

### Configuration

**`utils/logger.js`**

```javascript
// utils/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define custom log format
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    // Console transporter with colorized output
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        customFormat
      ),
    }),
    // File transporter for error logs
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // File transporter for all logs
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Stream for morgan to use
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;
```

**Notes:**

- Logs are stored in the `logs/` directory.
- **Error Logs**: Stored separately in `logs/error.log`.
- **Combined Logs**: All logs are stored in `logs/combined.log`.
- **Console Logs**: Colorized and formatted for readability during development.

---

## Error Handling

Centralized error handling ensures that your application responds gracefully to unexpected situations.

### Middleware

**`middleware/errorHandler.js`**

```javascript
// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    msg: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
```

### Features

- **Logging**: Captures detailed error information for debugging.
- **User-Friendly Responses**: Sends clear error messages to clients without exposing sensitive details in production.
- **Status Codes**: Utilizes appropriate HTTP status codes based on the error type.

---

## Contributing

Contributions are welcome! Follow these steps to contribute to the project:

1. **Fork the Repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/yourusername/SecureAccess.git
   cd SecureAccess
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Your Changes**

   Implement your feature or bug fix.

5. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Add description of your changes"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request**

   Navigate to the original repository and click "New Pull Request". Provide a clear description of your changes.

### Code of Conduct

Please adhere to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) to ensure a welcoming and respectful environment for all contributors.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any inquiries or feedback, please contact:

- **Aarav Shukla**
- **Email**: [aarav8090shukla@gmail.com](mailto:aarav8090shukla@gmail.com)
- **GitHub**: [https://github.com/aarav238](https://github.com/Aarav238)

---


