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

module.exports = router
