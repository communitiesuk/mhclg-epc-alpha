# -*- coding: utf-8 -*-
'''
addmatch.py
Matches a single address against AddressBase, following Peter Hufton's method.  
Author: nigel1@notbinary.co.uk
Created: February 14th 2019, 17:15
To do: 
 
1.  
2.  
3.  sort out removal of counties - must not remove eg Wiltshire Way,
4.  Find set of tokens in both ref. address and input address
5.  Find tokens from reference address matching in input address
6.  Create parent addresses and find parent UPRN 
7.  Why are most of the records not finding a match?? 

'''


import pandas as pd
import numpy as np
import re

# parameters for connecting to addressbase
params = {
    'dbname': 'addbase',
    'user': 'adb_user',
    'password': 'addbase',
    'host': 'ec2-3-8-40-91.eu-west-2.compute.amazonaws.com',
    'port': '5432'
}

# punctuation to be removed
punct = [',', '.', ':', ';', '?']

# counties to be removed
counties = ['Avon', 'Berkshire', 'Cambs', 'Cornwall', 'Devon', 'Essex', ',Greater Manchester', 'Hertfordshire', 'Lancashire', 'Lincolnshire', 'Middx', 'North Humberside', 'Oxfordshire', 'S Yorkshire', 'South Yorkshire', 'Surrey', 'W Yorkshire', 'West Sussex', 'Worcestershire', 'Bedfordshire', 'Buckinghamshire', 'Cheshire', 'County Durham', 'Dorset', 'Glos', 'Hampshire', 'Herts', 'Lancs', 'Lincs', 'N Humberside', 'North Yorkshire', 'Northumberland', 'Oxon', 'Shropshire', 'Staffordshire', 'Tyne and Wear', 'Warks', 'West Yorkshire', 'Worcs', 'Beds', 'Bucks', 'Cleveland', 'Cumbria', 'E Sussex', 'Gloucestershire', 'Hants', 'Isle of Wight', 'Leicestershire', 'Merseyside', 'N Yorkshire', 'Northamptonshire', 'Nottinghamshire', 'Powys', 'Somerset', 'Staffs', 'W Midlands', 'Warwickshire', 'Wilts', 'Berks', 'Cambridgeshire', 'Co Durham', 'Derbyshire', 'East Sussex', 'Greater London', 'Herefordshire', 'Kent', 'Leics', 'Middlesex', 'Norfolk', 'Northants', 'Notts', 'S Humberside', 'South Humberside', 'Suffolk', 'W Sussex', 'West Midlands', 'Wiltshire']

# regex for extracting postcodes
pcodereg = r'([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? [0-9][A-Za-z]{2}|[Gg][Ii][Rr] 0[Aa]{2})'

# regex for extracting building numbers
bnoreg1 = r'([0-9][0-9][0-9])'
bnoreg2 = r'([0-9][0-9])'
bnoreg3 = r'([0-9])'
bnoreg4 = r'([0-9][0-9][0-9][A-Za-z])'
bnoreg5 = r'([0-9][0-9][A-Za-z])'
bnoreg6 = r'([0-9][A-Za-z])'

def getaddress(exeter, i):
    add = exeter.iloc[i, 1] + ', '
    add = add + str(exeter.iloc[i, 2]) + ', '
    add = add + str(exeter.iloc[i, 3]) + ', '
    add = add + 'Exeter, '
    add = add + exeter.iloc[i, 4]
    add = remove_nan(add)
    return add
    
def remove_nan(add):
    add2 = add.split()
    add3 = []
    for x in add2:
        if x != 'nan,' and x!= 'nan' and x != 'Nan':
            add3.append(x)
    add = ''
    for x in add3:
        add = add + ' ' + x 
    return add

def clean_address(add):
    add = add.split()
    add2 = []
    for word in add:
        if word[-2:] == '.0':
            word = word[:-2]
        word2 = ''
        for c in word: 
            if c in punct:
                c= ''
            word2 = word2 + c
        if len(word2) > 0:
            word2.capitalize()
        add2.append(word2)
    add = ''
    for x in add2:
        add = add + x + ' '
    return add


