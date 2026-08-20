# ⚡ VegaRecords — Personal Operating System (POS)

> A modern, tactical command-center and productivity workspace engineered for knowledge workers, developers, and power users. Inspired by Notion, Linear, Obsidian, and Arc Browser.

---

## 🚀 Overview

**VegaRecords** is a full-stack **Personal Operating System (POS)** built to centralize tasks, knowledge notes, custom objective trackers, digital resources, and real-time activity streams into a unified, high-performance web application.

Designed with a high-contrast dark command-center aesthetic, standard keyboard shortcuts (`Ctrl+K`), dynamic widget dashboards, and an automated database migration pipeline.

---

## 🏛️ System Architecture

```text
               ┌─────────────────────────────────────────────────────────┐
               │              Next.js 16 App Router UI                   │
               │  (Zustand State, Framer Motion, Axios Interceptors)     │
               └──────────────────────────┬──────────────────────────────┘
                                          │  HTTPS / REST APIs (JWT Bearer)
                                          ▼
               ┌─────────────────────────────────────────────────────────┐
               │             Spring Boot 3.4.2 REST Backend              │
               │  (Spring Security, JWT Rotation, Flyway SQL Engine)     │
               └──────────────────────────┬──────────────────────────────┘
                                          │  HikariCP / JPA
                                          ▼
               ┌─────────────────────────────────────────────────────────┐
               │               PostgreSQL Database (Neon / Local)        │
               │  (Auth, Tasks, Notes, Trackers, Resources, Activity)    │
               └─────────────────────────────────────────────────────────┘
```

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS, Zustand (Persistent Stores), Framer Motion, Lucide Icons, Axios.
- **Backend**: Java 21, Spring Boot 3.4.2, Spring Security 6, JJWT (Java JWT), Spring Data JPA, Hibernate, Lombok.
- **Database**: PostgreSQL with **Flyway** native raw SQL schema migrations.
- **Security**: Stateless JWT Authentication with Refresh Token rotation, environment variable isolation.

---

## ✨ Core Workspace Modules

