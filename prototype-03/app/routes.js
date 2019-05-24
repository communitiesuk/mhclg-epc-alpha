const express = require('express')
const request = require('request')
const router = express.Router()
const MAX_POSTCODE_LENGTH = 7;

router.get('/assessor', (req, res) => {
  res.render('assessor/index')
})

router.get('/assessor/results', (req, res) => {
  if(req.session.data['postcode']){
    postcodeOrRef = req.session.data['postcode'];
    delete req.session.data['postcode'];
    // Remove whitespace from submitted string and check length; if long treat it as a ref and go direct to assessor
    if(postcodeOrRef.replace(/\s/g, "").length > MAX_POSTCODE_LENGTH) {
        res.redirect("/assessor/" + randomIntFromInterval(0, req.session.data['assessors'].length -1));
    } else {
        res.render('assessor/results', { results: req.session.data['assessors'] });
    }
  }
  // If filters have been deselected and resubmitted fall back to full list
  else if(typeof req.session.data['type'] == "undefined" && typeof req.session.data['nonrestype'] == "undefined"){
    res.render('assessor/results', { results: req.session.data['assessors'] });
  }
  // Some filters have been submitted so filter
  else {
    filterAssessors(req, res);
  }
})

var assessorNiceNames = {
  "residential": "residential EPC",
  "nonresepc":  "non-residential EPC",
  "displayenergy": "DEC",
  "accert": "AC-CERT"
}

function filterAssessors(req, res){
  var results = [];
  var assessorTypes = req.session.data['type'] || [];
  var nonResTypes = req.session.data['nonrestype'] || [];

  // If nothing chosen in the second set of filters, assume we want all nonresidential certs
  if (assessorTypes.includes("nonresidential") && !nonResTypes.length){
    nonResTypes = ["nonresepc","displayenergy","accert"];
  }
  // If non-residential types chosen but not the high-level non-residential box then check the nonresidential box too
  else if (nonResTypes.length && ! assessorTypes.includes("nonresidential")){
    assessorTypes.push("nonresidential")
  }

  var allSelectedTypes = assessorTypes.concat(nonResTypes);

  for (var i=0;i<req.session.data['assessors'].length;i++){
    current_assessor = req.session.data['assessors'][i]
    assessorCerts = current_assessor.certificates.map(cert => cert.type);
    if(allSelectedTypes.some(cert=> assessorCerts.includes(cert))){
      results.push(current_assessor);
    }
  }
  filterString = allSelectedTypes.filter(function(item) {return item !== "nonresidential"}).map(item => assessorNiceNames[item]).join(", ");
  res.render('assessor/results', {
    results: results,
    allSelectedTypes: allSelectedTypes,
    filterString: filterString
  });
}

router.get('/assessor/:id', (req, res) => {
  res.render('assessor/view', { assessor: req.session.data['assessors'].filter(assessor => assessor.accreditation_number == req.params.id)[0] })
})

router.get('/certificate', function(req, res, next) {
  res.render('certificate/postcode-form');
});


router.post('/certificate/results', function(req, res) {
  if(req.session.data['postcode-or-reference']){
     postcodeOrRef = req.session.data['postcode-or-reference'];
     delete req.session.data['postcode-or-reference'];
     // Remove whitespace from submitted string and check length; if long treat it as a ref and go direct to certificate
     if(postcodeOrRef.replace(/\s/g, "").length > MAX_POSTCODE_LENGTH) {
         res.redirect("/certificate/results/" + randomIntFromInterval(1, req.app.locals.data.length));
     }
     else {
        res.render('certificate/results', {
          addresses: req.app.locals.data //static dummy data
        });
     }
  }
  // If all filters have been deselected and resubmitted fall back to full list
  else if(typeof req.session.data['certificate-type'] == "undefined"){
    res.render('certificate/results', { addresses: req.app.locals.data });
  }
  else{
    filterCertTypes(req, res);
  }
});

function randomIntFromInterval(min,max) // min and max included
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

function filterCertTypes(req, res){
  var arr = [];
  var selected_cert_types = req.session.data['certificate-type']
  for (var i=0;i<req.app.locals.data.length;i++){
    current_cert = req.app.locals.data[i]
    if(selected_cert_types.indexOf(current_cert.certificate_type) > -1){
      arr.push(current_cert);
    }
  }

  res.render('certificate/results', {
    addresses: arr,
    certificates_description: selected_cert_types.join(", ")
  });
}


function getPropertyByReference(properties, reference) {
  return properties.filter(property => property.reference === reference)[0];
}

router.get('/certificate/results/:reference', function(req, res) {
  if(req.params.reference){
    var property = getPropertyByReference(req.app.locals.data, req.params.reference);

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

    var efficiency_value = {};
    efficiency_value['A'] = 97;
    efficiency_value['B'] = 83;
    efficiency_value['C'] = 75;
    efficiency_value['D'] = 58;
    efficiency_value['E'] = 42;
    efficiency_value['F'] = 27;
    efficiency_value['G'] = 12;
    
    Object.assign(property, {
      date: property['issue_date'],
      propertyType: property['type'],
      floorArea: 132.6,
      transactionType: "Mandatory issue (Property to let).",
      currentRating: property['current-energy-rating'],
      potentialRating: property['potential-energy-rating'],
      currentEfficiency: efficiency_value[property['current-energy-rating']],
      potentialEfficiency: efficiency_value[property['potential-energy-rating']],
      currentPositionStyle: "top: " + offset[ property['current-energy-rating'] ] +"px; left:280px;",
      potentialPositionStyle: "top: " + offset[ property['potential-energy-rating'] ] +"px; left:350px;",
      costs:[
        {energyType: "Lighting", currentCost:"£26", futureCost: "£6"},
        {energyType: "Heating", currentCost:"£674", futureCost: "£487"},
        {energyType: "Water", currentCost:"£315", futureCost: "£287"}
      ],
      history:[
        {date:"2015", event:"Current EPC Certificate", rating:"C", assessmentType:"RdSAP assessment"},
        {date:"2006-2015", event:"PC Certificate issued", rating:"D", assessmentType:"RdSAP assessment"},
        {date:"2006", event:"First certificate issued", rating:"", assessmentType:""}
      ],
      documents:[
        {date:"23 January 2015", address:property['address'], rating:"C", assessmentType:"RdSAP assessment", type:"210kb, 5 pages"},
        {date:"8 May 2009", address:property['address'], rating:"D", assessmentType:"RdSAP assessment", type:"207kb, 5 pages"},
        {date:"1 October 2006", address:property['address'], rating:"D", assessmentType:"", type:"190kb, 4 pages"}
      ]
    });

    res.render('certificate/certificate', {
      data: property
    });

  } else {
        res.redirect('/error');
  }
});

// module.exports should be the final line in the file

module.exports = router
