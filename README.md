# HRMS Lite

A lightweight Human Resource Management System for managing employee records and tracking daily attendance. Built as a clean, production-ready full-stack web application.

---

## Project Overview

HRMS Lite provides a single-admin interface to:

- **Manage Employees** — Add, view, and delete employee records with fields for Employee ID, Full Name, Email, and Department.
- **Track Attendance** — Mark daily attendance (Present / Absent) per employee and view all records with filtering by date and status.

The application is intentionally scoped to core HR operations, prioritising stability, clean code, and a professional UI over feature breadth.

---

## Tech Stack

| Layer               | Technology                      |
| ------------------- | ------------------------------- |
| Frontend            | React 18 + TypeScript           |
| Styling             | Tailwind CSS                    |
| UI Components       | shadcn/ui                       |
| Toast Notifications | Sonner                          |
| Backend             | Django + Django REST Framework  |
| Database            | SQLite (development)            |
| API Style           | RESTful, Functional Based Views |

---

## Project Structure

```
hrms-lite/
├── backend/                  # Django project
│   ├── hrms/                 # Main Django app
│   │   ├── models.py         # Employee & Attendance models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API views
│   │   └── urls.py           # App-level URL routes
│   ├── core/                 # Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                 # React project
    ├── src/
    │   ├── components/
    │   │   ├── employees/    # EmployeeForm, EmployeeList
    │   │   └── attendance/   # AttendanceForm, AttendanceList
    │   ├── services/         # API service functions (axios)
    │   ├── types/            # TypeScript interfaces
    │   └── App.tsx
    ├── package.json
    └── vite.config.ts
```

---

## Running the Project Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

### 1. Backend (Django)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

---

### 2. Frontend (React)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** Make sure the backend server is running before using the frontend. The frontend expects the Django API at `http://localhost:8000` by default. Update `src/services/` base URL if your backend runs on a different port.

---

## API Endpoints

| Method   | Endpoint              | Description                                                   |
| -------- | --------------------- | ------------------------------------------------------------- |
| `GET`    | `/api/employees/`     | List all employees                                            |
| `POST`   | `/api/employees/`     | Create a new employee                                         |
| `DELETE` | `/api/employees/:id/` | Delete an employee                                            |
| `GET`    | `/api/attendance/`    | List attendance records (filterable by `employee` and `date`) |
| `POST`   | `/api/attendance/`    | Mark attendance for an employee                               |

---

## Assumptions & Limitations

- **Single admin, no authentication.** There is no login system. The app assumes a single trusted admin user. Authentication is out of scope.
- **No edit functionality.** Employees and attendance records cannot be updated after creation — only created or deleted.
- **SQLite for development.** The backend uses SQLite by default. For production use, swap to PostgreSQL or another production-grade database in `settings.py`.
- **No pagination.** All employee and attendance records are returned in a single response. This may become a performance concern with large datasets.
