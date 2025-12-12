# pip install fastapi uvicorn pillow ollama python-multipart
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image, ImageDraw
import ollama

app = FastAPI()

# Add CORS middleware - MUST be before routes
# Allowed origins for browser extensions and localhost development
allowed_origins = [
    "http://localhost",
    "http://127.0.0.1",
]

# Use regex to support extension IDs (which vary per installation)
allowed_origin_regex = r"(chrome-extension://.*|moz-extension://.*|safari-web-extension://.*|http://localhost:.*|http://127\.0\.0\.1:.*)"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add manual CORS headers to all responses
@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    origin = request.headers.get("origin")
    
    # Check if origin matches allowed patterns
    if origin:
        import re
        # Check if origin is in allowed list or matches regex pattern
        if origin in allowed_origins or re.match(allowed_origin_regex, origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
    
    return response

@app.options("/api")
async def options_api():
    return {"status": "ok"}

class RequestData(BaseModel):
    image_b64: str          # data:image/png;base64,...
    coords: list[float]     # [x1, y1, x2, y2] in page coordinates
    question_count: int = 0

def img_to_b64(img: Image.Image) -> str:
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()

@app.post("/api")
async def explain(data: RequestData):
    try:
        print(f"[Backend] Received request with {len(data.image_b64)} bytes")
        print(f"[Backend] Coords: {data.coords}")
        
        # 1. Decode image
        img_bytes = base64.b64decode(data.image_b64.split(",")[1])
        img = Image.open(BytesIO(img_bytes))
        
        # 2. Crop to selected area for AI analysis
        x1, y1, x2, y2 = data.coords
        cropped = img.crop((int(x1), int(y1), int(x2), int(y2)))
        
        # 3. Create highlighted version for display
        img_display = img.copy()
        draw = ImageDraw.Draw(img_display)
        draw.rectangle(data.coords, outline="#FF006E", width=6)

        print("[Backend] Image cropped, sending to ollama...")
        
        # 4. Send cropped image to AI — maximum coherence mode
        cropped_b64 = img_to_b64(cropped).split(",")[1]

        response = ollama.generate(
            model="moondream:1.8b",
            prompt="Describe what code or text you see in this image. What programming language is it? What does it do?",
            images=[cropped_b64],
            options={
                "temperature": 0.3,
                "num_predict": 100,
                "num_ctx": 2048,
            },
            keep_alive="10m"
        )

        print("[Backend] Ollama response received")

        raw = response["response"].strip()
        print(f"[Backend] Raw response: '{raw}'")
        print(f"[Backend] Response length: {len(raw)}")

        return {
            "highlighted": img_to_b64(cropped),
            "explanation": raw if raw else "No explanation generated",  # Fallback
            "next_question_allowed": data.question_count < 3
        }
    except Exception as e:
        print(f"[Backend] ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise
