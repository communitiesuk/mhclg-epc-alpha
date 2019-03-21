---
title: Service providers and data consumers prototype
order: 2
layout: prototypes
---
<h2 class="govuk-heading-m">Service providers and data consumers prototype</h2>

[https://mhclg-epc-alpha-prototype-02.herokuapp.com](https://mhclg-epc-alpha-prototype-02.herokuapp.com)

[Demo access without sign-in](https://mhclg-epc-alpha-prototype-02.herokuapp.com/user?user=demo)

This prototype provides authorised access to a range of services based on the user type, eg service provider, assessor, epc, government, devolved administration or local government. It enables service users to find certificates, assessors and addresses using a smart search with combined filterable results. It makes it quicker for service users to get the information they require and provides consistent results.

This prototype also tested and validated the need for data consumers to filter and access an appropriate level of data based on their level of authorisation.

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

As per the service users prototype, multiple iterations were made to the prototype during the Alpha phase. Changes were made to the different functions, eg the search results were modified to provide filtering and sorting tools based on user feedback. The lodgement of data was investigated, with different GDS patterns used to capture the multiple data capture for a property assessment.

Another aspect that involved revision of this prototype was the provision of separate forms to add and update addresses which was split out from the original version. Again, some 50 plus iterations of this second prototype were deployed to Heroku during the course of the Alpha.
