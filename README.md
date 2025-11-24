# Easy Invoicing & Tax (GST) Automation

A modern web-based invoicing system designed to simplify customer management, invoice generation, and GST calculation for small and medium-sized businesses. This project integrates a **Django REST Framework backend** with a **Next.js frontend**, offering a smooth, responsive, and efficient experience for end-users.

---

## 🚀 Project Overview

The **Easy Invoicing & Tax (GST) Automation** system aims to automate the invoicing process with accurate GST computation and easy customer management.

The system consists of two main components:

### **Backend – Django REST Framework**
- Handles customer, invoice, and user data
- Provides RESTful API endpoints
- Performs business logic (GST calculation, validation)

### **Frontend – Next.js + React**
- Consumes backend APIs via Axios
- Displays data dynamically in a clean UI
- Fully responsive using Tailwind CSS

This architecture maintains a clear separation of concerns where the backend focuses on logic and data, while the frontend handles UI and user interactions.

---

## 🎯 Objectives

- Build a backend API using Django REST Framework  
- Develop a responsive frontend using Next.js  
- Implement API communication using Axios  
- Enable basic customer display and navigation  
- Lay the foundation for complete GST-based invoicing automation  

---

## 🛠️ Technologies Used

### **Backend**
- Django
- Django REST Framework
- SQLite (for development)

### **Frontend**
- Next.js
- React
- Tailwind CSS

### **Other Tools**
- Axios (API calls)
- Git & GitHub (Version control)

---

## 📐 System Design

### **Database Design**
- Models for *User*, *Customer*, and *Invoice*
- Foreign key relationships for data integrity
- Designed to scale with additional invoicing features

### **API Design**
- RESTful structured endpoints
- Supports data retrieval & future CRUD operations
- Designed for smooth frontend integration

### **Frontend Design**
- Modular and reusable components
- Dynamic API-driven content
- Clean UI with Tailwind CSS

---

## 🧩 Implementation Progress

### ✅ Completed
- Django backend project setup  
- Customer & user models created  
- API testing endpoints functional  
- Next.js frontend setup  
- Axios configured for backend communication  
- Basic navigation and routing  
- Home page fetching & displaying API messages  

### 🔜 Upcoming Features
- Full CRUD: customers & invoices  
- GST auto-calculation  
- User authentication & role-based permissions  
- Invoice builder UI  
- Dashboard and analytics view  

---

## 📂 Project Structure

Easy_Hisab/
│
├── backend/ # Django Backend (DRF)
│ ├── easy_hisab/
│ ├── api/
│ └── manage.py
│
├── frontend/ # Next.js Frontend
│ ├── pages/
│ ├── components/
│ └── public/
│
└── README.md


---

## ▶️ Running the Project

### **1. Start the Backend Server**
```bash
cd backend
python manage.py runserver

2. Start the Frontend Server
cd frontend
npm install
npm run dev
```
Test the Backend API

Open in browser:
http://127.0.0.1:8000/api/

📸 Screenshots
(You can add your screenshots here later)
Main directory structure
Backend setup
Frontend interface
API test output

📦 GitHub Repository
🔗 Project Link: https://github.com/MSakibR/Easy_Hisab

#The repository includes:
Full backend & frontend source code
Project documentation
Setup instructions

## 🏁 Conclusion

The Easy Invoicing & Tax (GST) Automation project successfully establishes the core structure for a complete invoicing and GST automation platform. With API integration, basic models, and frontend routing already implemented, the foundation is ready for further expansion.

Future enhancements will include robust CRUD operations, GST automation, authentication, and a more interactive user interface to support real business usage.
