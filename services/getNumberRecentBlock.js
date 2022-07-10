const axios = require('axios');

const {API_KEY, BASE_URL } = process.env;

const getNumberRecentBlock = async () => {
    const {data} = await axios.get(
        `${BASE_URL}module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
        )
        return data.result;
}

module.exports = getNumberRecentBlock;