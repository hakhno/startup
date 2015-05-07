import habitclass as habit
from bottle import route, run, template, get, post, request

@get('/unittest/api/tasks')
def list():
	return {"items": taskDict}

@post('/unittest/api/tasks')
def create():
	name = request.json["name"]
	x = habit.ToDoItem(name)
	taskArray.append(x)
	taskDict[x.id] = x.description
	return {"item": x.id}

a = habit.ToDoItem("Task A")
b = habit.ToDoItem("Task B")
c = habit.ToDoItem("Task C")
d = habit.ToDoItem("Task D")
a.complete()

taskArray = [a, b, c, d]
taskDict = {}

for each in taskArray:
	taskDict[each.id] = each.description

run(host='localhost', port=8080)