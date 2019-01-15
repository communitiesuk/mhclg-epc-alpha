const express = require('express')
const router = express.Router() 
const request = require('request')
const moment = require('moment')

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
  var contentType='service-start'
  var contentId='95acc9f8-b0d8-41e9-b8ab-c877bb950c42'
  request(process.env.CONTOMIC_CONTENT_API_URI+contentType+'/'+contentId, {
  method: "GET",
  headers: {
	    'Authorization': process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
	  }
	}, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      res.render('service-start', { content : JSON.parse(body) });
	    } else {
	      res.redirect('/error');
	    }
	});
});

router.get('/article', function(req, res, next) {
  var contentType='article'
  var contentId='3c941966-ed76-41a5-b091-29b109ab46e2'
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

module.exports = router
