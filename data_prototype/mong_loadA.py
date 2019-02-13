import pymongo
import json
# connection to mongo atlas.  
# mongodb+srv://nigel_nb:<BigRock5793!>@notbinaryepc0-d34bg.mongodb.net/test?retryWrites=true

client = pymongo.MongoClient('mongodb+srv://nigel_nb:BigRock5793!@notbinaryepc0-d34bg.mongodb.net/test?retryWrites=true')

db = client.test
if db:
	print('connected')

collection = db.test.collection

data = open('data.txt').read()
post = json.loads(data)

posts = db.posts
posts.insert_one(post)

import pprint

pprint.pprint(posts.find_one())