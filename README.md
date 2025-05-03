# How to Start the Project

1. Install dependencies of the React server and the Express server, and in the root: npm i
2. If you use cloud MongoDB Atlas, add your URI to backend/.env
3. Start the React server and the Express server: npm run start

Format code with Prettier: npx prettier --write .

# About the Project
MongoDB is stored in a separate repository (https://github.com/Xutik/DontLookUp_DB). The data resides in the "Collision" collection, which combines two datasets:
Primary data from small bodies (via NASA's CAD API)
Enriched data with risk/diameter estimates (via Sentry API)
The collection contains both test samples and actual data.

# Frontend
A modal window with password authentication enables two user types:
- Viewer (password: "observer"): Read-only access
- Scientist (password: "scientist"): Edit privileges
The app features a data visualization viewport, search/editing controls, and a paginated data table (optimized for UX and backend performance). Frontend communicates with endpoints for data operations, including:
- Validation checks and isEditable attribute enforcement
- Error/success notifications for user/server actions
Accessibility enhancements: semantic markup, ARIA attributes, Lighthouse-tested contrast ratios
SEO optimization via index.html meta tags
Google Tag integration (example.com) for test analytics
Search tracking via console.log

# Backend
The backend handles MongoDB interactions through RESTful endpoints supporting GET, POST, PUT, and DELETE operations. It manages:
- User permission verification
- Database response/error handling
- Secure data transactions

Threat Handling
Current Protections:
- Role-based authorization
- User input validation
- CORS restricted to localhost:3000
- MongoDB client-side data sanitization

Vulnerabilities:
- Browser API Access: Potential unauthorized usage (mitigation: token/cookie authentication)
- DDoS Risk: No current rate-limiting
- Login Bypass: Modal window vulnerable to DevTools manipulation
- login info should be stored in secure place