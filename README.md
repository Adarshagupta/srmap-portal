# SRMAP Student Portal - FastAPI Backend

A comprehensive REST API wrapper around SRMAP Student Portal with **40+ endpoints** covering all student portal features.

## 🚀 Features

- **Complete Coverage**: All SRMAP portal features accessible via REST API
- **Authentication**: Secure login with captcha verification
- **Academic Data**: Profile, CGPA, attendance, timetable, marks
- **Finance**: Fee details, payments, bank information
- **Hostel & Transport**: Booking, room details, registrations
- **Course Management**: Registration, cancellation, minor programs
- **SAP Program**: Full SAP process management
- **Session Management**: Secure session handling
- **CORS Enabled**: Ready for frontend integration
- **Auto-generated Docs**: Interactive Swagger UI & ReDoc

## 📋 Prerequisites

- Python 3.8+
- pip

## 🛠️ Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## ▶️ Running the Server

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:
- **Root**: http://localhost:8000 - See all available endpoints
- **Swagger UI**: http://localhost:8000/docs - Interactive API testing
- **ReDoc**: http://localhost:8000/redoc - Beautiful documentation

## 🔑 API Endpoints Overview

### 🔐 Authentication (3 endpoints)

#### Get Captcha
```http
GET /api/captcha
```
**Response**: PNG image with `X-Session-ID` header

#### Login
```http
POST /api/login
```
**Request Body**:
```json
{
  "username": "AP24110012177",
  "password": "your_password",
  "captcha": "ABC12",
  "session_id": "uuid-from-captcha-response"
}
```

#### Logout
```http
DELETE /api/logout
```

### 📚 Academic Endpoints (10 endpoints)

All require `POST` with `{"session_id": "your-session-id"}`:

- `/api/student/profile` - Student profile information
- `/api/student/subjects` - Student wise subjects
- `/api/student/attendance` - Attendance details with percentages
- `/api/student/internal-marks` - Internal marks
- `/api/student/cgpa` - CGPA and exam marks (parsed)
- `/api/student/timetable` - Class timetable
- `/api/student/current-semester-results` - Current semester results
- `/api/student/earlier-internal-marks` - Earlier internal marks
- `/api/student/od-ml-details` - OD/ML details
- `/api/student/student-attendance-marking` - Mark attendance

### 💰 Finance Endpoints (5 endpoints)

- `/api/finance/fee-paid` - Fee paid details
- `/api/finance/fee-due` - Fee due details
- `/api/finance/payment-verification` - Online payment verification
- `/api/finance/payment-acknowledgment` - Payment acknowledgment
- `/api/finance/bank-details` - Bank account details

### 📝 Examination Endpoints (2 endpoints)

- `/api/exam/registration` - Exam registration
- `/api/exam/registration-details` - Exam registration details

### 🏠 Hostel Endpoints (4 endpoints)

- `/api/hostel/booking` - Hostel booking for full year
- `/api/hostel/room-details` - Room details
- `/api/hostel/room-request` - Room request
- `/api/hostel/room-transfer` - Room transfer

### 🚌 Transport Endpoints (2 endpoints)

- `/api/transport/registration` - Transport registration
- `/api/transport/acknowledgment` - Transport acknowledgment

### 📖 Course Registration Endpoints (3 endpoints)

- `/api/course/registration` - Course registration
- `/api/course/registration-cancellation` - Cancel registration
- `/api/course/minor-registration` - Minor program registration

### 🎓 SAP Program Endpoints (5 endpoints)

- `/api/sap/details` - SAP details
- `/api/sap/process` - SAP process
- `/api/sap/withdraw` - SAP withdraw
- `/api/sap/attachments` - SAP attachments
- `/api/sap/feedback` - SAP feedback

### 📢 Other Endpoints (4 endpoints)

- `/api/feedback/end-semester` - End semester feedback
- `/api/announcements` - View announcements
- `/api/change-password` - Change password page

## 💡 Usage Example

### Using Python