class AddMatch():

    def __init__(self):
        self.adb = pd.read_csv('addressbase.csv', low_memory=False)
        self.matchlist = []

    def clean_add(self, address):
        # Remove punctuation and capitalize all words.  
        add = address.split()
        add2 = []
        for word in add:
            if word[-2:] == '.0':
                word = word[:-2]
            word2 = ''
            for c in word: 
                if c in punct:
                    c= ''
                word2 = word2 + c
            if len(word2) > 0:
            	word2.capitalize()
            add2.append(word2)
        self.add2 = add2
        return True

    def clean_target(self, target):
        # remove counties
        i = 0
        lt = len(target)
        targ = []
        for index,  row in target.iterrows():
            add = ''
            add = add + str(row['SUB_BUILDING_NAME']).lower() + ' '
            add = add + str(row['BUILDING_NAME']).lower() + ' '
            add = add + str(row['BUILDING_NUMBER']).lower() + ' '
            add = add + str(row['DEPENDENT_THOROUGHFARE']).lower() + ' '
            add = add + str(row['THOROUGHFARE']).lower() + ' '
            add = add + str(row['POST_TOWN']).lower() + ' '
            add = add + str(row['POSTCODE']) + ' '
            add = remove_nan(add)
            add = clean_address(add)
            targ.append(add)
        return targ


    def remove_counties(self):
        # remove postal county from the input as these have been deprecated
        add2 = self.add2
        i = 0
        for word in add2:
            if word in counties:
                del add2[2+i]
            i += 1
        self.add2 = add2
        return True

    def extract_pcode(self):
    	# use regex to extract the postcode
        add = self.add2
        add2 = ''
        for x in add:
            add2 = add2 + ' ' + x
        pcode =  re.findall(pcodereg, add2)
        # search adb table - filter to pcode = adbp
        adb = self.adb
        adbp = adb[adb['POSTCODE'] == pcode[0]]
        self.adbp = adbp
        self.add2 = add2
        return True 

    def extract_buildno(self):
        # use regex to get the building number and order when more than one number. 
        add2 = self.add2
        add2 = add2[:-7]
        buildno = []
        buildno.append(re.findall(bnoreg1, add2))
        buildno.append(re.findall(bnoreg2, add2))
        buildno.append(re.findall(bnoreg3, add2))
        buildno2 = []
        buildno2.append(re.findall(bnoreg4, add2))
        buildno2.append(re.findall(bnoreg5, add2))
        buildno2.append(re.findall(bnoreg6, add2))
        b_number = ''
        b_name = ''
        if len(buildno[0]) > 0:
            b_number = buildno[0][0]
        elif len(buildno[0]) == 0 and len(buildno[1]) > 0:
            b_number = buildno[1][0]
        elif len(buildno[0]) == 0 and len(buildno[1]) == 0 and len(buildno[2]) > 0:
            b_number = buildno[2][0]
        if b_number == '':
            if len(buildno2[0]) > 0:
                b_name = buildno2[0][0]
            elif len(buildno2[0]) == 0 and len(buildno2[1]) > 0:
                b_name = buildno2[1][0]
            elif len(buildno2[0]) == 0 and len(buildno2[1]) == 0 and len(buildno2[2]) > 0:
                b_name = buildno[2][0]
        if len(buildno2[0]) == 0 and len(buildno2[1]) == 0 and len(buildno2[2]) == 0 and len(buildno[0]) == 0 and len(buildno[1]) == 0 and len(buildno[2]) == 0:
            # pull a house name because a number of number/letter combo are not working
            add3 = add2.split()
            b_name = add3[0]
        adbp = self.adbp
        if(b_number):
            target = adbp[adbp['BUILDING_NUMBER'] == float(b_number)]
        if(b_name):
            target = adbp[adbp['BUILDING_NAME'] == b_name]
        self.target = target
        return True
    
    def compstring(self):
        # compare string: get number of words that are the same. 
        # this depends on having carried out the same data cleaning on the target addresses as on the input
        addi = self.add2.lower()
        target = self.target
        targa = self.clean_target(target)
        targ = []
        targb = []
        for addt in targa: # target address set
            i = len(addi)
            t = len(addt)
            if i == t: 
                j = 0
                k = 0
                while j < i:
                    if addt[j] == addi[j]:
                        k += 1
                    j += 1
                targ.append(k)
            else:

                if i < t:
                    targb.append(t-i)
                if i > t:
                    targb.append(-(t-i))
        lt = len(targ)
        match = ''
        if lt == 1:
            match = addt
        if lt > 1:
            maxind = targ.index(max(targ))
            match = target.iloc[[maxind]]
        if len(targb) > 0:
            minind = targb.index(min(targb))
            match = target.iloc[[minind]]
        if len(match) > 0:
            self.matchlist.append(match)
        return True

    def matchcounts(self, exlen):
        matches = self.matchlist
        out = open('matchcounts.html', 'w')
        html = ''
        html = html + '<!DOCUMENT html>\n'
        html = html + '<title>Match Counts</title>\n'
        html = html + '<br />'
        html = html + '<h1>Address Match, MHCLG_method, Exeter.</h1>\n'
        html = html + '<br />'
        html = html + '<body>\n'
        html = html + '<table border="1" class="NTLxtab">\n'
        html = html + '<tr style="text-align: right;">\n'
        html = html + '<thead>\n'
        html = html + '<th></th><th> Test run results</th></tr>\n'
        html = html + '</thead> \n'
        html = html + '<tbody> <tr><td> Dataset </td><td> Exeter </td></tr>\n'
        html = html + '<tr><td> Total Records </td><td>' + str(exlen) + '</td></tr>\n'
        html = html + '<tr><td> Matches </td><td>' + str(len(matches)) + '</td></tr>\n'
        html = html + '<tr><td> % matches </td><td>' + str((len(matches)/exlen)*100) + '</td></tr>\n'
        html = html + '</tbody></table>'
        out.write(html)
        out.close()
        print('Matching Complete')
        return True


if __name__ == '__main__':
    match = AddMatch()
    exeter = pd.read_csv('exeter.csv')
    i = 0
    exlen = len(exeter)
    while i < exlen:
        add = getaddress(exeter, i)
        match.clean_add(add)
        match.remove_counties()
        match.extract_pcode()
        match.extract_buildno()
        match.compstring()
        i += 1
    match.matchcounts(exlen)