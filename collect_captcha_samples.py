"""
Captcha Sample Collector
Run this to collect SRMAP captcha samples for training a model later
"""
import requests
import os
from datetime import datetime

BASE_URL = "https://student.srmap.edu.in/srmapstudentcorner"

# Create samples directory
os.makedirs("captcha_samples", exist_ok=True)

print("SRMAP Captcha Sample Collector")
print("=" * 60)
print("This will help you collect captcha samples to train a model")
print("Collect 100-200 samples with labels for best results\n")

count = 0
while True:
    # Create session
    session = requests.Session()
    session.get(f"{BASE_URL}/StudentLoginPage")
    
    # Get captcha
    response = session.get(f"{BASE_URL}/captchas")
    
    if response.status_code == 200:
        # Save image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"captcha_samples/captcha_{timestamp}.png"
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        count += 1
        print(f"✓ Saved: {filename}")
        
        # Ask for label
        label = input(f"  Enter the captcha text (or 'q' to quit): ").strip().upper()
        
        if label.lower() == 'q':
            break
        
        if label:
            # Rename with label
            labeled_filename = f"captcha_samples/captcha_{timestamp}_{label}.png"
            os.rename(filename, labeled_filename)
            print(f"  ✓ Labeled as: {label}\n")
        else:
            print(f"  ⚠️ No label provided, keeping unlabeled\n")
    
    else:
        print(f"✗ Failed to fetch captcha: {response.status_code}")
        break

print(f"\n✓ Collected {count} captcha samples")
print(f"📁 Saved in: captcha_samples/")
print(f"\n💡 Next steps:")
print(f"   1. Collect at least 100 labeled samples")
print(f"   2. Train a tiny CNN model (see train_model.py)")
print(f"   3. Convert to ONNX and integrate with backend")
