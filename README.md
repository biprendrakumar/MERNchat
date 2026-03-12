# ChatApp – Real-Time Full-Stack Chat Application

A modern real-time chat application built using the **MERN Stack**, **Socket.io**, and **Cloudinary**, designed for secure one-to-one communication with text and image sharing.

---

## 📌 Project Overview

**ChatApp** is a full-stack web application developed as a **2nd Year Computer Science Engineering project at GLA University**.

The application enables authenticated users to communicate instantly through real-time messaging, image sharing, and online user presence tracking.

This project demonstrates practical implementation of:

* Full-stack web development
* REST API design
* Real-time communication systems
* Cloud media integration
* Authentication and authorization

---

## 🚀 Key Features

### 🔐 Authentication System

* JWT-based secure authentication
* Password hashing using bcrypt
* Login / Signup system
* Session persistence

### 💬 Real-Time Messaging

* Instant one-to-one messaging using Socket.io
* Message persistence in MongoDB
* Auto-scroll latest message support

### 🖼️ Image Sharing

* Cloudinary image upload integration
* Media delivery through CDN
* Shared image preview inside chat

### 🟢 Online User Presence

* Real-time active user detection
* Online/offline indicator

### 📩 Smart Notifications

* Unread message count
* Seen / unseen message tracking

### 👤 Profile Management

* Update profile picture
* Edit bio and display name

### 📱 Responsive User Interface

* Modern three-panel chat layout
* Tailwind CSS responsive design

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Socket.io
* JWT
* bcrypt.js

### Cloud & Deployment

* Cloudinary
* Vercel

---

## 🏗️ System Architecture

Client → REST API + Socket Connection → Server → Database + Cloud Storage

### Architecture Flow:

* React frontend sends requests to Express backend
* Socket.io manages real-time communication
* MongoDB stores users and messages
* Cloudinary stores uploaded images

---

## 📁 Project Structure

chatapp/
├── client/
├── server/
├── README.md
├── LICENSE

### Frontend Modules

* Sidebar
* ChatContainer
* RightSidebar
* Login Page
* Profile Page

### Backend Modules

* Authentication Controller
* Message Controller
* User Model
* Message Model
* JWT Middleware

---

## 🔐 Environment Variables

### Server (.env)

MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

### Client (.env)

VITE_API_URL=http://localhost:5000

---

## 📡 Core API Endpoints

### Authentication APIs

* POST /api/auth/signup
* POST /api/auth/login
* GET /api/auth/check-auth
* PUT /api/auth/update-profile

### Messaging APIs

* GET /api/messages/users
* GET /api/messages/:userId
* POST /api/messages/send/:userId
* PUT /api/messages/mark/:userId

---

## 👨‍💻 Team Members

This project was developed by a team of **5 members** under academic curriculum at **GLA University**.

| Name                | Role                    | Contribution                                                    |
| ------------------- | ----------------------- | --------------------------------------------------------------- |
| **Viprendra Kumar** | Full Stack Developer    | Project architecture, backend integration, core messaging logic |
| Member 2            | Frontend Developer      | UI design and responsive layout                                 |
| Member 3            | Backend Developer       | Database models and APIs                                        |
| Member 4            | Security Developer      | Authentication and authorization                                |
| Member 5            | Testing & Documentation | Testing, debugging, documentation                               |

---

## 🏫 Academic Information

* **University:** GLA University
* **Department:** Computer Science & Engineering
* **Academic Year:** 2024–2025
* **Year:** 2nd Year B.Tech

---

## 🔮 Future Enhancements

* Group Chat
* Voice Calling
* Video Calling
* Typing Indicator
* Message Reactions
* Dark Mode
* File Sharing
* End-to-End Encryption

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgment

We sincerely thank:

* GLA University
* Department of Computer Science & Engineering
* Faculty mentors and project guide
* Open-source communities of React, MongoDB, Socket.io, and Node.js

---

## ❤️ Developed By

**Team ChatApp – GLA University**
