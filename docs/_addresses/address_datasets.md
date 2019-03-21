---
title: Address Datasets
order: 1
layout: addressPage
---

**Recommendations of Address Datasets.**

4 address datasets were considered.

**Notes on Ordnance Survey AddressBase.**

1. Coverage - 28 million Royal Mail postal address records.
2. Contains the UPRN - the main source of this nationally.
3. No abbreviations found in the sample data for Exeter provided.
4. See https://www.ordnancesurvey.co.uk/business-and-government/help-and-support/public-sector/guidance/ - this is a bit beyond me, will need someone with more experience of that sort thing.
5. Updated every six weeks - should be enough.

Contains OS Coordinates and Latitude / Longitude pairs for each address; this would allow for mapping/visualisation in the future.
AddressBase Plus and Premium have additional fields; I have signed up for a (free) Exploration Licence to determine whether this additional data would be of use.

Though I have yet to explore other datasets (PAF, Experian, and Loqate), this appears to be the best option, as it contains the UPRN and is regularly updated. Inclusion of address location information (both OS National Grid and Lat/Long) add extra value.

As part of the work of the Geospatial Commission, the UPRN is due to be made Open Source in the summer of 2019.  As a result, Ordnance Survey are planning to change their data products.  I have been assured by Geoplace that one of the new products will be a daily update of new addresses and UPRNs, which should reduce the time lag between creation of a certificate and the addition of the correct UPRN. 
 

**Notes on Experian Data Quality - Address Validation**

This is the new name for Experian QAS, which was used for address verification in the Landmark EPC system.
Address Validation appears to be online tool;

1. Coverage not stated in data sheet.
2. Contains UPRN - assume these are the 'correct' ones.
3. Unable to see whether addresses are normalised.
4,
5. Update frequency - not sure.

This tool contains a wealth of other data whch is not relevant to this project - project will in effect be paying for Mosaic, company registration numbers, etc.
I'm not convinced that relying on an external tool and externally managed database is a good idea in terms of security and stability of service.




**Notes on Loqate AddressBase.**

Loqate are a reseller of the Ordnance Survey AddresBase product. There is little point in using this service when the project can probably get the same data cheaper directly from the OS.
This is the basis of the Loqate address verification tool.


**Notes on NLPG**

The National Land and Property Gazeteer is managed by GeoPlace, a public sector Limited Liability Partnership between the Local Government Association and the Ordnance Survey.
Each local authority maintains a Local Land and Property registry; these act as a single source of address data in each authority area.  Each of these contributes to the central NLPG. 

The NLPG itself is not available, but provides the single source of truth from which the Ordnance Survey AddressBase product is drawn. 
 


**Conclusion:** 
The OS AddressBase product appears to be the most suitable for the requirements of this project. We need to understand the timelines for EPC creation and for the dissemination of newly assigned UPRNs into the database [trying to find contacts in GeoPlace to meet with for this].  

