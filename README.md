# How to start project

1. Install dependencies in the root: npm ci
2. Install dependencies of the React server and the Express server: npm run install
3. Start the React server and the Express server: npm run start

Prettier
npx prettier --write .

# About the project

DB Mongo is stored in a separate repo. Data is stored in the "Collision" collection, consists of 2 datasets (from 2 APIs https://ssd-api.jpl.nasa.gov/doc/cad.html - main data for small bodies and https://ssd-api.jpl.nasa.gov/doc/sentry.html - to enrich data with risk estimation and diameter estimation), contains test samples and actual data.

# Front

Modal window with password input allows 2 types of users with different permissions (view - password "observer" / view and edit - password "scientist"). App contains viewport for data visualisation and control panel to search and edit data, data table. Front calls endpoints to manipulate / get data. For safety of data: validation and limitations of input, isEditable attribute. Notification for errors (of user and server) and sucessful actions. Pagination in the table is used for UX and performance, decrease backend server load.
SEO: added meta data in index.html; a11y: semantics markup, aria-attributes, contrast, tested on LightHouse devTools. Contrasts checked with Colour contrast checker extension. Added Google tag for tracking (example.com) for testing analytics. Tracking of number of searches added on console.log.

# Back

Back connects to MongoDB to get / change data through endpoints.
API handles user permissions and data from database. Verbs: put (edit), delete, post (create), get. Success and error catch in repsonses.

### Handling Threats:

- Authorisation to handle safe data manipulations (roles for users)
- Validation of data from user to ensure data is full to add to dataset.
- Configured CORS for localhost:3000 Only
- MongoDB client sanitises data. Next step would be validation middleware for regex.

### Vulnerabilities:

- No validation of deleting on backend
- API is accessed via browser, which creats threat of unauthoirised access (this could be mitigated with tokens, authentification or/ and cookie-files)
