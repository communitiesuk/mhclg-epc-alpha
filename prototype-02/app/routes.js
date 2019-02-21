const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');
const _ = require('underscore');


var links = [
  {},
  {title:'Find a certificate', copy:'Find an EPC (Energy Performance Certificate) using the property\'s postcode.', link:'https://mhclg-epc-alpha-prototype-01.herokuapp.com/find-a-report'},
  {title:'Find an assessor', copy:'Find an assessor using postcode, assessor number or certificate reference.', link:'https://mhclg-epc-alpha-prototype-01.herokuapp.com/find-an-assessor'},
  {title:'Find address', copy:'Find an address', link:'/search'},
  {title:'Request new address', copy:'Request new address', link:'/new-address'},
  {title:'Lodge EP data', copy:'Create an EPC certificate for a property', link:'/lodge-data/'},
  {title:'Get EP data', copy:'Download EPC data', link:'#'},
  {title:'Get duplicate address', copy:'Resolve duplicate address data', link:'#'},
  {title:'Add address', copy:'Add a new address', link:'#'},
  {title:'Process opt in/out', copy:'Add or remove a property from public searches', link:'#'},
];


// call start page from contomic CMS
router.get('/', function(req, res, next) {
  res.render( 'auth/index', {});
});


router.get('/user', function(req, res, next) {

  var available = [];
  var renderPath = 'auth/user';
  //check for user in url query string
  if(req.query.user){

    var user = req.query.user.toLowerCase();

    if(user!=='assessor' && user!=='scheme' && user!=='gov' && user!=='local-gov'
      && user!=='epc' && user!=='service-provider' && user!=='bank'){
      user = 'none';
      renderPath='auth/index';
    }

    if(user==='assessor'){
      available = [ links[1], links[2], links[3], links[5], links[6] ];
    }else
    if(user==='scheme'){
      available = [ links[1], links[2], links[3], links[5], links[6] ];
    }else
    if(user==='local-gov'){
      available = [ links[1], links[2], links[3], links[4] ];
    }else
    if(user==='gov'){
      available = [ links[1], links[2], links[3], links[4] ];
    }else
    if(user==='service-provider'){
      available = [ links[1], links[2], links[3], links[4], links[5], links[6], links[7], links[8], links[9] ];
    }else
    if(user==='bank'){
      available = [ links[1], links[2], links[3], links[4], links[5], links[6], links[7], links[8], links[9] ];
    }else
    if(user==='epc'){
      available = [ links[1], links[2], links[3], links[4], links[5], links[6], links[7], links[8], links[9] ];
    }

  }else{
      user = 'none';
      renderPath='auth/index';

  }

  var contentType='article';
  var contentId='257e91e7-29c2-4f32-8715-e9dab644f96d';

  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
    method: "GET",
    headers: {
        'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.render( renderPath, { 
          content : JSON.parse(body),
          user: user,
          links: available,
          users:['assessor','scheme','local-gov','gov','service-provider','epc','bank']
           });
      } else {
        res.redirect('/error');
      }
  });
});


