---
layout: two-thirds
title: Prototypes
---


As a part of this alpha we prototyped and iterated **16 user journeys**; 8 high-level and 8 detailed to meet identified user needs. These user journeys were combined into two core service offerings; one for **service users** and one for **service providers and data consumers**. Research with data consumers validated the requirement for RESTful APIs and JSON (aligned with Government Service Standards), we further validated the usage of APIs to drive the services recommended for GOV.UK by building some of our prototypes on top of the EPB Open Data Service APIs.



## Service users prototype

[https://mhclg-epc-alpha-prototype-01.herokuapp.com](https://mhclg-epc-alpha-prototype-01.herokuapp.com)

This prototype covers public access to the register for public service users. Building on the wireframes from the discovery phase, it provides routes for users to: find an existing report; find an assessor; and opt out (or opt in) to the register. It also includes links to useful additional information about the service.

The prototype was revised based on user feedback and expert review, with the user flow changed to follow GDS patterns. The site design was iterated over consistently during the course of the Alpha phase, with 58 iterations being deployed to Heroku. One idea included in the prototype was the provision of canonical urls for the certificate, including a separate URL for the energy chart in order to allow it to be included directly in third party sites. Another key idea was the removal of the whole opt-in/out flow based on user feedback as this was felt to be unnecessary (an area to explore in beta with policy and legal). Additional improvements suggest but not implemented included a more detailed flow to identify/check assessors; and the combination of commercial and domestic results. 

## Service providers and data consumers prototype

[https://mhclg-epc-alpha-prototype-02.herokuapp.com](https://mhclg-epc-alpha-prototype-02.herokuapp.com)

This prototype provides authorised access to a range of services based on the user type, eg service provider, assessor, epc, government, devolved administration or local government. It enables service users to find certificates, assessors and addresses using a smart search with combined filterable results. It makes it quicker for service users to get the information they require and provides consistent results.  This prototype also tested and validated the need for data consumers to filter and access an appropriate level of data based on their level of authorisation.

The features of this prototype include:
* a smart search facility with the ability to filter/sort results of certificates, assessors or address
* API access
* ability to download build EPC data
* edit own profile
* management of user accounts
* ability to add/edit addresses
* ability to lodge a certificate via the website
* process the opt in/opt out for clients

Other features suggested but not implemented include:
* ability to flag a certificate
* ability to annotated a certificate with a reason for its creation
* a section to provide statistics on the usage and trends within the register
* a more fully featured search to enable advanced filtering of data
* creation of common report eg monthly reports 

As per the service users prototype, multiple iterations were made to the prototype during the Alpha phase. Changes were made to the different functions, eg the search results were modified to provide filtering and sorting tools based on user feedback. The lodgement of data was investigated, with different GDS patterns used to capture the multiple data capture for a property assessment. Another aspect that involved revision of this prototype was the provision of separate forms to add and update addresses which was split out from the original version. Again, some 50 plus iterations of this second prototype were deployed to Heroku during the course of the Alpha.

