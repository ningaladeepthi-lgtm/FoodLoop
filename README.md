# FoodLoop – Food Waste Redistribution Platform

FoodLoop is a full-stack food waste management and redistribution web application. It connects surplus food donors (restaurants, hotels, function halls and households) with nearby volunteers and recipient organizations/NGOs to rescue edible food before it expires.

The project demonstrates full-stack development along with Docker containerization, Selenium automation testing and Jenkins CI/CD integration.

---

## 🌟 Key Features

### 1. Separation of Donation Status and Urgency Level

**Donation Status:**
- `AVAILABLE`
- `CLAIMED`
- `PICKUP_ASSIGNED`
- `PICKED_UP`
- `DELIVERED`
- `EXPIRED`
- `SPOILED`
- `CANCELLED`

**Urgency Level:** Dynamically calculated based on the remaining time until food expiry.

- 🟢 `FRESH`: More than 6 hours remaining
- 🟡 `EXPIRING_SOON`: 2–6 hours remaining
- 🟠 `URGENT`: 0–2 hours remaining
- 🔴 `EXPIRED`: 0 or fewer hours remaining

### 2. Food Expiry vs. Physical Spoilage

- An automated Spring Boot scheduler checks active donations every minute.
- Donations are automatically marked as `EXPIRED` when their expiry time passes.
- Donors, volunteers, NGOs and admins can report physically spoiled food.
- Spoilage reasons include bad smell, changed appearance, improper storage, temperature issues and damaged packaging.

### 3. Safety Restriction Enforcement Engine

Food-related operations such as accepting pickups, matching and delivery enforce expiry and food safety restrictions.

Operations are rejected when:
- The current time has passed the expiry time.
- The donation status is `EXPIRED`.
- The donation status is `SPOILED`.

### 4. Volunteer Pickup Mission Workflow

Volunteers can track pickup and delivery progress through the following stages:

1. Accept Pickup Mission
2. Start Pickup (`PICKUP_STARTED`)
3. Arrived at Donor (`ARRIVED_AT_DONOR`)
4. Food Collected (`FOOD_COLLECTED`)
5. Start Transit to Recipient (`DELIVERY_STARTED`)
6. Confirm Delivery (`DELIVERED`)

### 5. Admin Food Safety Monitor

- Dedicated admin dashboard.
- Live food expiry countdown timers.
- Food urgency metrics.
- Fresh, expiring soon, urgent and expired donation monitoring.
- Spoiled food incident audit log.

---

## 🔐 Demo Credentials

| Role | Email | Password | Dashboard Features |
|---|---|---|---|
| Donor | `donor1@foodloop.org` | `password123` | Create donations, live timers, manage donations and report spoilage |
| Volunteer | `volunteer1@foodloop.org` | `password123` | Urgency-sorted pickups, accept pickup and track delivery |
| NGO / Organization | `ngo1@foodloop.org` | `password123` | Post food requests, view recommended food matches and incoming deliveries |
| Admin | `admin@foodloop.org` | `admin123` | System statistics, user management, food safety monitoring and analytics |

**Note:** These are local demonstration credentials. Change demo passwords and avoid publishing real production credentials in a public repository.

---

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Java
- Spring Boot
- Spring Security
- REST APIs
- JWT Authentication

### Database
- H2 Database

### DevOps and Testing
- Docker
- Docker Compose
- Nginx
- Selenium WebDriver
- JUnit 5
- Maven
- Jenkins
- Nuclei Security Scanner

---

## 🏗️ Project Architecture

FoodLoop follows a frontend-backend architecture.

- **Frontend:** React application that provides the user interface.
- **Backend:** Spring Boot application that handles business logic, authentication and REST API requests.
- **Database:** H2 database for local application data.
- **Docker:** Containerizes the frontend and backend.
- **Nginx:** Serves the production frontend build and handles API proxying.
- **Selenium:** Automates browser-based application testing.
- **Jenkins:** Automates the build, testing and pipeline workflow.

---

## 🚀 Getting Started Locally

### Prerequisites

- Java 17 or Java 21
- Maven
- Node.js (v18 or later)
- npm
- Docker Desktop (for containerized execution)

### 1. Running the Spring Boot Backend

Open a terminal and execute:

```bash
cd backend
mvn spring-boot:run
```

Backend server:

`http://localhost:8080`

H2 Database Console:

`http://localhost:8080/h2-console`

JDBC URL:

`jdbc:h2:mem:foodloopdb`

### 2. Running the React Vite Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend development server:

`http://localhost:5173`

---

## 🐳 Docker Implementation

FoodLoop uses Docker to containerize the frontend and backend services.

### Docker Files

