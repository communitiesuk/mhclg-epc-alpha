const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');
const _ = require('underscore');



// call start page from contomic CMS
router.get('/', function(req, res, next) {
  var contentType='article'
  var contentId='257e91e7-29c2-4f32-8715-e9dab644f96d'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.render('article', { content : JSON.parse(body) });
      } else {
        res.redirect('/error');
      }
  });
});


router.get('/error', function(req, res, next) {
  var today = moment(Date.now()).format('YYYY-MM-DD')
  var tokenCreatedDate = moment(process.env.CONTOMIC_ACCESS_TOKEN_DATE, 'DD/MM/YYYY') 
  var tokenExpiryDate = moment(tokenCreatedDate).add(30, 'days').format('YYYY-MM-DD')

  if (moment(today).isAfter(tokenExpiryDate)){
    res.render('error', { content : {error: {message: "Contomic trial expired"}}});
  } else if (!process.env.CONTOMIC_ACCESS_TOKEN_DATE){
  	res.render('error', { content : {error: {message: "CONTOMIC_ACCESS_TOKEN_DATE missing"}}});
  } else {
	res.render('error', { content : {error: {message: "Internal server error"}}});
  }
});



////////////////////////////////////////////////////////////////////////////
//
//  AUTHORISED USERS
//
////////////////////////////////////////////////////////////////////////////

router.get('/start', function(req, res, next) {
  var contentType='service-start';
  var contentId='42da62eb-7944-4ed1-9cb2-326f3c192781';
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.render('service-start', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
});



router.get('/search', function(req, res, next) {
  var contentType='find-a-report-step'
  var contentId='c6a91d55-8cfe-46a6-83fb-3b875ea9e324'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.render('auth/search', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        //console.log(error);
        res.redirect('/error');
      }
  });
});


router.get('/results', function(req, res, next) {

  if(req.session.data['search-field']){
    // pull in dummy data loaded from static file via server.js
    // arrays fr addresses, certificates and assessors
    var str = req.session.data['search-field'];
    var response = {};
    // set some empty arrays for zero count

    response.addresses = [];
    response.certificates = [];
    response.assessors = [];
    
    // base64 encode the assessor ref num
    for ( var i=0; i<req.app.locals.smartResults.assessors.length; i++){
      var base = Buffer.from(req.app.locals.smartResults.assessors[i]['number']).toString('base64')
      req.app.locals.smartResults.assessors[i].base64ref = base;
    }
    // create fake reference for dummy data
    for ( var i=0; i<req.app.locals.smartResults.certificates.length; i++){
      var base = Buffer.from("0000_" +i).toString('base64');// has to be a string...
      req.app.locals.smartResults.certificates[i].reference = base;
    }

    var sort = 'name_desc';
    if(req.session.data['sortBy']){
      sort = req.session.data['sortBy'];
    }

    var checkboxes = [ 'certificates', 'assessors', 'addresses' ];
    // todo refactor this to make more sense
    // get filter type from original search: if its 'all' then use all three types
    if(req.session.data['filter-type']){
      if(req.session.data['filter-type']!== 'all'){
        checkboxes = req.session.data['filter-type'];
      }
    }

    var total = 0;
    var filterType = {};

    // loop through each group by type from the raw data
    // if selected, add to response
    // change sort order if required
    _.each(checkboxes, function (element, index, list) {
        // console.log( 'Element: ' + element + ', ' + 'Index: ' + index + ', ' + 'List Length: ' + list.length);
        var output = req.app.locals.smartResults[element];
        var sortedOutput;

        if (sort==='name_desc'){
          //console.log('sort name down');
          sortedOutput = _.sortBy(output, 'name').reverse();
        } else if (sort==='name_asc'){
          //console.log('sort name up');
          sortedOutput =_.sortBy(output, 'name');

        } else if (sort==='number_desc'){
          //console.log('sort number down');
          sortedOutput =_.sortBy(output, 'number').reverse();

        } else if (sort==='number_asc'){
          //console.log('sort number_asc up');
          sortedOutput =_.sortBy(output, 'number');

        }
        response[element] = sortedOutput;
        filterType[element] = true;
    });

    // set the page tab anchor
    var anchor = req.session.data['anchor'];

    // certificate
    if(str.length>20){
      response.addresses = [];
      response.certificates = [ response.certificates[Math.round(Math.random()*response.certificates.length)] ];
      // show 1 random assessor
      response.assessors = [ response.assessors[Math.round(Math.random()*response.assessors.length)] ];
      anchor = "certificates";
    }else if(str.length>8 && str.length<20){ // ASSESSOR : 1 assessor and multiple certificates
      response.addresses = [];
      //response.certificates = response.certificates;
      response.assessors = [ response.assessors[Math.round(Math.random()*response.assessors.length)] ];
      anchor = "assessors";
    }else if(str.length<=8){ // postcode so all results
      //response.addresses = response.addresses;
      //response.certificates = response.certificates;
      //response.assessors = response.assessors;
      anchor = "all";
    }

    // if there is a tab selected already
    if(req.session.data['anchor']){
    	anchor = req.session.data['anchor']
    }
    
    total = response.addresses.length + response.certificates.length + response.assessors.length;
    response.filterType = filterType;

    res.render('auth/results', {
      response: response,
      anchor: anchor,
      count:total   
    });
              
  }else{
    res.send('no data');
  }
});



