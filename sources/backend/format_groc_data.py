#!/usr/bin/python27
import xlrd
import sys
from xlutils.copy import copy

workbook = xlrd.open_workbook('user1_formatData.xlsx')
worksheet = workbook.sheet_by_index(0)
virtual_worksheet = copy(workbook)
sheet = virtual_worksheet.get_sheet(0)
num_cols = worksheet.ncols
with open("user1_transData.txt") as file:
	#print "loop1"
	r_count = 1;
	for line in file:
		#line.rstrip('\r')
		#line.rstrip('\n')
		line = line.replace('\r','')
		line = line.replace('\n','')
		#line.rstrip('\s')
		print line
		arr_prod = line.split(',')
		#print len(arr_prod)
		for elem in arr_prod:
			#print "loop3"
			for col in range(0,num_cols):
				if worksheet.cell(0,col).value == elem:
					#print worksheet.cell(0,col).value
					sheet.write(r_count,col,1)
					break
		r_count = r_count + 1

virtual_worksheet.save('user1_finalformatData.xls')