```python
import requests

# 1. Get captcha
response = requests.get("http://localhost:8000/api/captcha")
session_id = response.headers.get("X-Session-ID")
with open("captcha.png", "wb") as f:
    f.write(response.content)

# Solve captcha manually...
captcha_solution = input("Enter captcha: ")

# 2. Login
login_response = requests.post(
    "http://localhost:8000/api/login",
    json={
        "username": "AP24110012177",
        "password": "your_password",
        "captcha": captcha_solution,
        "session_id": session_id
    }
)
login_data = login_response.json()

if login_data["success"]:
    # 3. Get CGPA
    cgpa_response = requests.post(
        "http://localhost:8000/api/student/cgpa",
        json={"session_id": session_id}
    )
    cgpa_data = cgpa_response.json()
    print(f"CGPA: {cgpa_data['cgpa']}")
    
    # 4. Get Attendance
    attendance_response = requests.post(
        "http://localhost:8000/api/student/attendance",
        json={"session_id": session_id}
    )
    print(attendance_response.json())
    
    # 5. Get Fee Details
    fee_response = requests.post(
        "http://localhost:8000/api/finance/fee-paid",
        json={"session_id": session_id}
    )
    print(fee_response.json())
```

### Using cURL

```bash
# Get captcha and save session ID
curl -i http://localhost:8000/api/captcha --output captcha.png
# Note the X-Session-ID from headers

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "AP24110012177",
    "password": "your_password",
    "captcha": "ABC12",
    "session_id": "your-session-id"
  }'

# Get CGPA
curl -X POST http://localhost:8000/api/student/cgpa \
  -H "Content-Type: application/json" \
  -d '{"session_id": "your-session-id"}'
```

## 🎯 Response Format

Most endpoints return:
```json
{
  "data": "parsed_data_object (if applicable)",
  "html": "raw_html_response"
}
```

The `html` field contains the raw HTML from SRMAP portal for custom parsing.

## 🔒 Security Notes

- **Production**: Use Redis or database for session store (not in-memory)
- **CORS**: Configure `allow_origins` for production
- **HTTPS**: Always use HTTPS in production
- **Rate Limiting**: Add rate limiting middleware
- **Environment Variables**: Store sensitive config in `.env` file

## 📦 Project Structure

```
.
├── main.py              # FastAPI application (40+ endpoints)
├── requirements.txt     # Python dependencies
├── README.md           # This file
├── apis.txt            # Original portal HTML (reference)
└── loginapi.txt        # Login page HTML (reference)
```

## 🌟 Features Breakdown

### Parsed Responses
Some endpoints parse HTML and return structured JSON:
- **CGPA**: Returns CGPA value + list of subjects with grades
- **Attendance**: Returns list of subjects with attendance percentages
- **Profile**: Returns key-value profile information

### Raw HTML
All endpoints include raw HTML for custom parsing needs.

## 🐛 Troubleshooting

**Session expired error**: Get a new captcha and login again.

**Import errors**: Install dependencies:
```bash
pip install -r requirements.txt
```

**Port already in use**: Change port in `main.py` or kill existing process:
```bash
# Windows PowerShell
Get-Process -Name python | Where-Object {$_.MainWindowTitle -eq ""} | Stop-Process -Force
```

## 📖 Endpoint Categories Summary

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Authentication | 3 | Login, captcha, logout |
| Academic | 10 | Profile, CGPA, attendance, marks, timetable |
| Finance | 5 | Fees, payments, bank details |
| Examination | 2 | Exam registration & details |
| Hostel | 4 | Booking, room management |
| Transport | 2 | Transport registration |
| Course Registration | 3 | Course & minor program registration |
| SAP | 5 | SAP program management |
| Feedback | 1 | End semester feedback |
| Other | 3 | Announcements, password change |

**Total: 38+ endpoints**

## 🚀 Integration Tips

### For Flutter
```dart
// Use http or dio package
final response = await http.post(
  Uri.parse('http://localhost:8000/api/student/cgpa'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({'session_id': sessionId}),
);
```

### For React/Next.js
```javascript
// Use fetch or axios
const response = await fetch('http://localhost:8000/api/student/cgpa', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({session_id: sessionId})
});
const data = await response.json();
```

## 📄 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Contributions welcome! Submit issues or pull requests.

## ⚡ Quick Start

```bash
# Clone/Download
# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Visit http://localhost:8000/docs to explore all endpoints!
```
#   s r m a p - p o r t a l  
 