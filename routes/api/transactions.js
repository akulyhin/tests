const express = require("express");

const {controllerWrapper} = require("../../middleware");

const getTransactions = require('../../controller/getTransactions');

const router = express.Router();

router.get('/', controllerWrapper(getTransactions));

module.exports = router;