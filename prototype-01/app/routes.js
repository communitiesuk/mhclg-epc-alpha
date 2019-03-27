const express = require('express')
const router = express.Router() 
const request = require('request')
const moment = require('moment')
const _ = require('underscore');

var dataset;

router.get('/', function(req, res, next) {
  res.render('index', {  });
});


router.get('/error', function(req, res, next) {
  res.render('error', { content : {error: {message: "Internal server error"}}});
});



////////////////////////////////////////////////////////////////////////////
//
//  FIND A CERTIFICATE
//
////////////////////////////////////////////////////////////////////////////
var certText = [
  "all energy performance certificates",
  "a domestic energy perfomance certificate",
  "a non-domestic energy perfomance certificate",
  "a display energy certificate",
  "an air conditioning inspection certificate"
];
var certInitials = [null, 'EPC', 'EPC3 or 4', 'DEC', 'AC-CERT'];
var certTitles = [null, 'Domestic energy perfomance certificate', 'Non-domestic energy perfomance certificate', 'Display energy certificates', 'Air conditioning inspection certificates'];


var certIndex = 0;
var certType = certText[0];

router.get('/find-a-report', function(req, res, next) {
  res.render('service-start-report');
});

router.get('/find-a-report/choice', function(req, res, next) {
  res.render('find-a-report/certificate-choice');
});


router.get('/find-a-report/search', function(req, res, next) {
  certIndex = req.session.data['cert-type'];

  if(certIndex>0){ 
    certType = certText[certIndex];
  }
  //console.log('search: ' + certIndex);

  if(req.session.data['sort']){
    //console.log('clear data');
    req.session.data['sort'] = null;
  }

  res.render('find-a-report/search', {
    certType: certType
  });

});



router.get('/find-a-report/choices', function(req, res, next) {
  var doesKnowCertType = req.session.data['know-cert-type'];
  //console.log(doesKnowCertType);
  if (doesKnowCertType === 'Yes') {
    // redirect and select a cert type
    res.redirect('/find-a-report/certificate-types')
  } else {
    // don't know so show all
    //console.log('choices:: search' + certText[0]);
    req.session.data['cert-type'] = 0;
    certIndex = 0;
    res.redirect('/find-a-report/search')
  }


});


var sortedArray = [];
var lastCheckedPostcode = '';

router.get('/find-a-report/results', function(req, res, next) {
//console.log('results: ' + certIndex);
  if(req.session.data['address-postcode']){

    var str = req.session.data['address-postcode'];
    var cleaned = str.split(' ').join('');
    // flats/houses, Small Commercial Buildings, Large Commercial Buildings, Public buildings


    if(cleaned!==lastCheckedPostcode){
      // get data for address and modify to add dummy 'types'
      request(process.env.EPC_API_URI+'?postcode='+cleaned+'&size=150', {
        method: "GET",
        headers: {
            'Authorization': process.env.EPC_API_KEY,
            'Accept': 'application/json'
          }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              if(body) {
                dataset = JSON.parse(body);

                lastCheckedPostcode = cleaned;

                // sort by second property then first property
                // sort by house number as main order then flat number
                sortedArray = _.chain(dataset.rows)
                  .sortBy('address1')
                  .sortBy('address2')
                  .value();

                // loop through results and build a simple array
                var arr = [];

                for (var i=0;i<sortedArray.length;i++){
                  //add in random certificate type
                  var ran = Math.random()*10;
                  var tempCertIdx = 1; //default is 1. 0 is for all certificates
                  if(ran>9){
                    tempCertIdx = 4;
                  }
                  else if(ran>8){
                    tempCertIdx =3;
                  }
                  else  if(ran>6){
                    tempCertIdx =2;
                  }
                  //update the sortedArray with the index for later sorting...
                  sortedArray[i].certIndex = tempCertIdx;
                  sortedArray[i].reference = sortedArray[i]['certificate-hash'];
                  sortedArray[i].type = certTitles[tempCertIdx];
                  sortedArray[i].initials = certInitials[tempCertIdx];
                  sortedArray[i].address = sortedArray[i].address +', '+ dataset.rows[i].postcode;
                  sortedArray[i].category = sortedArray[i]['current-energy-rating'];

                }              


                filterCertTypes(req, res);

                
              } else {
                res.render('find-a-report/results', {
                  addresses: []
                });
              }
            } else {
              res.redirect('/error');
            }
        });

    }else{
      //console.log('previously...');
      filterCertTypes(req, res);
    }



    
  }else{
    // error reading data
    res.send('no data');
  }

});


