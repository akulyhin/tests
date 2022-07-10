const convert = require('../utils');

const setDataRecentBlock = require('./setDataRecentBlock');

const requestsCycle = async (startNumber, endNumber) => {
    for (let currentNumberBlock = startNumber; endNumber < currentNumberBlock; currentNumberBlock--) {
        
        console.log(`Get transactions per block: ${currentNumberBlock}`);
         await setDataRecentBlock(convert.decToHexConverting(currentNumberBlock))
    }
}


module.exports = requestsCycle;