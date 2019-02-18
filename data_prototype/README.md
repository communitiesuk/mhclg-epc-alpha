Prototype Data Store for MHCLG EPC.  

Design has four layers. 
1.  Registry Layer: JSON records in a mongoDB database.  Immutable 
2.  Index Layer: mutable.  Place for address cleaning, addition of UPRN, and other datacleaning as necessary.  
3.  AddressBase: linked through Address Matching Algorithm, for data cleaning and UPRN addition. 
4.  Queries / query builders to export data for team, MHCLG, BEIS, DEFRA, other government, open, and other uses.  

Requirements: 
x1.  Needs some dummy data in HJSON format.  I will take the example SAP domestic data record in xml as the basis for this.  A script in this folder will creates the data - generate.py

x2.  MongoDB instance set up on mongo atlas - NotBinaryEPC0, and local on nigel.lenovo.  

x3.  Connection scripts written using pymongo: mong_loadL.py for local and mong_loadA.py for Atlas.  

4.  Address Matching - 
4.  Create a view - but that can not be written to. - can we store the view somewhere? And automate that?  Example code to be written - this could be a simple copy from the registry collection to the cleaned collection.  

5.  Create a "cleaned collection" within mongoDB - a copy of the data which has the cleaned addresses and rUPRN in it. 

6.  Create an index - containing rUPRN matching to LMK_key.   

7.  
6.  Run timed queries from mongo into second store... 

