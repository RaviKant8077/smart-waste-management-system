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
=======
## Quick Start

### Option 1: Docker (Recommended)

```bash
git clone <repository-url>
cd "Smart Waste Management System1"

# Start all services with Docker Compose
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306

### Option 2: Manual Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Smart Waste Management System1"
```

#### 2. Backend Setup (Spring Boot)

```bash
# Navigate to backend directory
cd smart-waste-management

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd ../Frontend/smart-waste-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`
