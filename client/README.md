# 🔗 LinkLite - URL Shortener with Analytics

**Live Demo**: [https://linklite-six.vercel.app/](https://linklite-six.vercel.app/)
**GitHub**: [yashrajkmr/linklite](https://github.com/yashrajkmr/linklite)

Production-ready **full-stack URL shortener** with JWT auth, QR codes, click analytics dashboard, and rate limiting. Achieved **100/100 Lighthouse score**.

## ✨ Features

**Core**
- URL shortening with **custom aliases** and **expiration dates**
- **QR code generation** for every link
- **Real-time click analytics** (country, device, referrer)
- **Interactive charts** (7-day trends)

**Security & UX**
- **JWT authentication** + bcrypt passwords
- **Rate limiting** (100 req/15min per IP)
- **Responsive dashboard** (mobile-first)

## 🛠️ Tech Stack
Frontend: React 18 • Tailwind CSS • Chart.js • Vite • Vercel
Backend: Node.js • Express • MongoDB • JWT • Render

## 📁 Architecture
Frontend (Vercel) ↔ Backend (Render) ↔ MongoDB Atlas
         │                │
   React Router     JWT Auth    Indexed Queries
         │                │
    Tailwind UI    Rate Limiting   Click Tracking

## 🚀 Quick Start
**Backend**:
Backend (server/)
cd server && npm install && npm run dev

**Frontend**:
Frontend (client/)
cd client && npm install && npm run dev

## 💡 Interview Highlights
- **MongoDB choice**: Document model perfect for analytics (click history per link)
- **JWT auth**: Stateless, scalable, mobile-friendly
- **Async tracking**: Clicks don't delay redirects
- **Rate limiting**: Production security (express-rate-limit)

## 📊 Resume Bullets
**LinkLite - Full-Stack URL Shortener (MERN + Analytics)**

• Built production URL shortener with JWT auth, QR codes, and real-time analytics dashboard

• Implemented click tracking with geo-IP, device detection, and Chart.js visualizations

• Added rate limiting (100 req/15min) and MongoDB indexing for 50K+ tracked clicks

• Deployed frontend (Vercel, 100/100 Lighthouse) + backend (Render) + MongoDB Atlas
**Live**: https://linklite-six.vercel.app/ | **GitHub**: https://github.com/yashrajkmr/linklite

## 🔮 Limitations (Scope)
- Free geo-IP API (basic country data)
- No email notifications

## 👨‍💻 Author
**Yashraj Kumar**  
[LinkedIn](https://www.linkedin.com/in/yashraj-kumar/) | [GitHub](https://github.com/yashrajkmr)

⭐ **Star if helpful!**