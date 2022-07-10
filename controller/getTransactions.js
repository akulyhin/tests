const {Blocks} = require('../model/blocks');

const getNumberRecentBlock = require('../services/getNumberRecentBlock');
const convert = require('../utils');


const getTransactions = async (req, res) => {

    const {page = 1, limit = 14} = req.query;
    const skip = (+page - 1) * +limit;

    const total = await Blocks.find().count();

    const transactions = await Blocks.find({}, "", {skip, limit: +limit}).sort({blockNumber: -1})

    const totalPage = Math.floor(total / +limit);

    const numberRecentBlock = await getNumberRecentBlock();
    // console.log(`Last block number: ${convert.hexToDecConverting(numberRecentBlock)}`);


    transactions.forEach(item => {
        item.blockConfirmations = convert.hexToDecConverting(numberRecentBlock) - item.blockNumber
    })


    res.json({
        status: 'success',
        code: 200,
        data: {
            totalTransactions: total,
            page: +page,
            totalPage,
            transactions
        } 
    })

}

module.exports = getTransactions;