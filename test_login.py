"""
Simple login test - helps debug credentials
"""
import requests
import os
from PIL import Image

BASE_URL = "https://student.srmap.edu.in/srmapstudentcorner"

print("Testing SRMAP Login...")
print("="*60)

# Get login page first
session = requests.Session()
response = session.get(f"{BASE_URL}/StudentLoginPage")
print(f"✓ Login page loaded: {response.status_code}")

# Download captcha
response = session.get(f"{BASE_URL}/captchas")
with open('test_captcha.png', 'wb') as f:
    f.write(response.content)
print(f"✓ Captcha saved: test_captcha.png")

# Display captcha image
try:
    img = Image.open('test_captcha.png')
    img.show()
    print(f"\n📸 Captcha image opened in default viewer!")
except Exception as e:
    print(f"\n⚠️  Could not auto-open image: {e}")
    print(f"📸 Please manually open 'test_captcha.png'")

print(f"\n📝 Type the captcha below:")

username = input("Enter your roll number: ").strip()
password = input("Enter your password: ").strip()
captcha = input("Enter captcha (5 chars): ").strip().upper()

print(f"\n🔐 Attempting login...")
print(f"   Username: {username}")
print(f"   Password: {password[:2]}***")
print(f"   Captcha: {captcha}")

# Login
login_data = {
    'txtUserName': username,
    'txtAuthKey': password,
    'ccode': captcha
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

print(f"\nResponse URL: {response.url}")

# Check result
if 'Invalid' in response.text:
    print("❌ LOGIN FAILED: Invalid credentials or wrong captcha")
    print("   Please check:")
    print("   1. Captcha was typed correctly")
    print("   2. Password is correct")
    print("   3. Roll number is correct")
elif 'Welcome' in response.text and 'ADARSH' in response.text:
    print("✅ LOGIN SUCCESSFUL!")
    print(f"✅ Session cookie: {session.cookies.get('JSESSIONID')}")
else:
    print("⚠️  Unknown response - check login_test_response.html")
    with open('login_test_response.html', 'w', encoding='utf-8') as f:
        f.write(response.text)