router.get('/error', function(req, res, next) {
  var today = moment(Date.now()).format('YYYY-MM-DD');
  var tokenCreatedDate = moment(process.env.CONTOMIC_ACCESS_TOKEN_DATE, 'DD/MM/YYYY');
  var tokenExpiryDate = moment(tokenCreatedDate).add(30, 'days').format('YYYY-MM-DD');

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
  var contentType='find-a-report-step';
  var contentId='c6a91d55-8cfe-46a6-83fb-3b875ea9e324';

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
  var str;

  if(req.query.q){
    str = req.query.q.toLowerCase();
  }
/*
  if(req.session.data['search-field']){
    str = req.session.data['search-field'];
  }*/


    // pull in dummy data loaded from static file via server.js
    // arrays from addresses, certificates and assessors
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
    if(str){
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
      total = response.addresses.length + response.certificates.length + response.assessors.length;
    
    }else{

    }

    // if there is a tab selected already
    if(req.session.data['anchor']){
      anchor = req.session.data['anchor']
    }
    
    response.filterType = filterType;

    res.render('auth/results', {
      response: response,
      anchor: anchor,
      count:total   
    });
              
/*  }else{
    res.send('no data');
  }*/
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
  var accreditation  = Buffer.from(certHash, 'base64').toString();

  var filtered = _.filter(req.app.locals.smartResults.assessors, function(item) {
    return (accreditation === item['number']);
  });

	var item = filtered[0];
	var scheme = req.app.locals.smartResults.schemes[item.scheme-1];
	
  var results = {
    assessor:{
        name:item.name,
        "accredition number": item.number,
        "Company name": scheme.name,
        "Postcode coverage": item['postcode coverage'].join(' '),
        "Contact address": item.address,
        "Email": scheme.email,
        "Phone number": item.telephone,
        "Website": scheme.website,
        "Certificate types": scheme['certificate types'].join('; ')
      },
      scheme:scheme
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



/*
router.get('/lodge-data', function(req, res, next) {
  var contentType='service-start';
  var contentId='42da62eb-7944-4ed1-9cb2-326f3c192781';
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.render('lodge-data/index', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
  res.render('lodge-data/index', { 
    sectionTitles: sectionTitles
  });

});
*/


router.get('/accordian', function(req, res, next) {
	res.render('lodge-data/accordian', {
		sectionTitles: sectionTitles
	});
});


// example left nav pages
router.get('/details', function(req, res, next) {
  res.render('lodge-data/propertyDetails', { 
    sectionTitles: sectionTitles,
    pageIndex: 0  // pass a page index to set page title, prev and next pages
  });
});


// example left nav pages
router.get('/lodge-data', function(req, res, next) {
	res.render('lodge-data/propertyDetails', { 
		sectionTitles: sectionTitles,
		pageIndex: 0	// pass a page index to set page title, prev and next pages
	});
});


router.get('/description', function(req, res, next) {
	res.render('lodge-data/propertyDescription', { 
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
	'Floor insulation (solid floor)',
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
	var response = [];

	for ( var i=0;i<=recommends.length; i++){
		var ran = Math.random();
		var ref = 2;
		if (ran<0.7){
			ref = 1;
		}
		if (ran<0.3){
			ref = 0;
		}
		response.push(options[ref]);
	}
	res.render('lodge-data/recommends', { 
		sectionTitles: sectionTitles,
		recommends: recommends,
		response: response,
		pageIndex: 2	// pass a page index to set page title, prev and next pages
	});
});


router.get('/overview', function(req, res, next) {
	//there is only one result
	var idx = 0;
	var filtered =[];
	filtered[idx] = {};
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
  var displayDate = moment(filtered[idx]['lodge-data-date']).format("Do MMMM YYYY");

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
  	reference: '1234-5678-9012-3456-7890',
  	rrn:'7189c25a-91d7-4b71-90fe-aa4578c1406b',
  	uprn:'6137522468',
    address: '16 St John\'s Business Park, Lutterworth, Leicestershire, LE17 4HB',
    transactionType: 'Marketed sale',
    processDate: '02/03/2017',
    current_SAP_Rating: '19 G',
    current_EI_Rating: '21 F',
    potential_SAP_Rating: '51 E',
    potential_EI_Rating: '52 E',
    current_energy_efficiency: 19,
    current_energy_rating: 'G',
    potential_energy_efficiency: 51,
    potential_energy_rating: 'E',
    emissions: Math.round(Math.random()*1000)/100 + ' tonnes',
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

  var options = ['Recommended', 'Not applicable', 'Already installed'];
	var response = [];

	for ( var i=0;i<recommends.length; i++){
		var obj = {};
		var ran = Math.random();
		var ref = 2;
		if (ran<0.7){
			ref = 1;
		}
		if (ran<0.3){
			ref = 0;
		}
		obj.recommends = recommends[i];
		obj.option = options[ref];
		obj.savings = '£ ' + Math.round(Math.random()*100)*10;
		obj.rating = Math.round(Math.random()*60 + 40);

		obj.isGreenDeal = 'Y';
		if( Math.random()>0.5) {
			obj.isGreenDeal = '-';
		}

		response.push(obj);
	}

	res.render('lodge-data/overview', { 
		sectionTitles: sectionTitles,
		//recommends: recommends,
		response: response,
    property: property
	});
});


module.exports = router
