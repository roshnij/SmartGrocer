#!/usr/bin/python27
import psycopg2
import pprint
import unirest
import io
import json
# Simple routine to run a query on a database and print the results:
def doQuery( conn ) :
	resp = []
	cur = conn.cursor()
	cur.execute( "SELECT * FROM userinfo" )
	for cols in cur.fetchone():
		resp.append(cols)
		#pprint.pprint(cols)
	return resp	#print resp
	print response

def main():
	'''myConnection = psycopg2.connect("dbname = caprecipes_ibm user = postgres password=Abc123456 port = 5433")
	result = []
	result = doQuery( myConnection )
	print result
	myConnection.close()
	apicall = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=false&cuisine="+result[13]+"&excludeIngredients="+result[12]+"&fillIngredients=false&includeIngredients=onions%2C+lettuce%2C+tomato&intolerances=peanut%2C+shellfish&limitLicense=false&maxCalories="+result[9]+"&maxCarbs="+result[6]+"&maxFat="+result[8]+"&maxProtein="+result[7]+"&minCalories=150&minCarbs=5&minFat=5&minProtein=5&number=10&offset=0&query=burger&ranking=1&type=main+course"'''
	
	apicall = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine=indian&diet=vegetarian&excludeIngredients=onions%2C+garlic&fillIngredients=true&includeIngredients=tomato%2C+cilantro%2C+pepper%2C+carrot%2C+Coriander%2C+Cumin&intolerances=egg%2C+seafood%2C+shellfish&limitLicense=false&maxCalories=1500&maxCarbs=100&maxFat=100&maxProtein=100&minCalories=150&minCarbs=5&minFat=5&minProtein=5&number=10&offset=0&query=<required>&ranking=1&type=main+course"
	
	response = unirest.get(apicall,
	headers={
    "X-Mashape-Key": "FM6rhmzOJ1mshE29nA3PzJNQSNjup1cziiQjsnXdRgxLo859D4",
	"Accept": "application/json"
	}
	)
	#print response.body

	with io.open('recjsonone.json', 'w', encoding='utf-8') as f:
		f.write(unicode(json.dumps(response.body,ensure_ascii=False)))
	
	with open('recjsonone.json') as data_file:    
		data = json.load(data_file)
	
	counter = 0;
	for val in data:
		
		if val == 'results':
			
			listrecm = []
			for recipe in data[val]:
				rec = {}
				rec['id'] = recipe['id']
				rec['title'] = recipe['title']
				rec['missedIngredients'] = recipe['missedIngredients']
				
				for missedattr in rec['missedIngredients']:
					length = len(missedattr)
					del missedattr['originalString']
					del missedattr['metaInformation']
					del missedattr['unitLong']
					del missedattr['unitShort']
					if length > 10:
						del missedattr['extendedName']
					
				rec['calories'] = recipe['calories']
				rec['carbs'] = recipe['carbs']
				rec['protein'] = recipe['protein']
				rec['fat'] = recipe['fat']
				rec['readyInMinutes'] = recipe['readyInMinutes']
				rec['image'] = recipe['image']
				rec['usedIngredients'] = recipe['usedIngredients']
				for usedattr in rec['usedIngredients']:
					length1 = len(usedattr)
					del usedattr['originalString']
					del usedattr['metaInformation']
					del usedattr['unitLong']
					del usedattr['unitShort']
					if length1 > 10:
						del usedattr['extendedName']
				rec['cuisines'] = recipe['cuisines']
				listrecm.append(rec)
			
			f1 = io.open('rec.json', 'w', encoding='utf-8')
			f1.write(unicode(json.dumps(listrecm,ensure_ascii=False)))
		
			
				

if __name__ == "__main__":
	main()
	
