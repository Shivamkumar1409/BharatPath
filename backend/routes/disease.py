from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def disease_test():
    return {"message": "Disease route working"}