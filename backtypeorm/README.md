# HFC Backend - Node.js + TypeORM with MySQL

This is the Node.js backend for the Hope for Children (HFC) organization, built with Express and TypeORM to work with a MySQL database.

> Note: this backend is implemented in JavaScript/Node.js, not TypeScript.

## Features

- **Node.js + Express**: API server runtime and routing
- **TypeORM with MySQL**: ORM-based database access
- **JWT Authentication**: Secure authentication with role-based access
- **Socket.IO**: Real-time communication support
- **RESTful APIs**: Complete CRUD operations for all entities
- **Admin Panel Support**: Protected routes for administrative operations

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## Installation

1. **Clone and navigate to the project**

   ```bash
   cd "back typeorm"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hfc_database

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Create MySQL Database**

   ```sql
   CREATE DATABASE hfc_database;
   ```

5. **Start the server**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## Database Schema

The application will automatically create the following tables:

- `users` - Admin users and authentication
- `staff` - Staff members (current and former)
- `alumni` - Alumni information and success stories
- `news` - News articles and announcements
- `projects` - Organization projects (ongoing and completed)
- `stats` - Dynamic statistics for the website
- `reports` - Annual and project reports
- `gallery_items` - Photo gallery items
- `case_stories` - Beneficiary case studies
- `board_directors` - Board of directors information
- `management_team` - Management team members
- `contacts` - Contact form submissions
- `donations` - Donation records

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Admin login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/create-admin` - Create admin user (admin only)
- `GET /api/auth/admins` - Get all admins (admin only)
- `DELETE /api/auth/admin/:id` - Delete admin (admin only)

### Staff Management

- `GET /api/staff` - Get all staff (public)
- `POST /api/staff` - Create staff member (admin only)
- `PUT /api/staff/:id` - Update staff member (admin only)
- `DELETE /api/staff/:id` - Delete staff member (admin only)

### Statistics

- `GET /api/stats` - Get all statistics
- `GET /api/stats/active` - Get active statistics only
- `POST /api/stats` - Create statistic (admin only)
- `PUT /api/stats/:id` - Update statistic (admin only)
- `DELETE /api/stats/:id` - Delete statistic (admin only)
- `PATCH /api/stats/:id/toggle` - Toggle active status (admin only)
- `POST /api/stats/reorder` - Reorder statistics (admin only)

### Alumni

- `GET /api/alumni` - Get public alumni
- `GET /api/alumni/all` - Get all alumni (admin only)
- `POST /api/alumni` - Create alumni (admin only)
- `PUT /api/alumni/:id` - Update alumni (admin only)
- `DELETE /api/alumni/:id` - Delete alumni (admin only)

### News

- `GET /api/news` - Get all news
- `POST /api/news` - Create news (admin only)
- `PUT /api/news/:id` - Update news (admin only)
- `DELETE /api/news/:id` - Delete news (admin only)

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Reports

- `GET /api/reports` - Get published reports
- `GET /api/reports/all` - Get all reports (admin only)
- `POST /api/reports` - Create report (admin only)
- `PUT /api/reports/:id` - Update report (admin only)
- `DELETE /api/reports/:id` - Delete report (admin only)

### Gallery

- `GET /api/gallery` - Get published gallery items
- `GET /api/gallery/all` - Get all gallery items (admin only)
- `POST /api/gallery` - Create gallery item (admin only)
- `PUT /api/gallery/:id` - Update gallery item (admin only)
- `DELETE /api/gallery/:id` - Delete gallery item (admin only)

### Case Stories

- `GET /api/case-stories` - Get published case stories
- `GET /api/case-stories/all` - Get all case stories (admin only)
- `POST /api/case-stories` - Create case story (admin only)
- `PUT /api/case-stories/:id` - Update case story (admin only)
- `DELETE /api/case-stories/:id` - Delete case story (admin only)

### Board Directors

- `GET /api/board-directors` - Get all board directors
- `POST /api/board-directors` - Create board director (admin only)
- `PUT /api/board-directors/:id` - Update board director (admin only)
- `DELETE /api/board-directors/:id` - Delete board director (admin only)

### Management Team

- `GET /api/management-team` - Get active management team
- `GET /api/management-team/all` - Get all management team (admin only)
- `POST /api/management-team` - Create management member (admin only)
- `PUT /api/management-team/:id` - Update management member (admin only)
- `DELETE /api/management-team/:id` - Delete management member (admin only)

## Migration from Mongoose

This backend has been converted from the original Mongoose implementation. Key changes:

1. **Database**: MongoDB → MySQL
2. **ORM**: Mongoose → TypeORM
3. **Schema**: Document-based → Relational tables
4. **Queries**: MongoDB queries → SQL queries via TypeORM repositories
5. **IDs**: ObjectId → Auto-increment integers

## Development

### Project Structure

```
back typeorm/
├── config/
│   └── database.js          # TypeORM configuration
├── entities/                # TypeORM entity definitions
│   ├── Staff.js
│   ├── Alumni.js
│   ├── News.js
│   └── ...
├── routes/                  # API route handlers
│   ├── staff.js
│   ├── auth.js
│   ├── stats.js
│   └── ...
├── middleware/
│   └── auth.js              # Authentication middleware
├── server.js                # Main server file
├── socket.js                # Socket.IO configuration
├── package.json
└── .env.example
```

### Adding New Entities

1. Create entity in `entities/` directory
2. Add entity to `config/database.js`
3. Create routes in `routes/` directory
4. Add routes to `server.js`

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a production MySQL database
3. Set strong JWT secret
4. Configure proper CORS origins
5. Use PM2 or similar for process management

## Socket.IO Events

The application emits the following Socket.IO events:

- `staffUpdated` - When staff data changes
- Add other events as needed for real-time updates

## Security Features

- JWT-based authentication
- Role-based access control (admin/user)
- CORS protection
- Input validation
- SQL injection prevention via TypeORM
- Password hashing with bcrypt

## Support

For issues or questions, please refer to the original Mongoose implementation in the `backoriginal/` directory for comparison.
