# Cookie Store Security System

## Overview
A modern security login system with admin/user roles, cookie management with pagination, and responsive UI.

## Features

### Authentication
- **JWT-based authentication** with role-based access control
- **Admin and User roles** with different permissions
- **Secure login/register** with password encryption
- **Auto-logout** on token expiration

### Cookie Management
- **Paginated cookie listing** (10 items per page)
- **Add/Edit/Delete cookies** (Admin only)
- **View cookies** (All users)
- **Real-time data updates**

### Modern UI
- **Responsive design** with mobile support
- **Gradient backgrounds** and modern styling
- **Navigation bar** with role indicators
- **Dashboard** with statistics and quick actions

## Default Accounts

### Admin Account
- Username: `admin`
- Password: `admin123`
- Permissions: Full CRUD operations on cookies

### User Account
- Username: `user`
- Password: `user123`
- Permissions: View cookies only

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Cookie Management
- `GET /api/cookies/allCookies` - Get all cookies
- `GET /api/cookies/paginated?page=0&size=10` - Get paginated cookies
- `POST /api/cookies/addCookie` - Add cookie (Admin only)
- `PUT /api/cookies/{id}` - Update cookie (Admin only)
- `DELETE /api/cookies/{id}` - Delete cookie (Admin only)

## Routes

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard
- `/cookies` - Cookie management
- `/admin` - Admin panel (Admin only)

## Security Features

- **JWT tokens** with role claims
- **Password encryption** using BCrypt
- **Route protection** based on authentication status
- **Role-based access control** for admin functions
- **CORS configuration** for frontend integration

## Technology Stack

### Backend
- Spring Boot with Spring Security
- JWT authentication
- JPA/Hibernate for data persistence
- BCrypt password encoding

### Frontend
- React with React Router
- Modern CSS with gradients and animations
- Responsive grid layouts
- JWT token management

## Getting Started

1. Start the Spring Boot backend
2. Start the React frontend
3. Navigate to the application
4. Login with default credentials or register new account
5. Explore the cookie management features based on your role

## File Structure

### Backend
- `User.java` - User entity with roles
- `UserRepository.java` - User data access
- `AuthController.java` - Authentication endpoints
- `CookieController.java` - Cookie CRUD with role protection
- `SecurityConfig.java` - JWT security configuration
- `JWTUtil.java` - JWT token utilities
- `DataInitializer.java` - Default user creation

### Frontend
- `Login.js` - Login component
- `Register.js` - Registration component
- `Navbar.js` - Navigation with role display
- `CookieManager.js` - Paginated cookie management
- `Dashboard.js` - User dashboard with statistics
- `App.jsx` - Main routing and authentication logic