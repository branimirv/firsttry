# Full-Stack Application

A modern full-stack web application built with React and Express, featuring authentication, password reset functionality, and protected routes.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Best Practices](#best-practices)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## 🛠 Tech Stack

### Client (`@client`)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **HTTP Client**: Axios
- **Notifications**: Sonner

### Server (`@server`)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: Enabled for cross-origin requests

## 📁 Project Structure

```
app-firsttry/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── layout/     # Layout components (Header, Footer)
│   │   │   ├── pages/      # Page components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── lib/            # Utility functions and helpers
│   │   │   └── validation/ # Form validation schemas
│   │   ├── router/         # TanStack Router configuration
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── dist/               # Build output
│
└── server/                 # Backend Express application
    ├── config/             # Configuration files (DB connection)
    ├── controllers/        # Route controllers
    ├── middleware/         # Express middleware (auth, error handling)
    ├── models/             # Mongoose models
    ├── routes/             # API route definitions
    ├── services/           # Business logic layer
    ├── utils/              # Utility functions (JWT, password, etc.)
    ├── validators/         # Request validation schemas
    └── types/              # TypeScript type definitions
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10.6.5 or higher) - Package manager
- **MongoDB** - Database server (local or cloud instance)
- **Git** - Version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app-firsttry
   ```

2. **Install client dependencies**
   ```bash
   cd client
   pnpm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   pnpm install
   ```

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/your-database-name

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Password Reset
PASSWORD_RESET_EXPIRY=3600000  # 1 hour in milliseconds
```

### Client Environment Variables

Create a `.env` file in the `client/` directory (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

## 💻 Development

### Running the Development Servers

**Terminal 1 - Start the server:**
```bash
cd server
pnpm dev
```
Server will run on `http://localhost:5000`

**Terminal 2 - Start the client:**
```bash
cd client
pnpm dev
```
Client will run on `http://localhost:5173` (default Vite port)

### Development Workflow

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the server** in one terminal
3. **Start the client** in another terminal
4. Make changes and see hot-reload in action

## ✨ Best Practices

### Code Organization

- **Separation of Concerns**: Keep business logic in services, not controllers
- **Type Safety**: Use TypeScript types consistently across client and server
- **Component Structure**: Follow the component organization in `client/src/components/`
- **Error Handling**: Use centralized error handling middleware on the server

### Client Best Practices

1. **State Management**
   - Use Zustand for global state (auth, user data)
   - Use React Hook Form for form state
   - Avoid prop drilling; use context or Zustand when needed

2. **Form Validation**
   - Always validate on both client and server
   - Use Zod schemas for type-safe validation
   - Provide clear, user-friendly error messages

3. **API Calls**
   - Centralize API calls in `lib/api.ts`
   - Handle errors gracefully with user feedback
   - Use loading states for better UX

4. **Routing**
   - Use TanStack Router for type-safe routing
   - Protect routes with `AuthGuard` component
   - Implement proper redirects after authentication

5. **Styling**
   - Use Tailwind CSS utility classes
   - Create reusable UI components in `components/ui/`
   - Maintain consistent design system

### Server Best Practices

1. **Security**
   - Never commit `.env` files
   - Use strong, unique JWT secrets
   - Hash passwords with bcryptjs (never store plain text)
   - Validate all user inputs
   - Use HTTPS in production

2. **Error Handling**
   - Use centralized error handler middleware
   - Return consistent error response format
   - Log errors appropriately (avoid exposing sensitive info)

3. **Database**
   - Use Mongoose models for type safety
   - Implement proper indexes for performance
   - Handle connection errors gracefully

4. **API Design**
   - Follow RESTful conventions
   - Use appropriate HTTP status codes
   - Version your API if needed (`/api/v1/...`)

5. **Code Structure**
   - Controllers: Handle HTTP requests/responses
   - Services: Business logic and data operations
   - Models: Database schemas and types
   - Middleware: Reusable request processing logic
   - Validators: Input validation schemas

### General Best Practices

1. **Git Workflow**
   - Write clear, descriptive commit messages
   - Create feature branches for new work
   - Keep commits focused and atomic

2. **Code Quality**
   - Run linters before committing (`pnpm lint`)
   - Follow TypeScript strict mode
   - Keep functions small and focused
   - Add comments for complex logic

3. **Testing** (Recommended)
   - Write unit tests for utilities and services
   - Write integration tests for API endpoints
   - Test authentication flows thoroughly

4. **Performance**
   - Optimize bundle size (check `client/dist/`)
   - Use lazy loading for routes
   - Implement pagination for large datasets
   - Cache frequently accessed data

## 📜 Scripts

### Client Scripts (`client/`)

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

### Server Scripts (`server/`)

```bash
pnpm dev          # Start development server with hot-reload (nodemon)
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/logout` - User logout

### Protected Routes (`/api/protected`)

- Requires valid JWT token in Authorization header
- `GET /api/protected/*` - Protected resources

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the best practices above
4. **Test your changes** thoroughly
5. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally

## 📝 License

[Add your license here]

## 👥 Authors

[Add author information here]

---

**Note**: This is a development project. Ensure all environment variables are properly configured and secrets are kept secure before deploying to production.
