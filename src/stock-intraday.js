const getApi = require('./util/api');
const wrapDone = require('./util/wrapDone');
const wrapSend = require('./util/wrapSend');

module.exports = (RED) => {
    RED.nodes.registerType("alphavantage-stock-intraday", function (config) {

        RED.nodes.createNode(this, config);

        const node = this;

        this.on('input', (msg, send, done) => {
            const Done = wrapDone(node, done);
            const Send = wrapSend(node, send);

            const api = getApi(RED, config);

            const symbol = msg.symbol || config.symbol;
            const interval = msg.interval || config.interval;

            if (!symbol) {
                this.warn('Missing "symbol" property');
                Done();
                return;
            }
            if (!interval) {
                this.warn('Missing "interval" property');
                Done();
                return;
            }

            this.debug(`Requesting stock intraday data for ${symbol} with ${interval} interval`);

            api.data.intraday(symbol, 'compact', 'json', `${interval}min`)
                .then((data) => {
                    const result = {};
                    result.data = {};
                    result.series = {};
                    Object.keys(data['Meta Data'])
                        .forEach((field) => {
                            const field2 = field
                                .replace(/^\d\. /, '')
                                .toLowerCase()
                                .replace(' ', '_');

                            result.data[field2] = data['Meta Data'][field];
                        });
                    const series = data[`Time Series (${data['Meta Data']['4. Interval']})`];
                    Object.keys(series)
                        .forEach((field) => {
                            result.series[field] = {};
                            Object.keys(series[field])
                                .forEach((key) => {
                                    let value = parseFloat(series[field][key]);
                                    if (field === '5. volume') {
                                        value = parseInt(series[field][key], 10);
                                    }
                                    result.series[field][key.replace(/^\d\. /, '')] = value;
                                });
                        });

                    msg.payload = result;

                    Send(msg);

                    Done();
                })
                .catch((error) => {
                    if (typeof error === 'string') {
                        this.error(error);
                        Done(error);
                        return;
                    }

                    this.error(`${JSON.stringify(error)}`);
                    Done(error);
                });
        });
    });
};