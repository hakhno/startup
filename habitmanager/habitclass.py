# level = 0
#possibly add a JSON representation to objects?
#add a date to the whole thing so that a) testing b) out of sync stuff doesn't happen
#make sure to have arrays for top level too, so we can add new sections or something
#add error handling
import json, datetime, uuid

class ToDoItem:
	def __init__(self, name='', description = '', dateDue = ''):
		self.itemType = 'ToDoItem'
		self.id = str(uuid.uuid4())
		self.description = name
		self.additionalText = description
		self._dateAdded = datetime.datetime.now()
		self.dateAdded = self._dateAdded.isoformat()
		self.dateCompleted = False
		self.dateDue = False
		self.subTasks = []	#add in UUIDs, not objects
		self.completed = False
		# self.parent = '' #necessary?
		# self.owner = '' #necessary?

	def complete(self):
		if len(self.subTasks) > 0:
			for task in self.subTasks:
				if not task.completed:
					return False, 'Subtasks not completed'
		self.completed = True
		self.dateCompleted = datetime.datetime.now()
		return True, 'Task completed'

	def display(self, level = 0):
		x = ('..' * level) + self.description + '\n'
		for task in self.subTasks:
			x = x + task.display(level + 1)
		return x

	def render(self):
		return {key: self.__dict__[key] for key in self.__dict__.keys() if not key.startswith('_')}

	#probably unnecessary?
	# def addSubTask(self, task):
	# 	self.subTasks.append(task)

class Habit(ToDoItem):
	def __init__(self, name='', description = ''):
		ToDoItem.__init__(self, name, description)
		self.itemType = 'Habit'
		self.successes = []
		self.successCount = len(self.successes)
		self.failures = []
		self.failureCount = len(self.failures)
		self.canSucceed = False
		self.canFail = False

	def success(self):
		if not self.canSucceed:
			return False, 'Cannot succeed at this task'
		self.successes.append(datetime.datetime.now())
		self.successCount = len(self.successes)
		return True, 'Success'

	def failure(self):
		if not self.canFail:
			return False, 'Cannot fail at this task'
		self.failures.append(datetime.datetime.now())
		self.failureCount = len(self.failures)
		return True, 'Failure'

class Recurring(ToDoItem):
	def __init__(self, name='', description = '', recurType = 'Daily'):
		ToDoItem.__init__(self, name, description)
		self.itemType = 'Recurring'
		self.successes = []
		self.successCount = len(self.successes)
		self.failures = []
		self.failureCount = len(self.failures)
		self.recurType = self.setRecurrer(recurType)

	def setRecurrer(self, recurType):
		if recurType == 'Daily':
			return Daily()
		elif recurType == 'Weekly':
			return Weekly()
		else:
			return Daily()

	def complete(self):
		if len(self.subTasks) > 0:
			for task in self.subTasks:
				if not task.completed:
					return False, 'Subtasks not completed'
		self.recurType.completion()
		self.completed = True
		return True, 'Task completed'

	def successCheck(self):
		if not self.recurType.due():
			return False, 'Not due'
		elif not self.recurType.count():
			return False, 'Not completed enough times'
		elif self.completed:
			self.successes.append(datetime.datetime.now())
			self.successCount = len(self.successes)
			self.completed = False
			return True, 'Success'

class Recurrer:
	def __init__(self):
		self.note = 'Error'

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
		if datetime.datetime.now().isocalendar()[1] == self.currentWeek:
			x = datetime.datetime.now() + datetime.delta(7)
			self.currentWeek = x
			return True
		return False

	def count(self):
		if self.count == 1:
			return True
		return False

def taskList(tasks):
	return tasks.keys()