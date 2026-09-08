# FoodLoop - Food Waste Redistribution Platform

FoodLoop is a full-stack, real-time food waste management and redistribution web application. It connects surplus food donors (restaurants, hotels, function halls, households) with nearby volunteers and recipient organizations/NGOs to rescue edible food before it expires.

---

## 🌟 Key Features

1. **Separation of Donation Status & Urgency Level**:
   - **Donation Status**: `AVAILABLE`, `CLAIMED`, `PICKUP_ASSIGNED`, `PICKED_UP`, `DELIVERED`, `EXPIRED`, `SPOILED`, `CANCELLED`
   - **Urgency Level** (Dynamically calculated based on `expiry_at - current_time`):
     - 🟢 `FRESH`: > 6 hours remaining
     - 🟡 `EXPIRING_SOON`: 2 – 6 hours remaining
     - 🟠 `URGENT`: 0 – 2 hours remaining
     - 🔴 `EXPIRED`: <= 0 hours remaining
2. **Food Expiry vs. Physical Spoilage**:
   - Automated Spring Boot Scheduler checks active donations every 1 minute and automatically sets status to `EXPIRED` if the expiry timestamp passes.
   - Physical spoilage can be reported by Donors, Volunteers, NGOs, or Admins (reasons: Bad smell, Changed appearance, Improper storage, Temperature issue, Damaged packaging, etc.) setting status to `SPOILED`.
3. **Safety Restriction Enforcement Engine**:
   - Operations (accepting pickup, matching, delivering) enforce `current_time < expiry_at` AND `status != EXPIRED` AND `status != SPOILED`. Violations are rejected with explicit error messages.
4. **Volunteer Pickup Mission Workflow**:
   - Real-time step-by-step progress tracking with exact timestamping:
     1. Accept Pickup Mission
     2. Start Pickup (`PICKUP_STARTED`)
     3. Arrived at Donor (`ARRIVED_AT_DONOR`)
     4. Food Collected (`FOOD_COLLECTED`)
     5. Start Transit to Recipient (`DELIVERY_STARTED`)
     6. Confirm Delivery (`DELIVERED`)
5. **Admin Food Safety Monitor**:
   - Dedicated dashboard with live countdown timers, `FRESH`, `EXPIRING_SOON`, `URGENT`, `EXPIRED` metrics cards, and a `SPOILED` incident audit log.

---

## 🔐 Demo Credentials

| Role | Email | Password | Dashboard Features |
| :--- | :--- | :--- | :--- |
| **Donor** | `donor1@foodloop.org` | `password123` | Create donation, live timers, my donations, report spoilage |
| **Volunteer** | `volunteer1@foodloop.org` | `password123` | Urgency-sorted pickups, accept pickup, live delivery workflow & map |
| **NGO / Organization** | `ngo1@foodloop.org` | `password123` | Post food request, smart recommended food match, incoming delivery |
| **Admin** | `admin@foodloop.org` | `admin123` | System stats, user management, Food Safety Monitor, analytics |

---

## 🚀 Getting Started Locally

### Prerequisites
- Java 17 or Java 21
- Maven
- Node.js (v18+) & npm

### 1. Running the Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
- Server runs on: `http://localhost:8080`
- Embedded H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:foodloopdb`)
- To switch to production PostgreSQL, update `src/main/resources/application.properties` with settings from `application-postgres.properties`.

### 2. Running the React Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
- Application runs on: `http://localhost:5173`
