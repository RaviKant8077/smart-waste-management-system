# Developer Guide: Smart Waste Management System

This guide provides in-depth technical information for developers working on the Smart Waste Management System.

## Development Environment Setup

### Required Tools

1. **Java Development Kit (JDK) 17**
   - Download from: [Eclipse Temurin](https://adoptium.net/)
   - Set JAVA_HOME environment variable
   - Add JDK bin directory to system PATH

2. **MySQL 8.0**
   - Install MySQL Server
   - Configure to run on port 3308
   - Create database: smart_waste_management_system

3. **IDE Setup**
   - Recommended: IntelliJ IDEA or VS Code
   - Install Spring Boot plugins
   - Configure JDK 17 in IDE

### Building from Source

```bash
# Clone repository
git clone <repository-url>

# Navigate to project directory
cd smart-waste-management

# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

## Architecture Overview

### Layer Structure

1. **Controller Layer (`controller/`)**
   - REST endpoints
   - Request validation
   - Response formatting
   - Authentication handling

2. **Service Layer (`service/`)**
   - Business logic
   - Transaction management
   - Integration points

3. **Repository Layer (`repository/`)**
   - Data access
   - JPA repositories
   - Custom queries

4. **Model Layer (`model/`)**
   - Domain entities
   - JPA annotations
   - Relationships

### Key Components

1. **Security Implementation**
   ```java
   // SecurityConfig.java
   @Configuration
   @EnableWebSecurity
   public class SecurityConfig {
       // Security rules and JWT configuration
   }
   ```

2. **JWT Authentication**
   - Token generation
   - Token validation
   - User authentication

3. **File Upload**
   - Configured in FileUploadConfig
   - Handles multipart requests
   - Manages file storage

## Database Design

### Entity Relationships

1. **User - SmartBin**
   - One-to-Many relationship
   - Users can manage multiple bins
   - CRUD operations through REST API

2. **Route - Waypoint**
   - One-to-Many relationship
   - Routes contain ordered waypoints
   - Optimization algorithms

3. **ComplaintRecord**
   - Links users and bins
   - Tracks status and resolution
   - Maintains history

### Database Migration

- Using Hibernate auto-ddl
- Production should use proper migration tools
- Schema version control recommended

## API Documentation

### RESTful Endpoints

1. **Authentication**
   ```
   POST /api/auth/register
   POST /api/auth/login
   POST /api/auth/refresh-token
   ```

2. **Smart Bin Management**
   ```
   GET    /api/bins
   POST   /api/bins
   PUT    /api/bins/{id}
   DELETE /api/bins/{id}
   ```

3. **Route Management**
   ```
   GET    /api/routes
   POST   /api/routes
   PUT    /api/routes/{id}
   PATCH  /api/routes/{id}/status
   ```

### Request/Response Examples

1. **Register User**
   ```json
   // Request
   POST /api/auth/register
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john.doe@example.com",
     "password": "securePassword123",
     "role": "CITIZEN"
   }

   // Response
   {
     "id": "uuid",
     "email": "john.doe@example.com",
     "role": "CITIZEN",
     "token": "jwt-token"
   }
   ```

2. **Create Smart Bin**
   ```json
   // Request
   POST /api/bins
   {
     "location": {
       "latitude": 12.34567,
       "longitude": 45.67890
     },
     "capacity": 100,
     "wasteType": "GENERAL"
   }

   // Response
   {
     "id": "bin-uuid",
     "status": "ACTIVE",
     "fillLevel": 0,
     "lastCollected": "2025-10-29T10:00:00Z"
   }
   ```

## Testing Strategy

### Unit Tests

1. **Controller Tests**
   ```java
   @WebMvcTest(BinController.class)
   class BinControllerTest {
       @Test
       void whenCreateBin_thenReturn201() {
           // Test implementation
       }
   }
   ```

2. **Service Tests**
   ```java
   @SpringBootTest
   class BinServiceTest {
       @Test
       void whenUpdateBinStatus_thenStatusUpdated() {
           // Test implementation
       }
   }
   ```

### Integration Tests

1. **API Tests**
   - Use TestRestTemplate
   - Test complete flows
   - Verify database state

2. **Security Tests**
   - Test authentication
   - Verify authorization
   - Check token handling

## Error Handling

### Global Exception Handler

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFound() {
        // Handler implementation
    }
}
```

### Error Response Format

```json
{
  "timestamp": "2025-10-29T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "path": "/api/bins/123"
}
```

## Performance Considerations

1. **Database Optimization**
   - Use appropriate indexes
   - Implement pagination
   - Optimize queries

2. **Caching Strategy**
   - Use Spring Cache
   - Configure cache timeouts
   - Cache appropriate data

3. **Memory Management**
   - Monitor heap usage
   - Configure JVM parameters
   - Implement resource cleanup

## Security Best Practices

1. **Input Validation**
   - Validate all input parameters
   - Sanitize data
   - Prevent SQL injection

2. **Authentication**
   - Use secure password hashing
   - Implement token refresh
   - Handle session timeouts

3. **Authorization**
   - Role-based access control
   - Method-level security
   - Resource ownership

## Monitoring and Logging

### Logging Configuration

```properties
# application.properties
logging.level.root=INFO
logging.level.com.example.smart.waste.management=DEBUG
logging.file.name=logs/application.log
```

### Metrics Collection

- Use Spring Actuator
- Monitor key metrics
- Set up alerts

## Deployment

### Production Configuration

1. **Environment Variables**
   ```properties
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/smart_waste
   JWT_SECRET=<production-secret>
   ```

2. **Security Hardening**
   - Enable HTTPS
   - Configure CORS
   - Set secure headers

### Container Deployment

```dockerfile
FROM eclipse-temurin:17-jdk
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## Maintenance

### Regular Tasks

1. **Database Maintenance**
   - Regular backups
   - Index optimization
   - Data archival

2. **Security Updates**
   - Update dependencies
   - Patch vulnerabilities
   - Audit security logs

3. **Performance Monitoring**
   - Check response times
   - Monitor resource usage
   - Optimize bottlenecks

## Troubleshooting Guide

### Common Issues

1. **Database Connectivity**
   - Check connection strings
   - Verify credentials
   - Test network connectivity

2. **Authentication Problems**
   - Verify token configuration
   - Check user credentials
   - Debug security logs

3. **Performance Issues**
   - Analyze slow queries
   - Check memory usage
   - Review thread dumps

## Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement changes
   - Write tests
   - Submit pull request

2. **Code Review Process**
   - Review requirements
   - Check code quality
   - Verify tests
   - Approve changes

3. **Release Process**
   - Version control
   - Testing stages
   - Deployment steps
   - Rollback procedures

## Support and Resources

- Internal Documentation
- API Documentation
- Team Contacts
- Emergency Procedures