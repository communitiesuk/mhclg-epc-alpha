---
title: Address Index
order: 2
layout: addressPage
---
**Address Index.** 

**Address Problems in the EPC.**  
In the current EPC register, there are duplicate addresses for the same property, which are the result of the manual address searching and matching process used by Landmark.  The field in the registry data called the UPRN is in fact the Building Reference Number, unique number assigned by Landmark, and is not the same as the UPRN assigned by local authorities.  
The results of this situation are: 
It is difficult to show the history of certificates for an individual property difficult, if not impossible, and
It is difficult to match the data in the EPC Register to data in other data sets, eg Land Registry, Valuation Office Agency, etc.  

**Address Index as a Solution.** 
The address index will link records representing the same address under a single UPRN.  
In order to link together all data representing a single property within the EPC register, an address matching algorithm will be used to find all the addresses that relate to a single property, with a single UPRN.  An index can then be constructed, containing the following fields: 
UPRN: The Universal Property Reference Number, as assigned by Ordnance Survey / Geoplaces, which represents a single property. Where duplicate addresses for a single property are present in the register, there may be more than one instance of a UPRN.
UDPRN - the Post Office Universal Delivery Point Number.  This is assigned to buildings, but not subdivisions of buildings.  There may be multiple UPRNs associated with a UDPRN. 
BRN - Building Reference Number: the proxy UPRN assigned by Landmark.  For every unique address (including different formats of the same address) in the register, there will be a unique BRN.  This is called the UPRN in the current register.   
ID - the ID of the record in the register; if the register is converted to JSON and stored in MongoDB, could be the id assigned to the record when it is lodged in the MongoDB collection. 
We recommend using the Ordnance Survey Address Base dataset for the address and UPRN matching.  According to Neill Silley and Nick Griffith from Geoplaces, by late summer there should be new OS data products, including daily updates from the LLPG, which should mean that the time between lodging an EPC and associating it with an UPRN.   
Following trials documented elsewhere, we recommend using an address matching algorithm based on that developed by Peter Hufton, as this will provide a single method across the department.  

**Benefits of Using an Address Index.** 
This structure will allow the register to be queried on the basis of the UPRN, allowing linking to other datasets, and at the same time would allow for the (correct) UPRN to be added to the register after a certificate is lodged, if it is not available when required.
Through the addition of other id’s, the Address Index could become an ongoing link between the various datasets relating to buildings and properties held in the department.  
