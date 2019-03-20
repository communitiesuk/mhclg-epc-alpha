# Prototype 01: Service Users

This is the folder for the first EPC Alpha prototype.

## Production
**Do not use in production!**
This kit has been designed for prototyping, not production code. Take only the lessons learned and your designs into a production system.

## Installation
To run this prototype locally, download this repo and install the files in a _working folder_.
From the `prototype-01` folder, run `npm install` to update the node modules

## Development
Run `npm run start` to build the site, run a local server and watch file changes.
The site is served at [http://localhost:3000](http://localhost:3000)

To stop the service use `ctrl+c`


## Deployment
For this project, a Heroku app has been created at:
[https://mhclg-epc-alpha-prototype-01.herokuapp.com](https://mhclg-epc-alpha-prototype-01.herokuapp.com)

From the working folder push changes to Heroku via 
`git subtree push --prefix prototype-01 heroku master`

## Notes

The prototype was built using the [GDS Prototype Kit](https://govuk-prototype-kit.herokuapp.com/docs/tutorials-and-examples).  A set of dummy data (`app/data/auth_user_results.json`) is loaded on the server to populate the search results. Additional example data is set in the `routes.js` file and passed to the actual pages to render them. 
