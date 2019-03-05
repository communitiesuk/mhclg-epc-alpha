const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');
const _ = require('underscore');

// capture the user type login
var user ='';
var availableOptions = [];

var links = [
  {},
  {id:1, title:'Find a certificate', copy:'Find an EPC (Energy Performance Certificate) using the property\'s postcode.', link:'https://mhclg-epc-alpha-prototype-01.herokuapp.com/find-a-report'},
  {id:2, title:'Find an assessor', copy:'Find an assessor using postcode, assessor number or certificate reference.', link:'https://mhclg-epc-alpha-prototype-01.herokuapp.com/find-an-assessor'},
  {id:3, title:'Find address', copy:'Find an address', link:'/search'},
  
  {id:4, title:'Request new address', copy:'Add a new address', link:'/add-address'},
  {id:5, title:'Edit address', copy:'Update company address data', link:'/find-address'},
  
  {id:6, title:'Lodge EP data', copy:'Create an EPC certificate for a property', link:'/lodge-data/'},
  {id:7, title:'Get EP data', copy:'Download EPC data', link:'/get-data'},
  {id:8, title:'Process opt in/out', copy:'Add or remove a property from public searches', link:'https://mhclg-epc-alpha-prototype-01.herokuapp.com/opt-in-opt-out'},
  {id:9, title:'Manage access', copy:'Manage user accounts', link:'/manage-accounts'},
];

// static start page 
router.get('/', function(req, res, next) {
  res.render( 'auth/index', {});
});


