# -*- coding: utf-8 -*-
'''
addmatch.py
Matches a single address against AddressBase, following Peter Hufton's method.  
Author: nigel1@notbinary.co.uk
Created: February 14th 2019, 17:15
To do: 
 
2.  Token matching
3.  Duplicate Tokens
4.  Find set of tokens in both ref. address and input address
5.  Find tokens from reference address matching in input address
6.  Create parent addresses and find parent UPRN 
'''


import pandas as pd
import numpy as np
import re
import psycopg2

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
bnoreg1 = r'([0-9][0-9])'
bnoreg2 = r'([0-9][0-9][A-Za-z])'

def getaddress(exeter, i):
    add = exeter.iloc[i, 1] + ', '
    if not np.isnan(exeter.iloc[i, 2]):
        add = add + exeter.iloc[i, 2] + ', '
    if not np.isnan(exeter.iloc[i, 3]):
        add = add + exeter.iloc[i, 3] + ', '
    add = add + exeter.iloc[i, 4]
    print(add)
    return add

class AddMatch():

    def __init__(self):
        self.adb = pd.read_csv('addressbase.csv', low_memory=False)
        

    def clean_add(self, address):
        # Remove punctuation and capitalize all words.  
        add = address.split()
        print(add)
        add2 = []
        for word in add:
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

    def remove_counties(self):
        # remove postal county from the input as these have been deprecated
        add2 = self.add2
        add2.pop(0)
        add2.pop(0)
        add2.pop(0)
        i = 0
        for word in add2:
            if word in counties:
                del a[2+i]
            i += 1
        self.add2 = add2
        return True

    def extract_pcode(self):
    	# use regex to extract the postcode
        add = self.add2
        add2 = ''
        for x in add:
            add2 = add + ' ' + x
        pcode =  re.findall(pcodereg, add2)
        print(add2)
        print(pcode)
        # search adb table - filter to pcode = adbp
        adb = self.adb
        adbp = adb[adb['POSTCODE'] == pcode]
        self.adbp = adbp
        self.add2 = add2
        return True

    def extract_buildno(self):
        # use regex to get the building number and order when more than one number. 
        add2 = self.add2
        buildno = re.findall(bnoreg1, add2)
        buildno2 = re.findall(bnoreg2, add2)
        conn = self.c_adb
        cursor = self.adbcur
        adbp = self.adbp
        if len(buildno) >=1:
            adbpb = adbp[adbp['BUILDING_NUMBER'] == buildno]
        if len(buildno2) >= 1:
            adbpb2 = adbp[adbp['BUILDING_NAME'] == buildno2]
        if len(adbpb) > 0 and len(adbpb2) == 0:
            target = adbpb
        elif len(adbpb) == 0 and len(adbpb2) > 0:
            target = adbpb2
        else:
            target = pd.concat(adbpb, adbpb2)
        self.target = target
        return True
    
    def compstring(self):
        # compare string: get number of words that are the same. 
        # this depends on having carried out the same data cleaning on the target addresses as on the input
        addi = self.add2
        target = self.adb
        targ = []
        for addt in target: # target address set
            i = len(addi)
            t = len(addt)
            if i == t: 
                j = 0
                k = 0
                while j < i:
                    if addt[j] == addi[j]:
                        k += 1
                targ.append(k)
        lt = len(targ)
        if lt == 1:
            match = addt
        if lt > 1:
            maxind = values.index(max(targ))
            match = target.iloc[[maxind]] 
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
