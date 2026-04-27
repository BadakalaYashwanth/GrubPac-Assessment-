# Content Broadcasting System (Backend)

## 📌 Project Overview
A production-ready generic Content Broadcasting System backend designed to manage an educational content lifecycle. It allows **Teachers** to upload subject-based educational content. The content remains hidden until a **Principal** reviews and approves it. Once approved, content becomes publicly accessible to students strictly during a schedule defined by the teacher (start/end time). Multiple approved contents for the same subject seamlessly rotate continuously based on their active duration using a dynamic modulo-based scheduling algorithm.

This project scales upon an existing JWT authentication foundation and introduces professional practices, clean architectural components, strict data validation, improved error handling, and file processing capability.

## 🌟 Features
- **JWT-Based Authentication:** Secure login and registration.
- **Role-Based Authorization:** Separate endpoints for `teacher` and `principal` roles.
- **Content Lifecycle Management:** Upload => Pending ✨ Approved / Rejected.
- **File Uploads Handling:** Uses `multer` for secure, validated local image uploads up to 10MB.
- **Dynamic Content Scheduling:** Advanced mathematical modulo rotation algorithm for rotating multiple contents seamlessly within an active schedule.
- **Industrial Clean Architecture:** Extracted routes, controllers, middlewares, models, config using `src/` modular layout.
- **Security Enhancements:** Employs `helmet` for HTTP headers, `cors` configured, error masking in production, and stringent `joi` payload validation.
- **Error Handling Pipeline:** Structured unified error processing avoiding typical backend crashes.

## 🛠️ Tech Stack
- **Environment Stack:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt (Password Hashing)
- **File Handling:** Multer
- **Validation:** Joi validation schemas
- **Security / Logging:** Helmet, CORS, Morgan

## 🚀 Setup & Run Locally

### 1. Prerequisites
Ensure you have the following installed on your system:
- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB (Local or Atlas URI)](https://www.mongodb.com/)

### 2. Installation Steps

Clone the project and navigate into the `backend` folder:
```bash
cd code-broadcasting/backend
```

Install dependencies:
```bash
npm install
```

### 3. Environment Config
Create a `.env` file at the root of `backend/` directory referencing `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/content_broadcasting
# OR MONGO_CONN=your_mongodb_cluster_string
JWT_SECRET=super_secret_unpredictable_key
NODE_ENV=development
```

### 4. Seed Essential Data
Run the seeder command to generate the default Principal administrative user along with a Demo Teacher if it's convenient:
```bash
npm run seed
```
**Principal Defaults:** `principal@admin.com` - Pass: `Admin123`
**Teacher Defaults:** `teacher@demo.com` - Pass: `Teacher123`

### 5. Running the Application
**Development Mode** (Hot Reloads using Nodemon)
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

## 🔄 Dynamic Scheduling Logic Explained
The public API endpoint utilizes mathematical logic to smoothly transition between approved assignments of identical topics overlapping at the current timestamp.
1. The server checks the `startTime` & `endTime`. If the current time is completely out of this range, the content is skipped internally.
2. It aggregates `durationMinutes` of all parallel approved contents for that subject.
3. Using Unix epoch duration intervals `(currentServerMinutes % totalDuration)`, it maps the active timeslot fraction to exactly which assignment sequence falls within the rotating loop.
4. Hence, students accessing without a login context will dynamically receive exactly the valid frame to render.

## 🌐 API Endpoints Definition

### Authentication API (Used By Both)
- `POST /api/auth/register` - Create an account 
- `POST /api/auth/login` - Login to account to receive JWT
- `GET /api/auth/profile` - Fetch self profile metadata

### Teacher User APIs (Protected)
- `POST /api/content/upload` - Creates a new pending upload content
- `GET /api/content/my-content` - Lists all user's items
- `GET /api/content/my-content/:id` - Fetch singular uploaded item details
- `PUT /api/content/:id` - Modify pending item details or swap photo
- `DELETE /api/content/:id` - Discard uploaded assignment

### Principal User APIs (Protected)
- `GET /api/admin/content/all` - Read entire pool of uploads
- `GET /api/admin/content/pending` - Read assignments explicitly needing review
- `PATCH /api/admin/content/:id/approve` - Authorize an assignment (sets publicly callable flag)
- `PATCH /api/admin/content/:id/reject` - Disapprove an assignment natively with explicit reasoning string

### Students/Public Read API (Unprotected)
- `GET /api/content/live/:teacherId?subject=Maths` - Publicly available fetch for valid content respecting rotation duration

## ☁️ Deployment Guides Context
- Setup a droplet on DigitalOcean, AWS EC2, or platforms like Render & Railway.
- Expose the exact port required by cloud configurations (auto-picked if PORT env is set).
- Assign an actual cloud MongoDB string in the environment variables securely.
- Important: The `/uploads` folder isn't permanently persisted on ephemeral hostings like Render. Either configure `Amazon S3` utilizing `multer-s3` plugin logic instead or operate via local VM instance hosting (EC2) retaining storage arrays. For Demo reasons, local Multer `diskStorage` suffices.
