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
    var goodOpts = parseArgs(assign(opts, this.opts));
    var defaultThis = {opts: goodOpts};

    var bound = requestAsPromised.bind(assign(defaultThis, this));
    Object.keys(requestAsPromised).forEach(function (key) {
        if(requestAsPromised.hasOwnProperty(key)){
            bound[key] = requestAsPromised[key];
        }
    });

    return bound;
};

requestAsPromised.get = function get(opts){
    opts = parseArgs(opts);
    opts.method = 'GET';
    return requestAsPromised(opts);
};

requestAsPromised.put = function put(opts){
    opts = parseArgs(opts);
    opts.method = 'PUT';
    return requestAsPromised(opts);
};

requestAsPromised.post = function post(opts){
    opts = parseArgs(opts);
    opts.method = 'POST';
    return requestAsPromised(opts);
};

requestAsPromised.delete =
requestAsPromised.del = function del(opts){
    opts = parseArgs(opts);
    opts.method = 'DELETE';
    return requestAsPromised(opts);

};

requestAsPromised.patch = function patch(opts){
    opts = parseArgs(opts);
    opts.method = 'PATCH';
    return requestAsPromised(opts);
};

requestAsPromised.head = function head(opts){
    opts = parseArgs(opts);
    opts.method = 'HEAD';
    return requestAsPromised(opts);
};

function parseArgs(opts){
    var parsed = opts || {};

    if(typeof opts === 'string'){
        parsed = {uri:opts}
    }

    return parsed;
}