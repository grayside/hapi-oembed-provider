'use strict';

var oEmbed = require('./oembed.js');

exports.register = function (server, options, next) {
    server.handler('oembed', oEmbed.handler);
    return next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
