module.exports = function(RED) {

	function avInstance(n) {
		RED.nodes.createNode(this,n)

		if (this.credentials.apiKey) {
			this.apiKey = this.credentials.apiKey


		} else if (n.apiKey && !this.credentials.apiKey) {
			// Backward compatibility
			this.apiKey = n.apiKey
		}
	}

	RED.nodes.registerType("alphavantage-config", avInstance, {
		credentials: {
			apiKey: { type: "text" },
		}
	})
}