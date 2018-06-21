from nltk import pos_tag, word_tokenize
import sys
import json
import urllib2
import requests
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import XML, fromstring, tostring
import difflib

def grocAPIResponse(tagItemNoun):
	apicall = "http://www.SupermarketAPI.com/api.asmx/COMMERCIAL_GetGroceries?APIKEY=3f34a80617&SearchText="+tagItemNoun
	data = requests.get(apicall)
	xmlData = data.content
	tree = ET.fromstring(xmlData)
	root = {}
	items = []
	for child in tree:
		root[child.tag.split("}")[1]] = child.text
		item =  root["string"]
		productName = item.split("-")[0]
		items.append(productName)
		
	return items

def posTagResponse(ingredient):
	#recipeItem = "juice of lime"
	posResult = pos_tag(word_tokenize(ingredient))
	posTagJSON = {}
	noun = []
	verb = []
	adjective = []
	for tagTuple in posResult:
		if(tagTuple[1] == "NN" or tagTuple[1] == "NNS" or tagTuple[1] == "NNP" or tagTuple[1] == "NNPS" ):
			noun.append(tagTuple[0].lower())
		elif(tagTuple[1] == "VB" or tagTuple[1] == "VBD" or tagTuple[1] == "VBG" or tagTuple[1] == "VBN"  or tagTuple[1] == "VBP"  or tagTuple[1] == "VBZ" ):
			verb.append(tagTuple[0].lower())
		elif(tagTuple[1] == "JJ" or tagTuple[1] == "JJR" or tagTuple[1] == "JJS" ):
			adjective.append(tagTuple[0].lower())
	if(len(noun)>=1):
		posTagJSON["Noun"] = noun
	if(len(verb)>=1):
		posTagJSON["Verb"] = verb
	if(len(adjective)>=1):
		posTagJSON["Adjective"] = adjective
		
	return posTagJSON

def probabilityCalculation(tag, recipeJSON, groceryJSON):
	counter = 0
	sum = 0.0
	prob  = 1.0
	if(tag in recipeJSON and tag in groceryJSON):
		for tagR in recipeJSON[tag]:
			for tagG in groceryJSON[tag]:
				p = difflib.SequenceMatcher(None,tagR,tagG).ratio()
				if(p>0.7):
					sum += p
				counter+= 1
		if(counter>0):
			prob = sum /counter
			
	return prob

if __name__ == "__main__":
	recipeIngredient = "juice of lime"
	recipeIngredientJSON  = posTagResponse(recipeIngredient)
	#print recipeIngredient
	groceryIngredients = []
	grocAPIResponseForRecipeIngr = grocAPIResponse(recipeIngredient)
	if(len(grocAPIResponseForRecipeIngr)>=1):
		groceryIngredients = grocAPIResponseForRecipeIngr
	else:
		for noun in recipeIngredientJSON["Noun"]:
			groceryIngredients += grocAPIResponse(noun)
	
	sum  = 0.0
	counter = 0
	pairs = {}
	maxProbability  = 0.7
	maxPair = ()
	nounProbability = 0
	verbProbability = 0
	adjProbability =  0
	for groceryIngredient in groceryIngredients:
		grocJSON = posTagResponse(groceryIngredient)
		
		nounProbability = probabilityCalculation("Noun", recipeIngredientJSON, grocJSON)
		verbProbability = probabilityCalculation("Verb", recipeIngredientJSON, grocJSON)
		adjProbability = probabilityCalculation("Adjective", recipeIngredientJSON, grocJSON)
				
		totalProbability =  (nounProbability + verbProbability + adjProbability)/3
		matchingPair = (recipeIngredient,groceryIngredient)
		pairs["matchingPair"] = matchingPair
		pairs["probability"] = nounProbability
		
		if(totalProbability> maxProbability):
			maxProbability = totalProbability
			maxPair = matchingPair
			
	print maxProbability
	print maxPair
	