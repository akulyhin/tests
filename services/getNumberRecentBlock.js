const axios = require('axios');

const sleep = require('../utils/sleep');

const {API_KEY, BASE_URL } = process.env;
await sleep(200);
const getNumberRecentBlock = async () => {
    const {data} = await axios.get(
        `${BASE_URL}module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
        )
        return data.result;
}

module.exports = getNumberRecentBlock;