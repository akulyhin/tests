const etherConverter = require('ether-converter');
const hexToDecConverting = require('./hexToDecConverting');

const transactionFee = (gas, gasPrice) => {
    const transactionFee = +hexToDecConverting(gasPrice) * +hexToDecConverting(gas);
    return Number(etherConverter(transactionFee, 'wei').ether).toFixed(10);
}

module.exports = transactionFee;