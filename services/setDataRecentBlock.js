const {Blocks} = require('../model/blocks');
const axios = require('axios');

const {API_KEY, BASE_URL } = process.env;

const convert = require('../utils');
const sleep = require('../utils/sleep');

const setDataRecentBlock = async (currentNumberBlock) => {

    const {data} = await axios.get(
        `${BASE_URL}module=proxy&action=eth_getBlockByNumber&tag=${currentNumberBlock}&boolean=true&apikey=${API_KEY}`
    )
    let dataRecentBlock = data.result;

    await Promise.all(
        dataRecentBlock.transactions.map(async item => {
            return new Promise(async (resolve, reject) => {
                try {
                const block = await Blocks.findOne({
                    transactionId: item.hash
                })

                if (!block && item.to) {
                    await Blocks.create({
                        blockNumber: convert.hexToDecConverting(item.blockNumber),
                        transactionId: item.hash,
                        senderAddress: item.from,
                        recipientsAddress: item.to,
                        blockConfirmations: 0,
                        date: convert.dateConverting(dataRecentBlock.timestamp),
                        value: convert.weiToEtherConverting(item.value),
                        transactionFee: convert.transactionFee(item.gas, item.gasPrice)
                    })
                }
                resolve()
            }
                catch(e) {
                    reject(e)
                }
            })
        })
    )

     await sleep(200)


}

module.exports = setDataRecentBlock;