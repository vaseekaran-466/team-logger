# Team Logger Application

Team Logger is a full-stack assessment project where employees add daily work logs and managers review team activity.

## Tech Stack

### Backend
- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication

### Frontend
- React
- JavaScript
- Vite
- Redux Toolkit
- Redux-Saga
- Formik
- Yup

## Folder Structure

```text
C:\vaseefolder\backend
C:\vaseefolder\frontent
```

- `backend` contains the NestJS API in TypeScript
- `frontent` contains the React app in JavaScript

## Features

### Authentication
- Login with JWT
- Two roles: `employee` and `manager`

### Employee
- Create own log
- Edit own log
- Delete own log
- View own logs

### Manager
- View all logs
- Filter logs by user
- Filter logs by date range

## Backend Setup

1. Open terminal in `C:\vaseefolder\backend`
2. Install packages:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/team-logger
JWT_SECRET=team-logger-secret
JWT_EXPIRES_IN_SECONDS=86400
FRONTEND_URL=http://localhost:5173

DEFAULT_MANAGER_NAME=Manager User
DEFAULT_MANAGER_EMAIL=manager@teamlogger.com
DEFAULT_MANAGER_PASSWORD=manager123

DEFAULT_EMPLOYEE_NAME=Employee User
DEFAULT_EMPLOYEE_EMAIL=employee@teamlogger.com
DEFAULT_EMPLOYEE_PASSWORD=employee123
```

4. Start backend:

```bash
npm run start:dev
```

Backend URL:

```text
http://localhost:3000/api
```

## Frontend Setup

1. Open terminal in `C:\vaseefolder\frontent`
2. Install packages:

```bash
npm install
```

3. Optional `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

4. Start frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Demo Login Accounts

### Manager
- Email: `manager@teamlogger.com`
- Password: `manager123`

### Employee
- Email: `employee@teamlogger.com`
- Password: `employee123`

These users are seeded automatically when the database is empty.

## API Endpoints

### Auth
- `POST /api/auth/login`

### Users
- `GET /api/users`

### Logs
- `GET /api/logs`
- `POST /api/logs`
- `PATCH /api/logs/:id`
- `DELETE /api/logs/:id`

## Assessment Checklist Covered

- Modular NestJS structure
- DTO validation with `class-validator`
- Mongoose schemas
- JWT authentication
- Role-based authorization
- Redux Toolkit state management
- Redux-Saga for API calls
- Formik for forms
- Yup validation
- Reusable components
- Role-based UI rendering
- Loading and error states

## Notes

- API calls are handled in sagas, not inside components
- Managers can only view and filter logs
- Employees can manage only their own logs
- Frontend is plain React JavaScript
- Backend is clean TypeScript