function filterCertTypes(req, res){
  var sort = 0;
  //console.log("FILTER CERTS");
  // check for a filter 
  // either previous radio or select menu
  if(req.session.data['sort'] ){
    sort = parseInt(req.session.data['sort']);
    //console.log('read sort '+ sort);
    certIndex = sort;
  }

  if(certIndex>0 ){
    //console.log('set sort ' + certIndex);
    sort = parseInt(certIndex);
  }

  //console.log("cert index: " + certIndex, sort);


  // loop through sortedArray and rebuild the array we pass to the page
  arr = [];
  certType = certText[sort];
  //console.log(' got sort ' + sort);
  for (var i=0;i<sortedArray.length;i++){
    // only match selection
    //console.log(sort, sortedArray[i].certIndex);
    if( sort=== 0 || sort === sortedArray[i].certIndex){
      //console.log('match!');
      arr.push(sortedArray[i]);
    }
  }

  res.render('find-a-report/results', {
    addresses: arr,
    selection: sort,
    totalRecords: sortedArray.length,
    selectedRecords: arr.length,
    certType: certType,
    certTitle: certTitles[sort]
  });

}


router.get('/find-a-report/certificate/:reference', function(req, res) {

  if(req.params.reference){

    var certHash = req.params.reference;
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

    var property = {};

    request(process.env.EPC_CERT_API_URI + '/' + certHash, {
        method: "GET",
        headers: {
            'Authorization': process.env.EPC_API_KEY,
            'Accept': 'application/json'
          }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              if(body) {
                var dataset = JSON.parse(body);
                var item = dataset.rows[0];

                // pull out results and build a simple array
                var displayDate = moment(item['lodgement-date']).format("Do MMMM YYYY");

                property = {
                  address: item['address'],
                  date: displayDate,
                  propertyType: item['property-type'],
                  floorArea: item['total-floor-area'],
                  transactionType: item['transaction-type'],
                  currentRating: item['current-energy-rating'],
                  potentialRating: item['potential-energy-rating'],
                  currentEfficiency: item['current-energy-efficiency'],
                  potentialEfficiency: item['potential-energy-efficiency'],
                  currentPositionStyle: "top: " + offset[ item['current-energy-rating'] ] +"px; left:280px;",
                  potentialPositionStyle: "top: " + offset[ item['potential-energy-rating'] ] +"px; left:350px;",
                  costs:[
                    {energyType: "Lighting", currentCost:"£ "+item['lighting-cost-current'], futureCost: "£ "+item['lighting-cost-potential']},
                    {energyType: "Heating", currentCost:"£ "+item['heating-cost-current'], futureCost: "£ "+item['heating-cost-potential']},
                    {energyType: "Water", currentCost:"£ "+item['hot-water-cost-current'], futureCost: "£ "+item['hot-water-cost-potential']}
                  ],
                  history:[
                    {date:"2015", event:"Current EPC Certificate", rating:"C", assessmentType:"RdSAP assessment"},
                    {date:"2006-2015", event:"PC Certificate issued", rating:"D", assessmentType:"RdSAP assessment"},
                    {date:"2006", event:"First certificate issued", rating:"", assessmentType:""}
                  ],
                  documents:[
                    {date:"23 January 2015", address:"Flat 3, 3 Leonora Tyson Mews, London, SE21 8GA", rating:"C", assessmentType:"RdSAP assessment", type:"PDF, 210kb, 5 pages"},
                    {date:"8 May 2009", address:"Flat 3, 3 Leonora Tyson Mews, Croxted Road, London, SE21 8GA", rating:"D", assessmentType:"RdSAP assessment", type:"PDF, 207kb, 5 pages"},
                    {date:"1 October 2006", address:"3, 3 Leonora Tyson Mews, London, SE21 8GA", rating:"D", assessmentType:"", type:"PDF, 190kb, 4 pages"}
                  ]
                };

                res.render('find-a-report/certificatePlus', {
                  data: property
                });

            } else {
              res.render('find-a-report/certificatePlus', {
                addresses: req.app.locals.data //static dummy data
              });
            }
          } else {
            res.redirect('/error');
          }
      });
  } else {
    res.redirect('/error');
  }
});



////////////////////////////////////////////////////////////////////////////
//
//  FIND AN ASSESSOR
//
////////////////////////////////////////////////////////////////////////////

router.get('/find-an-assessor', function(req, res, next) {
  res.render('service-start-assessor', {  });
});