router.get('/certificate/:reference', function(req, res) {

	//console.log(req.params.reference);
  var certHash = req.params.reference;
  // convert back from base64
  var ref  = Buffer.from(certHash, 'base64').toString();
  // and extract the number at the end
  ref = ref.split("_")[1];

	//console.log('got ref ' +ref);
	// store as an array
	var filtered = [ req.app.locals.smartResults.certificates[ref] ];

	//there is only one result
	var idx = 0;
	//console.log(filtered);
	// add dummy data
	  filtered[idx]['address'] = '';
    displayDate = '';
    filtered[idx]['property-type'] = 'Fake Property';
    filtered[idx]['total-floor-area'] = '200';
    filtered[idx]['transaction-type'] = 'Commercial';
    filtered[idx]['current-energy-rating'] = 'G';
    filtered[idx]['potential-energy-rating'] = 'E';
    filtered[idx]['current-energy-efficiency'] = 19;
    filtered[idx]['potential-energy-efficiency'] = 51;


  //assume a filtered array with only a single property result
  var displayDate = moment(filtered[idx]['lodgement-date']).format("Do MMMM YYYY");

  // hard code style pixel offsets for now
  // used to position the rating pointed in the chart
  var step = 35;
  var offset = {};
    offset['A'] = 0;
    offset['B'] = step;
    offset['C'] = 2*step;
    offset['D'] = 3*step;
    offset['E'] = 4*step;
    offset['F'] = 5*step;
    offset['G'] = 6*step;

  var property = {
    address: filtered[idx]['address'],
    date: displayDate,
    propertyType: filtered[idx]['property-type'],
    floorArea: filtered[idx]['total-floor-area'],
    transactionType: filtered[idx]['transaction-type'],
    currentRating: filtered[idx]['current-energy-rating'],
    potentialRating: filtered[idx]['potential-energy-rating'],
    currentEfficiency: filtered[idx]['current-energy-efficiency'],
    potentialEfficiency: filtered[idx]['potential-energy-efficiency'],
    currentPositionStyle: "top: " + offset[ filtered[idx]['current-energy-rating'] ] +"px; left:280px;",
    potentialPositionStyle: "top: " + offset[ filtered[idx]['potential-energy-rating'] ] +"px; left:350px;",
    costs:[
      {energyType: "Lighting", currentCost:"£ "+filtered[idx]['lighting-cost-current'], futureCost: "£ "+filtered[idx]['lighting-cost-potential']},
      {energyType: "Heating", currentCost:"£ "+filtered[idx]['heating-cost-current'], futureCost: "£ "+filtered[idx]['heating-cost-potential']},
      {energyType: "Water", currentCost:"£ "+filtered[idx]['hot-water-cost-current'], futureCost: "£ "+filtered[idx]['hot-water-cost-potential']}
    ],
    history:[
      {date:"2015", event:"Current EPC Certificate", rating:"C", assessmentType:"RdSAP assessment"},
      {date:"2006-2015", event:"PC Certificate issued", rating:"D", assessmentType:"RdSAP assessment"},
      {date:"2006", event:"First certificate issued", rating:"", assessmentType:""}
    ]
  };
  res.render('auth/certificate', {
    data: property
  });

});


