# 🎯 AI Interview Preparation Platform

A full-stack web app for mock interview practice with AI-powered scoring, resume analysis, and performance tracking.

---

## ✨ Features

- **Mock Interviews** — Technical, HR & Behavioral categories with Easy/Medium/Hard difficulty
- **AI Scoring** — Keyword-based answer evaluation with instant feedback
- **Resume Analyzer** — PDF upload, ATS score, skill extraction & improvement tips
- **Dashboard** — Score trends, category breakdown charts, interview history
- **JWT Auth** — Register, login, forgot/reset password
- **Admin Panel** — Manage users and questions
- **Responsive UI** — Built with React + Vite (no CSS framework)

---

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, Vite, React Router, Recharts  |
| Backend   | Spring Boot 3.2, Spring Security, JPA   |
| Database  | MySQL (prod) / H2 in-memory (dev)       |
| Auth      | JWT (jjwt 0.11.5)                       |
| PDF       | Apache PDFBox 3                         |

---

## 🚀 Quick Start (Windows)

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.8+ *(or use the included `mvnw`)*

### One-click run (H2 in-memory DB — no MySQL needed)

```
Double-click  RUN.bat
```

Opens automatically at **http://localhost:3000**

---

## 🔑 Default Credentials

| Role  | Email                      | Password   |
|-------|----------------------------|------------|
| Admin | admin@interviewprep.com    | Admin@123  |
| User  | Register any new account   | —          |

---

## ⚙️ Manual Setup

### Backend

```bash
cd backend

# Run with H2 (no MySQL required)
mvn spring-boot:run -Dspring-boot.run.profiles=h2

# OR build JAR first
mvn package -DskipTests
java -jar target/interview-prep-backend-1.0.0.jar --spring.profiles.active=h2
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**, proxies `/api` → `http://localhost:8080`

---

## 🗄️ MySQL Setup (optional)

1. Create database:
   ```sql
   CREATE DATABASE interview_prep_db;
   ```

2. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/interview_prep_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

3. Run without the `h2` profile:
   ```bash
   mvn spring-boot:run
   ```

---

## 📁 Project Structure

```
AI Interview Preparation Platform/
├── backend/
│   └── src/main/java/com/interviewprep/
│       ├── config/          # SecurityConfig (CORS, JWT filter chain)
│       ├── controller/      # REST endpoints (Auth, Interview, Resume, Admin…)
│       ├── dto/             # Request/Response objects
│       ├── entity/          # JPA entities (User, Interview, Question, Result…)
│       ├── repository/      # Spring Data JPA repositories
│       ├── security/        # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       ├── service/         # Business logic
│       └── util/            # DataSeeder, GlobalExceptionHandler
├── frontend/
│   └── src/
│       ├── components/      # Navbar, ProtectedRoute
│       ├── context/         # AuthContext
│       ├── pages/           # Dashboard, Interview, Resume, History, Profile, Admin
│       └── services/        # Axios API client
├── RUN.bat                  # One-click launcher
└── README.md
```

---

## 🔌 Key API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/api/auth/register`              | Register new user        |
| POST   | `/api/auth/login`                 | Login → returns JWT      |
| POST   | `/api/interviews/start`           | Start a mock interview   |
| GET    | `/api/interviews/{id}/questions`  | Fetch interview questions|
| POST   | `/api/interviews/{id}/submit`     | Submit an answer         |
| POST   | `/api/interviews/{id}/complete`   | Finish & get score       |
| POST   | `/api/resumes/upload`             | Upload & analyze PDF     |
| GET    | `/api/dashboard`                  | User stats & charts      |
| GET    | `/api/admin/users`                | List all users (admin)   |

---

## 📊 How Scoring Works

1. User answer keywords are matched against expected keywords for the question
2. **Keyword score** = matched / total keywords × 70 points
3. **Length score** = min(answer length / 50 × 30, 30 points)
4. Final score = keyword score + length score (max 100)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push and open a Pull Request

---

## 📄 License

MIT License — free to use and modify.
