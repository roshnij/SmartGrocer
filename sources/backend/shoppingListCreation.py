#Usage for getting meal plan: http://localhost:8040/SmartGrocer/groceryList
import json
import sys
import io
#for making localhost url
from bottle import Bottle, route, run, request, response
import subprocess

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
def createGroceryList(name):
	if name == 'groceryList':
		with open('../frontend/app/containers/MealPlanPage/recipes_Lindsay_lunch.json') as data_file:    
			lunchRecipesData = json.load(data_file)
		with open('../frontend/app/containers/MealPlanPage/recipes_Lindsay_dinner.json') as data_file:    
			dinnerRecipesData = json.load(data_file)
		with open('../frontend/app/containers/MealPlanPage/recipes_Lindsay_breakfast.json') as data_file:    
			breakfastRecipesData = json.load(data_file)
		with open('../backend/Evaluation/participant1/Coupons.json') as data_file:    
			couponsData = json.load(data_file)
		couponedIngredients= []
		discount= []
		for ingrCoupons in couponsData["Data"]:
			for eachIngrCoupon in ingrCoupons["IngredientsCoupons"]:
				couponedIngredients.append(eachIngrCoupon["name"])
				discount.append(eachIngrCoupon["discount"])
		groceryList={}
		for eachBFRecipe in breakfastRecipesData["data"]:
			if(len(eachBFRecipe)>1):
				for eachBFMissedIngredient in eachBFRecipe["missedIngredients"]:
					print "eachBFMissedIngredient: " + eachBFMissedIngredient["name"]
					match  = subprocess.check_output([sys.executable,"posTag_couponIngr.py",eachBFMissedIngredient["name"], str(couponedIngredients)])
					print "match : " + match
					match = match.strip('\r\n')
					if(match != ''):
						ind = couponedIngredients.index(match)
						if match not in groceryList :
							pair = {}
							pair["discount"] = discount[ind]
							pair["isDiscount"] = True
							pair["recipes"] = []
							pair["recipes"].append(eachBFRecipe["title"])
							groceryList[match] = pair
						else:
							for key,val in groceryList[match].iteritems():
								if key == "recipes":
									(val.append(eachBFRecipe["title"])or val) if eachBFRecipe["title"] not in val else val
					else:
						if match not in groceryList :
							pair = {}
							pair["isDiscount"] = False
							pair["recipes"] = []
							pair["recipes"].append(eachBFRecipe["title"])
							groceryList[eachBFMissedIngredient["name"]] = pair
						else:
							for key,val in groceryList[match].iteritems():
								if key == "recipes":
									(val.append(eachBFRecipe["title"])or val) if eachBFRecipe["title"] not in val else val

		for eachlunchRecipe in lunchRecipesData["data"]:
			if(len(eachlunchRecipe)>1):
				for eachLunchMissedIngredient in eachlunchRecipe["missedIngredients"]:
					print "eachLunchMissedIngredient: " + eachLunchMissedIngredient["name"]
					match  = subprocess.check_output([sys.executable,"posTag_couponIngr.py",eachLunchMissedIngredient["name"], str(couponedIngredients)])
					print "match : " + match
					match = match.strip('\r\n')
					if(match != ''):
						ind = couponedIngredients.index(match)
						if match not in groceryList :
							pair = {}
							pair["discount"] = discount[ind]
							pair["isDiscount"] = True
							pair["recipes"] = []
							pair["recipes"].append(eachlunchRecipe["title"])
							groceryList[match] = pair
						else:
							for key,val in groceryList[match].iteritems():
								if key == "recipes":
									(val.append(eachlunchRecipe["title"])or val) if eachlunchRecipe["title"] not in val else val
					else:
						if match not in groceryList :
							pair = {}
							pair["isDiscount"] = False
							pair["recipes"] = []
							pair["recipes"].append(eachlunchRecipe["title"])
							groceryList[eachLunchMissedIngredient["name"]] = pair
						else:
							for key,val in groceryList[match].iteritems():
								if key == "recipes":
									(val.append(eachlunchRecipe["title"])or val) if eachlunchRecipe["title"] not in val else val

		for eachDinnerRecipe in dinnerRecipesData["data"]:
			if(len(eachDinnerRecipe)>1):
				for eachDinnerMissedIngredient in eachDinnerRecipe["missedIngredients"]:
					print "eachDinnerMissedIngredient: " + eachDinnerMissedIngredient["name"]
					match  = subprocess.check_output([sys.executable,"posTag_couponIngr.py",eachDinnerMissedIngredient["name"], str(couponedIngredients)])
					print "match : " + match
					match = match.strip('\r\n')
					if(match != ''):
						ind = couponedIngredients.index(match)
						if match not in groceryList :
							pair = {}
							pair["discount"] = discount[ind]
							pair["isDiscount"] = True
							pair["recipes"] = []
							pair["recipes"].append(eachDinnerRecipe["title"])
							groceryList[match] = pair
						else:
							for key,val in groceryList[match].iteritems():
								if key == "recipes":
									(val.append(eachDinnerRecipe["title"])or val) if eachDinnerRecipe["title"] not in val else val
					else:
						if match not in groceryList :
							pair = {}
							pair["isDiscount"] = False
							pair["recipes"] = []
							pair["recipes"].append(eachDinnerRecipe["title"])
							groceryList[eachDinnerMissedIngredient["name"]] = pair
						else:
							for key,val in groceryList[match].iteritems():
								if key == "recipes":
									(val.append(eachDinnerRecipe["title"])or val) if eachDinnerRecipe["title"] not in val else val
		
		recGrocery=[]
		for ingr in couponedIngredients:
			#print ingr
			if ingr not in groceryList:
				ind = couponedIngredients.index(ingr)
				pair ={}
				pair["discount"] = discount[ind]
				pair["name"] = ingr
				recGrocery.append(pair)
		
		groceryList["RecommendedCoupons"] = recGrocery
		finalGroceryList = {}
		datainArray= []
		datainArray.append(groceryList)
		finalGroceryList["data"] = datainArray
		with io.open('../frontend/app/containers/GroceryList/groc_Lindsay.json', 'w', encoding='utf-8') as f:
			f.truncate()
			f.write(unicode(json.dumps(finalGroceryList,ensure_ascii=False)))
		
		
		return dict(data=finalGroceryList)

run(app, host='localhost', port=8040, debug=True)

		