router.get('/user', function(req, res, next) {

  
  var renderPath = 'auth/user';

  //check for user in url query string
  if(req.query.user){

    user = req.query.user.toLowerCase();

    if(user!=='assessor' && user!=='scheme' && user!=='gov' 
      && user!=='local-gov' && user!=='local'
      && user!=='service-provider' && user!=='service' && user!=='sp' 
      && user!=='epc' && user!=='bank'){
      user = 'none';
      renderPath='auth/index';
    }


    if(user==='assessor'){
      availableOptions = [ links[1], links[2], links[3], links[4], links[5] ];
    }else
    if(user==='scheme'){
      availableOptions = [ links[1], links[2], links[3], links[4], links[5] ];
    }else
    if(user==='local-gov' || user==='local'){
      user = 'local-gov';
      availableOptions = [ links[1], links[2], links[3], links[7] ];
    }else
    if(user==='gov'){
      availableOptions = [ links[1], links[2], links[3], links[7] ];
    }else
    if(user==='service-provider'|| user==='service'|| user==='sp'){
      user = 'service-provider';
      availableOptions = [ links[1], links[2], links[3], links[4], links[5], links[6], links[7], links[8], links[9] ];
    }else
    if(user==='bank'){
      availableOptions = [ links[7] ];
    }else
    if(user==='epc'){
      availableOptions = [ links[1], links[2], links[3], links[4], links[5], links[6], links[7], links[8] ];
    }

  }else{
      user = 'none';
      renderPath='auth/index';
  }


  res.render( renderPath, { 
      user: user,
      links: availableOptions,
      users:['assessor','scheme','local-gov','gov','service-provider','epc','bank']
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
        res.render('auth/search', {
          links: availableOptions,
          content : JSON.parse(body)
        });
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
  var certHash = req.params.reference;
  // convert back from base64
  var ref  = Buffer.from(certHash, 'base64').toString();
  // and extract the number at the end
  ref = ref.split("_")[1];

	// store as an array
	var filtered = [ req.app.locals.smartResults.certificates[ref] ];

	//there is only one result
	var idx = 0;

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
    filtered[idx]['lighting-cost-current'] = Math.round(Math.random()*100) * 10;
    filtered[idx]['heating-cost-current'] = Math.round(Math.random()*100) * 10;
    filtered[idx]['hot-water-cost-current'] = Math.round(Math.random()*100) * 10;
    filtered[idx]['lighting-cost-potential'] = Math.round( filtered[idx]['lighting-cost-current'] * Math.random() );
    filtered[idx]['heating-cost-potential'] = Math.round( filtered[idx]['heating-cost-current'] * Math.random() )
    filtered[idx]['hot-water-cost-potential'] = Math.round( filtered[idx]['hot-water-cost-current'] * Math.random() );


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
      {date:"2009", event:"PC Certificate issued", rating:"D", assessmentType:"RdSAP assessment"},
      {date:"2006", event:"First certificate issued", rating:"D", assessmentType:"Not known"}
    ],
    documents:[
      {date:"23 January 2015", address:"Flat 3, 3 Leonora Tyson Mews, London, SE21 8GA", rating:"C", assessmentType:"RdSAP assessment", type:"PDF, 210kb, 5 pages"},
      {date:"8 May 2009", address:"Flat 3, 3 Leonora Tyson Mews, Croxted Road, London, SE21 8GA", rating:"D", assessmentType:"RdSAP assessment", type:"PDF, 207kb, 5 pages"},
      {date:"1 October 2006", address:"3, 3 Leonora Tyson Mews, London, SE21 8GA", rating:"D", assessmentType:"", type:"PDF, 190kb, 4 pages"}
    ]
  };

  res.render('auth/certificatePlus', {
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


router.get('/find-address', function(req, res) {

  res.render('auth/find-address', {
    links: availableOptions
  });
});

/*
router.get('/add-address', function(req, res) {

  res.render('auth/add-address', {
    links: availableOptions
  });
});
*/

router.get('/add-address', function(req, res) {

  res.render('auth/add-address', {
    title:"Add",
    links: availableOptions
  });
});



router.get('/edit-address', function(req, res) {
  var address = ["","","",""];
  var companyName = "";
  if(req.session.data.address){
    address = req.session.data.address.split(', ');
  }
  if(req.session.data['address-company-name']){
    companyName = req.session.data['address-company-name'];
  }

  res.render('auth/add-address', {
    title:"Edit",
    links: availableOptions,
    address: {
      'company-name': companyName,
      'name': address[0],
      'number': address[1],
      'street': address[2],
      'postcode': address[3]
    }
  });

});


router.get('/confirm-address', function(req, res) {
  //get form fields and stitch them together
  var companyName = "";
  if (req.session.data['address-company-name']){
    companyName = req.session.data['address-company-name'] + ', ';
  }
  var name = req.session.data['address-name'];
  var number = req.session.data['address-number'];
  var street = req.session.data['address-street'];
  var postcode = req.session.data['address-postcode'].toUpperCase();
  var address = companyName + name + ', ' + number + ', ' + street + ', ' + postcode;

  res.render('auth/confirm-address', {
    links: availableOptions,
    address: address
  });
});


router.get('/select-address', function(req, res) {
  var list = [
      { address: "Flat 1, 28, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 2, 28, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 3, 28, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 4, 28, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 5, 28, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 7, 28, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 8, 28, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 1, 32, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Second Floor Flat, 40, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 1, 42, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 3, 42, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 5, 42, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 6, 42, Great Smith Street, SW1P 3BU", ref:""},
      { address: "Flat 8, 42, Great Smith Street, SW1P 3BU", ref:""}
  ];

  res.render('auth/select-address', {
    links: availableOptions,
    result: {addresses: list}
  });
});


// use link pattern 'filter-xxxx' where xxxx is the property being filtered
// create a new route for each page
// date, location, assessor, scheme, rating, propType, propSize, reason, certType, status, rooms
// use a generic filter-checkbox template to render most pages
var filters = [
  {id:1, ref:'date', title:"Date range", link:"filter-date", results:'Nothing added'},
  {id:2, ref:'location', title:"Location", link:"filter-location", results:'Nothing added'},
  {id:3, ref:'assessor', title:"Assessor", link:"filter-assessor", results:'Nothing added'},
  {id:4, ref:'schemes', title:"Scheme", link:"filter-scheme", results:'Nothing added'},
  {id:5, ref:'rating', title:"Rating", link:"filter-rating", results:'Nothing added'},
  {id:6, ref:'propType', title:"Property type", link:"filter-prop-type", results:'Nothing added'},
  {id:7, ref:'propSize', title:"Property total size", link:"filter-prop-size", results:'Nothing added'},
  {id:8, ref:'reason', title:"Lodgement reason", link:"filter-reason", results:'Nothing added'},
  {id:9, ref:'certType', title:"Certificate Type", link:"filter-type", results:'Nothing added'},
  {id:10, ref:'status', title:"Status", link:"filter-status", results:'Nothing added'},
  {id:11, ref:'rooms', title:"Number of rooms", link:"filter-rooms", results:'Nothing added'}
];

var filteredArray = [];


router.get('/filter', function(req, res, next) {
  // get returned data
  // console.log(req.session.data);

  //populate filter list with returned values
  for (item in req.session.data){
    // find filter with the matching ref value
    var refObj = _.findWhere(filters, {
        ref: item
      })

    if(refObj){
      refObj.results = req.session.data[item];
    }
  
    //console.log(item, refObj);
  }

  // extract the range of sizes for 
  var minSize = 0;
  var maxSize = 10000;
  
  // get range for size
  if(req.session.data['size-from']){
    minSize = req.session.data['size-from'];
  }
  if(req.session.data['size-to']){
    maxSize = req.session.data['size-to'];
  }
  filters[6].results = minSize + ' to ' + maxSize +" sq ft";


  // TODO: Extract this function out and check for query string for each page?
  // check for user in url query string
  if(req.query.user){
    user = req.query.user.toLowerCase();

    if(user!=='assessor' && user!=='scheme' && user!=='gov' 
      && user!=='local-gov' && user!=='local'
      && user!=='service-provider' && user!=='service' && user!=='sp' 
      && user!=='epc' && user!=='bank'){
      user = 'none';
      renderPath='auth/index';
    }

    if(user==='assessor'){
      availableOptions = [ links[1], links[2], links[3], links[4], links[5] ];
    }else
    if(user==='scheme'){
      availableOptions = [ links[1], links[2], links[3], links[4], links[5] ];
    }else
    if(user==='local-gov' || user==='local'){
      user = 'local-gov';
      availableOptions = [ links[1], links[2], links[3], links[7] ];
    }else
    if(user==='gov'){
      availableOptions = [ links[1], links[2], links[3], links[7] ];
    }else
    if(user==='service-provider'|| user==='service'|| user==='sp'){
      user = 'service-provider';
      availableOptions = [ links[1], links[2], links[3], links[4], links[5], links[6], links[7], links[8], links[9] ];
    }else
    if(user==='bank'){
      availableOptions = [ links[7] ];
    }else
    if(user==='epc'){
      availableOptions = [ links[1], links[2], links[3], links[4], links[5], links[6], links[7], links[8] ];
    }

  }

  filteredArray =  filters.slice();
  // there are more users that have all options so 
  // loop thru the array and remove the non-applicable ones
  switch (user) {
    case 'epc': 
      filteredArray = _.without(filteredArray, _.findWhere(filters, {
        id: 6
      })); 
      filteredArray = _.without(filteredArray, _.findWhere(filters, {
        id: 7
      })); 
      filteredArray = _.without(filteredArray, _.findWhere(filters, {
        id: 11
      }));
    case 'assessor': 
      filteredArray = _.without(filteredArray, _.findWhere(filters, {
        id: 3
      }));
    case 'local-gov': 
      filteredArray = _.without(filteredArray, _.findWhere(filters, {
        id: 2
      }));

    default:
      break;

  }
  res.render('auth/filter', {
    filterList:filteredArray,
    links: availableOptions
  });
});


router.get('/filter-date', function(req, res, next) {
 var itemList = [
    { value: "2018", text: "2018"},
    { value: "2017", text: "2017"},
    { value: "2016", text: "2016"},
    { value: "2015", text: "2015"},
    { value: "2014", text: "2014"},
    { value: "2013", text: "2013"},
    { value: "2013", text: "2013"},
    { value: "2012", text: "2012"},
    { value: "2011", text: "2011"},
    { value: "2010", text: "2010"},
    { value: "2009", text: "2009"}
  ]

  res.render('auth/filter-checkbox', {
    title:"date",
    description:"date",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


/*
UKRegionCode, string, 1, Borders, 2, East Anglia, 3, East Pennines, 4, East Scotland, 5, Highland, 6, Midlands, 7, North East England, 8, North East Scotland, 9, North West England / South West Scotland, 10, Northern Ireland, 11, Orkney, 12, Severn Valley, 13, Shetland, 14, South East England, 15, South West England, 16, Southern England, 17, Thames Valley, 18, Wales, 19, West Pennines, 20, West Scotland, 21, Western Isles, 22, Jersey, 23, Guernsey, 24, Isle of Man, NR, for backwards compatibility only – do not use,
*/

router.get('/filter-location', function(req, res, next) {
  var regions = [
  "Borders", "East Anglia", "East Pennines", "East Scotland",
   "Highland", "Midlands", "North East England", "North East Scotland", 
   "North West England / South West Scotland", "Northern Ireland", 
   "Orkney", "Severn Valley", "Shetland", "South East England", 
   "South West England", "Southern England", "Thames Valley", 
   "Wales", "West Pennines", "West Scotland", "Western Isles", 
   "Jersey", "Guernsey", "Isle of Man"
   // NR, for backwards compatibility only – do not use,
];

 var itemList = [];

  for (var i=0; i<regions.length; i++){
    itemList.push({value:regions[i], text:regions[i]})
  }

  res.render('auth/filter-checkbox', {
    title:"location",
    description:"location",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


router.get('/filter-assessor', function(req, res, next) {
 var itemList = [
    { value: "Elmhurst", text: "Elmhurst"},
    { value: "Quidos", text: "Quidos"},
    { value: "CIBSE", text: "CIBSE"},
    { value: "Stirling", text: "Stirling"},
    { value: "Stroma", text: "Stroma"},
    { value: "ECMK", text: "ECMK"}
  ]

   res.render('auth/filter-input', {
    type:"text",
    title:"assessor",
    description:"Enter the Assessor reference",
    filterList:filters,
    links: availableOptions
  });
});


router.get('/filter-scheme', function(req, res, next) {
 var itemList = [
    { value: "Elmhurst", text: "Elmhurst"},
    { value: "Quidos", text: "Quidos"},
    { value: "CIBSE", text: "CIBSE"},
    { value: "Stirling", text: "Stirling"},
    { value: "Stroma", text: "Stroma"},
    { value: "ECMK", text: "ECMK"}
  ]

  res.render('auth/filter-checkbox', {
    title:"schemes",
    description:"Schemes",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


router.get('/filter-rating', function(req, res, next) {
 var itemList = [
    { value: "A", text: "A"},
    { value: "B", text: "B"},
    { value: "C", text: "C"},
    { value: "D", text: "D"},
    { value: "E", text: "E"},
    { value: "F", text: "F"}
  ]

  res.render('auth/filter-checkbox', {
    title:"rating",
    description:"Energy rating",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


router.get('/filter-prop-type', function(req, res, next) {
 var itemList = [
    { value: "House", text: "House"},
    { value: "Bungalow", text: "Bungalow"},
    { value: "Flat", text: "Flat"},
    { value: "Maisonette", text: "Maisonette"},
    { value: "Park home", text: "Park home"}
  ]

  res.render('auth/filter-checkbox', {
    title:"propType",
    description:"Property Type",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


router.get('/filter-prop-size', function(req, res, next) {
 var itemList = [
    { value: "A", text: "A"},
    { value: "B", text: "B"},
    { value: "C", text: "C"},
    { value: "D", text: "D"},
    { value: "E", text: "E"},
    { value: "F", text: "F"}
  ]

  res.render('auth/filter-range', {
    title:"size",
    description:"Property Size",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});

// green deal, sale, rental
router.get('/filter-reason', function(req, res, next) {
 var itemList = [
    { value: "Rental", text: "Rental"},
    { value: "Sale", text: "Sale"},
    { value: "Green Deal", text: "Green Deal"},
    { value: "Green mortgage", text: "Green mortgage"},
    { value: "Renewable Heat Initiative", text: "Renewable Heat Initiative"}
  ]

  res.render('auth/filter-checkbox', {
    title:"reason",
    description:"Lodgement reason",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


// certifcate type
router.get('/filter-type', function(req, res, next) {
 var itemList = [
    { value: "SAP", text: "SAP"},
    { value: "SAPrd", text: "SAPrd"},
    { value: "DEC", text: "DEC"},
    { value: "ACR", text: "ACR"}
  ]

  res.render('auth/filter-checkbox', {
    title:"certType",
    description:"Certificate type",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


router.get('/filter-status', function(req, res, next) {
 var itemList = [
    { value: "Active", text: "Active"},
    { value: "Retired", text: "Retired"},
    { value: "Not for issue", text: "Not for issue"}
  ]

  res.render('auth/filter-checkbox', {
    title:"status",
    description:"status",
    itemList:itemList,
    filterList:filters,
    links: availableOptions
  });
});


router.get('/filter-rooms', function(req, res, next) {
 var itemList = [
    { value: "2", text: "2"},
    { value: "3", text: "3"},
    { value: "4", text: "4"},
    { value: "4+", text: "4+"}
  ]

  res.render('auth/filter-input', {
    type:"number",
    title:"rooms",
    description:"Enter the number of rooms",
    filterList:filters,
    links: availableOptions
  });
});


router.get('/manage-accounts', function(req, res, next) {
  res.render('auth/manage-accounts', {
    links: availableOptions
  });
});


router.get('/get-data', function(req, res, next) {
  res.render('auth/get-data', {
    links: availableOptions
  });
});


router.get('/filter-result', function(req, res, next) {
  var randomNumber = Math.round(Math.random()*100000);

  res.render('auth/filter-result', {
    randomNumber:randomNumber,
    filterList:filteredArray,
    links: availableOptions
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
    filtered[idx]['lighting-cost-current'] = Math.round(Math.random()*100) * 10;
    filtered[idx]['heating-cost-current'] = Math.round(Math.random()*100) * 10;
    filtered[idx]['hot-water-cost-current'] = Math.round(Math.random()*100) * 10;
    filtered[idx]['lighting-cost-potential'] = Math.round( filtered[idx]['lighting-cost-current'] * Math.random() );
    filtered[idx]['heating-cost-potential'] = Math.round( filtered[idx]['heating-cost-current'] * Math.random() )
    filtered[idx]['hot-water-cost-potential'] = Math.round( filtered[idx]['hot-water-cost-current'] * Math.random() );


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
