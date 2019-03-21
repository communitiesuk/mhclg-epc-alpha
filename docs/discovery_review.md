**Addresses: Review of Discovery work on Addresses**

Accurate address matching is fundamental to users' ability to search for the certificates and data they need, and to match updated assessor / certificate data with existing data for the same address.

According to the discovery work done by Valtech, in the second scenario Landmark used manual matching to resolve anomalies, though there is no detail on how this was done.

Address matching is not always straightforward, for a number of reasons:

1. Abbreviations - commonly used in addresses, such as AV or AVE for Avenue, St for Street (or Saint), Rd for Road, etc. From an open source code repository I have retrieved a listing of common abbreviations, and normalise.py converts abbreviations to the full word. 
2. House names - Houses (or flats) may be given names by owners / residents, while they may retain their street number.
3. Spellings - House, street, and postal town names may all be spelled incorrectly.
4. Postcodes - The post code may be typed incorrectly.
5. The fields included in the address will not always be the same - see eg the address fields in Address Base as compared to the EPC register database.  

In order for a piece of mail to be delivered, all that is required is the building number and the post code; matching must take into account the fact that not all data fields need to be filled.

Most of the thinking around UK address matching suggests that a system should start with filtering the data set to be matched into by the postcode; this assumes that the postcode is correct. UK postcodes do not have a single standard format. All postcodes are made up of two /sections, 

the first 'outbound' section, which is of one of the following forms: AA9A, A9A, A9, A99, AA9, AA99; 
the second 'inbound' section, which is always of the format 9AA.

There is a script, pcode_verify.py, which verifies that a postcode is in a valid format (it does not verify that it is an actual postcode, and has not been extensively tested). This, or something similar, should be used to ascertain whether the postcode entered by the assessor is valid.

The Valtech discovery advised using the address parsing method that was developed at the Office for National Statistics, which relies on Conditional Random Fields for labelling the parts of the address prior to matching. This could be a way of getting round the issue of having additional fields (eg dependent thoroughfare) in duplicate copies of the same record. The following methods can also be used:

1. A fuzzy match based on the Levenshtein distance between the new and old addresses;
2. Matching using the libpostal library for parsing and normalising addresses;
3. A phonetic match;
4. A match based on Conditional Random Field Parsing 

A test implementation of each will be developed and tested against a database of addresses.

First pass test implementation of the Levenshtein difference with simple normalisation built; however, the test data I have is not sufficiently “buggy” to be able to draw any conclusions. 
