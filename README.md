# 📘 Dynamic Portfolio & Blog Management System - SRS

## 🧾 1. Introduction

### 1.1 Purpose
The purpose of this system is to develop a **dynamic personal portfolio platform** that allows a user (admin) to manage and display:
- Personal details
- Skills
- Projects
- Blogs
- Social media links
- Resume
- Contact information

The system provides a **modern, interactive, and responsive interface** for visitors and a **secure admin panel** for content management.

### 1.2 Scope
The system is a **full-stack web application** built using:
- **Frontend:** React
- **Backend:** Spring Boot
- **Database:** MySQL

It allows:
- **Public users** → View portfolio
- **Admin** → Manage all content dynamically

### 1.3 Definitions
- **Admin:** Authorized user who manages content (CRUD operations)
- **Visitor:** Public user viewing the portfolio
- **CRUD:** Create, Read, Update, Delete

---

## 🧩 2. Overall Description

### 2.1 Product Perspective
This system is a **standalone web application** that works as a:
- Personal branding platform
- Resume showcase
- Blog publishing system

### 2.2 User Classes
| User Type | Description |
| --------- | ----------- |
| **Admin** | Full access to dashboard. Manages settings and dynamic content. |
| **Visitor** | Public users seeking to view portfolio, resume, projects, or blogs. |

### 2.3 Operating Environment
- Web browser (Google Chrome, Microsoft Edge, Mozilla Firefox)
- Backend server (Java runtime)
- Database server (MySQL)

---

## ⚙️ 3. System Features

### 🏠 3.1 Home Module
Displays:
- Name
- Profile image
- Role (e.g., Full Stack Developer)
- Short intro
- Social links

### 👨‍💻 3.2 About Module
- Detailed bio
- Education details
- Career objective

### 🛠️ 3.3 Skills Module (Dynamic)
- Skills added by admin dynamically
- Displayed as visually appealing progress bars or skill cards

### 💼 3.4 Projects Module
- Project title
- Description
- Tech stack used
- GitHub repository link
- Live demo URL
- Project image

### ✍️ 3.5 Blog Module
- Admin can publish, edit, and delete blogs
- Visitors can read published blogs

### 🔗 3.6 Social Media Module
- Displays links like GitHub, LinkedIn, Instagram, etc.

### 📄 3.7 Resume Module
**Features:**
- Upload resume format (PDF)
- Visitors can view and download the resume

### 📞 3.8 Contact Module
**Features:**
- Contact form requiring Name, Email, Message
- Stores incoming messages directly in the database
- Optional: Email notification logic

### 🔐 3.9 Admin Module
**Features:**
- Secure login (JWT authentication)
- Dashboard to manage:
  - Skills
  - Projects
  - Blogs
  - Resume
  - Social links
  - Contact messages

---

## 🗄️ 4. Database Design

### Database Tables Representation

**Users Table**
`id, username, password`

**Skills Table**
`id, name, level`

**Projects Table**
`id, title, description, techStack, githubLink, liveLink, image`

**Blogs Table**
`id, title, content, image, createdAt`

**Social Links Table**
`id, platform, url, icon`

**Resume Table**
`id, fileUrl`

**Contact Table**
`id, name, email, message`

---

## 🎨 5. User Interface Requirements

**UI Design Principles:**
- Clean, premium, and modern layout
- Responsive design (mobile + desktop)
- Smooth animations
- Dark/light mode switch

---

## ⚡ 6. Functional Requirements
- Admin must be able to log in securely using standardized credentials.
- Admin can perform full CRUD operations on all dynamic portfolio content.
- Visitors can seamlessly view all public-facing sections.
- The user's uploaded Resume must be readily downloadable by visitors.
- Contact form submissions must accurately store messages for the Admin to read.

---

## 🚫 7. Non-Functional Requirements
- Fast loading and highly optimized assets.
- Secure authentication and data handling.
- Scalable design.
- Responsive UI that scales natively on all devices.
- Data Consistency.

---

## 🔐 8. Security Requirements
- Password encryption.
- JWT-based authorization and session management.
- Role-based access control.
- Input validation for forms.

---

## 🚀 9. Deployment Requirements
- **Frontend** → Netlify / Vercel
- **Backend** → Render / Railway
- **Database** → MySQL Cloud

---

## 📈 10. Future Enhancements
- Integration of an AI Chatbot for quick visitor queries
- Detailed Portfolio Analytics (Tracking page visits, resume downloads)
- Blog comments system to allow visitor engagement
- Multi-user portfolio support capabilities
