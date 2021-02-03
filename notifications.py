import json
import datetime
import dateutil.parser
import pandas as pd
import pytz
from data import createData

# importing sample data
data = createData()

data_for_df = {'time_of_day':[],"count":[]}
timeList = pd.DataFrame(data_for_df)
timeList.set_index('time_of_day', inplace=True)

today = pytz.UTC.localize(datetime.datetime.now())

threeMonthsAgo = today - datetime.timedelta(days=90)

count = 1
curDate = dateutil.parser.parse(data[count]['start_date'])

while(curDate > threeMonthsAgo and count < len(data)):
    dayStr = curDate.strftime("%a") # getting day of week in 3 letters
    dayTime = curDate.strftime("%H") # getting time of day
    dayStr = dayStr + " " + dayTime
    if dayStr in timeList.index.values:
        timeList['count'][dayStr] = timeList['count'][dayStr] + 1
    else:
        tempDf = pd.DataFrame({'time_of_day':[dayStr],"count":[1]})
        tempDf.set_index('time_of_day', inplace=True)
        timeList = timeList.append(tempDf)
    
    curDate = dateutil.parser.parse(data[count]['start_date'])
    count = count + 1

timeList.sort_values(by=['count'],axis=0, ascending=False, inplace=True)
print(timeList)

# pulling 3 most common times
numNotifications = 3
mostCommonRunTimes = timeList[:numNotifications]

# creating a list with notification times 1 hour before most common weekly times to run
notificationTimes = []
for i in range(len(mostCommonRunTimes)):
    tempStr = mostCommonRunTimes.index.values[i]
    day = tempStr[:4]
    time = tempStr[4:]
    time = int(time) - 1
    newStr = day + str(time)
    notificationTimes.append(newStr)

print(notificationTimes)

# import datetime
# from data import data
 
# def same(d1, d2):
#    d1 = datetime.datetime.strptime(d1, "%Y-%m-%dT%H:%M:%SZ")
#    d2 = datetime.datetime.strptime(d2, "%Y-%m-%dT%H:%M:%SZ")
 
#    return d1.isocalendar()[1] == d2.isocalendar()[1] and d1.year == d2.year
 
 
# #print(type(data[0]["start_date"]))
# # print(data[4]["start_date"])
 
# # print(same(data[0]["start_date"], data[4]["start_date"]))
 
# new = []
# new2 = []
 
# times_storage = {"monday" : 0, "tuesday": 0, "wednesday": 0, "thursday": 0, "friday": 0, "saturday": 0, "sunday": 0}
 
# for i in range(len(data)-1):
#    curr = data[i]["start_date"]
#    next = data[i + 1]["start_date"]
#    curr_datetime = datetime.datetime.strptime(curr, "%Y-%m-%dT%H:%M:%SZ")
#    next_datetime = datetime.datetime.strptime(next, "%Y-%m-%dT%H:%M:%SZ")
 
#    if same(curr, next) == True:
#        new.append(data[i])
#        #new.append(next)
#        #print("Same week")
#        if(curr_datetime)
      
#    else:
#         new.append(data[i])
#         new2.append(new)
#         new2 = []
#         #print("not same week")
# #print(new[0])
 
 
 
# Input for string is day of the week, time of the day
def convert(str1):
 
   s = []
   s = str1.split(" ")
 
   result = "0 " + s[1] + " * * " + str(returnNum(s[0]))
 
   print(result)
 
 
def returnNum(str2):
 
   if(str2 == "Mon"):
       return 1
   elif(str2 == "Tue"):
       return 2
   elif (str2 == "Wed"):
       return 3
   elif (str2 == "Thu"):
       return 4
   elif (str2 == "Fri"):
       return 5
   elif (str2 == "Sat"):
       return 6
   else:
       return 0
 
chronTimes = []
for i in notificationTimes:
    chronTimes.append(convert(i))
print(chronTimes)