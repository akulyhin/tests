const etherConverter = require('ether-converter');
const hexToDecConverting = require('./hexToDecConverting');

const weiToEtherConverting = (wei) => {
    const ether = etherConverter(hexToDecConverting(wei), 'wei');

    return Number(ether.ether).toFixed(18);
}

module.exports = weiToEtherConverting;