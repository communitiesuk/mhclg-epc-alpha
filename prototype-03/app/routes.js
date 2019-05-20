const express = require('express')
const request = require('request')
const router = express.Router()

router.get('/assessor', (req, res) => {
  res.render('assessor/index')
})

router.get('/assessor/results', (req, res) => {
  res.render('assessor/results', { results: req.session.data['assessors'] })
})

router.get('/assessor/:id', (req, res) => {
  res.render('assessor/view', { assessor: req.session.data['assessors'][req.params.id] })
})

router.get('/certificate', function(req, res, next) {
  res.render('certificate/postcode-form');
});


var sortedArray = [];
var lastCheckedPostcode = '';

router.post('/certificate/results', function(req, res) {
  console.log("SESSION DATA: " + JSON.stringify(req.session.data))
  if(req.session.data['postcode-or-reference']){
      res.render('certificate/results', {
        addresses: req.app.locals.data //static dummy data
      });

  }else{
    filterCertTypes(req, res);
  }
});


function filterCertTypes(req, res){
  console.log("SESSION DATA: " + JSON.stringify(req.session.data))

  // loop through sortedArray and rebuild the array we pass to the page
  arr = [];
  for (var i=0;i<req.app.locals.data.length;i++){
    current_cert = req.app.locals.data[i]
    if( req.session.data['selected_types'].indexOf(current_cert.type) > -1){
      arr.push(current_cert);
    }
  }

  res.render('certificate/results', {
    addresses: arr,
    totalRecords: arr.length,
    selectedRecords: arr.length,
  });

}

function getPropertyByReference(properties, reference) {
  return Object.keys(properties).find(key => object[key] === value);
}

router.get('/certificate/results/:reference', function(req, res) {

  if(req.params.reference){

    var property = req.app.locals.data
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
                    {date:"23 January 2015", address:"Flat 3, 3 Leonora Tyson Mews, London, SE21 8GA", rating:"C", assessmentType:"RdSAP assessment", type:"210kb, 5 pages"},
                    {date:"8 May 2009", address:"Flat 3, 3 Leonora Tyson Mews, Croxted Road, London, SE21 8GA", rating:"D", assessmentType:"RdSAP assessment", type:"207kb, 5 pages"},
                    {date:"1 October 2006", address:"3, 3 Leonora Tyson Mews, London, SE21 8GA", rating:"D", assessmentType:"", type:"190kb, 4 pages"}
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

// module.exports should be the final line in the file

module.exports = router
