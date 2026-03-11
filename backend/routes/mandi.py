from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def mandi_test():
    return {"message": "Mandi route working"}