router.get('/find-an-assessor/results', function(req, res) {
  // dummy assessor data
  var assessors = req.app.locals.smartResults.assessors;
  for ( var i=0; i<assessors.length; i++){
    var base = Buffer.from(assessors[i]['number']).toString('base64')
    req.app.locals.smartResults.assessors[i].base64ref  = base;
    var schemeRef = parseInt(assessors[i].scheme)-1;
    assessors[i].schemeName = req.app.locals.smartResults.schemes[schemeRef].name;
  }

  var results = {
    assessor:assessors
  };

  res.render('find-an-assessor/results', {
    addresses: results
  });
});


router.get('/find-an-assessor/assessor/:reference', function(req, res) {
  // dummy assessor data
  if(req.params.reference){

    var certHash = req.params.reference;
    // convert back from base64
    var accreditation  = Buffer.from(certHash, 'base64').toString();
    var filtered = _.filter(req.app.locals.smartResults.assessors, function(item) {
      return (accreditation === item.number);
    });

    var item = filtered[0];
    var scheme = req.app.locals.smartResults.schemes[item.scheme-1];
    
    var results = {
      assessor:{
          name:item.name,
          "accredition number": item.number,
          "Contact address": item.address,
          "Phone number": item.telephone,
          "Company name": scheme.name,
          "status": "registered",
          "Postcode coverage": item['postcode coverage'].join(' '),
          "Certificate types": scheme['certificate types'].join('; ')
        },
        scheme:scheme
      };
      res.render('find-an-assessor/assessor', {
        results: results
      });


  } else {
    res.redirect('/error');
  }


});

// Branching
router.post('/find-an-assessor/assessor-branch', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names
  let assessorSearch = req.session.data['assessor-search-type']

  if (assessorSearch === 'check-assessor') {
    res.redirect('/find-an-assessor/check')
  } else {
    res.redirect('/find-an-assessor/search-for-type')
  }
})


////////////////////////////////////////////////////////////////////////////
//
//  OPT-IN / OPT OUT
//
////////////////////////////////////////////////////////////////////////////
var list = [
    { address: "Flat 1, 28, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 2, 28, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 3, 28, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 4, 28, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 5, 28, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 7, 28, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 8, 28, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 1, 32, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Second Floor Flat, 40 Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 1, 42, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 3, 42, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 5, 42, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 6, 42, Great Smith Street, SW1P 3BU", ref:""},
    { address: "Flat 8, 42, Great Smith Street, SW1P 3BU", ref:""}
];


router.get('/opt-in-opt-out', function(req, res, next) {
  res.render('service-start-opt-out', {  });
});


router.get('/opt-in-opt-out/choices', function(req, res, next) {
  var data = {
    isOptedIn: true
  };

  res.render('opt-in-opt-out/choices', {
    result: data
  });
});


router.get('/opt-in-opt-out/select-address', function(req, res, next) {
  res.render('opt-in-opt-out/select-address', {
    result: {addresses: list}
  });
});


router.get('/opt-in-opt-out/home-select-address', function(req, res, next) {
  res.render('opt-in-opt-out/home-select-address', {
    result: {addresses: list}
  });
});


router.post('/opt-in-opt-out/confirm-details', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names
  let addressChoice = req.session.data['address-choice']

  if (addressChoice !== 'Another address') {
    res.redirect('/opt-in-opt-out/confirm-details')
  } else {
    res.redirect('/opt-in-opt-out/home-address')
  }
})


router.get('/opt-in-opt-out/terms-and-conditions', function(req, res, next) {
  res.render('opt-in-opt-out/terms', {  });
});


router.get('/opt-in-opt-out/confirm-property', function(req, res) {
  // dummy property data
  var property = {
    address: "94 Deckow Gardens Suite 23",
    issueDate: "21 September 2017",
    assessmentDate: "21 August 2017",
    referenceNo: "ABX-213528"
  };

  res.render('opt-in-opt-out/confirm-property', {
    property: property
  });
});


router.get('/opt-in-opt-out/application-complete', function(req, res) {
  // dummy property data
  var random1 = Math.floor(Math.random()*10);
  var random2 = Math.floor(Math.random()*10);
  var random3 = Math.floor(Math.random()*10);
  var random4 = Math.floor(Math.random()*10);
  var randomNo = "EPC" + random1 + random1 + random3 + random4 +"X";

  res.render('opt-in-opt-out/application-complete', {
    applicationReference: randomNo
  });
});


router.get('/about', function(req, res, next) {
  res.render('about', { });
});




module.exports = router
