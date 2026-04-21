# 🍪 Cookie Store Management System

A full-stack web application for managing a cookie store with role-based access control, inventory management, order processing, and customer shopping features.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Default Users](#default-users)
- [Database](#database)
- [Security](#security)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Admin Features
- ✅ Full CRUD operations on cookies (Add, Edit, Delete)
- ✅ View and manage all orders
- ✅ User management
- ✅ Inventory tracking
- ✅ Order status updates

### Manager Features
- ✅ View all orders
- ✅ Update order status
- ✅ View user information
- ✅ Monitor inventory

### Baker Features
- ✅ View assigned orders
- ✅ Update order status (Pending → Processing → Completed)

### Customer (User) Features
- ✅ Browse cookie catalog
- ✅ Search and filter cookies by name/flavor
- ✅ Add items to cart
- ✅ Wishlist management
- ✅ Place orders
- ✅ View order history
- ✅ Track order status

### General Features
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Responsive UI design
- ✅ Real-time inventory updates
- ✅ Secure password encryption (BCrypt)
- ✅ RESTful API architecture

## 🛠 Tech Stack

### Backend
- **Framework:** Spring Boot 3.2.2
- **Language:** Java 17
- **Database:** H2 (in-memory)
- **Security:** Spring Security + JWT
- **ORM:** Spring Data JPA / Hibernate
- **Build Tool:** Maven
- **API Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** CSS3
- **Icons:** Lucide React

## 📁 Project Structure

```
workspace/
├── springapp/                      # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/examly/springapp/
│   │   │   │   ├── configuration/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── JWTUtil.java
│   │   │   │   │   ├── CorsConfiguration.java
│   │   │   │   │   └── DataInitializer.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── CookieController.java
│   │   │   │   │   ├── OrderController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── AdminController.java
│   │   │   │   │   ├── BakerController.java
│   │   │   │   │   └── ManagerController.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Cookie.java
│   │   │   │   │   └── Order.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── CookieRepository.java
│   │   │   │   │   └── OrderRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── CookieService.java
│   │   │   │   │   └── OrderService.java
│   │   │   │   └── SpringappApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── reactapp/                       # Frontend (React)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── Login.js
    │   │   │   └── Register.js
    │   │   ├── cookie/
    │   │   │   ├── CookieManager.js
    │   │   │   ├── CookieCard.js
    │   │   │   └── CookieList.js
    │   │   ├── cart/
    │   │   │   └── Cart.js
    │   │   ├── wishlist/
    │   │   │   └── Wishlist.js
    │   │   ├── orders/
    │   │   │   └── OrderHistory.js
    │   │   ├── admin/
    │   │   │   └── AdminOrders.js
    │   │   ├── dashboard/
    │   │   │   └── Dashboard.js
    │   │   ├── navigation/
    │   │   │   └── Navbar.js
    │   │   └── footer/
    │   │       └── Footer.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── index.js
    └── package.json
```

## 📦 Prerequisites

- **Java 17** or higher
- **Node.js 16+** and npm
- **Maven 3.6+**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/rakmeghaa19/Cookie-Store-Management-System.git
cd Cookie-Store-Management-System
```

### 2. Backend Setup

```bash
cd springapp

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 3. Frontend Setup

```bash
cd reactapp

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on **http://localhost:8081**

## 🎯 Running the Application

### Backend (Port 8080)
```bash
cd springapp
mvn spring-boot:run
```

### Frontend (Port 8081)
```bash
cd reactapp
npm start
```

### Access the Application
- **Frontend:** http://localhost:8081
- **Backend API:** http://localhost:8080/api
- **H2 Console:** http://localhost:8080/h2-console
- **Swagger UI:** http://localhost:8080/swagger-ui.html

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | User registration | Public |

**Login Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN",
  "username": "admin"
}
```

### Cookie Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cookies/allCookies` | Get all cookies | All |
| GET | `/api/cookies/{id}` | Get cookie by ID | All |
| GET | `/api/cookies/search?name={name}` | Search cookies | All |
| GET | `/api/cookies/byFlavor?flavor={flavor}` | Filter by flavor | All |
| GET | `/api/cookies/sortedByPrice` | Get sorted by price | All |
| POST | `/api/cookies/addCookie` | Add new cookie | ADMIN |
| PUT | `/api/cookies/{id}` | Update cookie | ADMIN |
| DELETE | `/api/cookies/{id}` | Delete cookie | ADMIN |

**Cookie Object:**
```json
{
  "id": 1,
  "cookieName": "Chocolate Chip",
  "flavor": "Chocolate",
  "price": 25,
  "quantityAvailable": 150
}
```

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get all orders | All |
| GET | `/api/orders/{id}` | Get order by ID | All |
| GET | `/api/orders/customer/{name}` | Get orders by customer | All |
| GET | `/api/orders/status/{status}` | Get orders by status | All |
| POST | `/api/orders` | Create new order | All |
| PUT | `/api/orders/{id}` | Update order | ADMIN/MANAGER |
| PUT | `/api/orders/{id}/status` | Update order status | ADMIN/MANAGER/BAKER |
| DELETE | `/api/orders/{id}` | Delete order | ADMIN |

**Order Object:**
```json
{
  "id": 1,
  "customerName": "John Doe",
  "cookieName": "Chocolate Chip",
  "quantity": 12,
  "totalPrice": 300,
  "status": "PENDING",
  "orderDate": "2024-01-15T10:30:00"
}
```

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | ADMIN/MANAGER |
| GET | `/api/users/{id}` | Get user by ID | ADMIN/MANAGER |
| GET | `/api/users/role/{role}` | Get users by role | ADMIN/MANAGER |
| POST | `/api/users` | Create new user | ADMIN |
| PUT | `/api/users/{id}` | Update user | ADMIN |
| DELETE | `/api/users/{id}` | Delete user | ADMIN |

## 👥 Default Users

The application comes pre-seeded with the following users:

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| `admin` | `admin123` | ADMIN | Full system access |
| `manager` | `manager123` | MANAGER | View/manage orders & users |
| `baker1` | `baker123` | BAKER | Update order status |
| `baker2` | `baker123` | BAKER | Update order status |
| `john_doe` | `user123` | USER | Browse, cart, orders |
| `jane_smith` | `user123` | USER | Browse, cart, orders |
| `mike_wilson` | `user123` | USER | Browse, cart, orders |

## 🗄 Database

### H2 In-Memory Database

**Configuration (application.properties):**
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

**Access H2 Console:**
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave empty)

### Database Schema

**Users Table:**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
```

**Cookies Table:**
```sql
CREATE TABLE cookie (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cookie_name VARCHAR(255) NOT NULL,
    flavor VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    quantity_available INT NOT NULL
);
```

**Orders Table:**
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    cookie_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    total_price INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    order_date TIMESTAMP NOT NULL
);
```

## 🔒 Security

### JWT Authentication
- **Algorithm:** HS256
- **Token Expiration:** 24 hours (86400000 ms)
- **Secret Key:** Configurable in `application.properties`

### Password Encryption
- **Algorithm:** BCrypt
- **Strength:** Default (10 rounds)

### CORS Configuration
- Configured to allow frontend origin
- Supports credentials
- Allows all standard HTTP methods

### Role-Based Access Control

```
ADMIN    → Full access to all endpoints
MANAGER  → View/manage orders, view users
BAKER    → Update order status
USER     → Browse cookies, manage cart, place orders
```

## 🎨 Features Breakdown

### Cookie Management
- 27+ pre-loaded cookie varieties
- Categories: Premium, Traditional, Gourmet, Seasonal, Healthy, International
- Real-time inventory tracking
- Search and filter functionality
- Pagination support

### Order Processing
- Multi-status workflow: PENDING → CONFIRMED → PROCESSING → SHIPPED → COMPLETED
- Automatic inventory deduction
- Order history tracking
- Customer-specific order views
- Bulk order support

### Shopping Experience
- Add to cart functionality
- Wishlist management
- Real-time price calculation
- Order confirmation
- Order tracking

## 🧪 Testing

### Backend Tests
```bash
cd springapp
mvn test
```

### Frontend Tests
```bash
cd reactapp
npm test
```

## 📸 Screenshots

### Login Page
User authentication with role-based redirection

### Dashboard
Role-specific dashboard with quick actions and statistics

### Cookie Catalog
Browse and search through available cookies

### Admin Panel
Manage cookies, orders, and users

### Order Management
Track and update order status

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rakmeghaa**
- GitHub: [@rakmeghaa19](https://github.com/rakmeghaa19)

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- JWT.io
- H2 Database
- Lucide Icons


⭐ **Star this repository if you find it helpful!**

Made with ❤️ by Rakmeghaa
