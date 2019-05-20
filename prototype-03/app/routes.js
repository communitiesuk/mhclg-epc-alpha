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
  if(req.session.data['postcode-or-reference']){
      res.render('certificate/results', {
        addresses: req.app.locals.data //static dummy data
      });

  }else{
    filterCertTypes(req, res);
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
