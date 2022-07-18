# node-red-contrib-alphavantage - Change Log

## [0.2.0] - 18/07/2022

- Changed node names to make them unique

## [0.1.0] - 18/07/2022

:fire: Forked from [petslane/node-red-contrib-alphavantage](https://github.com/petslane/node-red-contrib-alphavantage) due to delayed PR :fire:

- Added new `msg.seriesArray` output that transforms object of objects returned from AV to an array of objects
- Add eslint dev dependency for code linting
- remove `package-lock.json` from ignore to lock package versions
- Changed node colors to match AV documentation header
- Change AV icon to new icon
- [**Stock Time Series Daily node**] Added new node
- [**Stock Global Quote node**] Added new node
- Added example flows json
- Bump alphavantage dependency from `1.2.6` to `2.3.0`
- `msg.apiKey`, if set, now overrides the selected instance, when externalising secrets outside of Node-RED
- [**config node**] Added `name` parameter
- [**config node**] Moved `apiKey` parameter to the encrypted credentials store
- `text/x-red` blocks changed to `text/html`
- [**forex node**] Moved `name` parameter to the bottom of the config panel
- [**forex node**] Added label styling if custom name given
- [**forex node**] Adjusted code for new AV dep version
- [**forex node**] documentation update
- [**Stock Time Series Intraday node**] Added default interval
- [**Stock Time Series Intraday node**] Added `outputSize` parameter
- [**Stock Time Series Intraday node**] Added label styling if custom name given
- [**Stock Time Series Intraday node**] Moved `name` parameter to the bottom of the config panel
- [**Stock Time Series Intraday node**] Adjusted code for new AV dep version
- [**Stock Time Series Intraday node**] documentation update

## [0.0.2] - 06/10/2020

- Initial release https://flows.nodered.org/node/node-red-contrib-alphavantage