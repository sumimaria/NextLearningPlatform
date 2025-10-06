# 📘 Learning Platform API Documentation

This documentation explains how to set up, connect to the database, start the server, and interact with the API endpoints.  

---

## ⚙️ Setup  

### 1. Connect to PostgreSQL  
From the terminal:  
```bash
psql -U admin -d learning_platform
Password: password
```

You should see:  
```
learning_platform=>
```

Check existing tables:  
```sql
\dt
```

Output:  
```
public | courses     | table | admin
public | enrollments | table | admin
public | users       | table | admin
```

Inspect table schema:  
```sql
\d courses
```

---

### 2. Start the Server  

Go to `pages/api` folder:  
```bash
npm run dev
```

Open browser: [http://localhost:3000/api/users](http://localhost:3000/api/users)  

---

## 🔑 Authentication  

Some APIs require authentication via **JWT tokens** (from login).  
Use the header:  
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

---

## 👤 User APIs  

### 1. List Users  
**GET**  
```
http://localhost:3000/api/users
```

### 2. Login  
**POST**  
```bash
curl -X POST      -H "Content-Type: application/json"      -d '{"email":"alice@example.com","password":"testpass123"}'      http://localhost:3000/api/login
```

Response:  
```json
{
  "token": "<jwt_token>",
  "user_id": 1
}
```

---

## 📚 Course APIs  

### 1. List Courses  
**GET**  
```
http://localhost:3000/api/courses
```

### 2. Course Details  
**GET**  
```
http://localhost:3000/api/courses/courseDetails?courseId=2
```

### 3. Create a Course  
**POST**  
```bash
curl -X POST      -H "Content-Type: application/json"      -d '{
           "title": "Quantum Computing",
           "course_summary": "Intro to qubits.",
           "what_you_will_learn": ["Qubits", "Gates"],
           "syllabus_structure": [{"order": 1, "title": "Start"}]
         }'      http://localhost:3000/api/courses/create
```

---

## 📝 Enrollment APIs  

### 1. Enrollments of a User  
**GET**  
```
http://localhost:3000/api/enrollments?userId=1
```

### 2. Enroll a User in a Course  
**POST**  
```bash
curl -X POST      -H "Content-Type: application/json"      -d '{"userId": 2, "courseId": 2}'      http://localhost:3000/api/enroll
```

---

## 📖 Course Content APIs  

### 1. Add Course Page (Lecture/Content)  
**POST**  
```bash
curl -X POST      -H "Content-Type: application/json"      -d '{
           "course_id": 2,
           "topic_title": "Module 1: ZKP Overview",
           "topic_order": 3,
           "title": "Introduction to Zero-Knowledge Proofs",
           "content_order": 1,
           "content_type": "lecture",
           "content_body": "This lesson introduces the definition and basic concept of ZKPs...",
           "video_url": "https://youtube.com/zkp-intro"
         }'      http://localhost:3000/api/content/add
```

---

### 2. Add Quiz Content  
Create a `quiz_payload.json` file and post it:  
```bash
curl -X POST      -H "Content-Type: application/json"      -d @quiz_payload.json      http://localhost:3000/api/content/add
```

---

### 3. Add Coding Exercise  
Create a `content_payload.json`:  
```bash
curl -X POST      -H "Content-Type: application/json"      -d @content_payload.json      http://localhost:3000/api/content/add
```

---

## 📑 Syllabus & Course Content APIs  

### 1. View Course Syllabus  
**GET**  
```
http://localhost:3000/api/courses/2/syllabus
```

### 2. View Entire Course Content  
**GET**  
```
http://localhost:3000/api/courses/2/content
```

ℹ️ Each course consists of `content_order` (denoting chapters). Within each `content_order`, there is a `content_id` that represents individual items like lectures, quizzes, or exercises.

---

## 📊 Progress APIs  

### 1. Mark User Progress  
**POST**  
```bash
curl -X POST \
  http://localhost:3000/api/progress/complete \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "contentId": 2,
    "score": 85.5,
    "attempts": 2
  }'
```
