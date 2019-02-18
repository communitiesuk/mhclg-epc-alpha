# -*- coding: utf-8 -*-

'''
Indexer.py
Creates the index layer above the registry. 
Author: nigel@notbinary.co.uk
Created: 15 February 2019 11:00
'''

'''
Needs to be triggered by new certificate being lodged.  
Can we get the change stream from mongo atlas? 
'''

import pymongo
from pymongo import MongoClient
import prettyprint


if __name__ == '__main__':
    client = MongoClient('localhost', 27017)
    change_stream = client.test.collection.watch([
        {'$match': {
            'operationType': {'$in': ['insert', 'replace']}
        }},
        {'$match': {
            'fullDocument.n': {'$gte': 1}
        }}
    ])
    for change in change_stream:
    	''' do what? -
    	take the UPRN from the new record and it's _id and put them in the index
    	What is the index? - what format is it? 
    	'''
    	print(change)


