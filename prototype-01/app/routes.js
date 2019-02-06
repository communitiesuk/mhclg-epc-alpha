const express = require('express')
const router = express.Router() 
const request = require('request')
const moment = require('moment')
const _ = require('underscore');

var dataset;
// request.headers.authorization = process.env.CONTOMIC_30_DAY_ACCESS_TOKEN

// router.get('/test', function(req, res, next) {
//   request('https://demo.contomic.com/api/v1/GovService/nodes/08119fc1f9304a25919fc1f930ba2538?version=published', function (err, response, body) {
//     if (err || response.statusCode !== 200) {
//       return res.sendStatus(500);
//     }
//     res.render('service-page', { content : JSON.parse(body) });
//     // res.send({ content : JSON.parse(body) });
//   });
// });

router.get('/', function(req, res, next) {
  var contentType='article'
  var contentId='ba19e506-b5d2-41e7-ab28-17eae0d1d79c'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log('body:', body);
        // res.send({ content : JSON.parse(body) });
        res.render('article', { content : JSON.parse(body) });
      } else {
        // console.log('error', error, response && response.statusCode);
        // res.send('error', error, response && response.statusCode);
        // return res.sendStatus(500);
        res.redirect('/error');
      }
  });
});


router.get('/epc-api-proxy/domestic/postcode/:postcode', function(req, res, next) {
  request(process.env.EPC_API_URI+'?postcode='+req.params.postcode+'&size=150', {
  method: "GET",
  headers: {
      'Authorization': process.env.EPC_API_KEY,
      'Accept': 'application/json'
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if(body) {
          // console.log(JSON.parse(body));
          res.send({ content : JSON.parse(body) });
          // res.render('service-start', { content : JSON.parse(body) });
          // process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
        } else {
          res.send('no data');
        }
      } else {
        // res.redirect('/error');
      }
  });
});


router.get('/mock-api/address-grade', function(req, res, next) {
  var contentType='mock-rest-api'
  var contentId='20e71420-5c9d-4a8e-b9d6-093a0d772dab'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send({ content : JSON.parse(body) });
        // res.render('service-start', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
});


router.get('/service-start-example', function(req, res, next) {
  var contentType='service-start'
  var contentId='d7fcda1d-d6d4-43d3-8cf4-b2af1ddce89f'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
	    'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
	  }
	}, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
        // res.send({ content : JSON.parse(body) });
	      res.render('service-start', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
	    } else {
	      res.redirect('/error');
	    }
	});
});



router.get('/article-example', function(req, res, next) {
  var contentType='article'
  var contentId='952e678f-3c17-4b13-a16a-ddf2f21267bb'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
	    'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
	  }
	}, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      // console.log('body:', body);
	      // res.send({ content : JSON.parse(body) });
	      res.render('article', { content : JSON.parse(body) });
	    } else {
	      // console.log('error', error, response && response.statusCode);
	      // res.send('error', error, response && response.statusCode);
	      // return res.sendStatus(500);
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



//Find certificate

router.get('/find-a-report', function(req, res, next) {
  var contentType='service-start'
  var contentId='434d4cc5-41fe-4b5c-b059-41c350f99d21'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // res.send({ content : JSON.parse(body) });
        res.render('service-start', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
});

router.get('/find-a-report/search', function(req, res, next) {
  var contentType='find-a-report-step'
  var contentId='70336a96-2d7d-473b-a93e-1d1233f513bb'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // res.send({ content : JSON.parse(body) });
        res.render('find-a-report/search', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
});
 

router.get('/find-a-report/results', function(req, res, next) {

  if(req.session.data['address-postcode']){
    var str = req.session.data['address-postcode'];
    var cleaned = str.split(' ').join('');

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

              // loop through results and build a simple array
              var arr = [];
              for (var i=0;i<dataset.rows.length;i++){
                arr[i] = {
                      "reference": dataset.rows[i]['lmk-key'],
                      "type": dataset.rows[i]['property-type'],
                      "address": dataset.rows[i].address +', '+ dataset.rows[i].postcode,
                      "category": dataset.rows[i]['current-energy-rating']
                  }
              }
              
              res.render('find-a-report/results', {
                addresses: arr
              });
              
            } else {
              console.log('no data');
              res.render('find-a-report/results', {
                addresses: []
                //addresses: req.app.locals.data //static dummy data
              });
            }
          } else {
            console.log(error);
            res.redirect('/error');
          }
      });
    
  }else{
    res.send('no data');

  }
});



router.get('/find-a-report/certificate/:reference', function(req, res) {

  var idx = 0;
  var lmkKey = req.params.reference;
  var filtered = _.filter(dataset.rows, function(item) {
    return (lmkKey === item['lmk-key']);
  });

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
  res.render('find-a-report/certificate', {
    data: property
  });

});



// Find an assessor

router.get('/find-an-assessor', function(req, res, next) {
  var contentType='service-start'
  var contentId='f27f6d59-88fc-4f64-8765-fea96bc44d26'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // res.send({ content : JSON.parse(body) });
        res.render('service-start', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
});

router.get('/find-an-assessor/results', function(req, res) {
  // dummy assessor data
  var results = {
    assessor:[
        {accredition:"ABS-23454355", name:"Lettie Gutierrez", status:"Registered", type:"Domestic", contactNumber:"094-074-7885"},
        {accredition:"ABC-47382952", name:"Ivan Shelton", status:"Registered", type:"Domestic", contactNumber:"081-161-1844"},
        {accredition:"ABX-34225435", name:"Ray Keller", status:"Rogue Agent", type:"Both", contactNumber:"07865-732-399"},
        {accredition:"ABC-47382952", name:"Barbara Steele", status:"Registered", type:"Domestic", contactNumber:"023-519-3943"},
    ]
  };

  res.render('find-an-assessor/results', {
    addresses: results
  });
});

router.get('/find-an-assessor/assessor/:reference', function(req, res) {
  // dummy assessor data
  var results = {
    assessor:{
        name:"Barbara Steele",
        accredition: req.params.reference,
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

  res.render('find-an-assessor/assessor', {
    results: results
  });
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

//Optout
router.get('/opt-in-opt-out', function(req, res, next) {
  var contentType='service-start'
  var contentId='86f589f6-5f51-4976-9104-b2d1801136ec'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // res.send({ content : JSON.parse(body) });
        res.render('service-start', { content : JSON.parse(body) });
        process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
      } else {
        res.redirect('/error');
      }
  });
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

  res.render('opt-in-opt-out/select-address', {
    result: {addresses: list}
  });
});
router.get('/opt-in-opt-out/home-select-address', function(req, res, next) {
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
  var contentType='article'
  var contentId='08010463-2f21-49e4-877e-b8b461b0eafe'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
      'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log('body:', body);
        // res.send({ content : JSON.parse(body) });
        res.render('opt-in-opt-out/terms', { content : JSON.parse(body) });
      } else {
        // console.log('error', error, response && response.statusCode);
        // res.send('error', error, response && response.statusCode);
        // return res.sendStatus(500);
        res.redirect('/error');
      }
  });
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


module.exports = router
