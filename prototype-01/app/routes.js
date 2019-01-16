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

router.get('/epc-api-proxy/domestic/postcode/:postcode', function(req, res, next) {
  request(process.env.EPC_API_URI+'?postcode='+req.params.postcode+'&size=10&from=10', {
  method: "GET",
  headers: {
      'Authorization': process.env.EPC_API_KEY,
      'Accept': 'application/json'
    }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body));
        res.send({ content : JSON.parse(body) });
        // res.render('service-start', { content : JSON.parse(body) });
        // process.env.CONTOMIC_30_DAY_ACCESS_TOKEN
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

router.get('/find-an-energy-assessor', function(req, res, next) {
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

module.exports = router
