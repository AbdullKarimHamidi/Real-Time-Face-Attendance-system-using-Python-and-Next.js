from database.db import holidays_collection
from datetime import datetime, date

holiday = holidays_collection.find_one(
    {},
    sort=[("_id", -1)]
)

if holiday:
    start_date = datetime.strptime(
        holiday["start_date"], "%Y-%m-%d"
    ).date()

    end_date = datetime.strptime(
        holiday["end_date"], "%Y-%m-%d"
    ).date()

    today = date.today()

    is_holiday = start_date <= today <= end_date
  

else:
    is_holiday = False


if is_holiday:
    print("Today is a holiday. Do NOT mark employees absent.")

else:
    print("Today is not a holiday. Run absence checking.")



# def getLatency(empemail: str):
#     employee = list(db.attendance_collection.find(
#         {'email': empemail},
#         {'_id': 0, 'entrance_time': 1, 'leaving_time': 1}
#     ))

#     # Get scheduled work times
#     worktime = start_end_time.find_one({}, sort=[("createdat", -1)])
#     start_str = worktime['start'] if worktime else None
#     end_str = worktime['end'] if worktime else None
#     start_time = time(int(start_str), 0) if start_str else None
#     end_time = time(int(end_str), 0) if end_str else None

#     total_absent = timedelta(0)

#     for record in employee:
#         entrance_time = record.get('entrance_time')
#         leaving_time = record.get('leaving_time')

#         if not entrance_time or not leaving_time:
#             continue

#         entrance = max(entrance_time, datetime.combine(entrance_time.date(), start_time))
#         leaving = min(leaving_time, datetime.combine(leaving_time.date(), end_time))

#         if entrance >= leaving:
#             day_absent = datetime.combine(entrance_time.date(), end_time) - datetime.combine(entrance_time.date(), start_time)
#         else:
#             # Late arrival
#             late = entrance - datetime.combine(entrance_time.date(), start_time) if entrance_time.time() > start_time else timedelta(0)
#             # Early leaving
#             early_leave = datetime.combine(leaving_time.date(), end_time) - leaving if leaving_time.time() < end_time else timedelta(0)
#             day_absent = late + early_leave

#         total_absent += day_absent

#     # Convert to hours and minutes
#     hours = total_absent.seconds // 3600
#     minutes = (total_absent.seconds % 3600) // 60

#     return {"employee_email": empemail, "total_late_hours": hours, "total_late_minutes": minutes}
    























    def PresentForFriday_or_Holiday():
    today = datetime.now().strftime("%A")
    if today =='Friday':
        AllEngineers=list(eng_collection.find({},{'name':1,"email":1,"tid":1,"lastName":1}))
        today_attendance = db.attendance_collection.find(
            {"date": today},
            {"email": 1}
        )
        engemails={erf['email'] for erf in today_attendance}
        worktime = start_end_time.find_one({}, sort=[("createdat", -1)])
        start_time=worktime['start'] if worktime else None
        end_time=worktime['end'] if worktime else None
        for eng in AllEngineers:
            if eng['email'] not in engemails:
                db.attendance_collection.insert_one({
                    'name':eng['name'],
                    'email':eng['email'],
                    "date":today,
                    'entrance_time':None,
                    'leaving_time':None,
                    'present':False,
                    'workstarts':start_time,
                    'workends':end_time,
                    'isFriday':True,
                    "isHoliday":False,
                    "createdAt":today
                })
def PresentForHoliday():
    holiday = holidays_collection.find_one(
        {},
        sort=[("_id", -1)]
    )
    if not holiday:
        return
    start_date = datetime.strptime(
        holiday["start_date"],
        "%Y-%m-%d"
    ).date()

    end_date = datetime.strptime(
        holiday["end_date"],
        "%Y-%m-%d"
    ).date()

    today = date.today()
    # Check whether today is inside the holiday period
    is_holiday = start_date <= today <= end_date
    if not is_holiday:
        return
    all_engineers = list(
        eng_collection.find(
            {},
            {
                "name": 1,
                "email": 1,
                "tid": 1,
                "lastName": 1
            }
        )
    )
    start_of_day = datetime.combine(
        today,
        datetime.min.time()
    )
    end_of_day = start_of_day + timedelta(days=1)

    today_attendance = db.attendance_collection.find(
        {
            "date": {
                "$gte": start_of_day,
                "$lt": end_of_day
            }
        },
        {
            "email": 1
        }
    )
    eng_emails = {
        employee["email"]
        for employee in today_attendance
    }
    worktime = start_end_time.find_one(
        {},
        sort=[("createdat", -1)]
    )
    start_time = worktime["start"] if worktime else None
    end_time = worktime["end"] if worktime else None
    for eng in all_engineers:
        if eng["email"] not in eng_emails:
            db.attendance_collection.insert_one({
                "name": eng["name"],
                "email": eng["email"],
                "date": start_of_day,
                "entrance_time": None,
                "leaving_time": None,
                "present": False,
                "workstarts": start_time,
                "workends": end_time,
                "isFriday": False,
                "isHoliday": True,
                "HoldayName": holiday["name"],
                "createdAt": datetime.now()
            })
