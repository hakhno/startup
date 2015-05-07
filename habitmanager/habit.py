#todos:
#error checking - check for duplicates, misses, etc
#saving

import habitclass as habit
from bottle import route, run, template, get, post, request

@get('/api/tasks')
def get():
	return {'items': habit.taskList(tasks)}

@post('/api/tasks')
def post():
	#need to get types in future
	name = request.json['name']
	#itemType = request.json['type']
	x = habit.ToDoItem(name)
	#cut this after testing
	x.id = '4d2e7411-c868-444c-813d-96f46c20c7ee'
	tasks[x.id] = x
	return {'item': x.id}

#annoying, get doesn't allow you to set variables
@route('/api/tasks/<taskid>', method='get')
def get(taskid):
	return tasks[taskid].render()

@route('/api/tasks/<taskid>', method='post')
def post(taskid):
	#makes subtask
	name = request.json['name']
	y = habit.ToDoItem(name)
	#cut this after testing
	y.id = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
	tasks[y.id] = y
	tasks[taskid].subTasks.append(y.id)
	return {'item': y.id}

@route('/api/tasks/<taskid>', method='put')
def put(taskid):
	#do nothing for now. updates task
	return {'item': x.id}

tasks = {}
taskLists = []

run(host='localhost', port=8080)