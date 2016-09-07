'use strict';

var request = require('request');
var Q = require('q');
var assign = require('object-assign');

module.exports = requestAsPromised;

function requestAsPromised(opts){
    var deferred = Q.defer();
    var self = this;
    var options;

    if(self) {
        options = assign(self.opts, parseArgs(opts));
    }
    else{
        options = parseArgs(opts);
    }

    if(!(options.uri || options.url)){
        var reason = new Error('Argument Error: The argument to requestAsPromised must be a uri/url string or a request options object');
        deferred.reject(reason);

        return deferred.promise;
    }

    request(options, function (err, res, data) {
        if(err){
            return deferred.reject(err);
        }

        return deferred.resolve([res, data]);
    });

    return deferred.promise;
}

requestAsPromised.defaults = function defaults(opts){
    var goodOpts = parseArgs(opts);
    var defaultThis = {opts:goodOpts};

    return requestAsPromised.bind(defaultThis);
};

requestAsPromised.get = function get(opts){
    opts = parseArgs(opts);
    opts.method = 'GET';
    return requestAsPromised(opts);
};

function parseArgs(opts){
    var parsed = opts || {};

    if(typeof opts === 'string'){
        parsed = {uri:opts}
    }

    return parsed;
}