# Integration and Final Fixes TODO for Full-Stack Connection

This TODO tracks the steps to connect frontend to backend, fix error handling for MongoDB Atlas, remove Prisma remnants, and complete the project audit fixes.

## 1. Clean Up Unused Files
- [ ] Delete backend/prisma/schema.prisma (unused for MongoDB/Mongoose)

## 2. Update Backend Error Handling
- [ ] Edit backend/src/middleware/errorHandler.ts: Replace Prisma error handling with Mongoose equivalents (e.g., MongoServerError code 11000 for duplicates → 409; ValidationError → 422; CastError → 400)

## 3. Enhance Database Connection
- [ ] Edit backend/src/config/database.ts: Add Mongoose retry options for Atlas reliability (e.g., mongoose.set('bufferCommands', false); retryAttempts, retryDelay)

## 4. Install API Client in Frontend
- [ ] Run: cd Interview-Dashboard/project && npm install axios
- [ ] Update project/package.json if needed (auto-handled by npm)

## 5. Connect Auth to Backend APIs
- [ ] Edit project/src/contexts/AuthContext.tsx: Replace mock login/register/logout with axios/fetch calls to /api/auth endpoints. Store JWT token in localStorage. Add Authorization: Bearer ${token} for protected requests.
- [ ] Read and update project/src/components/auth/ProtectedRoute.tsx: Ensure it checks real token validity (e.g., decode JWT or call /api/auth/profile)

## 6. Update Other API-Dependent Pages
- [ ] Read project/src/pages/candidate/BookingPage.tsx and edit: Replace any mocks with API calls to /api/slots and /api/interviews (POST/GET with auth token)
- [ ] Read project/src/pages/interviewer/ManageSlotsPage.tsx and edit: Replace mocks with API calls to /api/slots (CRUD with auth)
- [ ] Read project/src/pages/candidate/CandidateDashboard.tsx and edit: Fetch real interviews via /api/interviews

## 7. Update Backend TODO and Documentation
- [ ] Edit backend/TODO.md: Mark completed items (e.g., auth routes, error handling base, server foundation). Remove PostgreSQL/Prisma references. Add notes on MongoDB Atlas setup.
- [ ] Update Interview-Dashboard/README.md: Add full-stack setup instructions (e.g., .env vars, run backend then frontend, test login)

## 8. Testing and Verification
- [ ] Run backend: cd Interview-Dashboard/backend && npm run dev (check logs for MongoDB Atlas connection)
- [ ] Run frontend: cd Interview-Dashboard/project && npm run dev
- [ ] End-to-end test: Register new user → Login → Navigate to dashboard → Book a slot → Verify data in Atlas (use MongoDB Compass)
- [ ] Test error scenarios: Invalid login (should show error toast), duplicate register (409 from backend)
- [ ] Check CORS: Ensure frontend can hit backend (localhost:3000 → localhost:5000)

## 9. Optional Polish
- [ ] Implement email notifications in controllers (e.g., sendBookingEmail in interviewController.ts)
- [ ] Add refresh token support in auth (if time allows)
- [ ] Run lint: npm run lint in both backend/project

Progress: Start with cleanup, then backend fixes, then frontend integration. Update this file after each step.
