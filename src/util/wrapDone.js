module.exports = (node, done) => {
    return (err) => {
        if (err) {
            if (done) {
                // Node-RED 1.0 compatible
                done(err);
            } else {
                // Node-RED 0.x compatible
                node.error(err, err.msg);
            }
            return;
        }

        if (done) {
            // Node-RED 1.0 compatible
            done(err);
        }
    };
};
