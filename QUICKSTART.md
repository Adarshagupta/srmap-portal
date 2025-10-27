# SRMAP Student Portal - Complete Guide

## 🎯 Quick Start

### Start Backend API
```bash
# In root directory
python main.py
```
Server runs at: http://localhost:8000

### Start Frontend
```bash
# In frontend directory
cd frontend
npm run dev
```
Frontend runs at: http://localhost:3000

## 📦 What's Included

### Backend (FastAPI)
- ✅ 40+ API endpoints
- ✅ Complete SRMAP portal wrapper
- ✅ Session management
- ✅ Auto-generated API docs

### Frontend (Next.js)
- ✅ Modern responsive UI
- ✅ Dashboard with analytics
- ✅ CGPA & attendance tracking
- ✅ Login with captcha
- ✅ TypeScript + Tailwind CSS

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📱 Features

### Authentication
- Captcha-based login
- Session persistence
- Auto logout

### Dashboard Pages
- **Dashboard**: Overview with stats
- **CGPA**: Detailed marks and grades
- **Attendance**: Subject-wise tracking
- **Profile**: Student information
- **Finance**: Fee details
- **Hostel**: Room information
- **Transport**: Registration details
- **Announcements**: Latest updates

## 🎨 Screenshots

### Login Page
- Modern gradient design
- Auto-refreshing captcha
- Form validation

### Dashboard
- Quick stats cards (CGPA, Attendance)
- Recent subjects table
- Quick action buttons

### CGPA Page
- Large CGPA display
- Semester-wise breakdown
- Color-coded grades

### Attendance Page
- Average attendance meter
- Subject-wise progress bars
- Critical attendance warnings

## 🚀 Deployment

### Backend
```bash
# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📝 Default Login (First Time)
- **Username**: Your roll number (e.g., AP24110012177)
- **Password**: Date of birth (DDMMYYYY format)
- **Captcha**: As shown in image

## 🛠️ Tech Stack

### Backend
- FastAPI
- BeautifulSoup4
- Requests
- Uvicorn

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- Lucide Icons

## 📂 Project Structure

```
.
├── main.py                    # FastAPI backend
├── requirements.txt           # Python dependencies
├── README.md                  # Backend docs
└── frontend/                  # Next.js frontend
    ├── src/
    │   ├── app/              # Pages
    │   ├── components/       # React components
    │   └── lib/              # API & state
    ├── package.json
    └── README.md             # Frontend docs
```

## ⚡ First Time Setup

1. **Install Backend Dependencies**
```bash
pip install -r requirements.txt
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Start Backend**
```bash
python main.py
```

4. **Start Frontend** (in new terminal)
```bash
cd frontend
npm run dev
```

5. **Access Application**
- Open http://localhost:3000
- Login with your credentials
- Explore the dashboard!

## 🎯 API Endpoints Summary

- **Authentication**: 3 endpoints
- **Academic**: 10 endpoints
- **Finance**: 5 endpoints
- **Examination**: 2 endpoints
- **Hostel**: 4 endpoints
- **Transport**: 2 endpoints
- **Course Registration**: 3 endpoints
- **SAP Program**: 5 endpoints
- **Other**: 4 endpoints

**Total**: 38+ endpoints

## 🔒 Security Features

- Session-based authentication
- Captcha verification
- CORS protection
- Session persistence
- Auto logout on expiry

## 🐛 Common Issues

### Backend won't start
```bash
pip install -r requirements.txt
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules .next
npm install
```

### Can't login
- Check if backend is running
- Verify captcha is correct
- Check credentials

### API not connecting
- Backend must be on port 8000
- Check CORS settings
- Verify API URL in frontend

## 📖 Documentation

- Backend API Docs: http://localhost:8000/docs
- Frontend README: frontend/README.md
- API Endpoints: Check /docs endpoint

## 🤝 Support

For issues:
- Check API documentation
- Review README files
- Check browser console
- Verify backend logs

---

**Built for SRMAP Students** 🎓
