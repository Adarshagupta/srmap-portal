# SRMAP Portal Flutter App

Complete Flutter client for the SRMAP Student Portal API with all features from the web frontend.

## Features

- **Auto-captcha login** - Backend automatically solves captcha, no manual entry needed
- **Session persistence** - Stay logged in across app restarts
- **Dashboard** - Overview with CGPA, attendance, and quick actions
- **Student Portal**:
  - Profile
  - Subjects
  - Attendance (with detailed breakdown and percentages)
  - Internal Marks
  - CGPA
  - Timetable
  - Current Semester Results
- **Finance**:
  - Fee Paid
  - Fee Due
  - Bank Details
- **Other**:
  - Announcements
  - Hostel Details
  - Transport Registration
  - Feedback
  - SAP
  - Exam Registration

## Setup

### Prerequisites

1. Install Flutter SDK: https://flutter.dev/docs/get-started/install
2. Ensure backend is running (local or deployed)

### Installation

1. Navigate to the flutter_app directory:

```powershell
cd C:\Users\adasg\Music\flutter\flutter_app
```

2. Install dependencies:

```powershell
flutter pub get
```

3. Run the app:

**For local backend:**
```powershell
flutter run --dart-define=SRMAP_API_URL=http://localhost:8000
```

**For production backend:**
```powershell
flutter run --dart-define=SRMAP_API_URL=https://srmap.onrender.com
```

**Default (uses localhost:8000):**
```powershell
flutter run
```

## Architecture

- **lib/main.dart** - App entry point, routes, and provider setup
- **lib/providers/** - State management (SessionProvider for auth)
- **lib/services/api.dart** - API client covering all backend endpoints
- **lib/screens/** - UI screens for each feature
  - `login_screen.dart` - Login with auto-captcha
  - `dashboard_screen.dart` - Main dashboard
  - `profile_screen.dart` - Student profile
  - `attendance_screen.dart` - Attendance with calculations
  - ... and more for each feature

## Login Flow

1. User enters username and password (no captcha needed)
2. Backend auto-solves captcha using OCR
3. Session ID is returned and saved locally
4. User navigates to dashboard
5. All subsequent API calls use the saved session ID

## Development Notes

- API client uses JSON encoding for all POST requests
- Session ID is stored using `shared_preferences`
- Provider pattern for state management
- Material Design UI matching web frontend patterns
- Error handling with user-friendly messages

## Backend Compatibility

This app is designed to work with the FastAPI backend in `main.py`. Ensure your backend:
- Accepts JSON request bodies (configured by default in FastAPI)
- Returns session_id in login response
- Implements auto-captcha solving (already implemented)

## Troubleshooting

**Error: "Failed to fetch..."**
- Check that backend URL is correct
- Ensure backend is running
- Check network connectivity

**Login fails**
- Verify credentials
- Check backend logs for errors
- Backend may have rate limiting

**Compile errors**
- Run `flutter pub get` to fetch dependencies
- Check Flutter SDK version (>=3.0.0)

## Next Steps

- Add pull-to-refresh on list screens
- Implement form-based features (course registration, hostel booking)
- Add caching for offline support
- Improve UI with more data visualizations

## License

For educational purposes only.
