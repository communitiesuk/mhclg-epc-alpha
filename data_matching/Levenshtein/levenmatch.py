# -*- coding: utf-8

import re
import pandas as pd
import numpy as np
from datetime import datetime

NON_ALPHA_RE = re.compile('[^A-Z0-9]+')
POSTCODE_RE = re.compile('^[A-Z]{1,2}[0-9]{1,2}[A-Z]? [0-9][A-Z]{2}$')

def npostcode(pcode):
    """Return a normalised postcode if valid, or None if not."""
    postcode = pcode
    postcode = NON_ALPHA_RE.sub('', postcode.upper())
    postcode = postcode[:-3] + ' ' + postcode[-3:]
    if POSTCODE_RE.match(postcode):
        return True
    else: 
        return False

def normalise(add):
    synonyms = pd.read_csv('synonyms.csv')
    address = add.split()
    for word in address:
        for y in range(len(synonyms.index)):
            if word == synonyms.loc[y, 'from']:
                word = synonyms.loc[y, 'to']
    return address


def levenshtein_distance(a, b):
    """Return the Levenshtein edit distance between two strings *a* and *b*."""
    if a == b:
        return 0
    if len(a) < len(b):
        a, b = b, a
    if not a:
        return len(b)
    previous_row = range(len(b) + 1)
    for k, column1 in enumerate(a):
        current_row = [k + 1]
        for m, column2 in enumerate(b):
            insertions = previous_row[m + 1] + 1
            deletions = current_row[m] + 1
            substitutions = previous_row[m] + (column1 != column2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1] 


def concat_new(df, ptown, i):
    nadd = ''
    if pd.isnull(df.loc[i, 'ADDRESS1']) == False:
        nadd = nadd + df.loc[i, 'ADDRESS1'].upper() + ', '
    if pd.isnull(df.loc[i, 'ADDRESS2']) == False:
        nadd = nadd + df.loc[i, 'ADDRESS2'].upper() + ', '
    if pd.isnull(df.loc[i, 'ADDRESS3']) == False:
        nadd = nadd + df.loc[i, 'ADDRESS3'].upper() + ', '
    nadd = nadd + ptown + ', '
    if pd.isnull(df.loc[i, 'POSTCODE']) == False:
        nadd = nadd + df.loc[i, 'POSTCODE'].upper()
    return nadd 


def concat_adb(adb, j):
    add = ''
    if pd.isnull(adb.get_value(j, 'SUB_BUILDING_NAME')) == False:
        add = add +adb.loc[j, 'SUB_BUILDING_NAME'] + ', '
    if pd.isnull(adb.loc[j, 'BUILDING_NAME']) == False:
        add = add + adb.loc[j, 'BUILDING_NAME'] + ', '
    if pd.isnull(adb.loc[j, 'BUILDING_NUMBER']) == False:
        add = add + str(adb.loc[j, 'BUILDING_NUMBER']) + ', '
    if pd.isnull(adb.loc[j, 'DEPENDENT_THOROUGHFARE']) == False:
        add = add + adb.loc[j, 'DEPENDENT_THOROUGHFARE'] + ', '
    if pd.isnull(adb.loc[j, 'THOROUGHFARE']) == False:
        add = add + adb.loc[j, 'THOROUGHFARE'] + ', '
    if pd.isnull(adb.loc[j, 'DOUBLE_DEPENDENT_LOCALITY']) == False:
        add = add + adb.loc[j, 'DOUBLE_DEPENDENT_LOCALITY'] + ', '
    if pd.isnull(adb.loc[j, 'DEPENDENT_LOCALITY']) == False: 
        add = add + str(adb.loc[j, 'DEPENDENT_LOCALITY']) + ', '
    if pd.isnull(adb.loc[j, 'POST_TOWN']) == False:
        add = add + adb.loc[j, 'POST_TOWN'] + ', '
    if pd.isnull(adb.loc[j, 'POSTCODE']) == False:
        add = add + adb.loc[j, 'POSTCODE']
    return add
    
    
def match(source, new):
    start = datetime.now()
    adb = pd.read_csv(source)
    newdb = pd.read_csv(new)
    ptown = 'EXETER'
    out = open('matches.txt', 'w')
    nos = np.arange(len(newdb))
    newdb['recnos'] = nos
    newdb.reindex(newdb['recnos'])
    for i in range(len(newdb.index)):
        nadd = concat_new(newdb, ptown, i)
        nadd = normalise(nadd)
        pcode = newdb.loc[i, 'POSTCODE']
        print(pcode)
        if npostcode(pcode):
            adb_f = adb[adb['POSTCODE'] == pcode].copy()
            nos = np.arange(len(adb_f))
            adb_f['recnos'] = nos
            adb_f.reindex(labels=nos, index=nos)
            adb_f.to_csv('adb_f.csv')
            levd = {}
            for j in adb_f.index:
                add = concat_adb(adb_f, j)
                levd[j] = levenshtein_distance(nadd, add)
                levdnadd[j] = nadd
                levdadd[j] = add
        print(levd)
        if len(levd) >0:
            match = min(levd, key=levd.get)
            wstr = str(i) + ', ' + str(match)+'\n'
            out.write(wstr)

    out.close()
    end = datetime.now()
    tottime = end - start
    print("Run match...")
    print("time: ", str(tottime))                

if __name__ == "__main__":
    source = 'addressbase.csv'
    new = input('enter name of file to be matched....  ')
    match(source, new)
