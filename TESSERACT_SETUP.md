# Auto-Captcha Setup - Using TrueCaptcha API

The backend now automatically solves captchas using the **TrueCaptcha API** - a free cloud-based OCR service!

## No Installation Needed! ✨

Unlike Tesseract OCR, TrueCaptcha works through an API, so you don't need to install anything locally. Just make sure you have `httpx` installed:

```powershell
pip install httpx
```

## How It Works

1. User sends login request with username and password (no captcha needed)
2. Backend automatically:
   - Fetches captcha image from SRMAP portal
   - Sends image to TrueCaptcha API
   - Receives solved captcha text
   - Submits login with auto-solved captcha

## API Details

- **Service**: TrueCaptcha Free API
- **Endpoint**: https://api.apitruecaptcha.org/one/gettext
- **Cost**: FREE (no API key registration needed)
- **Speed**: ~1-3 seconds per captcha
- **Accuracy**: High for simple text captchas like SRMAP

## API Changes

### Before (Manual Captcha):
```json
POST /api/login
{
  "username": "AP21110011234",
  "password": "yourpassword",
  "captcha": "AB3CD",
  "session_id": "uuid-here"
}
```

### Now (Auto Captcha):
```json
POST /api/login
{
  "username": "AP21110011234",
  "password": "yourpassword"
}
```

The `captcha` and `session_id` fields are now optional!

## Troubleshooting

If captcha solving fails:
- Check internet connection (API requires internet access)
- Backend will automatically retry
- Fallback: You can still provide captcha manually if needed by including the `captcha` field

## Dependencies

```
httpx>=0.24.0  # For async HTTP requests to TrueCaptcha API
Pillow>=10.0.0 # For basic image handling
```

No local OCR installation required!
