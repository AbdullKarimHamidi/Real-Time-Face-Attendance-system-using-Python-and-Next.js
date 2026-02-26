from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from pymongo import MongoClient
from datetime import datetime
app = FastAPI()
# ===== MongoDB setup =====
client = MongoClient("mongodb://localhost:27017")
db = client["mydatabase"]
eng_collection = db["Engineers"]

Attendace_collection=db["Attendance"]

start_end_time=db['time']
cameras_collection=db['Cameras']
