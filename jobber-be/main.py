# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from jobber import Jobber
app = FastAPI()

# Allow CORS for local React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    user_input: str

@app.post("/generate")
async def generate_markdown(data: InputData):
    # Dummy markdown response
    job = Jobber(data.user_input)
    res = job.formalize_result()
    print(res)
    return {
        "result": res
    }
