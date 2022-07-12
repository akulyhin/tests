const {Blocks} = require('../../model/blocks');
const {NotFound, BadRequest} = require('http-errors');

const getNumberRecentBlock = require('../../services/getNumberRecentBlock');
const convert = require('../../utils');


const getTransactions = async (req, res) => {

    let {page = 1, limit = 14, search, searchQuery} = req.query;
    const skip = (+page - 1) * +limit;
    
    let total;
    let transactions;
    if (search && searchQuery) {
        switch (search) {
            case 'address':
                search = 'recipientsAddress'
              break
            case 'transactionId':
                search = 'transactionId'
              break

              case 'blockNumber':
                search = 'blockNumber'
              break
        
            default:
              break
          }

        if (search === 'blockNumber' && !Number(searchQuery)) throw new BadRequest('Search by block number must have a number in the query')
        total = await Blocks.find({search: +searchQuery.trim()}).count().where(search).equals(searchQuery)
        transactions = await Blocks.find({search: +searchQuery.trim()}, "", {skip, limit: +limit})
        .where(search)
        .equals(searchQuery)
        .sort({blockNumber: -1})

        if (!transactions[0]) throw new NotFound(`Transactions by the ${search} were not found.`)
    }
    else {
        total = await Blocks.find().count();
        transactions = await Blocks.find({}, "", {skip, limit: +limit}).sort({blockNumber: -1}).allowDiskUse(true)
    }

    const totalPage = Math.floor(total / +limit);

    const numberRecentBlock = await getNumberRecentBlock();


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