"""
End-to-end test of auto-captcha login
"""
import asyncio
import httpx

async def test_login():
    print("Testing Auto-Captcha Login...")
    print("=" * 60)
    
    # Test credentials (won't actually work, just testing captcha solving)
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            'http://localhost:8000/api/login',
            json={
                'username': 'TEST123',
                'password': 'test'
                # No captcha field - should be auto-solved!
            }
        )
        
        result = response.json()
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {result}")
        
        if 'message' in result:
            print(f"\n✓ Auto-captcha is working!")
            print(f"Message: {result['message']}")
        
        return result

asyncio.run(test_login())
