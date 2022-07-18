const { setClient,
	mapData,
	mapSeriesObj,
	mapSeriesArray } = require("./util/api")
const wrapDone = require("./util/wrapDone")
const wrapSend = require("./util/wrapSend")

module.exports = (RED) => {
	RED.nodes.registerType("alphavantage-core-stock-intraday", function (config) {

		RED.nodes.createNode(this, config)

		const node = this

		this.on("input", async (msg, send, done) => {

			const Done = wrapDone(node, done)
			const Send = wrapSend(node, send)
			try {

				const apiConfig = RED.nodes.getNode(config.apiConfig)
				const api = setClient(msg.apiKey || apiConfig.apiKey )

				const symbol = msg.symbol || config.symbol
				const interval = msg.interval || config.interval
				const outputSize = msg.outputSize || config.outputSize || "compact"
                

				if (!symbol || symbol === "") {
					this.warn("Missing \"symbol\" property")
					Done()
					return
				}
				if (!interval || interval === "") {
					this.warn("Missing \"interval\" property")
					Done()
					return
				}

				this.debug(`Requesting stock intraday data for ${symbol} with ${interval} interval`)

				const result = api.util.polish(await api.data.intraday(symbol, outputSize, "json", `${interval}min`))

				const timeSeriesKey = `Time Series (${interval}min)`

				result.data = mapData(result.meta) // backward compat
				result.series = mapSeriesObj(result[timeSeriesKey]) // backward compat
				result.seriesArray = mapSeriesArray(result[timeSeriesKey]) // new array
				
				delete(result.meta)
				delete(result[timeSeriesKey])

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
