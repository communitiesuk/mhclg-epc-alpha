Levenshtein. 

The Levenshtein distance is defined as the number of changes that are required to change one string to another - or, the number of errors in the spelling of a word that need to be corrected to get the correct word.  
For this exercise we take the address in the new file and calculate the number of changes required to convert it to each of the addresses in the source file with the same postcode.  The addreess that requires the least changes will be 	considered as the match. 

Expected to be the slowest and least accurate method - does not require training or a model, works by iterating through the data. 
