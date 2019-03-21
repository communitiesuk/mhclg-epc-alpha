---
title: Addresses
order: 3
layout: prototypes
---
<h2 class="govuk-heading-m">Addresses</h2>


As part of this alpha we researched how addresses are used in the service and how this sits within the wider MHCLG landscape. Assessments are carried out on existing buildings as well as new buildings sometimes on-plan prior to ground being broken.

A bespoke address database has been created and populated over the past 12 years as part of the provisioning and delivery of the EPB service. This address database contains all the addresses where an EPC has been recorded. 

Our research with assessors and scheme representatives identified issues with this bespoke address database primarily around address duplication, data quality and back office processes - specifically the requesting, validating and adding of new addresses. 

Our research with data consumers including MHCLG data analysts identified a lack of linkability of EPC data with other data sets by address - specifically caused by the bespoke unique property reference number not being linked to other standard property reference numbers such as the NLPG’s UPRN (National Land and Property Gazeteer’s Unique Property Reference Number).

We met with a number of MHCLG staff as well as Geoplace and Ordnance Survey to get a better picture of the address lifecycle, data owners and the roadmap around products and services available under Government licences such as the Public Sector Mapping Agreement and how EPB is affected. We tested and validated approaches to address matching to get a better understanding of common challenges and how EPB could be affected.

There are a number of recommended improvements around addresses, over the short term; we recommend improvements to the ‘request a new address’ process required by assessors. Implementing a simpler experience and interface that provides clearer more trustworthy results to assessors - essentially better address search results incorporating a validated base address source such as the NLPG that prevents the unnecessary requesting of new addresses. Additionally cleansing and matching across the existing address database is recommended to sort out the current duplication and associated data quality issues.

The longer term recommendations are for MHCLG to create and provide an address service that enables services to search for an address, request a new address to be added and links addresses across services via an address index. We recognise that linkable addresses and addressing data is a bigger picture conversation that is greater than any one service so these longer term recommendations sit outside of EPB with a view of EPB eventually becoming a consumer of the address service.


<h2 class="govuk-heading-m">Issues</h2>
There are a number of issues with the addresses in the current EPB:
* The Universal Property Reference Number (UPRN) is not always available at the time an energy certificate is produced;
* The address matching system used was largely manual, and took up to 24 hours.  Without the UPRN to link to, this often lead to a single property being represented by more than one address in the index;
* The regulations that govern the operation and management of the register stipulate that once a data record has been lodged it cannot be changed in any way.  This means that even if the UPRN that matches an address becomes available in the future, it cannot be added to the data at a later point in time.

<h2 class="govuk-heading-m">Reason EPB need to create addresses (as exceptions)</h2>

* Using the MHCLG address matching algorithm should find different formats of the same address, and be more accurate than the previous manual method, and so reduce the number of properties with multiple addresses. However, this will not capture all cases. 
* If the address being presented by the Assessor for a new certificate is not found in the register, this could be because the property is a new build or a new subdivision of an existing property, and the address / UPRN has not been added to AddressBase.  
* We have been assured by Geoplace that a daily feed of address and UPRN updates to AddressBase will be available.  The addresses in this feed will cover the ⅔ of local authorities that report daily.  This feed will be of addresses and UPRNs assigned in the last 48 hours, cutting the lead time from a minimum of 6-8 weeks.
* Where an address presented by an Assessor is not found in any current database using accurate address matching, it will be necessary to add it to the database, as an exception, with a unique reference number (Building Reference Number?)
 

<h2 class="govuk-heading-m">Address index approach</h2>

* To associate addresses in the register with a standard UPRN, we suggest building an Address Index layer.
* The Address Index will contain a single record for each address and variant of an address in the register, with their associated Building Reference Numbers (assigned by the EPB system), and UPRNs (assigned from Address Base using address matching). 
* This approach will allow linking of the EPB register to other datasets (through the UPRN), and linking of records within the EPB register which relate to a single physical property.


<h2 class="govuk-heading-m">High-level non-breaking approach to beta</h2>

Can link to architecture etc link to relevant documents/wiki pages

* Register data to be held in a cloud-based no-SQL database, such as Mongo Atlas or DynamoDB. 
* Index Layer and Address Exceptions to be held in a cloud based relational database, such as AWS Aurora, or a hosted Postgres instance.  
* Access to the data through AWS API Gateways, with code logic in serverless functions.  
* All register searches to go through the Address Index layer, so that all historic certificate are properly represented.  
