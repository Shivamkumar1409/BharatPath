from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def profit_test():
    return {"message": "Profit route working"}