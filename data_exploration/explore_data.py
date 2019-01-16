# -*- coding: utf-8 -*-
'''
Script to explore data files; counts number of records, and missing data.  
input: certificate.csv (change name to that of the post-town?)
output: certificate.html (change name to that of the post-town?)
created: 15 January 2019
author: Nigel Legg (nigel@notbinary.co.uk)
'''


import pandas as pd

hart = pd.read_csv('hartlepool.csv')
bris = pd.read_csv('bristol.csv')
card = pd.read_csv('cardiff.csv')

cols = hart.columns
rlen = len(cols)
hlen = len(hart)
hcounts = hart.isna().sum()
blen = len(bris)
bcounts = bris.isna().sum()
clen = len(card)
ccounts = card.isna().sum()
hcountsa = []
bcountsa = []
ccountsa = []
i = 0
while i < rlen:
	x = hlen - hcounts[i]
	hcountsa.append(x)
	x = blen - bcounts[i]
	bcountsa.append(x)
	x = clen - ccounts[i]
	ccountsa.append(x)
	i += 1

html = '<!DOCTYPE html>\n<html>\n<head>\n'
html = html + 'table, th, td {border: 1px solid black;}'
html = '<h1>Hartlepool, Bristol, Cardiff Compared</h1></head>\n<body>'
html = html + '<table>\n<tr><th>City</th><th>Population</th><th>No. Certificates</th></tr>'
html = html + '<tr><td>Hartlepool</td><td>92,028</td><td>'+str(hlen)+'</td></tr>\n'
html = html + '<tr><td>Bristol</td><td>539,907</td><td>'+str(blen)+'</td></tr>\n'
html = html + '<tr><td>Cardiff</td><td>335,145</td><td>'+str(clen)+'</td></tr></table>\n<p><p>'

html = html + '<table>\n<tr>\n<th>Column Name</th><th>Hartlepool count</th><th>Bristol count</th><th>Cardiff Count</th></tr>'
i = 0
while i < rlen:
	html = html + '<tr><td>'+ cols[i] +'</td><td>'+ str(hcountsa[i]) +'</td><td>'+ str(bcountsa[i]) +'</td><td>'+ str(ccountsa[i]) +'</td></tr>\n'
	i += 1
html = html + '</table>'
html = html + '</body></html>'

out = open('compare.html', 'w')
out.write(html)
out.close()

