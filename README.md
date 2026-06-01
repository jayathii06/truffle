# Truffle — Hyperlocal Food Discovery Platform

A full-stack community platform where users discover, review, and bookmark the best dishes around them. Built with the MERN stack.

##  Live Demo
- **Frontend:** https://truffle-ns59.vercel.app/login
- **Backend API:** https://truffle-api-qh36.onrender.com

##  Features
- JWT Authentication (Register/Login)
- Add restaurants and dishes with photo uploads
- Dish-level reviews with star ratings
- Average rating calculation
- Search and filter restaurants by cuisine and city
- Pagination on all listings
- Bookmark favourite restaurants
- Trending dishes this week
- User profile with review history
- Mobile responsive design

##  Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios with request interceptors
- Context API for global auth state
- CSS-in-JS (inline styles)

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- Bcrypt password hashing
- Multer + Cloudinary for image uploads
- REST API with 15+ endpoints

##  Project Structure
\`\`\`
truffle/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   └── utils/         # Axios config
└── backend/           # Express API
    ├── config/        # DB + Cloudinary config
    ├── controllers/   # Business logic
    ├── middleware/    # Auth middleware
    ├── models/        # Mongoose schemas
    └── routes/        # API routes
\`\`\`

##  Database Schema
- **User** — name, email, password (hashed), avatar, bio, bookmarks[]
- **Restaurant** — name, description, cuisine, area, city, image, createdBy
- **Dish** — name, ingredients, flavor, weight, price, image, restaurant, createdBy
- **Review** — rating, comment, dish, user


##  Author
Jayathi Sree — [GitHub](https://github.com/jayathii06)
