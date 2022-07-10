const {Blocks} = require('../model/blocks');
const convert = require('../utils');

const getNumberRecentBlock = require('./getNumberRecentBlock');
const requestsCycle = require('./requestsCycle');

const {TOTAL_BLOCKS} = process.env;

const getBlocksUpdates = async () => {


        const numberRecentBlock = await getNumberRecentBlock();

        console.log(`Last block number: ${convert.hexToDecConverting(numberRecentBlock)}`);

        
        const numberOldBlock = convert.hexToDecConverting(numberRecentBlock) - +TOTAL_BLOCKS;

        const latestBlockNumber = await Blocks.find().sort({blockNumber: -1}).limit(1);

        
        // iF the last block does not match the last block in the database
        if (latestBlockNumber[0] && convert.hexToDecConverting(numberRecentBlock) !== latestBlockNumber[0].blockNumber) {
            const diffBlockNumber = convert.hexToDecConverting(numberRecentBlock) - latestBlockNumber[0].blockNumber;
            console.log(`Number of new blocks detected: ${diffBlockNumber}`)

            await Blocks.deleteMany({blockNumber: {$lt: numberOldBlock}}) // Delete all transactions that are greater than 1000 from the last block number
            
            // If the difference between the last block in the database and the last block in the API does not exceed the set number
            if (diffBlockNumber !== +TOTAL_BLOCKS) {
                requestsCycle(convert.hexToDecConverting(numberRecentBlock), latestBlockNumber[0].blockNumber);
            }

            // If the difference between the last block in the database and the last block in the API exceeds the specified number
            else if (diffBlockNumber > +TOTAL_BLOCKS || diffBlockNumber !== +TOTAL_BLOCKS) {
                await Blocks.deleteMany(); // Delete all transactions

                requestsCycle(convert.hexToDecConverting(numberRecentBlock), numberOldBlock);
            }
        }

        // If there are no transactions in the database
        else if (!latestBlockNumber[0]) {
            requestsCycle(convert.hexToDecConverting(numberRecentBlock), numberOldBlock);
        }
        return
    






}

module.exports = getBlocksUpdates;