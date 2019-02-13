Prototype Data Store for MHCLG EPC.  

Design has four layers. 
1.  Registry Layer: JSON records in a mongoDB database.  Immutable 
2.  Index Layer: mutable.  Place for address cleaning, addition of UPRN, and other datacleaning as necessary.  
3.  AddressBase: linked through Address Matching Algorithm, for data cleaning and UPRN addition. 
4.  Queries / query builders to export data for team, MHCLG, BEIS, DEFRA, other government, open, and other uses.  

Requirements: 
1.  Needs some dummy data in HJSON format.  I will take the example SAP domestic data record in xml as the basis for this.  A script in this folder will creates the data - generate.py

2.  MongoDB instance set up on mongo atlas - NotBinaryEPC0, and local on nigel.lenovo.  

3.  Connection scripts written using pymongo: mong_loadL.py for local and mong_loadA.py for Atlas.  

 