const express = require('express');
const { createQr, getQrs } = require('../Controllers/QrController');
const router = express.Router();


router.post('/generate-qr', createQr)

router.get('/get-qr/:productId', getQrs)

module.exports = router