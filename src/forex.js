const { setClient } = require("./util/api")
const wrapDone = require("./util/wrapDone")
const wrapSend = require("./util/wrapSend")

module.exports = (RED) => {
	RED.nodes.registerType("alphavantage-forex-rate", function (config) {

		RED.nodes.createNode(this, config)

		const node = this

		this.on("input", async (msg, send, done) => {
			const Done = wrapDone(node, done)
			const Send = wrapSend(node, send)
			try {

				const apiConfig = RED.nodes.getNode(config.apiConfig)
				const api = setClient(msg.apiKey || apiConfig.apiKey )

				const from = msg.fromCurrency || config.fromCurrency
				const to = msg.toCurrency || config.toCurrency

				if (!from || from === "") {
					this.warn("Missing \"fromCurrency\" property")
					Done()
					return
				}
				if (!to || to === "") {
					this.warn("Missing \"toCurrency\" property")
					Done()
					return
				}

				this.debug(`Requesting FX from ${from || "?"} to ${to || "?"}`)

				const result = api.util.polish(await api.forex.rate(from, to))

				const rate = parseFloat(result.rate.value)
				const amount = msg.amount ? parseFloat(msg.amount) : undefined

				msg.payload = {
					rate,
				}
				if (amount) {
					msg.payload.amount = amount * rate
				}

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