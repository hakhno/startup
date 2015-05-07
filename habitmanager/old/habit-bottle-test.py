# level = 0
#possibly add a JSON representation to objects?
#add a date to the whole thing so that a) testing b) out of sync stuff doesn't happen
import json, datetime, uuid
from bottle import route, run, template

@route('/unittest/list')
def index():
	return {"items": taskDict}

class ItemEncoder(json.JSONEncoder):
	def default(self, o):
		# if hasattr(o, 'isoformat'):
		# 	return o.isoformat()
		if isinstance(o, ToDoItem):
			return o.__dict__
		elif isinstance(o, Recurrer):
			return o.__dict__
		elif isinstance(o, datetime.date):
			return o.isoformat()
		else:
			# print "no"
			return json.JSONEncoder.default(self, o)

class ToDoItem:
	def __init__(self, name="", description = "", dateDue = ""):
		self.itemType = "ToDoItem"
		self.id = str(uuid.uuid4())
		self.description = name
		self.additionalText = description
		self.dateAdded = datetime.datetime.now()
		self.dateCompleted = False
		self.dateDue = False
		self.subTasks = []	#add in UUIDs, not objects
		self.completed = False
		self.parent = "" #necessary?
		self.owner = "" #necessary?

	def complete(self):
		if len(self.subTasks) > 0:
			for task in self.subTasks:
				if not task.completed:
					return False, "Subtasks not completed"
		self.completed = True
		self.dateCompleted = datetime.datetime.now()
		return True, "Task completed"

	def display(self, level = 0):
		x = (".." * level) + self.description + "\n"
		for task in self.subTasks:
			x = x + task.display(level + 1)
		return x

	def addSubTask(self, task):
		self.subTasks.append(task)

a = ToDoItem("Task A")
b = ToDoItem("Task B")
c = ToDoItem("Task C")
d = ToDoItem("Task D")
a.complete()

taskArray = [a, b, c, d]
taskDict = {}

for each in taskArray:
	taskDict[each.id] = each.description

run(host='localhost', port=8080)