| File | Purpose |
|---|---|
| `backend/Dockerfile` | Builds the Spring Boot backend container |
| `frontend/Dockerfile` | Builds the React frontend and serves it using Nginx |
| `frontend/nginx.conf` | Configures Nginx to serve the frontend and handle API requests |
| `docker-compose.yml` | Manages frontend and backend containers together |

### Running FoodLoop Using Docker

Make sure Docker Desktop is running.

From the project root directory, execute:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

View running containers:

```bash
docker ps
```

View application logs:

```bash
docker compose logs
```

### Application Access

- Frontend: `http://localhost:3001`
- Backend: Port `8080` inside the Docker network

Docker Compose manages both services and connects them through a shared Docker network.

To stop the containers:

```bash
docker compose down
```

---

## 🧪 Selenium Automation Testing

FoodLoop uses Selenium WebDriver with Java and JUnit 5 to automate browser-based testing.

Maven is used to manage testing dependencies and execute the test suite.

### Selenium Project Structure

```text
selenium-tests/
│
├── pom.xml
│
└── src/
    └── test/
        └── java/
            └── com/
                └── foodloop/
                    └── tests/
                        └── FoodLoopHomeTest.java
```

### Implemented Test Cases

Four Selenium automation test cases have been implemented:

| Test Case | Description |
|---|---|
| TC01 – Homepage Test | Verifies that the FoodLoop homepage loads successfully |
| TC02 – Login Page UI Test | Checks login page elements and donor shortcut functionality |
| TC03 – Valid Donor Login | Verifies successful login using valid donor credentials |
| TC04 – Invalid Login | Verifies that invalid login credentials are rejected |

### Executing Selenium Tests

First, ensure Docker is running and the FoodLoop application is accessible.

Navigate to the Selenium test directory:

```bash
cd selenium-tests
```

Execute the test suite:

```bash
mvn clean test
```

### Test Execution Results

Previously verified successful execution:

| Result | Count |
|---|---:|
| Total Tests | 4 |
| Passed | 4 |
| Failures | 0 |
| Errors | 0 |
| Skipped | 0 |

**Build Status: BUILD SUCCESS**

### Test Reports

Maven Surefire generates test reports in:

```text
selenium-tests/target/surefire-reports/
```

The reports include:

- `com.foodloop.tests.FoodLoopHomeTest.txt`
- `TEST-com.foodloop.tests.FoodLoopHomeTest.xml`

These reports provide details about the executed test cases and their results.

---

## ⚙️ Jenkins CI/CD Pipeline

Jenkins is integrated into the FoodLoop project to automate the build and testing workflow.

The Jenkins pipeline is defined in the root `Jenkinsfile`.

### Pipeline Stages

The pipeline includes the following stages:

1. **GitHub Checkout:** Retrieves the project source code from GitHub.
2. **Backend Build:** Builds the Spring Boot backend.
3. **Backend Test:** Executes backend tests.
4. **Frontend Install:** Installs frontend dependencies.
5. **Frontend Build:** Builds the React application.
6. **Nuclei Security Scan:** Performs security scanning on the application.
7. **Docker Integration:** Includes Docker-related pipeline operations.

### Jenkins Access

Jenkins dashboard:

`http://localhost:8080`

Pipeline Job:

`FoodLoop-Pipeline`

Jenkins helps automate important development and testing activities through a single pipeline.

---

## 🔒 Security Scanning

Nuclei is integrated into the Jenkins pipeline to perform automated security scanning.

The scan checks for potential security issues using configured templates.

The scan result from the previously recorded Jenkins execution reported zero matches.

---

## 📂 Project Structure

```text
FoodLoop-Fresh/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── selenium-tests/
│   ├── src/
│   ├── pom.xml
│   └── target/
│
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## 🎯 Project Benefits

- Reduces food wastage by connecting donors with recipients.
- Provides food expiry and spoilage monitoring.
- Supports different user roles and workflows.
- Uses Docker for containerized application deployment.
- Uses Selenium for automated browser testing.
- Uses Jenkins for Continuous Integration and pipeline automation.
- Integrates Nuclei for security scanning.

---

## 🔮 Future Enhancements

- Cloud-based deployment.
- PostgreSQL database integration for persistent production storage.
- Improved real-time notifications.
- Enhanced analytics and reporting.
- Additional automated functional and performance tests.

---

## 📝 Conclusion

FoodLoop demonstrates the development of a full-stack food waste redistribution platform along with practical DevOps implementation.

The project integrates React, Spring Boot and H2 with Docker containerization, Selenium automation testing, JUnit, Maven and Jenkins CI/CD.

Through this project, we gained practical experience in application development, containerization, automated testing, build automation and security scanning.

---

**Project:** FoodLoop – Food Waste Redistribution Platform  
**Repository:** [GitHub – FoodLoop](https://github.com/ningaladeepthi-lgtm/FoodLoop)
