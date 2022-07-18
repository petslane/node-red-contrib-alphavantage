const { setClient, mapQuoteObj } = require("./util/api")
const wrapDone = require("./util/wrapDone")
const wrapSend = require("./util/wrapSend")

module.exports = (RED) => {
	RED.nodes.registerType("alphavantage-core-stock-quote", function (config) {

		RED.nodes.createNode(this, config)

		const node = this

		this.on("input", async (msg, send, done) => {

			const Done = wrapDone(node, done)
			const Send = wrapSend(node, send)
			try {

				const apiConfig = RED.nodes.getNode(config.apiConfig)
				const api = setClient(msg.apiKey || apiConfig.apiKey )

				const symbol = msg.symbol || config.symbol
                

				if (!symbol || symbol === "") {
					this.warn("Missing \"symbol\" property")
					Done()
					return
				}

				this.debug(`Requesting stock quote data for ${symbol}`)

				const result = api.util.polish(await api.data.quote(symbol, "compact", "json"))

				result.data = mapQuoteObj(result.data)

				msg.payload = result.data

				Send(msg)
				Done()
                
			} catch(error) {
				if (typeof error === "string") {
					this.error(error)
					Done(error)
					return
				}

				this.error(`${JSON.stringify(error)}`)
				Done(error)
			}
		})
	})
}
