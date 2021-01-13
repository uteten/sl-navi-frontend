import datetime
x=datetime.datetime.now().timetuple()[:4]
y=datetime.datetime(x[0],x[1],x[2],hour=x[3])
print(y)
