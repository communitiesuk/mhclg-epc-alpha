import pymongo
import json
# connection to mongo atlas.  
# mongodb+srv://nigel_nb:<BigRock5793!>@notbinaryepc0-d34bg.mongodb.net/test?retryWrites=true
from pymongo import MongoClient

client = MongoClient('localhost', 27017)

db = client.test_database 

collection = db.test.collection

data = open('data.txt').read()
post = json.loads(data)

posts = db.posts
post_id = posts.insert_one(post).insert_id
print(post_id)