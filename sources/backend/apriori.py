#Usage for getting coupons: http://localhost:8050/SmartGrocer/couponGenerator=<filename>

import sys
import json
import re
from bottle import Bottle, route, run, request, response
from Queue import Queue
from itertools import chain, combinations
from collections import defaultdict
from optparse import OptionParser
from urllib2 import Request, urlopen
import io
import subprocess

def frequentItemsCalculation(itemSet, transactionList, minSupport, freqSet):
        _itemSet = set()
        localSet = defaultdict(int)

        for item in itemSet:
                for transaction in transactionList:
                        if item.issubset(transaction):
								freqSet[item] += 1
								localSet[item] += 1

        for item, count in localSet.items():
                support = float(count)/len(transactionList)

                if support >= minSupport:
                        _itemSet.add(item)

        return _itemSet

def runApriori(data, minSupport, minConfidence):
		eachTransaction = list()
		items = set()
		for transRow in data:
			transaction = frozenset(transRow)
			eachTransaction.append(transRow)
			for item in transaction:
				items.add(frozenset([item]))              
		print "trans: " + str(eachTransaction)
		print "items: " + str(items)
		
		freqSet = defaultdict(int)
		frequentItemSet = dict()
		assocRules = dict()
		oneDimensionalSet = frequentItemsCalculation(items,
                                        eachTransaction,
                                        minSupport,freqSet)
		print "oneDimensionalSet:" + str(oneDimensionalSet)
		currentSet = oneDimensionalSet
		k = 2
		
		while(currentSet != set([])):
			frequentItemSet[k-1] = currentSet
			currentSet =set()
			for itemL in frequentItemSet[k-1]:
				for itemR in frequentItemSet[k-1]:
					if(len(itemL.union(itemR)) == k):
						currentSet.add(itemL.union(itemR))
			print "currentSet: " + str(currentSet)
			nextIterationSet = frequentItemsCalculation(currentSet,
													eachTransaction,
													minSupport,freqSet)
			currentSet = nextIterationSet
			k+=1
		print "frequentItemSet: " + str(frequentItemSet)
		def getSupport(item):
				return float(freqSet[item])/len(eachTransaction)
		
		toRetItems = []
		for key, value in frequentItemSet.items():
			toRetItems.extend([(tuple(item), getSupport(item))
							   for item in value])

		toRetRules = []
		for key, value in frequentItemSet.items()[1:]:
			for item in value:
				_subsets = map(frozenset, [x for x in subsets(item)])
				for element in _subsets:
					remain = item.difference(element)
					if len(remain) > 0:
						confidence = getSupport(item)/getSupport(element)
						if confidence >= minConfidence:
							toRetRules.append(((tuple(element), tuple(remain)),
											   confidence))
			
		return toRetItems, toRetRules
	
def generateDiscountList(items, rules):
		freqItems = [];
		finalRules = dict()
		print "\n------------------------ FREQUENT ITEMS-------------------------------------:"
		for freqItem, support in sorted(items, key=lambda (item, support): support):
				for item in freqItem:
					#print "final freq item:" + item
					freqItems.append(item)
		finalfreqItems = list(set(freqItems))
		finalFreqItemsString = "%2C".join(finalfreqItems)
		print "\n------------------------ SUGGESTED ITEMS-------------------------------------:"
		pairedIngredients = ingredientPairing(finalFreqItemsString, finalfreqItems)
		#print "ffreqItems: " + json.dumps(finalfreqItems)
		
		print "\n------------------------ RULES-------------------------------------:"
		for rule, confidence in sorted(rules, key=lambda (rule, confidence): confidence):
				pre, post = rule
				#eachRule = dict()
				pre  = json.dumps(pre)
				post  = json.dumps(post)
				finalRules[pre] = post
				#rules.update(eachRule)
		#print "rules: " + str(finalRules)
		
		print "\n------------------------ JSON DATA-------------------------------------:"
		freqItemsJSON = dict()
		freqItemsJSON["FrequentIngredients"] = finalfreqItems
		rulesJSON = dict()
		rulesJSON["Rules"] = finalRules
		suggestedJSON =  dict()
		suggestedJSON["SuggestedIngredients"] = pairedIngredients
		jsonData = dict()
		jsonData["Data"] =list()
		jsonData["Data"].append(dict())
		jsonData["Data"][0].update(freqItemsJSON)
		jsonData["Data"][0].update(rulesJSON)
		jsonData["Data"][0].update(suggestedJSON)
		#print "JSON data : " + json.dumps(jsonData)
		return jsonData

#To find the pairing ingredients list from the frequently purchased ingredients list
def ingredientPairing(ingredients, freqItems):
	headers = {
		'X-Application-ID': 'e06f8fb2',
		'X-Application-Key': '2d5775cf1fb62e8c0d87401c743bbfb9'
	}
	ingredients = re.sub(r'\s','%20',ingredients)
	url = 'https://api.foodpairing.com/ingredients?q='+ingredients
	request = Request(url, headers=headers)
	response_body = urlopen(request).read()
	response_body = json.loads(response_body)
	for eachIngridient in response_body:
		del eachIngridient['name']
		del eachIngridient['preparation']
		del eachIngridient['_links']
		del eachIngridient['description']
		del eachIngridient['_meta']
	frequentItemsId = []
	for freqIngr in freqItems:
		id  = subprocess.check_output([sys.executable,"posTag_ingrMatch.py",freqIngr, str(response_body)])
		if(id != ''):
			frequentItemsId.append(id.rstrip())
	
	freqIdString = ",".join(frequentItemsId)
	url = 'https://api.foodpairing.com/ingredients/'+freqIdString+'/pairings'
	request = Request(url, headers=headers)
	pairingResponse = urlopen(request).read()
	pairingResponse = json.loads(pairingResponse)
	finalpairedIngredients = []
	for eachPairIngr in pairingResponse:
		if(eachPairIngr['matches']['all']['abs'] >0.8):
			finalpairedIngredients.append(eachPairIngr['_links']['ingredient']['product'])
		
	return finalpairedIngredients
	
def subsets(arr):
    return chain(*[combinations(arr, i + 1) for i, a in enumerate(arr)])

def fileData(filename):
	file = open(filename, 'r')
	wholeData = []
	for line in file:
		line = line.strip().rstrip(',')  
		row = line.split(',')
		wholeData.append(row);
		#yield row
	return wholeData

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
def recData(name):
	if name == "couponGenerator":
		inputFile = fileData(request.query.file)
		confidence = 0.6
		support = 0.15
		
		items, rules = runApriori(inputFile, support, confidence)
		print items
		discountItems = generateDiscountList(items, rules)
		return dict(discountItems)
 

run(app, host='localhost', port=8050, debug=True)

