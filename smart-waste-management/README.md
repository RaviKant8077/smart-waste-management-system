# Smart Waste Management System

A comprehensive Spring Boot application for managing smart waste collection and monitoring systems.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Database](#database)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- JDK 17 or later
- MySQL 8.0 or later
- Maven 3.6 or later
- Git
- MySQL database running on port 3308 (or update configuration accordingly)

## Technology Stack

- **Backend Framework:** Spring Boot 3.5.7
- **Security:** Spring Security with JWT Authentication
- **Database:** MySQL 8
- **API Documentation:** OpenAPI/Swagger
- **Build Tool:** Maven
- **Java Version:** 17

## Project Structure

```
src/
├── main/
│   ├── java/com/example/smart/waste/management/
│   │   ├── config/           # Configuration classes
│   │   ├── controller/       # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # Domain models
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # Security configurations
│   │   └── service/         # Business logic
│   └── resources/
│       ├── application.properties  # Application configuration
│       ├── static/                # Static resources
│       └── templates/             # Template files
└── test/
    └── java/                      # Test classes
```

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd smart-waste-management
   ```

2. **Set Up Database**
   - Create a MySQL database named 'smart_waste_management_system'
   - Default port: 3308
   - Default credentials: 
     - Username: root
     - Password: 1234
   - Or update `application.properties` with your database configuration

3. **Configure JDK 17**
   - Install JDK 17 (Recommended: Eclipse Temurin/Adoptium)
   - Set JAVA_HOME environment variable
   - Verify installation:
     ```bash
     java -version
     javac -version
     ```

4. **Build the Project**
   ```bash
   mvn clean install
   ```

5. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```
   The application will start on port 8082 (configured in application.properties)

## Configuration

### Application Properties

Key configurations in `application.properties`:

```properties
# Server Configuration
server.port=8082

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3308/smart_waste_management_system
spring.datasource.username=root
spring.datasource.password=1234
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
jwt.secret=<your-secret-key>
jwt.expiration=86400000

# File Upload Configuration
file.upload-dir=uploads
```

## API Documentation

### Authentication Endpoints

1. **Register User**
   ```
   POST /api/auth/register
   Content-Type: application/json
   
   {
     "firstName": "string",
     "lastName": "string",
     "email": "string",
     "password": "string",
     "role": "CITIZEN|EMPLOYEE|ADMIN"
   }
   ```

2. **Login**
   ```
   POST /api/auth/login
   Content-Type: application/json
   
   {
     "email": "string",
     "password": "string"
   }
   ```

### Main Features

1. **Smart Bin Management**
   - Create, update, and monitor smart bins
   - Track fill levels and status
   - Manage waste types

2. **Route Management**
   - Create and optimize collection routes
   - Track vehicle assignments
   - Monitor route completion status

3. **Complaint Management**
   - Register and track citizen complaints
   - Update complaint status
   - Generate complaint reports

4. **Employee Performance Tracking**
   - Monitor collection efficiency
   - Track route completion times
   - Generate performance reports

## Security

The application uses JWT (JSON Web Token) for authentication. All endpoints except `/api/auth/**` require authentication.

### Security Features:
- JWT-based authentication
- Role-based access control
- Password encryption
- Secure endpoints
- Token expiration

## Database Schema

Key entities and their relationships:

1. **User**
   - Roles: CITIZEN, EMPLOYEE, ADMIN
   - Manages authentication and authorization

2. **SmartBin**
   - Tracks bin location and status
   - Monitors fill levels
   - Links to collection records

3. **Route**
   - Defines collection routes
   - Associates vehicles and employees
   - Contains waypoints

4. **Complaint**
   - Tracks citizen complaints
   - Manages resolution status
   - Links to affected areas/bins

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify MySQL is running on port 3308
   - Check database credentials
   - Ensure database exists

2. **JWT Authentication**
   - Check token expiration
   - Verify proper token format in Authorization header
   - Debug using security logging:
     ```properties
     logging.level.org.springframework.security=DEBUG
     ```

3. **Build Issues**
   - Verify JDK 17 installation
   - Clean Maven cache: `mvn clean`
   - Update dependencies: `mvn -U clean install`

### Debug Logging

Enable debug logging by adding to `application.properties`:
```properties
logging.level.com.example.smart.waste.management=DEBUG
logging.level.org.springframework.security=DEBUG
```

## Contributing

1. Create a feature branch
2. Make changes
3. Write/update tests
4. Submit pull request

## License

[Add License Information]

## Support

For support and questions, please contact [Add Contact Information]