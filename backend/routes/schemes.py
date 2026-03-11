from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def schemes_test():
    return {"message": "Schemes route working"}