router.get('/assessor/:reference', function(req, res) {
  // dummy assessor data

  var certHash = req.params.reference;
  // convert back from base64
  var accredition  = Buffer.from(certHash, 'base64').toString();

  var results = {
    assessor:{
        name:"Barbara Steele",
        accredition: accredition,
        "Company name": "Robert Knight Ltd",
        "Postcode coverage": "WC1V",
        "Contact address": "25 Krajcik Junctions",
        "Email": "jared_lamb@gmail.com",
        "Phone number": "21-188-9870",
        "Website": "robertknight.com",
        "Certificate types": "EPC 3; EPC 4"
      },
      scheme:{
        "Contact address": "549 Toni Glens",
        "Email": "enquires@test1.co.uk",
        "Phone number": "421-188-9870",
        "Website": "test1.co.uk"
      }
    };

  res.render('auth/assessor', {
    results: results
  });
});




////////////////////////////////////////////////////////////////////////////
//
//  LODGEMENT
//
////////////////////////////////////////////////////////////////////////////
var sectionTitles = [
	'Property Details',
	'Property Description',
	'Dimensions',
	'Conservatory',
	'Walls',
	'Roofs',
	'Floors',
	'Main Building',
	'Openings',
	'Ventilation & Cooling',
	'Lighting',
	'Water Heating',
	'New Technologies',
	'Recommendations',
	'Addenda',
	'Outstanding Photos',
	'Supporting Notes',
	'Results Overview',
	'Input Summary'
	];

router.get('/lodgement', function(req, res, next) {

/*
  var contentType='service-start';
  var contentId='42da62eb-7944-4ed1-9cb2-326f3c192781';
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.render('lodgement/index', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
*/

	res.render('lodgement/index', { 
		sectionTitles: sectionTitles
	});

});


router.get('/accordian', function(req, res, next) {
	res.render('lodgement/accordian', {
		sectionTitles: sectionTitles
	});
});

// example left nav pages
router.get('/details', function(req, res, next) {
	res.render('lodgement/propertyDetails', { 
		sectionTitles: sectionTitles,
		pageIndex: 0	// pass a page index to set page title, prev and next pages
	});
});


router.get('/description', function(req, res, next) {
	res.render('lodgement/propertyDescription', { 
		sectionTitles: sectionTitles,
		pageIndex: 1	// pass a page index to set page title, prev and next pages
	});
});

var recommends = [
	'Loft insulation',
	'Flat roof insulation',
	'Room-in-roof insulation',
	'Cavity wall insulation',
	'Solid wall insulation',
	'Floor insulaiton (solid floor)',
	'Hot water cylinder insulation',
	'Draught proofing',
	'Low energy lighting',
	'Cylinder thermostat',
	'Heating controls for wet central heating',
	'Upgrade boiler, same fuel',
	'Change heating to gas condensing boiler (fuel switch)',
	'Flue gas heat recovery in conjunction with new boiler',
	'Solar water heating',
	'Heat recovery system for mixer showers',
	'Double glazed windows',
	'Insulated doors',
	'Solar photovoltaic panels',
	'Wind turbine'
];
router.get('/recommends', function(req, res, next) {
	var options = ['Recommended', 'Not applicable', 'Already installed'];
	var colours = ['#006435', '#bfc1c3', '#6f777b'];
	var response = [];
	var colour = [];

	for ( var i=0;i<recommends.length; i++){
		var ran = Math.random();
		var ref = 2;
		if (ran<0.7){
			ref = 1;
		}
		if (ran<0.4){
			ref = 0;
		}
		response.push(options[ref]);
		colour.push(colours[ref]);
	}
	res.render('lodgement/recommends', { 
		sectionTitles: sectionTitles,
		recommends: recommends,
		response: response,
		colour: colour,
		pageIndex: 1	// pass a page index to set page title, prev and next pages
	});
});


module.exports = router
