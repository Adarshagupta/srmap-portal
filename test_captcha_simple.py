"""
Simple test to see SRMAP captcha and decide best FREE OCR approach
"""
import requests
from PIL import Image
import io

BASE_URL = "https://student.srmap.edu.in/srmapstudentcorner"

# Get captcha
session = requests.Session()
session.get(f"{BASE_URL}/StudentLoginPage")
response = session.get(f"{BASE_URL}/captchas")

# Save and show
img = Image.open(io.BytesIO(response.content))
img.save("sample_captcha.png")
img.show()

print("✓ Captcha saved as sample_captcha.png")
print("\nLook at the captcha and tell me:")
print("1. Is it just plain text on white/colored background?")
print("2. Any distortion/noise/lines?")
print("3. Font style - simple or fancy?")
print("\nBased on this, we can choose the BEST FREE solution!")
