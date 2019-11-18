const alphavantage = require('alphavantage');

module.exports = (RED, config) => {
    const apiConfig = RED.nodes.getNode(config.apiConfig);
    const api = alphavantage({ key: apiConfig.apiKey });

    return api;
};
