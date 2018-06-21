from nltk import pos_tag, word_tokenize
import sys
import json
import urllib2
import requests
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import XML, fromstring, tostring
import difflib
import ast
import re

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
		for tagR in recipeIngredientJSON[tag]:
			for tagG in grocJSON[tag]:
				p = difflib.SequenceMatcher(None,tagR,tagG).ratio()
				if(p>0.7):
					sum += p
				counter+= 1
		if(counter>0):
			prob = sum /counter
			
	return prob

if __name__ == "__main__":
	#print "Hiii" + sys.argv[1]
	recipeIngredient = sys.argv[1]
	recipeIngredientJSON  = posTagResponse(recipeIngredient)
	#print recipeIngredient
	response_body = ast.literal_eval(sys.argv[2])
	sum  = 0.0
	counter = 0
	pairs = {}
	maxProbability  = 0
	maxPair = ()
	nounProbability = 1.0
	verbProbability = 1.0
	adjProbability = 1.0
	similarIngredient = ""
	for groceryIngredient in response_body:
		grocJSON = posTagResponse(groceryIngredient)
		
		nounProbability = probabilityCalculation("Noun", recipeIngredientJSON, grocJSON)
		verbProbability = probabilityCalculation("Verb", recipeIngredientJSON, grocJSON)
		adjProbability = probabilityCalculation("Adjective", recipeIngredientJSON, grocJSON)
				
		totalProbability =  nounProbability * verbProbability* adjProbability
		matchingPair = (recipeIngredient,groceryIngredient)
		pairs["matchingPair"] = matchingPair
		pairs["probability"] = nounProbability
		
		if(totalProbability> maxProbability):
			maxProbability = totalProbability
			maxPair = matchingPair
			similarIngredient = groceryIngredient
	
	print similarIngredient
	