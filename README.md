# How to Start the Project
Install dependencies of the React server and the Express server, and in the root: npm i
If you use cloud MongoDB Atlas, add your URI to backend/.env
Start the React server and the Express server: npm run start
Format code with Prettier: npx prettier --write .

# About the Project
MongoDB is stored in a separate repository (https://github.com/Xutik/DontLookUp_DB). The data resides in the "Collision" collection, which combines two datasets: Primary data from small bodies (via NASA's CAD API) Enriched data with risk/diameter estimates (via Sentry API) The collection contains both test samples and actual data.

# Frontend
A modal window with password authentication enables two user types: - Viewer (password: "observer"): Read-only access - Scientist (password: "scientist"): Edit privileges The app features a data visualization viewport, search/editing controls, and a paginated data table (optimized for UX and backend performance). Frontend communicates with endpoints for data operations, including: - Validation checks and isEditable attribute enforcement - Error/success notifications for user/server actions Accessibility enhancements: semantic markup, ARIA attributes, Lighthouse-tested contrast ratios SEO optimization via index.html meta tags Google Tag integration (example.com) for test analytics Search tracking via console.log

# Backend
The backend handles MongoDB interactions through RESTful endpoints supporting GET, POST, PUT, and DELETE operations. It manages: - User permission verification - Database response/error handling - Secure data transactions

# Security Implementation
## Threat Handling and Current Protections:
- Role-based authorization
- User input validation
- CORS restricted to localhost:3000
- MongoDB client-side data sanitization
## Role-Based Authorization
Implemented role-based authorization as one of the main security features to prevent unauthorized users from messing with the data. This is important because the app contains scientific data about asteroids that shouldn't be changed by random people.

The way it works is pretty simple - there are two types of users: "Viewer" who can only look at the data, and "Scientist" who can edit everything. The frontend checks which role you have and only shows the editing buttons to scientists. The backend also verifies your permissions before actually making changes to the database.

This security measure is necessary because without it, anyone could delete important asteroid data or add fake information, which would be bad for scientific research. The role system keeps the data safe while still letting people view it for research purposes.

## User Input Validation
The app includes input validation to prevent malicious data from being entered into the system. This works by checking all user inputs on both the frontend and backend before they reach the database. For example, when users search for asteroids or scientists try to edit data, the system validates that the input follows the expected format and doesn't contain potentially harmful code or characters. This helps protect against injection attacks where someone might try to insert malicious scripts or database commands through input fields. Without this validation, attackers could potentially corrupt the database or steal sensitive information.

## Known Vulnerabilities
- Browser API Access: Potential unauthorized usage (mitigation: token/cookie authentication)
- DDoS Risk: No current rate-limiting
- Login Bypass: Modal window vulnerable to DevTools manipulation. login info should be stored in secure place
# Tracking and Privacy Implementation
## Privacy Tracking and Impact
The application implements tracking through: - Google Tag integration for usage analytics - Search tracking via console.log for development purposes

Tracking added to the app mainly to see how people actually use it and to catch any performance issues. Google Analytics helps to understand which features people click on most, where they might be getting stuck, and how much traffic the site gets. The console logging for searches was mostly for debugging during development - it's helpful to see what people are searching for when something breaks.

## Privacy Issues
There are definitely some privacy concerns:

1. Google Analytics: This collects quite a bit of user data - IP addresses, browser info, what pages people visit, how long they stay, etc. All of this gets sent to Google's servers, and theoretically someone could track individual users over time if they really wanted to.
2. No User Consent: Users have no idea their data is being collected, and there's no way for them to opt out. This is probably not great from a GDPR perspective.

### What Should Be Fixed: 
- Add a cookie banner so people know what's happening - Give users an option to disable trackin
