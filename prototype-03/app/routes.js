const express = require('express')
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

router.post('/cert-postcode-results', function(req, res) {
    res.redirect('certificate/postcode-results')
});


// module.exports should be the final line in the file

module.exports = router
