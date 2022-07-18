module.exports = (node, send) => {
	return send || function () { node.send.apply(node, arguments) }
}
