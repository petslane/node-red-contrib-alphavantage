"use strict"

const alphavantage = require("alphavantage")

const FLOAT_VARS = ["open", "close", "high", "low", "price", "change", "prev_close"]
const INT_VARS = ["volume"]

var api

function setClient(apiKey) {
	api = alphavantage({ key: apiKey })

	return api
}

function mapData(metadata) {
	return {
		information: metadata.information,
		symbol: metadata.symbol,
		last_refreshed: metadata.updated,
		interval: metadata.interval,
		output_size: metadata.size,
		time_zone: metadata.zone
	}
}

function mapQuoteObj(quoteObj) {
	var returnVar = {}

	Object.keys(quoteObj).forEach((dataPointKey) => {

		if (FLOAT_VARS.includes(dataPointKey)) {
			returnVar[dataPointKey] = parseFloat(quoteObj[dataPointKey])
		} else if (INT_VARS.includes(dataPointKey)) {
			returnVar[dataPointKey] = parseInt(quoteObj[dataPointKey], 10)
		} else if (dataPointKey === "change_percent") {
			returnVar[dataPointKey] = parseFloat(quoteObj[dataPointKey].replace("%",""))/100.0
		} else {
			returnVar[dataPointKey] = quoteObj[dataPointKey]
		}
	})

	return returnVar
}

function mapSeriesObj(seriesObj) {
	var returnVar = {}
	Object.keys(seriesObj).forEach((key) => {

		const keyDate = new Date(key)
		const year = String(keyDate.getFullYear())
		const month = String(keyDate.getMonth()+1).padStart(2,0)
		const day = String(keyDate.getDate()).padStart(2,0)
		const hours = String(keyDate.getHours()).padStart(2,0)
		const mins = String(keyDate.getMinutes()).padStart(2,0)
		const seconds = String(keyDate.getSeconds()).padStart(2,0)

		const seriesKey = `${year}-${month}-${day} ${hours}:${mins}:${seconds}`
		returnVar[seriesKey] = seriesObj[key]

		Object.keys(seriesObj[key]).forEach((dataPointKey) => {

			if (FLOAT_VARS.includes(dataPointKey)) {
				returnVar[seriesKey][dataPointKey] = parseFloat(seriesObj[key][dataPointKey])
			} else if (INT_VARS.includes(dataPointKey)) {
				returnVar[seriesKey][dataPointKey] = parseInt(seriesObj[key][dataPointKey], 10)
			}
		})
	})

	return returnVar
}

function mapSeriesArray(seriesObj) {
	const returnVar = []
	Object.keys(seriesObj).forEach((key) => {

		let seriesItem = JSON.parse(JSON.stringify(seriesObj[key])) // deep copy this

		Object.keys(seriesItem).forEach((dataPointKey) => {

			if (FLOAT_VARS.includes(dataPointKey)) {
				seriesItem[dataPointKey] = parseFloat(seriesItem[dataPointKey])
			} else if (INT_VARS.includes(dataPointKey)) {
				seriesItem[dataPointKey] = parseInt(seriesItem[dataPointKey], 10)
			}
		})

		seriesItem.timestamp = key
		returnVar.push(seriesItem)
	})

	return returnVar
}


module.exports = {
	setClient,
	mapData,
	mapQuoteObj,
	mapSeriesObj,
	mapSeriesArray
}