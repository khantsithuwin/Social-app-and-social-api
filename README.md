# Social — Full-Stack Social Media Application

A modern social media application built as a full-stack monorepo. Users can create an account, publish posts, join conversations through comments, like content, and view their profile in a responsive light or dark interface.

This project demonstrates end-to-end application development with a React client, REST API, token-based authentication, relational data modeling, and client-side server-state management.

## Highlights

- Account registration and login with bcrypt password hashing and JWT authentication
- Public post feed with detailed post and comment views
- Authenticated post, comment, and like interactions
- Ownership-based authorization for deleting posts and comments
- Optimistic like updates with automatic query invalidation
- User profiles with bios, post history, and engagement totals
- Responsive Material UI interface with light and dark themes
- Relational SQLite schema managed through Prisma migrations
- Reproducible development data generated with Faker

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Material UI, React Router |
| Data fetching | TanStack Query |
| Forms | React Hook Form |
| Backend | Node.js, Express 5, TypeScript |
| Authentication | JSON Web Tokens, bcrypt |
| Database | SQLite, Prisma ORM |
| Development | ESLint, tsx, Faker |

## Architecture

```text
Social-app-and-social-api/
├── social-app/                 # React single-page application
│   └── src/
│       ├── components/         # Navigation and reusable post UI
│       ├── pages/              # Feed, auth, profile, and post views
│       ├── AppProvider.jsx     # Theme, authentication, and query providers
│       └── AppRouter.jsx       # Client-side routes
└── social-api/                 # Express REST API
    ├── middlewares/            # JWT authorization middleware
    ├── prisma/                 # Schema and database migrations
    ├── routes/                 # User, post, comment, and like endpoints
    ├── seed/                   # Development data generator
    └── index.ts                # API entry point
```

## Getting Started

### Prerequisites

- Node.js 20.19 or newer
- npm

### 1. Configure and start the API

```bash
cd social-api
npm install
```

Create `social-api/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-random-secret"
```

Generate the Prisma client, apply the migrations, and start the development server:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

The API runs at [http://localhost:8800](http://localhost:8800).

To reset the local database and populate it with sample users, posts, comments, and likes, run:

```bash
npm run fresh
```

> `npm run fresh` deletes existing local data. Seeded accounts use `password` as the password; for example, sign in as `alice` or `bob`.

### 2. Start the frontend

In a second terminal:

```bash
cd social-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Overview

Protected routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/` | No | Check API status |
| `POST` | `/users` | No | Register a user |
| `POST` | `/login` | No | Authenticate and receive a JWT |
| `GET` | `/verify` | Yes | Verify a session and return its user |
| `GET` | `/users/:id` | No | Retrieve a profile and its posts |
| `GET` | `/posts` | Optional | Retrieve the latest 20 posts |
| `POST` | `/posts` | Yes | Create a post |
| `GET` | `/posts/:id` | Optional | Retrieve a post and its comments |
| `DELETE` | `/posts/:id` | Yes | Delete an owned post |
| `POST` | `/comments` | Yes | Add a comment |
| `DELETE` | `/comments/:id` | Yes | Delete an owned comment |
| `GET` | `/likes/:postId` | No | List users who liked a post |
| `POST` | `/likes` | Yes | Toggle the current user's like |

## Available Scripts

### Frontend (`social-app`)

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

### Backend (`social-api`)

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with automatic TypeScript reloads |
| `npm run fresh` | Reset, migrate, and seed the local database |

## Engineering Notes

- TanStack Query keeps feed, post, and profile data synchronized after mutations.
- Like interactions update optimistically and roll back if the API request fails.
- A compound database constraint prevents duplicate likes from the same user on a post.
- The API checks resource ownership before allowing post or comment deletion.
- Passwords are stored as bcrypt hashes, while protected endpoints validate signed JWTs.

## Potential Next Steps

- Add automated API and component tests
- Move the frontend API URL into environment configuration
- Add image uploads and profile editing
- Introduce pagination or infinite scrolling for larger feeds
- Deploy the client, API, and a production database
