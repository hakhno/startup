#simple-todo.py

from bottle import route, run, template, get, post, request, response
import json, datetime, uuid

def saveTasks():
	return

def enable_cors(fn):
	def _enable_cors(*args, **kwargs):
		# set CORS headers
		response.headers['Access-Control-Allow-Origin'] = '*'
		response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
		response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
		if request.method != 'OPTIONS':
			# actual request; reply with the actual response
			return fn(*args, **kwargs)
	return _enable_cors

# @route('/cors', method=['OPTIONS', 'GET'])
# @enable_cors
# def lvambience():
#     response.headers['Content-type'] = 'application/json'
#     return '[1]'

@route('/simpletodo/tasks', method=['options', 'get'])
@enable_cors
def get():
	response.headers['Access-Control-Allow-Origin'] = '*'
	return tasks

@route('/simpletodo/tasks', method=['options', 'post'])
@enable_cors
def post():
	response.headers['Access-Control-Allow-Origin'] = '*'
	name = request.json['name']
	x = {"name": name, "dateAdded": datetime.datetime.now().isoformat(), "dateCompleted": None}
	taskid = str(uuid.uuid4())
	tasks[taskid] = x
	saveTasks()
	return {taskid: tasks[taskid]}

# @route('/simpletodo/tasks', method='options')
# def options():
# 	response.headers['Access-Control-Allow-Origin'] = '*'
# 	response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
# 	response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
# 	return

# @route('/simpletodo/tasks/<taskid>', method='options')
# def options():
# 	response.headers['Access-Control-Allow-Origin'] = '*'
# 	response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
# 	response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
# 	return

@route('/simpletodo/tasks/<taskid>', method=['options', 'post'])
@enable_cors
def post(taskid):
	response.headers['Access-Control-Allow-Origin'] = '*'
	if tasks[taskid]["dateCompleted"]:
		tasks[taskid]["dateCompleted"] = None
	else:
		tasks[taskid]["dateCompleted"] = datetime.datetime.now().isoformat()
	saveTasks()
	return {taskid: tasks[taskid]}

tasks = {}

run(host='localhost', port=8080)