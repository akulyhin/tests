
const {Blocks} = require('../model/blocks');
const convert = require('../utils');
const mongoose = require("mongoose");
const { parentPort } = require("node:worker_threads");
const Cabin = require('cabin');
const { Signale } = require('signale');
const getNumberRecentBlock = require('./getNumberRecentBlock');
const requestsCycle = require('./requestsCycle');



const {TOTAL_BLOCKS, DB_HOST} = process.env;

const cabin = new Cabin({
    axe: {
      logger: new Signale(),
    },
  });
  let isCancelled = false;

  if (parentPort) {
    parentPort.once("message", (message) => {
      if (message === "cancel") isCancelled = true;
    });
  }

(async () => {
  await mongoose
  .connect(DB_HOST)

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
                await requestsCycle(convert.hexToDecConverting(numberRecentBlock), latestBlockNumber[0].blockNumber);
            }

            // If the difference between the last block in the database and the last block in the API exceeds the specified number
            else if (diffBlockNumber > +TOTAL_BLOCKS || diffBlockNumber !== +TOTAL_BLOCKS) {
                await Blocks.deleteMany(); // Delete all transactions

                await requestsCycle(convert.hexToDecConverting(numberRecentBlock), numberOldBlock);
            }
        }

        // If there are no transactions in the database
        else if (!latestBlockNumber[0]) {
          await requestsCycle(convert.hexToDecConverting(numberRecentBlock), numberOldBlock);
        }


          setTimeout(() => {
            // signal to parent that the job is done
            if (parentPort) parentPort.postMessage('done');
            else process.exit(0);
          }, 15000)



})();

