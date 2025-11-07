from fastapi import FastAPI

app = FastAPI(title="TapWise Backend")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "TapWise backend running successfully 🚀"}
