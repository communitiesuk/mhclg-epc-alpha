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

router.get('/cert-find-a-certificate', function(req, res, next) {
  res.render('certificate/postcode-form');
});


var sortedArray = [];
var lastCheckedPostcode = '';

router.post('/cert-postcode-results', function(req, res) {
  console.log(req.session.data);
  if(req.session.data['postcode-or-reference']){
    var str = req.session.data['postcode-or-reference'];
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
                res.render('certificate/results', {
                  addresses: []
                });
              }
            } else {
            // Error fetching results from API (e.g. because of Z-Scaler) but we can use canned data instead
            console.log("FIRST: " + req.session.data['postcode-or-reference'])
            req.session.data['postcode-or-reference'] = 'SW1P 3BU';
            console.log("SECOND: " + req.session.data['postcode-or-reference'])
            res.render('certificate/results', {
                addresses: req.app.locals.data //static dummy data
            });
            // OR we could just... res.redirect('/error');
            }
        });

    }else{
      filterCertTypes(req, res);
    }


  }else{
    // error reading data
    res.send('no data');
  }

});


function filterCertTypes(req, res){
  var sort = 0;
  // check for a filter
  // either previous radio or select menu
  if(req.session.data['sort'] ){
    sort = parseInt(req.session.data['sort']);
    certIndex = sort;
  }

  if(certIndex>0 ){
    sort = parseInt(certIndex);
  }

  // loop through sortedArray and rebuild the array we pass to the page
  arr = [];
  certType = certText[sort];
  for (var i=0;i<sortedArray.length;i++){
    // only match selection
    if( sort=== 0 || sort === sortedArray[i].certIndex){
      arr.push(sortedArray[i]);
    }
  }

  res.render('certificate/results', {
    addresses: arr,
    selection: sort,
    totalRecords: sortedArray.length,
    selectedRecords: arr.length,
    certType: certType,
    certTitle: certTitles[sort]
  });

}


// module.exports should be the final line in the file

module.exports = router
