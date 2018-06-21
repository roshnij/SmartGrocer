import sys
import json
import io
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()
	
	
with open('../backend/Evaluation/participant2/recipes_Linday_bf.json') as data_file:    
	recipesData = json.load(data_file)

with open('../backend/Evaluation/participant1/Coupons.json') as data_file:    
	coupons = json.load(data_file)

for eachRecipe in recipesData["data"]:
	missedIngredientsCost = eachRecipe["missedIngredientsCost"];
	for eachMissedIngredient in eachRecipe["missedIngredients"]:
		for IngrCoupons in coupons["Data"]:
			for eachCoupon in IngrCoupons["IngredientsCoupons"]:
				if similar(eachCoupon["name"],eachMissedIngredient["name"]) >0.7:
					print eachCoupon["name"]
					eachIngrPrice = float(eachMissedIngredient["price"][1:])
					eachIngrReducedPrice = (float(eachCoupon["discount"])/100) * eachIngrPrice
					print eachIngrReducedPrice
					missedIngredientsCost = missedIngredientsCost - eachIngrReducedPrice
	print " ---------"
	eachRecipe["missedIngredientsCostAfterDiscount"] = missedIngredientsCost
with io.open('recipes_Linday_bf_wD.json', 'w', encoding='utf-8') as f:
	f.write(unicode(json.dumps(recipesData,ensure_ascii=False)))