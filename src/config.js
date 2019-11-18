module.exports = function(RED) {
    RED.nodes.registerType("alphavantage-config", function (n) {
        RED.nodes.createNode(this,n);
        this.apiKey = n.apiKey;
    });
}