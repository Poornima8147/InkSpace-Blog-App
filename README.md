
# InkSpace – Blog Application

InkSpace is a full-stack blog application where users can register, log in, create blog posts, and explore stories shared by other users.

## Features

- User Registration
- User Login
- Create and Publish Blogs
- View All Published Blogs
- MySQL Database Integration
- Responsive User Interface

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Additional Packages
- mysql2
- bcryptjs
- cors
- dotenv

## Project Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── blogController.js
│
├── routes/
│   ├── authRoutes.js
│   └── blogRoutes.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| POST | `/api/blogs/create` | Create a blog |
| GET | `/api/blogs` | Retrieve all blogs |

## Database

Database name: `inkspace_db`

### Users Table
- id
- name
- email
- password
- created_at

### Blogs Table
- id
- user_id
- title
- content
- created_at

The `user_id` in the blogs table references the users table.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure MySQL

Create a MySQL database named:

```sql
CREATE DATABASE inkspace_db;
```

Create the users and blogs tables using the required schema.

### 5. Configure Environment Variables

Create a `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=inkspace_db
PORT=5000
```

Ensure `config/db.js` reads these environment variables.

### 6. Start the Server

```bash
node server.js
```

### 7. Open the Application

Visit:

```text
http://localhost:5000
```

## Learning Outcomes

Through this project, I developed practical knowledge of:

- Building REST APIs using Node.js and Express.js.
- Connecting a backend application to MySQL.
- Implementing user registration and login.
- Performing database operations using SQL.
- Connecting frontend interfaces with backend APIs.

## Author

**Poornima A**

B.Tech – Artificial Intelligence and Machine Learning
