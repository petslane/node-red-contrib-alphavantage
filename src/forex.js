const getApi = require('./util/api');
const wrapDone = require('./util/wrapDone');
const wrapSend = require('./util/wrapSend');

module.exports = (RED) => {
    RED.nodes.registerType("alphavantage-forex", function (config) {

        RED.nodes.createNode(this, config);

        const node = this;

        this.on('input', (msg, send, done) => {
            const Done = wrapDone(node, done);
            const Send = wrapSend(node, send);

            const api = getApi(RED, config);

            const from = msg.fromCurrency || config.fromCurrency;
            const to = msg.toCurrency || config.toCurrency;

            if (!from) {
                this.warn('Missing "fromCurrency" property');
                Done();
                return;
            }
            if (!to) {
                this.warn('Missing "toCurrency" property');
                Done();
                return;
            }

            this.debug(`Requesting FX from ${from || '?'} to ${to || '?'}`);

            api.forex.rate(from, to)
                .then((data) => {
                    this.debug(`Result: ${JSON.stringify(data)}`);

                    const exchange = data['Realtime Currency Exchange Rate'];
                    const rate = parseFloat(exchange['5. Exchange Rate']);
                    const amount = msg.amount ? parseFloat(msg.amount) : undefined;

                    msg.payload = {
                        rate,
                    };
                    if (amount) {
                        msg.payload.amount = amount * rate;
                    }

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