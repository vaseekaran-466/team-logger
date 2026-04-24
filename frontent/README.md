# Team Logger Frontend

React + Vite frontend for the Team Logger submission.

## Prerequisites

- Node.js 18+
- npm 9+
- Backend API running locally

## Setup

1. Open a terminal in `C:\vaseefolder\frontent`
2. Install dependencies:

```bash
npm install
```

3. Create an optional `.env` file in `frontent`:

```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:5173
```

## Build

Create a production build with:

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

## Backend Connection

This frontend expects the backend API at:

```text
http://localhost:3000/api
```

If needed, change it with `VITE_API_URL` in `.env`.

## Demo Accounts

Manager:

- Email: `manager@teamlogger.com`
- Password: `manager123`

Employee:

- Email: `employee@teamlogger.com`
- Password: `employee123`

These accounts are seeded by the backend when the database is empty.

## Main Features

- Role-based login for manager and employee
- Manager dashboard with user search filtering
- Manager log creation for selected users
- Employee log viewing
- Tailwind CSS based UI with React components

## Tech Stack

- React 19
- Vite
- Redux Toolkit
- Redux Saga
- Formik
- Yup
- Tailwind CSS 4

## Submission Notes

- Frontend folder: `C:\vaseefolder\frontent`
- Backend folder: `C:\vaseefolder\backend`
- Make sure the backend is started before logging in from the frontend
