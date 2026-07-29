from fastapi import FastAPI


app = FastAPI(title="PrepPeriod",
              description="PrepPeriod is an AI tool to assist secondary teachers",
              version="0.1.0")

@app.get("/")
def home():
    return {
        "message": "Welcome to PrepPeriod!"
    }
