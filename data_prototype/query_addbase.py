# -*- coding: utf-8 -*-
'''
Functions for querying addbase - for address matching, 
and other functions.  
This is sample code - will need to be rewritten to make it functional
Author: nigel@notbinary.co.uk
Created: 18 February 2019, 11:00
'''

import psycopg2

try:
	connection = psycopg2.connect(user='',
		                          password='',
		                          host='',
		                          port='5432',
		                          database='addbase')
	cursor = connection.cursor()
	print(connection.get_dsn_parameters(), '\n')

except (Exception, psycopg2.Error) as error:
	print("Error connecting to postgres", error)

finally:
	if(connection):
		cursor.close()
		connection.close()
		print("Postgres connection closed")


try:
    connection = psycopg2.connect(user = "postgres",
                                  password = "pass@#29",
                                  host = "127.0.0.1",
                                  port = "5432",
                                  database = "postgres_db")
    cursor = connection.cursor()
    
    create_table_query = '''CREATE TABLE mobile
          (ID INT PRIMARY KEY     NOT NULL,
          MODEL           TEXT    NOT NULL,
          PRICE         REAL); '''
    
    cursor.execute(create_table_query)
    connection.commit()
    print("Table created successfully in PostgreSQL ")

except (Exception, psycopg2.DatabaseError) as error :
    print ("Error while creating PostgreSQL table", error)

finally:
    #closing database connection.
    if(connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")
