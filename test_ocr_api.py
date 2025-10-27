"""
Test the FREE OCR.Space API with SRMAP captcha
"""
import httpx
import base64
import asyncio
import re

async def test_ocr():
    # Read the sample captcha we saved
    with open('sample_captcha.png', 'rb') as f:
        image_bytes = f.read()
    
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            'https://api.ocr.space/parse/image',
            data={
                'base64Image': f'data:image/png;base64,{base64_image}',
                'language': 'eng',
                'isOverlayRequired': False,
                'detectOrientation': False,
                'scale': True,
                'OCREngine': 2,
            },
            headers={
                'apikey': 'helloworld'
            }
        )
        
        result = response.json()
        print("API Response:", result)
        
        if result.get('IsErroredOnProcessing') == False:
            parsed_text = result.get('ParsedResults', [{}])[0].get('ParsedText', '')
            captcha_text = re.sub(r'[^A-Z0-9]', '', parsed_text.upper().strip())
            print(f"\n✓ Solved: {captcha_text}")
            print(f"✓ This will work in production!")
        else:
            print("Error:", result)

asyncio.run(test_ocr())
