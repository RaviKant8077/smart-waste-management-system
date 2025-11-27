# Smart Waste Management System

A comprehensive waste management system with both frontend and backend components for efficient waste collection and management.

## Project Structure

```
Smart Waste Management System1/
├── Frontend/smart-waste-management-system/  # React Frontend
├── smart-waste-management/                   # Spring Boot Backend
├── package.json                              # Root package.json (if needed)
├── .gitignore                                # Git ignore rules
└── README.md                                 # This file
```

## Prerequisites

Before running this project, make sure you have the following installed:

- **Java 17 or higher** (for backend)
- **Node.js 16 or higher** (for frontend)
- **npm or yarn** (for frontend dependencies)
- **Maven** (for backend build)
- **Git** (for cloning)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Smart Waste Management System1"
```

### 2. Backend Setup (Spring Boot)

```bash
# Navigate to backend directory
cd smart-waste-management

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd ../Frontend/smart-waste-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Detailed Setup Instructions

### Backend (Spring Boot)

1. **Navigate to backend directory:**
   ```bash
   cd smart-waste-management
   ```

2. **Configure database** (if needed):
   - Update `src/main/resources/application.properties` with your database settings
   - Default configuration uses H2 in-memory database for development

3. **Build and run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **API Documentation:**
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - API Docs: `http://localhost:8080/v3/api-docs`

### Frontend (React + Vite)

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend/smart-waste-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   - Update API base URL in `src/api/client.js` if backend is not running on default port

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `mvn clean install` - Build the project
- `mvn spring-boot:run` - Run the application
- `mvn test` - Run tests

## Features

- **User Management**: Citizen, Employee, Supervisor, and Admin roles
- **Complaint Management**: Submit and track waste-related complaints
- **Route Management**: Plan and monitor waste collection routes
- **Real-time Tracking**: GPS-based vehicle and employee tracking
- **Dashboard Analytics**: Comprehensive reporting and analytics
- **Notification System**: Automated alerts and updates

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet (for maps)
- Chart.js (for analytics)

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- H2 Database (development)
- WebSocket (real-time updates)
- JWT Authentication

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Vite will automatically find an available port

2. **Database connection:**
   - Ensure database is running and credentials are correct
   - For development, H2 console is available at `http://localhost:8080/h2-console`

3. **CORS issues:**
   - Backend is configured to allow frontend origin
   - Check `application.properties` for CORS settings

### Getting Help

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure ports 8080 (backend) and 5173 (frontend) are available
4. Check the troubleshooting section above

## License

This project is licensed under the MIT License - see the LICENSE file for details.
