#!/usr/bin/env python
# -*- coding: utf-8 -*-

import scipy.stats as scistats
import pickle
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.cluster import KMeans, MiniBatchKMeans

import warnings
warnings.filterwarnings('error')

# This helpful method will print the jokes for you
def print_jokes(p, n_jokes):
    for i in range(N_clusters):
        print '\n------------------------------'
        print '     cluster ' + str(i) + '   '
        print '------------------------------'
        for j in idx[p == i][:n_jokes]:
            print jokes[j] + '\n'

data = pickle.load(open('jester.p'))
# rows are users, columns are jokes
data_test = data['data_test']
data_train = data['data_train']
# Here are the joke texts, idx is used to index in print_jokes
jokes = pickle.load(open('jokes.pck', 'rb'))
idx = np.arange(len(jokes))

# Here we compute the similarity matrix. Refer to slides
# to see how to use the calculated numbers
d_user_user = np.zeros([data_test.shape[0],data_train.shape[0]])
d_item_item = np.zeros([data_train.shape[1],data_train.shape[1]])

for i in range(data_test.shape[0]):
	ri = data_test[i]
	for j in range(data_train.shape[0]):
		rj = data_train[j]
		# use elements for which both users have given ratings
		inds = np.logical_and(ri != 0, rj != 0)
		# some users gave the same rating to all jokes :(
		if np.std(ri[inds])==0 or np.std(rj[inds])==0:
			continue
		d_user_user[i,j] = scistats.pearsonr(ri[inds],rj[inds])[0]
		#print d_user_user[i,j]
		#exit(2)
#print d_user_user
#exit(1)
for i in range(data_train.shape[1]):
	ri = data_train[:,i]
	d_item_item[i,i] = 1
	for j in range(i+1, data_train.shape[1]):
		rj = data_train[:,j]
		# consider only those users who have given ratings
		inds = np.logical_and(ri != 0, rj != 0)
		d_item_item[i,j] = scistats.pearsonr(ri[inds],rj[inds])[0]
		d_item_item[j,i] = d_item_item[i,j]
#print d_item_item
#exit(1)
# the above takes a while to compute, so if you run this many times 
# during debugging, you might consider saving d_item_item and 
# d_user_user to file using pickle.dump

# If the rating is 0, then the user has not rated that item
# You can use this mask to select for rated or unrated jokes
d_mask = (data_test == 0)
#print d_mask
#exit(1)
# ------------------- user user --------------------- #

print "\n*******User User similarity*******"
#print data_test
#exit(1)
tot = 0
expected_rating = np.zeros([data_test.shape[0],100])
for u in range(data_test.shape[0]):
	maximum = 0.0
	index = 0
	
	difference = []
	paricular_user_similarity = d_user_user[u,:] # particular test user similarity with all the train users
	#print paricular_user_similarity
	#exit (1)
	count = 0
	for v in range(0,100):
		
		particular_joke_rating = data_train[:,v] # particular joke rated by all the train users
		#print particular_movie_rating
		#print np.sum(np.dot(particular_movie_rating,paricular_user_similarity))
		#exit(1)
		inner_sum = np.sum(paricular_user_similarity)
		#print inner_sum
		for i in range(particular_joke_rating.shape[0]):
			if particular_joke_rating[i] == 0:
				inner_sum = inner_sum - paricular_user_similarity[i]
		#print inner_sum
		#exit(1)
		expected_rating[u][v] = np.dot(particular_joke_rating,paricular_user_similarity) / inner_sum
		
		if data_test[u][v] == 0:
			#print v
			#print expected_rating[u][v]
			if (expected_rating[u][v] > maximum):
				maximum = expected_rating[u][v]
				index = v
		#print "iteration"+str(v)
		#print expected_rating[u][v]
		#print data_test[u][v]
		#print d_user_user[u][v]
		if data_test[u][v] != 0:
			diff = data_test[u][v] - expected_rating[u][v]
			difference.append(diff)
			count = count + 1

	#print difference
	#exit(1)
	rmse = np.sqrt(np.sum(np.square(difference))/count) #Replace with RMSE calculation for **non-zero** entries only
	tot += rmse
	#print "joke "+str(max)
	print "Test instance "+str(u)+" RMSE:"+str(rmse)

	joke_rec = index #Replace this with the index of your recommended joke from those jokes with **zero** ratings
	print "Recommend joke: "+str(joke_rec)
	#exit(1)
