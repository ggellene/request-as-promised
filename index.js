'use strict';

var request = require('request');
var Q = require('q');

module.exports = reqAP;

function reqAP(uri, opts) {
    var deferred = Q.defer();

    opts.uri = uri || opts.uri;

    request(opts, function (err, res, data) {
        if(err){
            return deferred.reject(err);
        }

        return deferred.resolve([res, data]);
    });

    return deferred.promise;
}

reqAP.get = function get(uri, opts) {
    opts.method = 'GET';

    return reqAP(uri, opts);
};

reqAP.put = function get(uri, opts) {
    opts.method = 'PUT';

    return reqAP(uri, opts);
};

reqAP.post = function get(uri, opts) {
    opts.method = 'POST';

    return reqAP(uri, opts);
};

reqAP.delete = function get(uri, opts) {
    opts.method = 'DELETE';

    return reqAP(uri, opts);
};

reqAP.patch = function get(uri, opts) {
    opts.method = 'PATCH';

    return reqAP(uri, opts);
};

reqAP.head = function get(uri, opts) {
    opts.method = 'HEAD';

    return reqAP(uri, opts);
};

reqAP.defaults = function defaults(opts) {
    
}

function setDefault (method, options, requester, verb) {

    return function (uri, opts, callback) {
        var params = initParams(uri, opts, callback);

        var target = {};
        extend(true, target, options, params);

        target.pool = params.pool || options.pool;

        if (verb) {
            target.method = verb.toUpperCase();
        }

        if (isFunction(requester)) {
            method = requester;
        }

        return method(target, target.callback);
    }
}