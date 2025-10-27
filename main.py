"""
SRMAP Student Portal - FastAPI Backend
Complete wrapper around SRMAP Student Portal
"""
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from typing import Optional, Dict, List, Any
import io
import uuid
from PIL import Image, ImageEnhance, ImageFilter
import httpx
import base64
import re

app = FastAPI(
    title="SRMAP Student Portal API",
    description="Complete FastAPI wrapper for SRMAP Student Portal - All endpoints available",
    version="2.0.0"
)

# CORS middleware - allow all origins (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Session-ID"],  # Expose custom header to frontend
)

BASE_URL = "https://student.srmap.edu.in/srmapstudentcorner"

# In-memory session store (use Redis in production)
sessions: Dict[str, requests.Session] = {}

# ==================== CAPTCHA SOLVER ====================

async def solve_captcha(image_bytes: bytes) -> str:
    """
    Automatically solve SRMAP captcha using OCR.Space FREE API - OPTIMIZED
    Works in production (Vercel/Render) - no installation needed!
    Returns the captcha text (5 characters)
    """
    try:
        # Pre-process image for better OCR accuracy
        try:
            from PIL import ImageEnhance, ImageFilter
            img = Image.open(io.BytesIO(image_bytes))
            
            # Convert to grayscale
            img = img.convert('L')
            
            # Enhance contrast
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(2.0)
            
            # Enhance sharpness
            enhancer = ImageEnhance.Sharpness(img)
            img = enhancer.enhance(2.0)
            
            # Apply threshold to make it binary (black and white)
            img = img.point(lambda x: 0 if x < 128 else 255, '1')
            
            # Resize for better OCR (larger = better accuracy)
            img = img.resize((img.width * 2, img.height * 2), Image.Resampling.LANCZOS)
            
            # Convert back to bytes
            img_buffer = io.BytesIO()
            img.save(img_buffer, format='PNG')
            image_bytes = img_buffer.getvalue()
        except Exception as img_err:
            print(f"⚠️ Image preprocessing failed, using original: {img_err}")
        
        # Convert image bytes to base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        # Use OCR.Space FREE API with increased timeout
        async with httpx.AsyncClient(timeout=30.0) as client:  # Increased timeout for OCR API
            # OCR.Space free API endpoint
            response = await client.post(
                'https://api.ocr.space/parse/image',
                data={
                    'base64Image': f'data:image/png;base64,{base64_image}',
                    'language': 'eng',
                    'isOverlayRequired': False,
                    'detectOrientation': False,
                    'scale': True,
                    'OCREngine': 2,  # Engine 2 is better for simple text
                },
                headers={
                    'apikey': 'helloworld'  # Free tier API key (public)
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get('IsErroredOnProcessing') == False:
                    parsed_text = result.get('ParsedResults', [{}])[0].get('ParsedText', '')
                    
                    if parsed_text:
                        # Clean the result - remove spaces, newlines, special chars
                        captcha_text = parsed_text.upper().strip()
                        captcha_text = re.sub(r'[^A-Z0-9]', '', captcha_text)
                        
                        # SRMAP captcha is typically 5 characters
                        if len(captcha_text) >= 5:
                            captcha_text = captcha_text[:5]
                        
                        if len(captcha_text) == 5:
                            print(f"✓ Captcha solved: {captcha_text}")
                            return captcha_text
                        else:
                            print(f"⚠️ OCR returned wrong length: {captcha_text}")
                
                print(f"✗ OCR.Space API issue: {result}")
            else:
                print(f"✗ OCR.Space API failed with status: {response.status_code}")
            
            return ""
            
    except httpx.ReadTimeout:
        print(f"⚠️ OCR.Space API timed out (server may be slow or unreachable)")
        return ""
    except Exception as e:
        print(f"Error solving captcha: {e}")
        return ""

# Endpoint mapping based on the JavaScript from apis.txt
REPORT_ENDPOINTS = {
    1: "Profile",
    2: "Student Wise Subjects",
    3: "Attendance Details",
    4: "Reserved",
    5: "Internal Mark Details",
    6: "Exam Mark Details / CGPA",
    7: "Fee Paid Details",
    10: "Time Table",
    15: "Current Semester Results",
    18: "Reserved",
    21: "Room Details (Hostel)",
    22: "Earlier Internal Marks",
    25: "Exam Schedule",
    35: "Reserved",
    47: "SAP Details",
    53: "OD/ML Details"
}


# ==================== MODELS ====================

class LoginRequest(BaseModel):
    username: str
    password: str
    captcha: Optional[str] = None  # Now optional - will be auto-solved if not provided
    session_id: Optional[str] = None


class LoginResponse(BaseModel):
    success: bool
    message: str
    session_id: Optional[str] = None


class StudentDataRequest(BaseModel):
    session_id: str


# ==================== ROOT ENDPOINT ====================

@app.get("/")
def read_root():
    return {
        "message": "SRMAP Student Portal API - Complete Wrapper",
        "version": "2.0.0",
        "total_endpoints": 40,
        "categories": {
            "authentication": [
                "GET /api/captcha - Get captcha image",
                "POST /api/login - Login with credentials",
                "DELETE /api/logout - Logout session"
            ],
            "academic": [
                "POST /api/student/profile - Student profile",
                "POST /api/student/subjects - Student wise subjects",
                "POST /api/student/attendance - Attendance details",
                "POST /api/student/internal-marks - Internal marks",
                "POST /api/student/cgpa - CGPA & exam marks",
                "POST /api/student/timetable - Time table",
                "POST /api/student/current-semester-results - Current results",
                "POST /api/student/earlier-internal-marks - Earlier internal marks",
                "POST /api/student/od-ml-details - OD/ML details",
                "POST /api/student/student-attendance-marking - Mark attendance"
            ],
            "finance": [
                "POST /api/finance/fee-paid - Fee paid details",
                "POST /api/finance/fee-due - Fee due details",
                "POST /api/finance/payment-verification - Payment verification",
                "POST /api/finance/payment-acknowledgment - Payment acknowledgment",
                "POST /api/finance/bank-details - Bank account details"
            ],
            "examination": [
                "POST /api/exam/registration - Exam registration",
                "POST /api/exam/registration-details - Exam registration details"
            ],
            "hostel": [
                "POST /api/hostel/booking - Hostel booking",
                "POST /api/hostel/room-details - Room details",
                "POST /api/hostel/room-request - Room request",
                "POST /api/hostel/room-transfer - Room transfer"
            ],
            "transport": [
                "POST /api/transport/registration - Transport registration",
                "POST /api/transport/acknowledgment - Transport acknowledgment"
            ],
            "course_registration": [
                "POST /api/course/registration - Course registration",
                "POST /api/course/registration-cancellation - Cancel registration",
                "POST /api/course/minor-registration - Minor program registration"
            ],
            "sap": [
                "POST /api/sap/details - SAP details",
                "POST /api/sap/process - SAP process",
                "POST /api/sap/withdraw - SAP withdraw",
                "POST /api/sap/attachments - SAP attachments",
                "POST /api/sap/feedback - SAP feedback"
            ],
            "feedback": [
                "POST /api/feedback/end-semester - End semester feedback"
            ],
            "other": [
                "POST /api/announcements - View announcements",
                "POST /api/change-password - Change password page"
            ]
        },
        "docs": {
            "swagger": "/docs",
            "redoc": "/redoc"
        }
    }


# ==================== AUTHENTICATION ENDPOINTS ====================

@app.get("/api/captcha")
def get_captcha():
    """
    Get a new captcha image and create a session
    Returns: PNG image and session_id in headers
    """
    session = requests.Session()
    
    # Get login page to establish session
    session.get(f"{BASE_URL}/StudentLoginPage")
    
    # Get captcha
    response = session.get(f"{BASE_URL}/captchas")
    
    # Generate session ID
    import uuid
    session_id = str(uuid.uuid4())
    sessions[session_id] = session
    
    # Return image with session_id in headers
    return StreamingResponse(
        io.BytesIO(response.content),
        media_type="image/png",
        headers={"X-Session-ID": session_id}
    )


@app.post("/api/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Login to SRMAP portal with automatic captcha solving and retry
    """
    # Create new session if not provided
    if not credentials.session_id or credentials.session_id not in sessions:
        session = requests.Session()
        # Get login page to establish session
        session.get(f"{BASE_URL}/StudentLoginPage")
        
        # Generate session ID
        session_id = str(uuid.uuid4())
        sessions[session_id] = session
    else:
        session_id = credentials.session_id
        session = sessions[session_id]
    
    # Auto-solve captcha if not provided (with retry mechanism)
    captcha_text = credentials.captcha
    if not captcha_text:
        max_attempts = 1  # Reduced to 1 attempt to avoid long waits
        for attempt in range(max_attempts):
            # Get captcha image
            captcha_response = session.get(f"{BASE_URL}/captchas")
            if captcha_response.status_code == 200:
                captcha_text = await solve_captcha(captcha_response.content)
                if captcha_text:
                    print(f"✓ Auto-solved captcha: {captcha_text}")
                    break
                else:
                    print(f"⚠️ Captcha solve failed (OCR timeout or error)")
            else:
                print(f"✗ Failed to retrieve captcha")
        
        if not captcha_text:
            return LoginResponse(
                success=False,
                message="Auto-captcha solving failed (OCR API timeout). Please try again or contact support if this persists."
            )
    
    # Login
    login_data = {
        'txtUserName': credentials.username,
        'txtAuthKey': credentials.password,
        'ccode': captcha_text.upper()
    }
    
    response = session.post(
        f"{BASE_URL}/StudentLoginToPortal",
        data=login_data,
        headers={
            'Referer': f'{BASE_URL}/StudentLoginPage',
            'Origin': 'https://student.srmap.edu.in',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        allow_redirects=True
    )
    
    # Check login success
    if 'Invalid' in response.text or 'login' in response.url.lower():
        # Remove failed session
        if session_id in sessions:
            del sessions[session_id]
        return LoginResponse(
            success=False,
            message="Login failed. Check your credentials or try again."
        )
    
    return LoginResponse(
        success=True,
        message="Login successful (captcha auto-solved)",
        session_id=session_id
    )


# ==================== STUDENT DATA ENDPOINTS ====================

def get_student_data(session_id: str, ids: str):
    """Helper function to fetch student data from report resources"""
    if session_id not in sessions:
        raise HTTPException(status_code=401, detail="Invalid or expired session. Please login again.")
    
    session = sessions[session_id]
    
    response = session.post(
        f"{BASE_URL}/students/report/studentreportresources.jsp",
        data={'ids': ids},
        headers={
            'Referer': f'{BASE_URL}/',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch data from portal")
    
    return response.text


def post_to_endpoint(session_id: str, endpoint: str, data: dict = None):
    """Helper function to POST to any endpoint"""
    if session_id not in sessions:
        raise HTTPException(status_code=401, detail="Invalid or expired session. Please login again.")
    
    session = sessions[session_id]
    
    response = session.post(
        f"{BASE_URL}/{endpoint}",
        data=data or {},
        headers={
            'Referer': f'{BASE_URL}/',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from {endpoint}")
    
    return response.text


# ==================== ACADEMIC ENDPOINTS ====================

@app.post("/api/student/profile")
def get_profile(request: StudentDataRequest):
    """Get student profile (ids=1)"""
    html_data = get_student_data(request.session_id, "1")
    soup = BeautifulSoup(html_data, 'html.parser')
    
    profile = {}
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 2:
                key = cells[0].get_text(strip=True).replace(':', '')
                value = cells[1].get_text(strip=True)
                if key and value:
                    profile[key] = value
    
    return {"profile": profile, "html": html_data}


@app.post("/api/student/subjects")
def get_subjects(request: StudentDataRequest):
    """Get student subjects (ids=2)"""
    html_data = get_student_data(request.session_id, "2")
    return {"html": html_data}


@app.post("/api/student/attendance")
def get_attendance(request: StudentDataRequest):
    """Get attendance details (ids=3)"""
    html_data = get_student_data(request.session_id, "3")
    
    soup = BeautifulSoup(html_data, 'html.parser')
    attendance = []
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 9:
                subject_code = cells[0].get_text(strip=True) if len(cells) > 0 else ""
                # Skip header rows
                if subject_code and subject_code != "Subject Code" and not subject_code.startswith("For any"):
                    record = {
                        "subject_code": subject_code,
                        "subject_name": cells[1].get_text(strip=True) if len(cells) > 1 else "",
                        "classes_conducted": cells[2].get_text(strip=True) if len(cells) > 2 else "0",
                        "present": cells[3].get_text(strip=True) if len(cells) > 3 else "0",
                        "absent": cells[4].get_text(strip=True) if len(cells) > 4 else "0",
                        "od_ml_taken": cells[5].get_text(strip=True) if len(cells) > 5 else "0",
                        "present_percentage": cells[6].get_text(strip=True) if len(cells) > 6 else "0",
                        "od_ml_approved": cells[7].get_text(strip=True) if len(cells) > 7 else "0",
                        "attendance_percentage": cells[8].get_text(strip=True) if len(cells) > 8 else "0",
                    }
                    attendance.append(record)
    
    return {"attendance": attendance, "html": html_data}


@app.post("/api/student/internal-marks")
def get_internal_marks(request: StudentDataRequest):
    """Get internal marks (ids=5)"""
    html_data = get_student_data(request.session_id, "5")
    return {"html": html_data}


@app.post("/api/student/cgpa")
def get_cgpa(request: StudentDataRequest):
    """Get CGPA and exam marks (ids=6)"""
    html_data = get_student_data(request.session_id, "6")
    
    soup = BeautifulSoup(html_data, 'html.parser')
    
    # Extract CGPA
    cgpa = None
    cgpa_div = soup.find('div', string=lambda text: text and 'CGPA' in text if text else False)
    if cgpa_div:
        cgpa_text = cgpa_div.get_text(strip=True)
        cgpa = cgpa_text.replace('CGPA', '').replace(':', '').strip()
    
    # Extract semester results
    subjects = []
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 8:
                semester = cells[0].get_text(strip=True)
                subject_code = cells[2].get_text(strip=True)
                
                if subject_code and semester:
                    subject = {
                        "semester": semester,
                        "month_year": cells[1].get_text(strip=True),
                        "subject_code": subject_code,
                        "subject_name": cells[3].get_text(strip=True),
                        "credit": cells[4].get_text(strip=True),
                        "grade": cells[5].get_text(strip=True),
                        "grade_points": cells[6].get_text(strip=True),
                        "result": cells[7].get_text(strip=True),
                    }
                    subjects.append(subject)
    
    return {"cgpa": cgpa, "subjects": subjects, "html": html_data}


@app.post("/api/student/timetable")
def get_timetable(request: StudentDataRequest):
    """Get timetable (ids=10)"""
    html_data = get_student_data(request.session_id, "10")
    
    soup = BeautifulSoup(html_data, 'html.parser')
    timetable = []
    tables = soup.find_all('table')
    
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            # Timetable usually has: Day, Period1, Period2, Period3, etc.
            if len(cells) >= 2:
                day = cells[0].get_text(strip=True) if len(cells) > 0 else ""
                # Skip header rows
                if day and day not in ["Day", "Days", ""]:
                    periods = []
                    for i in range(1, len(cells)):
                        period_text = cells[i].get_text(strip=True)
                        if period_text and period_text != "-":
                            periods.append(period_text)
                        else:
                            periods.append("")
                    
                    if periods:  # Only add if there are periods
                        timetable.append({
                            "day": day,
                            "periods": periods
                        })
    
    return {"timetable": timetable, "html": html_data}


@app.post("/api/student/current-semester-results")
def get_current_results(request: StudentDataRequest):
    """Get current semester results (ids=15)"""
    html_data = get_student_data(request.session_id, "15")
    return {"html": html_data}


@app.post("/api/student/earlier-internal-marks")
def get_earlier_internal_marks(request: StudentDataRequest):
    """Get earlier internal marks (ids=22)"""
    html_data = get_student_data(request.session_id, "22")
    return {"html": html_data}


@app.post("/api/student/od-ml-details")
def get_od_ml_details(request: StudentDataRequest):
    """Get OD/ML details (ids=53)"""
    html_data = get_student_data(request.session_id, "53")
    return {"html": html_data}


@app.post("/api/student/student-attendance-marking")
def get_student_attendance_marking(request: StudentDataRequest):
    """Get student attendance marking (ids=33)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/studentattendance.jsp", {"ids": "33"})
    return {"html": html_data}


# ==================== FINANCE ENDPOINTS ====================

@app.post("/api/finance/fee-paid")
def get_fee_paid(request: StudentDataRequest):
    """Get fee paid details (ids=7)"""
    html_data = get_student_data(request.session_id, "7")
    return {"html": html_data}


@app.post("/api/finance/fee-due")
def get_fee_due(request: StudentDataRequest):
    """Get fee due details (ids=8)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/feeduegroups.jsp", {"ids": "8"})
    return {"html": html_data}


@app.post("/api/finance/payment-verification")
def get_payment_verification(request: StudentDataRequest):
    """Get online payment verification (ids=26)"""
    html_data = post_to_endpoint(request.session_id, "students/onlinepayments/onlinepaymentreconcilation.jsp", {"ids": "26"})
    return {"html": html_data}


@app.post("/api/finance/payment-acknowledgment")
def get_payment_acknowledgment(request: StudentDataRequest):
    """Get payment acknowledgment (ids=27)"""
    html_data = post_to_endpoint(request.session_id, "students/report/receiptgeneration.jsp", {"ids": "27"})
    return {"html": html_data}


@app.post("/api/finance/bank-details")
def get_bank_details(request: StudentDataRequest):
    """Get bank account details (ids=54)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/studentbankdetails.jsp", {"ids": "54"})
    return {"html": html_data}


# ==================== EXAMINATION ENDPOINTS ====================

@app.post("/api/exam/registration")
def get_exam_registration(request: StudentDataRequest):
    """Get exam registration page (ids=13)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/semesterexamapplicationinstruction.jsp", {"ids": "13"})
    return {"html": html_data}


@app.post("/api/exam/registration-details")
def get_exam_registration_details(request: StudentDataRequest):
    """Get exam registration details (ids=159)"""
    html_data = post_to_endpoint(request.session_id, "students/report/examaplicationreport.jsp", {"ids": "159"})
    return {"html": html_data}


# ==================== HOSTEL ENDPOINTS ====================

@app.post("/api/hostel/booking")
def get_hostel_booking(request: StudentDataRequest):
    """Get hostel booking for full year (ids=31)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/hostelregistrationinstruction.jsp", {"ids": "31"})
    return {"html": html_data}


@app.post("/api/hostel/room-details")
def get_hostel_room_details(request: StudentDataRequest):
    """Get hostel room details (ids=21)"""
    html_data = get_student_data(request.session_id, "21")
    return {"html": html_data}


@app.post("/api/hostel/room-request")
def get_hostel_room_request(request: StudentDataRequest):
    """Get hostel room request page (ids=19)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/hostelroomrequest.jsp", {"ids": "19"})
    return {"html": html_data}


@app.post("/api/hostel/room-transfer")
def get_hostel_room_transfer(request: StudentDataRequest):
    """Get hostel room transfer page (ids=32)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/hostelroomtransfer.jsp", {"ids": "32"})
    return {"html": html_data}


# ==================== TRANSPORT ENDPOINTS ====================

@app.post("/api/transport/registration")
def get_transport_registration(request: StudentDataRequest):
    """Get transport registration (ids=51)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/transportregistrationinstructions.jsp", {"ids": "51"})
    return {"html": html_data}


@app.post("/api/transport/acknowledgment")
def get_transport_acknowledgment(request: StudentDataRequest):
    """Get transport registration acknowledgment (ids=52)"""
    html_data = post_to_endpoint(request.session_id, "students/report/transportconfirmationprint.jsp", {"ids": "52"})
    return {"html": html_data}


# ==================== COURSE REGISTRATION ENDPOINTS ====================

@app.post("/api/course/registration")
def get_course_registration(request: StudentDataRequest):
    """Get course registration page (ids=39)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/studentscourseregistrationinstruction2022.jsp", {"ids": "39"})
    return {"html": html_data}


@app.post("/api/course/registration-cancellation")
def get_course_cancellation(request: StudentDataRequest):
    """Get course registration cancellation (ids=42)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/studentcourseregistrationcancellation.jsp", {"ids": "42"})
    return {"html": html_data}


@app.post("/api/course/minor-registration")
def get_minor_registration(request: StudentDataRequest):
    """Get minor program registration (ids=152)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/minorregistrationinstruction.jsp", {"ids": "152"})
    return {"html": html_data}


# ==================== SAP ENDPOINTS ====================

@app.post("/api/sap/details")
def get_sap_details(request: StudentDataRequest):
    """Get SAP details (ids=47)"""
    html_data = get_student_data(request.session_id, "47")
    return {"html": html_data}


@app.post("/api/sap/process")
def get_sap_process(request: StudentDataRequest):
    """Get SAP process page (ids=43)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/sapregistrationinstruction.jsp", {"ids": "43"})
    return {"html": html_data}


@app.post("/api/sap/withdraw")
def get_sap_withdraw(request: StudentDataRequest):
    """Get SAP withdraw page (ids=46)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/sapwithdraw.jsp", {"ids": "46"})
    return {"html": html_data}


@app.post("/api/sap/attachments")
def get_sap_attachments(request: StudentDataRequest):
    """Get SAP attachments (ids=48)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/sapattachfiles.jsp", {"ids": "48"})
    return {"html": html_data}


@app.post("/api/sap/feedback")
def get_sap_feedback(request: StudentDataRequest):
    """Get SAP feedback (ids=49)"""
    html_data = post_to_endpoint(request.session_id, "students/registrations/sapfeedback.jsp", {"ids": "49"})
    return {"html": html_data}


# ==================== FEEDBACK ENDPOINTS ====================

@app.post("/api/feedback/end-semester")
def get_end_semester_feedback(request: StudentDataRequest):
    """Get end semester feedback (ids=9)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/subjectwisefeedback.jsp", {"ids": "9"})
    return {"html": html_data}


# ==================== OTHER ENDPOINTS ====================

@app.post("/api/announcements")
def get_announcements(request: StudentDataRequest):
    """Get announcements (ids=107)"""
    html_data = post_to_endpoint(request.session_id, "students/report/announcements.jsp", {"ids": "107"})
    return {"html": html_data}


@app.post("/api/change-password")
def change_password_page(request: StudentDataRequest):
    """Get change password page (ids=17)"""
    html_data = post_to_endpoint(request.session_id, "students/transaction/changepassoword.jsp", {"ids": "17"})
    return {"html": html_data}


# ==================== SESSION MANAGEMENT ====================

@app.delete("/api/logout")
def logout(request: StudentDataRequest):
    """Logout and clear session"""
    if request.session_id in sessions:
        del sessions[request.session_id]
        return {"message": "Logged out successfully"}
    return {"message": "Session not found"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
