const { setClient,
	mapData,
	mapSeriesObj,
	mapSeriesArray } = require("./util/api")
const wrapDone = require("./util/wrapDone")
const wrapSend = require("./util/wrapSend")

module.exports = (RED) => {
	RED.nodes.registerType("alphavantage-core-stock-daily", function (config) {

		RED.nodes.createNode(this, config)

		const node = this

		this.on("input", async (msg, send, done) => {

			const Done = wrapDone(node, done)
			const Send = wrapSend(node, send)
			try {

				const apiConfig = RED.nodes.getNode(config.apiConfig)
				const api = setClient(msg.apiKey || apiConfig.apiKey )

				const symbol = msg.symbol || config.symbol
				const outputSize = msg.outputSize || config.outputSize || "compact"
                

				if (!symbol || symbol === "") {
					this.warn("Missing \"symbol\" property")
					Done()
					return
				}

				this.debug(`Requesting stock time series daily data for ${symbol}`)

				const result = api.util.polish(await api.data.daily(symbol, outputSize, "json"))

				result.series = mapSeriesObj(result.data) // backward compat
				result.seriesArray = mapSeriesArray(result.data) // new array
				result.data = mapData(result.meta) // backward compat
				
				delete(result.meta)

				msg.payload = result

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
