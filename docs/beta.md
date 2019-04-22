---
layout: two-thirds
title: Beta Requirements
---

The Energy Performance of Buildings (EPB) Registers Alpha team has spent 10 weeks investigating the user needs, business and technology requirements and associated issues related to moving to a new delivery model for the service. From the outset the hypothesis has been that the current service and technology is insufficiently flexible or adaptable to meet the current/future needs of MHCLG (and its users). Additionally the current platform is considered to be ageing and expensive.

This hypothesis has been partially proven - though perhaps not to the extent that the Discovery and previous intelligence had insinuated. The platform is costly, based on a set of decade old architectural decisions, not ’cloud’ based and is certainly lacking recent UX attention. We agree it should be replaced. However, it is running on reasonably recent versions of the Oracle software and in most cases on relatively well-specified and up-to-date hardware. It is stable and reliable, has made strides towards using more modern standards and the core of the service is trusted by users.

At its core the current architectural model is based on solid foundations and ourrecommended approach to move to the cloud is an evolution (and simplification) rather than major revolution. 

Where the current service particularly fails users is in relation to emerging needs - particularly in relation to access to data. At almost every touchpoint (Assessors, Schemes, Government, Industry, Open Data community) there are well articulated use cases for better access to the data. To some extent the current service has been unable to respond to these emerging demands because of tactical choices it has had to make throughout the long life of the service but it has become a cause of frustration for many stakeholders.



<h3 class="govuk-heading-m">The Register</h3>


Based on understanding gained of the current implementation, data formats and structure of the register, it is recommended that, providing the policy and legal framework allow, the current contents of the register be archived as-is (in order to meet the need to retain information unchanged). 

Current register entries can then be extradited, transformed, cleansed and loaded in the new implementation according to current standards. This would include extracting image data to secure, durable object storage and moving from XML to JSON as a data format, in line with government and industry practice.

Separating file storage from lodgement data will significantly reduce database size and can be expected to improve both system performance and cost of storage. Simplifying the implementation in this way is likely to improve the flexibility of the system to adapt to future requirements..

Based on experience of previous format transitions of long-term data stores it is important to ensure the register is fully translated at the outset in order to mitigate the cost, complexity and operational risks of dual-running with parallel data models.

This approach ensures existing register data are preserved in original format, whilst allowing the data set as a whole to transition to newer formats and benefit from advances in database and storage technology now commonly on use by government and industry.


<h2 class="govuk-heading-m">Data warehousing</h2>



Reporting capabilities such as those traditionally provided by a data warehouse can, with modern approaches, now typically be provided by authenticated APIs. 

Approaches such as event-based architectures and highly scalable and performant petabyte-scale cloud databases mean that needs can typically be met without a dedicated data warehouse solution. Whilst clear design and disciplined data governance are still essential, commodity cloud solutions are now able to handle the levels of scale and performance required.

Making use of solutions managed by cloud vendors will enable benefit to be derived from ongoing industry advances and improvement in the underlying platforms and technologies.


<h2 class="govuk-heading-m">Code</h2>


Following assessments by both MHCLG architecture and the alpha team it is recommended that the current codebase not be migrated. 

Due to the age of the current codebase and coupling to the underlying database technology, the recommended approach is to “leave the code and take the learning”. Based on experience it will be cheaper in the short term and more sustainable, supportable and maintainable over the medium to long term to implement using modern approaches and technologies. 

This will enable MHCLG to benefit from advances in the technology industry as a whole.

