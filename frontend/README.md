# SRMAP Student Portal - Next.js Frontend

Modern, responsive frontend for SRMAP Student Portal built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure login with captcha verification
- **Dashboard**: Overview of CGPA, attendance, and quick actions
- **Academic Pages**: 
  - CGPA & Exam Marks with detailed subject-wise breakdown
  - Attendance tracking with visual indicators
  - Timetable viewer
  - Internal marks and results
- **Finance Section**: Fee details and payment information
- **Hostel & Transport**: Booking and details management
- **State Management**: Zustand for efficient state handling
- **Type Safety**: Full TypeScript support
- **Responsive**: Works on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- SRMAP Backend API running on `http://localhost:8000`

## 🛠️ Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## ▶️ Running the Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── page.tsx       # Main dashboard
│   │   │   ├── cgpa/          # CGPA page
│   │   │   ├── attendance/    # Attendance page
│   │   │   └── layout.tsx     # Dashboard layout
│   │   ├── login/             # Login page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   └── lib/                   # Utilities
│       ├── api.ts             # API service layer
│       ├── store.ts           # Zustand state management
│       └── utils.ts           # Helper functions
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs

```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Package Manager**: npm

## 🔑 Pages

### Public Pages
- `/login` - Student login with captcha

### Protected Pages (Require Authentication)
- `/dashboard` - Main dashboard with overview
- `/dashboard/profile` - Student profile
- `/dashboard/cgpa` - CGPA and exam marks
- `/dashboard/attendance` - Attendance tracking
- `/dashboard/timetable` - Class timetable
- `/dashboard/subjects` - Subject list
- `/dashboard/internal-marks` - Internal marks
- `/dashboard/finance` - Fee details
- `/dashboard/hostel` - Hostel information
- `/dashboard/transport` - Transport details
- `/dashboard/announcements` - Latest announcements

## 🎯 Features in Detail

### Authentication
- Automatic captcha loading and refresh
- Form validation
- Session management with Zustand
- Auto-redirect based on auth status

### Dashboard
- Quick stats: CGPA, Attendance, Subjects count
- Recent subjects table
- Quick action cards
- Responsive grid layout

### CGPA Page
- Large CGPA display card
- Semester-wise subject breakdown
- Color-coded grades (A+, A, B+, B, C)
- Pass/Fail status indicators

### Attendance Page
- Average attendance with color-coded alerts
- Subject-wise attendance table
- Visual progress bars
- Critical attendance warnings
- Attendance policy information

## 🎨 Color Scheme

- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Neutral**: Gray scale

## 📱 Responsive Design

- **Mobile**: < 768px - Sidebar collapses to hamburger menu
- **Tablet**: 768px - 1024px - Adjusted layouts
- **Desktop**: > 1024px - Full sidebar visible

## 🔒 State Management

Uses Zustand with persistence:
- User authentication state
- Session ID storage
- Automatic logout on session expiry

## 🌐 API Integration

All API calls are centralized in `src/lib/api.ts`:
- Authentication API
- Student Data API
- Finance API
- Hostel API
- Transport API
- Announcements API

## 🎭 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 Development Notes

- TypeScript errors are expected until `npm install` is run
- Make sure backend API is running before starting frontend
- Session persists in localStorage
- Captcha refreshes on login failure

## 🐛 Troubleshooting

**Build errors**: 
```bash
rm -rf node_modules .next
npm install
```

**API connection issues**:
- Check if backend is running on port 8000
- Verify CORS settings in backend
- Check network tab in browser dev tools

**Session expired**:
- Clear localStorage
- Get new captcha and login again

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Submit issues or pull requests.

---

Built with ❤️ for SRMAP Students
