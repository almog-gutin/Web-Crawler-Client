const axios = require('axios');

const checkURL = async (req, res) => {
    try {
        const URL = req.body.url;
        const result = await axios.get(URL);
        return res.sendStatus(result.status);
    } catch (err) {
        console.log(err);
        if (err.response?.status) return res.sendStatus(err.response?.status);
        return res.sendStatus(500);
    }
};

module.exports = checkURL;
