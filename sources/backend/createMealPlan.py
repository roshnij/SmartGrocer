#Usage for getting meal plan: http://localhost:8030/SmartGrocer/mealPlan?days=3
import json
import sys
import io
#for making localhost url
from bottle import Bottle, route, run, request, response

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
def createMealPlan(name):
	if name == 'mealPlan':
		mealDuration = int(request.query.days)
		with open('../backend/Evaluation/participant2/recipes_Linday_wD.json') as data_file:    
			recipesData = json.load(data_file)
		with open('../backend/Evaluation/participant2/recipes_Linday_bf_wD.json') as data_file:    
			recipesBFData = json.load(data_file)
		#mealDuration = 3;
		lunchRecipes  = []
		dinnerRecipes = []
		breakfastRecipes = []
		i = 1
		for eachRecipe in recipesData["data"]:
			if(i<=mealDuration):
				lunchRecipes.append(eachRecipe)
			elif(i<=(mealDuration*2)):
				print i
				dinnerRecipes.append(eachRecipe)
			else:
				break;
			i = i+1
		print len(dinnerRecipes)
		if len(lunchRecipes)%7 !=0:
			for j in range(7-len(lunchRecipes)):
				lunchRecipes.append({})
				dinnerRecipes.append({})
		
		i=1
		for eachBFRecipe in recipesBFData["data"]:
			if(i<=mealDuration):
				breakfastRecipes.append(eachBFRecipe)
			else:
				break;
			i = i+1
			
		print len(breakfastRecipes)
		if len(breakfastRecipes)%7 !=0:
			for j in range(7-len(breakfastRecipes)):
				breakfastRecipes.append({})
				
		lunchMeal = {}
		lunchMeal["data"] = lunchRecipes
		dinnerMeal = {}
		dinnerMeal["data"] = dinnerRecipes
		breakFastMeal= {}
		breakFastMeal["data"] = breakfastRecipes
		
		with io.open('../frontend/app/containers/MealPlanPage/recipes_Lindsay_lunch.json', 'w', encoding='utf-8') as f:
			f.truncate()
			f.write(unicode(json.dumps(lunchMeal,ensure_ascii=False)))
		with io.open('../frontend/app/containers/MealPlanPage/recipes_Lindsay_dinner.json', 'w', encoding='utf-8') as f:
			f.seek(0)
			f.truncate()
			f.write(unicode(json.dumps(dinnerMeal,ensure_ascii=False)))
		with io.open('../frontend/app/containers/MealPlanPage/recipes_Lindsay_breakfast.json', 'w', encoding='utf-8') as f:
			f.seek(0)
			f.truncate()
			f.write(unicode(json.dumps(breakFastMeal,ensure_ascii=False)))
		Meal = {}
		Meal["lunchRecipes"] = lunchRecipes
		Meal["dinnerRecipes"] = dinnerRecipes
		Meal["breakfastRecipes"] = breakfastRecipes
		
		return dict(data=Meal)

run(app, host='localhost', port=8030, debug=True)

		