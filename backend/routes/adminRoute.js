// routes/adminAuthRoute.js
const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminController');


// POST route for admin login
router.post('/login', adminLogin);

module.exports = router;
