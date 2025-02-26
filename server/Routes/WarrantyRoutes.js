const express = require('express');
const { claimWarranty, getWarranties } = require('../Controllers/WarrantyController');
const { warrantyUpload } = require('../warrantyMulter');
const router = express.Router();


router.post('/claim-warranty/:productId/:userId', warrantyUpload, claimWarranty)

router.get('/all-warranties/:userId', getWarranties)

module.exports = router;