const express = require("express");

const {controllerWrapper} = require("../../middleware");
const {transactions:ctrl} = require('../../controller');

const router = express.Router();

router.get('/', controllerWrapper(ctrl.getTransactions));

module.exports = router;