print "Average RMSE " + str(tot/data_test.shape[0])
#exit(1)

# ------------------ item item ----------------------- #
print "\n*******Item Item similarity*******"
tot = 0
expected_rating_algo = np.zeros([data_test.shape[0],100])
for u in range(data_test.shape[0]):
	max = 0.0
	index = 0
	difference = []
	paricular_test_user_rating = data_test[u,:] # particular test user
	count = 0
	for v in range(0,100):
		particular_item_similarity = d_item_item[v,:]
		inner_sum = np.sum(particular_item_similarity)
		#print inner_sum
		for i in range(paricular_test_user_rating.shape[0]):
			if paricular_test_user_rating[i] == 0:
				inner_sum = inner_sum - particular_item_similarity[i]

		expected_rating_algo[u][v] = np.dot(paricular_test_user_rating,particular_item_similarity) / inner_sum

		if data_test[u][v] == 0:
			#print v
			#print expected_rating_algo[u][v]
			if (expected_rating_algo[u][v] > max):
				max = expected_rating_algo[u][v]
				index = v
		#print "iteration"+str(v)
		#print expected_rating[u][v]
		#print data_test[u][v]
		#print d_user_user[u][v]
		if data_test[u][v] != 0:
			diff = data_test[u][v] - expected_rating_algo[u][v]
			difference.append(diff)
			count = count + 1
	rmse = np.sqrt(np.sum(np.square(difference))/count) #Replace with RMSE calculation for **non-zero** entries only
	tot += rmse
	print "Test instance "+str(u)+" RMSE:"+str(rmse)
	joke_rec = index #Replace this with the index of your recommended joke from those jokes with **zero** ratings
	print "Recommend joke: "+str(joke_rec)

print "Average RMSE " + str(tot/data_test.shape[0])

#exit(1)
# ------- Clustering question  -------- #
N_clusters = 10
# ------- jokes clustering based on user votes  -------- #
print "\n*******Clustering based on user votes*******"
#X = data_train.data
#print X
#exit(1)
kmeans = KMeans(N_clusters)
t_data = np.transpose(data_train)
jokes_cluster = kmeans.fit(t_data)
jokes_cluster = kmeans.predict(t_data)
#labels = kmeans.labels_
#print labels

#kmeans.fit(data_train.data)
#centroids = kmeans.cluster_centers_
#print(centroids)
#exit(1)
####################################
# put you code here
####################################
# Here you should apply KMeans clustering to the ratings in the
# *TRAINING DATA* <--- very important!  
# You should *not* use the test data for this question at all.
# Replace jokes_cluster with the output of your clustering.
# Below is a random clustering that ignores the joke text
# so the code still works.
####################################

#jokes_cluster = np.random.randint(low=N_clusters,size=data_train.shape[1])
print_jokes(jokes_cluster, 3)
print jokes_cluster
#exit(1)
# ------ jokes clustering based on text similariy ------#
print "\n*******Clustering based on text similarity*******"
# Use the following vectorizer to turn the text of the jokes
# into vectors that can be clustered
vectorizer = CountVectorizer(stop_words='english',
							max_df=0.95,
                            min_df=0.05,
                        	analyzer='char',
                            ngram_range = [2,5], binary=True)
kmeans = KMeans(N_clusters)
#print jokes
#exit(1)
trans_data = vectorizer.fit_transform(jokes)
jokes_cluster = kmeans.fit_predict(trans_data)
#jokes_cluster = kmeans.predict(trans_data)
####################################
# put you code here
####################################
# Here you should apply the vectorizer to the text of the jokes
# and then use the vector representation as input to KMeans clustering.
# Replace jokes_cluster with the output of your clustering.
# Below is a random clustering that ignores the joke text
# so the code still works.
#jokes_cluster = np.random.randint(low=N_clusters,size=data_train.shape[1])
print_jokes(jokes_cluster, 3)
print jokes_cluster
