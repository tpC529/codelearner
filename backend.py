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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add manual CORS headers to all responses
@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
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
        
        # 4. Send cropped image to AI (better focus)
        cropped_b64 = img_to_b64(cropped).split(",")[1]
        response = ollama.generate(
            model="moondream:1.8b",
            prompt="Analyze this cropped image of code. First, identify the programming language. Then, explain step-by-step what the code does, including its main purpose or function. If unclear, note assumptions. Output in this format: Language: [language] || Explanation: [brief step-by-step description] || Purpose: [high-level goal]",
            images=[cropped_b64],
            options={
                "num_predict": 200,
                "temperature": 0.7,
                "num_ctx": 2048
            }
        )
        
        print("[Backend] Ollama response received")

        return {
            "highlighted": img_to_b64(cropped),  # Show only the cropped selection
            "explanation": response["response"],
            "next_question_allowed": data.question_count < 3
        }
    except Exception as e:
        print(f"[Backend] ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise