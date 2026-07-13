<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

<br/>

<div align="center">
  <h1>The Third Strike — Server</h1>
  <p><strong>Backend API for the Student Safety & Accountability Platform</strong></p>

  <a href="https://the-third-strike-server-1.onrender.com">
    <img src="https://img.shields.io/badge/Live_API-000000?style=for-the-badge&logo=render&logoColor=white" alt="Live API" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Hackathon-2026-7030EF?style=for-the-badge" alt="Hackathon" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/API_REST-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="REST API" />
  </a>
</div>

---

## About The Project

**The Third Strike Server** is the backend API for the student safety platform built for the **BAIUST Computer Club Hackathon 2026**. It provides secure authentication, anonymous complaint management, real-time SOS alerts, strike tracking, and AI-powered features.

> "Three complaints. Two warnings. One final strike."

### Core Responsibilities

- **Authentication** — JWT-based login for Students, Teachers, and Captains
- **Anonymous Complaints** — Identity-hidden reporting system
- **Strike Management** — Three-strike impeachment system
- **Real-time SOS** — Socket.io-powered emergency alerts
- **AI Integration** — Syllabus summarization and fact-checking

---

## Live API

| Environment | URL | Status |
|---|---|---|
| **Production API** | [the-third-strike-server-1.onrender.com](https://the-third-strike-server-1.onrender.com) | Live |
| **Health Check** | [/api/health](https://the-third-strike-server-1.onrender.com/api/health) | Live |
| **API Root** | [/api](https://the-third-strike-server-1.onrender.com/api) | Live |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Socket.io** | Real-time communication |
| **Multer** | File uploads |
| **Dotenv** | Environment variables |

---

## Features

### 1. Authentication System

| Feature | Description |
|---|---|
| Student Login | Roll number + secret code |
| Teacher Login | Email + password |
| Captain Login | Email + password |
| JWT Tokens | Secure session management |
| Role-based Access | Student / Teacher / Captain permissions |

### 2. Complaint System (Mission 1)

| Feature | Description |
|---|---|
| Anonymous Submission | No student ID stored |
| Category Selection | Tiffin theft, bribery, syllabus bloat, etc. |
| Evidence Upload | Image upload with EXIF metadata stripping |
| Teacher Review | Verify or reject submitted complaints |
| Complaint Code | Track complaints anonymously by code |

### 3. Strike System

| Feature | Description |
|---|---|
| Automatic Counting | Three strikes trigger impeachment |
| Warning Levels | First Warning → Final Warning → Impeachment |
| Strike History | Complete audit trail |
| Socket Updates | Real-time notifications on strike changes |

### 4. SOS System (Mission 5)

| Feature | Description |
|---|---|
| Real-time Alerts | Socket.io-based emergency notifications |
| Location Tracking | Student location sharing |
| Captain Response | Respond to and resolve alerts |
| Status Tracking | Active → Responding → Resolved |

### 5. Syllabus AI (Mission 3)

| Feature | Description |
|---|---|
| Smart Parsing | Extracts chapters and topics automatically |
| Study Plan | Generates a day-by-day study schedule |
| Priority Assignment | Flags topics as High / Medium / Low priority |
| Time Estimation | Estimates total study hours required |

### 6. Seat Planner (Mission 2)

| Feature | Description |
|---|---|
| Advanced Algorithm | Line-of-sight optimization for seating |
| Visibility Control | Ensures teacher visibility for flagged students |
| Accessibility | Front-row placement for special needs |
| Height-based Logic | Shorter students placed front, taller students back |

### 7. Ledger System (Mission 4)

| Feature | Description |
|---|---|
| Money Tracking | Logs toll-style monetary entries |
| Tiffin Tracking | Tracks food-related deductions |
| Verification | Requires teacher approval before finalizing |
| Statistics | Aggregates total money and tiffin counts |

### 8. Fact Checker (Mission 6)

| Feature | Description |
|---|---|
| Claim Verification | Returns TRUE / FALSE status on claims |
| Confidence Score | Provides an accuracy percentage |
| Rule Database | Cross-references official school rules |
| Semantic Search | Keyword-based matching against the rule set |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in a user |
| `GET` | `/api/auth/me` | Get the current authenticated user |
| `PUT` | `/api/auth/profile` | Update user profile |

### Complaints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/complaints` | Submit a complaint |
| `GET` | `/api/complaints` | Get all complaints |
| `GET` | `/api/complaints/:id` | Get a complaint by ID |
| `PUT` | `/api/complaints/:id/verify` | Verify or reject a complaint |
| `DELETE` | `/api/complaints/:id` | Delete a complaint |
| `GET` | `/api/complaints/strike/status` | Get current strike status |

### Strikes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/strikes` | Create a strike |
| `GET` | `/api/strikes` | Get all strikes |
| `GET` | `/api/strikes/:id` | Get a strike by ID |
| `PUT` | `/api/strikes/:id/status` | Update strike status |

### SOS

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/sos` | Create an SOS alert |
| `GET` | `/api/sos` | Get all SOS alerts |
| `PUT` | `/api/sos/:id/respond` | Respond to an SOS alert |

### Ledger

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ledger` | Create a ledger entry |
| `GET` | `/api/ledger` | Get all ledger entries |
| `PUT` | `/api/ledger/:id/verify` | Verify a ledger entry |
| `DELETE` | `/api/ledger/:id` | Delete a ledger entry |

### Fact Check

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/factcheck/check` | Check a claim |
| `GET` | `/api/factcheck/rules` | Get all rules |
| `POST` | `/api/factcheck/rules` | Create a new rule |

### Seats

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/seats/generate` | Generate a seat plan |
| `GET` | `/api/seats/plan` | Get the current seat plan |
| `PUT` | `/api/seats/student` | Update a student's seat |

### Syllabus

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/syllabus/summarize` | Summarize a syllabus |

---

## Database Models

### Student Model

```javascript
{
  name: String,
  email: String,
  password: String,
  rollNumber: String,
  secretCode: String,
  role: 'student' | 'teacher' | 'captain',
  height: Number,
  isKuddus: Boolean,
  needsFront: Boolean,
  anonymousId: String
}
```

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/SultanaBristy226/the-third-strike-server.git
cd the-third-strike-server

# 2. Install dependencies
npm install

# 3. Create environment variables
cp .env.example .env

# 4. Update .env with your credentials
#    - Add MongoDB URI
#    - Add JWT Secret

# 5. Seed the database
npm run seed

# 6. Start the development server
npm run dev

# 7. Server runs on http://localhost:5000
```# the-third-strike-server
