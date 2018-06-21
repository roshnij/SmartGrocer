#!/usr/bin/python27

#Usage for getting recipelist: http://localhost:8020/SmartGrocer/recipelist?type=main%20course&number=20&cuisine=indian,mexican
#Usage for getting cookingstep: http://localhost:8020/SmartGrocer/cookingsteps?id=584043


import psycopg2
import pprint
import unirest
import io
import json
import re
from bottle import Bottle, route, run, request, response
from Queue import Queue
from threading import Thread

class RecipeRunner(Thread):
	def __init__(self, queue):
		Thread.__init__(self)
		self.queue = queue

	def run(self):
		while True:
			# Get the work from the queue and expand the tuple
			origrecipelist, recommendedlist, cost = self.queue.get()
			if len(origrecipelist['analyzedInstructions']) > 0:
				recipelistgen(origrecipelist, recommendedlist, cost)
			self.queue.task_done()

app = Bottle()

@app.hook('after_request')
def enable_cors():
	"""
	You need to add some headers to each request.
	Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
	"""
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
	response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

@app.route('/SmartGrocer/<name>', method=['GET'])
def recdata(name):
	if name == "recipelist":
		foodtype = request.query.type
		recipeCount = request.query.number
		cuisineinfo = request.query.cuisine
		
		foodtype.replace ("%20", "+")
		cuisineinfo.replace ("%2C", ",")
		print cuisineinfo
		apicall = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine="+cuisineinfo+"&diet=&excludeIngredients=&fillIngredients=true&includeIngredients=beef%2C+rice%2C+chicken%2C+black bean%2C+kale%2C+quinoa%2C+avocado%2C+lemon%2C+ginger%2C+cucumber%2C+garlic&intolerances=nut&limitLicense=false&minCalories=150&minCarbs=5&minFat=5&minProtein=5&number="+recipeCount+"&offset=0&query=<required>&ranking=2&type="+foodtype
		
		response = unirest.get(apicall,
		headers={
		"X-Mashape-Key": "FM6rhmzOJ1mshE29nA3PzJNQSNjup1cziiQjsnXdRgxLo859D4",
		"Accept": "application/json"
		}
		)

		print response.body

		with io.open('recjsonone.json', 'w', encoding='utf-8') as f:
			f.write(unicode(json.dumps(response.body,ensure_ascii=False)))
		
		with open('recjsonone.json') as data_file:    
			data = json.load(data_file)
		
		counter = 0;
		# Create a queue to communicate with the worker threads
		queue = Queue()
		# Create 10 worker threads
		for x in range(20):
			worker = RecipeRunner(queue)
			# Setting daemon to True will let the main thread exit even though the workers are blocking
			worker.daemon = True
			worker.start()
		for val in data:
			
			if val == 'results':
				
				listrecm = []
				
				for recipe in data[val]:
					if len(recipe) <=13:
						continue
					queue.put((recipe,listrecm,recipe['pricePerServing']))
					#recipelistgen(recipe,listrecm,recipe['pricePerServing'])
				
				
		queue.join()
		with io.open('recresponse.json', 'w', encoding='utf-8') as f:
			f.write(unicode(json.dumps(listrecm,ensure_ascii=False)))
		for item in listrecm:
			del item['cookingInstructions']
		return dict(data=listrecm)
	elif name == "cookingsteps":
	
		with open('recresponse.json') as data_file:    
			listrecm = json.load(data_file)
		
		recipeid = request.query.id
		listrecm1 = []
		
		for item in listrecm:
			if str(item['id']).strip() != str(recipeid).strip():
				listrecm1.append(listrecm.index(item))
			
		for v in listrecm1[::-1]:
			del listrecm[v]
		
		#print listrecm
		return dict(data=listrecm)
		

def recipelistgen(origrecipe,reclist,prcperserving):
	#if len(origrecipe) <= 13:
	#	continue
	
		
		
	rec = {}
	rec['id'] = origrecipe['id']
	rec['costPerServing'] = round(prcperserving/100,2)
		
	rec['title'] = origrecipe['title']
	rec['missedIngredients'] = origrecipe['missedIngredients']
	price = 0.0
	for missedattr in rec['missedIngredients']:
		
		length = len(missedattr)
		missedattr['amount'] = round(missedattr['amount']/origrecipe['servings'],2)
		ingredientinfo = missedattr['name'] + " " + str(round(missedattr['amount'],2)) + " " + missedattr['unitLong']
		
		mresponse = unirest.post("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/visualizePriceEstimator",
		headers={
		"X-Mashape-Key": "FM6rhmzOJ1mshE29nA3PzJNQSNjup1cziiQjsnXdRgxLo859D4",
		"Accept": "text/html",
		"Content-Type": "application/x-www-form-urlencoded"
		},
		params={
		"defaultCss": True,
		"ingredientList": ingredientinfo,
		"mode": 1,
		"servings": 1,
		"showBacklink": True
		}
		)
		mresp =  json.dumps(mresponse.body)
		#print mresp
		searchObj = re.search(r'>Cost per Serving: (.*?)</div>',mresp)
		print searchObj.group(1)
		
		del missedattr['originalString']
		del missedattr['metaInformation']
		del missedattr['unitLong']
		del missedattr['unitShort']
		#if length > 10:
		#	del missedattr['extendedName']
		missedattr['price'] = str(searchObj.group(1))
		prc = re.search(r'\$(.*)',missedattr['price'])
		price = round(price + float(prc.group(1)),2)
		#missedattr['price'] = "val"
	rec['missedIngredientsCost'] = price
	#print rec['missedIngredientsCost']
	rec['calories'] = origrecipe['calories']
	rec['carbs'] = origrecipe['carbs']
	rec['protein'] = origrecipe['protein']
	rec['fat'] = origrecipe['fat']
	rec['readyInMinutes'] = origrecipe['readyInMinutes']
	rec['image'] = origrecipe['image']
	rec['usedIngredients'] = origrecipe['usedIngredients']
	for usedattr in rec['usedIngredients']:
		length1 = len(usedattr)
		usedattr['amount'] = round(usedattr['amount']/origrecipe['servings'],2)
		del usedattr['originalString']
		del usedattr['metaInformation']
		del usedattr['unitLong']
		del usedattr['unitShort']
		#if length1 > 10:
		#	del usedattr['extendedName']
	rec['cuisines'] = origrecipe['cuisines']
	rec['cookingInstructions'] =origrecipe['analyzedInstructions'][0]['steps']
	#print rec['cookingInstructions']
	reclist.append(rec)


run(app, host='localhost', port=8020, debug=True)
