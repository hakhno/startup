# level = 0
#possibly add a JSON representation to objects?
#add a date to the whole thing so that a) testing b) out of sync stuff doesn't happen
import json, datetime, uuid

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

	# def __str__(self):
	# 	x = (".." * level) + self.description + "\n"
	# 	global level
	# 	level = level + 1
	# 	for task in self.subTasks:
	# 		x = x + str(task)
	# 	level = level - 1
	# 	return x

	#what is this for?
	# def default(self, o):
	# 	return "butts"

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

# class TestToDo(ToDoItem):
# 	pass

class Habit(ToDoItem):
	def __init__(self, name="", description = ""):
		ToDoItem.__init__(self, name, description)
		self.itemType = "Habit"
		self.successes = []
		self.successCount = len(self.successes)
		self.failures = []
		self.failureCount = len(self.failures)
		self.canSucceed = False
		self.canFail = False

	def success(self):
		if not self.canSucceed:
			return False, "Cannot succeed at this task"
		self.successes.append(datetime.datetime.now())
		self.successCount = len(self.successes)
		return True, "Success"

	def failure(self):
		if not self.canFail:
			return False, "Cannot fail at this task"
		self.failures.append(datetime.datetime.now())
		self.failureCount = len(self.failures)
		return True, "Failure"

class Recurring(ToDoItem):
	def __init__(self, name="", description = "", recurType = "Daily"):
		ToDoItem.__init__(self, name, description)
		self.itemType = "Recurring"
		self.successes = []
		self.successCount = len(self.successes)
		self.failures = []
		self.failureCount = len(self.failures)
		self.recurType = self.setRecurrer(recurType)

	def setRecurrer(self, recurType):
		if recurType == "Daily":
			return Daily()
		elif recurType == "Weekly":
			return Weekly()
		else:
			return Daily()

	def complete(self):
		if len(self.subTasks) > 0:
			for task in self.subTasks:
				if not task.completed:
					return False, "Subtasks not completed"
		self.recurType.completion()
		self.completed = True
		return True, "Task completed"

	def successCheck(self):
		if not self.recurType.due():
			return False, "Not due"
		elif not self.recurType.count():
			return False, "Not completed enough times"
		elif self.completed:
			self.successes.append(datetime.datetime.now())
			self.successCount = len(self.successes)
			self.completed = False
			return True, "Success"

class Recurrer:
	def __init__(self):
		self.note = "Error"

class Daily(Recurrer):
	def __init__(self):
		self.count = 0

	def completion(self):
		self.count = 1
		return True

	def due(self):
		return True

	def count(self):
		if self.count == 1:
			return True
		return False

class Weekly(Recurrer):
	def __init__(self):
		self.count = 0
		self.currentWeek = datetime.datetime.now().isocalendar()[1]

	def completion(self):
		self.count = 1
		return True

	def due(self):
		#return True
		if datetime.datetime.now().isocalendar()[1] == self.currentWeek:
			x = datetime.datetime.now() + datetime.delta(7)
			self.currentWeek = x
			return True
		return False

	def count(self):
		if self.count == 1:
			return True
		return False

def newSubTask(taskName, task):
	x = ToDoItem(taskName)
	task.subTasks.append(x)

def displayTasks(array):
	for task in array:
		print task.description
		task.display()

q = datetime.datetime.now()
a = ToDoItem("Task A")
b = ToDoItem("Task B")
c = ToDoItem("Task C")
d = ToDoItem("Task D")
a.complete()

a.addSubTask(ToDoItem("Task A.1"))
a.addSubTask(ToDoItem("Task A.2"))
a.addSubTask(ToDoItem("Task A.3"))
b.addSubTask(Habit("Task B.1"))

e = ToDoItem("Task E")
e1 = ToDoItem("Task E.1")
e1.addSubTask(ToDoItem("Task E.1.1"))
e.addSubTask(e1)
f = Recurring("Task F")

taskArray = [a, b, c, d, e, f]
# for task in taskArray:
# 	print task.display(),
	# print task

# print type(a)
# print isinstance(a, ToDoItem)
x = json.dumps(taskArray, cls=ItemEncoder)
# print x
# q = json.loads(x)
# for each in q:
# 	print each
# 	print

# h = json.JSONDecoder(object_hook = item_decode).decode(x)
# print h