### 1. 🎛️ Personalized Dashboard (`/dashboard`)
- **OS Greeting**: Contextual greeting header based on local time and user profile.
- **Modular Widgets**: Customize, toggle, and reorder dashboard widgets (Quick Actions, Continue Trackers, Today's Tasks, Activity Feed, Category Nodes).
- **Interactive Actions**: One-click status updates and shortcut triggers.

### 2. 🌳 Category Node Explorer (`/categories`)
- **Hierarchical Tree Engine**: Multi-level parent-child workspace categorization.
- **Node Management**: Create, edit, move, expand/collapse, and delete nodes with cascading updates.
- **Unified Filtering**: Pass category context dynamically across Tasks, Notes, Resources, and Trackers.

### 3. 📋 Task Management Center (`/tasks`)
- **Multi-View Engine**: Switch seamlessly between **List**, **Kanban Board**, and **Timeline** views.
- **Priority & Status Tracking**: Categorize by urgency (LOW, MEDIUM, HIGH, URGENT) and state (TODO, IN_PROGRESS, COMPLETED, ARCHIVED).
- **Right Sidebar Context**: Quick drawer inspection for detail edits.

### 4. 📝 Knowledge Notes Hub (`/notes`)
- **Obsidian-Style Markdown**: Rich content notes linked directly to categories and tracker objectives.
- **Full-Screen Focus Mode**: Immersive reading and writing environment.
- **Pinned Notes & Vault**: Quick access to essential knowledge documents.

### 5. 🎯 Tracker Hub & Custom Schema Builder (`/trackers`)
- **Dynamic Tracker Types (`/tracker-types`)**: Build custom field schemas (Text, Number, Date, Progress Bar) on the fly without database code changes.
- **Interactive Progress Rings**: Monitor completion percentages, log custom entries, and track milestones.

### 6. 🔖 Digital Vault Resources (`/resources`)
- **Asset Repository**: Store URLs, documents, course links, and media resources.
- **Quick Favorites & Categorization**: Instant search and category tagging.

### 7. ⏱️ Activity Feed (`/activity`)
- **GitHub/Linear Timeline**: Temporal grouping (Today, Yesterday, This Week, Earlier).
- **Entity Filter**: Filter event logs by Tasks, Trackers, Notes, Resources, and Categories.

### 8. 🔔 Notification System (`/notifications`)
- **Navbar Dropdown**: Instant unread badge counter and slide-out preview drawer.
- **Full Notifications Center**: Filter by Unread, Reminders, Milestones, and System Alerts.

### 9. ⌘ Global Command Palette (`/search` or `Ctrl+K`)
- **Unified Keyboard Navigation**: Press `Ctrl+K` or `/` anywhere to launch the global command palette.
- **Instant Search Indexing**: Queries tasks, notes, trackers, resources, and categories in real-time.

---

## 🔒 Security Architecture

### 1. Zero Hardcoded Credentials Policy
- **Environment Isolation**: No production passwords, secret keys, or database URLs are stored in the codebase.
- **Spring Boot Environment Resolution**: Environment variables are resolved dynamically from `backend/.env` via `${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`, and `${JWT_SECRET}`.
- **Failure Safeguard**: If `JWT_SECRET` is omitted from the environment, the application will refuse to start rather than fallback to an insecure hardcoded key.

### 2. JWT Authentication & Token Rotation
- **Stateless Session**: Access Tokens (short-lived) paired with Refresh Tokens (long-lived) stored in secure persistent storage.
- **Transparent Interceptor**: Frontend Axios client automatically attaches `Bearer <token>` headers and handles background token refresh requests transparently.

---

## 📁 Repository Structure

```text
VegaRecords/
├── backend/
│   ├── src/main/java/com/vegarecords/
│   │   ├── auth/           # Registration, Login, JWT Service, User Profile
│   │   ├── category/       # Category CRUD & Hierarchy Engine
│   │   ├── task/           # Task Management & Statistics
│   │   ├── resource/       # Vault Resource Management
│   │   ├── note/           # Markdown Knowledge Notes
│   │   ├── tracker/        # Tracker Types, Dynamic Schemas, Progress Values
│   │   ├── activity/       # Activity Audit Logs
│   │   ├── notification/   # User Notification System
│   │   └── search/         # Unified Global Search Engine
│   ├── src/main/resources/
│   │   ├── db/migration/   # Flyway Raw SQL Scripts (V1, V2)
│   │   └── application.yaml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── apis/           # Centralized Axios API Clients
│   │   ├── app/            # Next.js 16 App Router Routes
│   │   ├── components/     # Modern UI Component Suite
│   │   ├── stores/         # Zustand Persistent State Stores
│   │   └── styles/         # Global Theme Variables
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- **Java JDK 21**
- **Node.js 18+ & npm**
- **PostgreSQL 14+** (or Neon PostgreSQL Cloud DB)

---

### 1. Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create your `.env` file from the provided `.env.example` template:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your PostgreSQL database credentials and JWT secret:
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/vegarecords
   DB_USERNAME=postgres
   DB_PASSWORD=your_secure_password
   JWT_SECRET=your_generated_32_byte_base64_secret_key
   JWT_EXPIRATION_MS=86400000
   JWT_REFRESH_EXPIRATION_MS=604800000
   SERVER_PORT=8080
   ```

4. Build and run the Spring Boot server:
   ```bash
   ./mvnw clean compile
   ./mvnw spring-boot:run
   ```
   *Flyway will automatically create and migrate all database tables on server launch.*

---

### 2. Frontend Setup (Next.js 16)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create your `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```

3. Ensure `.env` points to the backend API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   NEXT_PUBLIC_APP_NAME=VegaRecords
   ```

4. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Production Build & Verification

To verify production compilation of the Next.js frontend:

```bash
cd frontend
npm run build
```

*Output:*
```text
✓ Compiled successfully
✓ Generating static pages using 15 workers (24/24)
✓ Finalizing page optimization
```

---

## 📄 License

Developed for **VegaRecords Personal Operating System**. Released under the MIT License.
