from motor.motor_asyncio import AsyncIOMotorClient
import os

client = None
db = None

async def connect_to_mongo():
    global client, db
    uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DATABASE_NAME", "voicehealth")
    
    if not uri or uri == "your_mongodb_uri_here":
        print("WARNING: Valid MONGODB_URI not found in environment variables. Running without DB.")
        return
    
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    print(f"Connected to MongoDB: {db_name}")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")

def get_db():
    return db