const express = require('express');
const { createQr, getQrs, getClaimedQrs } = require('../Controllers/QrController');
const router = express.Router();


router.post('/generate-qr', createQr)

router.get('/get-qr/:productId', getQrs)

router.get('/get-claimed-qrs', getClaimedQrs)

module.exports = router