const express = require('express');
const router = express.Router();

const { createPurchase, getAllPurchases } = require('../Controllers/PurchasesController');



router.post('/create-purchase/:productId/:userId', createPurchase);

router.get('/all-purchases/:userId', getAllPurchases);


module.exports = router