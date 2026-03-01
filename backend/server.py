from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="FREEMAN MOBILE CLEANING API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Service(BaseModel):
    id: str
    name: str
    description: str
    category: str
    icon: str
    image: Optional[str] = None

class TimeSlot(BaseModel):
    time: str
    available: bool = True

class BookingCreate(BaseModel):
    service_id: str
    service_name: str
    date: str
    time_slot: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    customer_address: str
    notes: Optional[str] = None
    photo_filename: Optional[str] = None

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_id: str
    service_name: str
    date: str
    time_slot: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    customer_address: str
    notes: Optional[str] = None
    photo_filename: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Services data
SERVICES = [
    {"id": "mobile-carwash", "name": "Mobile CarWash", "description": "Professional car washing at your location", "category": "Vehicle", "icon": "Car"},
    {"id": "carwash", "name": "CarWash", "description": "Complete car wash and detailing service", "category": "Vehicle", "icon": "Car"},
    {"id": "landscaping", "name": "LandScaping", "description": "Transform your outdoor space beautifully", "category": "Outdoor", "icon": "TreeDeciduous"},
    {"id": "laundry", "name": "Laundry", "description": "Professional laundry and dry cleaning", "category": "Home", "icon": "Shirt"},
    {"id": "home-cleaning", "name": "Home Cleaning", "description": "Complete residential cleaning service", "category": "Home", "icon": "Home"},
    {"id": "office-cleaning", "name": "Office Cleaning", "description": "Professional commercial space cleaning", "category": "Commercial", "icon": "Building2"},
    {"id": "lawn-care", "name": "Lawn Care", "description": "Keep your lawn healthy and beautiful", "category": "Outdoor", "icon": "Leaf"},
    {"id": "garbage-collection", "name": "Garbage Collection", "description": "Regular waste removal services", "category": "Utility", "icon": "Trash2"},
    {"id": "smart-home-repair", "name": "Smart Home Repair", "description": "Quick fixes for your home", "category": "Repair", "icon": "Wrench"},
    {"id": "environment-cleaning", "name": "Environment Cleaning", "description": "Eco-friendly cleaning solutions", "category": "Outdoor", "icon": "Recycle"},
    {"id": "farm-work", "name": "Farm Work", "description": "Agricultural cleaning and maintenance", "category": "Outdoor", "icon": "Tractor"},
    {"id": "garden-work", "name": "Garden Work", "description": "Garden maintenance and beautification", "category": "Outdoor", "icon": "Flower2"},
    {"id": "toilet-cleaning", "name": "Toilet Cleaning", "description": "Deep sanitization of restrooms", "category": "Home", "icon": "Bath"},
    {"id": "yard-cleaning", "name": "Yard Cleaning", "description": "Complete yard cleanup services", "category": "Outdoor", "icon": "Shovel"},
    {"id": "guest-house-cleaning", "name": "Guest House Cleaning", "description": "Professional guest house maintenance", "category": "Commercial", "icon": "Hotel"},
    {"id": "hotel-cleaning", "name": "Hotel Cleaning", "description": "Commercial hotel cleaning services", "category": "Commercial", "icon": "Building"},
    {"id": "building-cleaning", "name": "Building Cleaning", "description": "Full building maintenance service", "category": "Commercial", "icon": "Building2"},
    {"id": "carpet-cleaning", "name": "Carpet Cleaning", "description": "Deep carpet cleaning and stain removal", "category": "Home", "icon": "Square"},
    {"id": "sofa-cleaning", "name": "Sofa Cleaning", "description": "Upholstery cleaning and refreshing", "category": "Home", "icon": "Sofa"},
    {"id": "mattress-cleaning", "name": "Mattress Cleaning", "description": "Sanitize and freshen your mattress", "category": "Home", "icon": "BedDouble"},
    {"id": "car-engine-cleaning", "name": "Car Engine Cleaning", "description": "Professional engine bay cleaning", "category": "Vehicle", "icon": "Cog"},
]

TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM"
]

# Routes
@api_router.get("/")
async def root():
    return {"message": "FREEMAN MOBILE CLEANING API", "status": "running"}

@api_router.get("/services", response_model=List[Service])
async def get_services():
    return SERVICES

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    for service in SERVICES:
        if service["id"] == service_id:
            return service
    raise HTTPException(status_code=404, detail="Service not found")

@api_router.get("/time-slots")
async def get_time_slots(date: str):
    # Get booked slots for the date
    booked = await db.bookings.find({"date": date}, {"_id": 0, "time_slot": 1}).to_list(100)
    booked_times = [b["time_slot"] for b in booked]
    
    slots = []
    for time in TIME_SLOTS:
        slots.append({
            "time": time,
            "available": time not in booked_times
        })
    return slots

@api_router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = UPLOADS_DIR / filename
        
        # Save file
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)
        
        return {"filename": filename, "message": "Photo uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    try:
        booking = Booking(**booking_data.model_dump())
        doc = booking.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.bookings.insert_one(doc)
        return booking
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    return bookings

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if isinstance(booking.get('created_at'), str):
        booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    return booking

# Include the router
app.include_router(api_router)

# Serve uploaded files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
