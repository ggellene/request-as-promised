var Q = require('q');
var rewire = require('rewire');

describe('request-as-promised', function () {
    var request, reqAP;
    var response = {fake: 'fake', body: 'fake data'};

    beforeEach(function () {
        request = jasmine.createSpy('request');
        reqAP = rewire('../index.js');
        reqAP.__set__('request', request);

        request.and.callFake(function (opts, cb) {
            cb(null, response, response.body);
        });
    });

    it('should return a promise', function () {
        var result = reqAP('example.com');

        expect(Q.isPromise(result)).toBe(true);
    });

    it('should resolve the promise with the result from request', function (done) {
        reqAP('example.com')
            .spread(function(res, data){
                expect(res).toEqual(response);
                expect(data).toEqual(response.body);
                done();
            })
            .catch(done.fail);
    });

    it('should reject the promise with the error from request', function (done) {
        var error = new Error('fake error');
        request.and.callFake(function (opts, cb) {
            cb(error);
        });

        reqAP('example.com')
            .then(done.fail, function (err){
                expect(err).toEqual(error);
                done();
            });
    });

    it('should reject if a URI is not given', function (done) {
        reqAP()
            .then(done.fail, function expectations(err) {
                expect(err.message).toBe('Argument Error: The argument to requestAsPromised must be a uri/url string or a request options object');
                done();
            });
    });

    it('should accept the URI as a string', function (done) {
        reqAP('string')
            .then(done)
            .catch(done.fail);
    });

    it('should reject if an appropriate URI property is not given in the options object', function (done) {
        reqAP({})
            .then(done.fail, function expectations(err) {
                expect(err.message).toBe('Argument Error: The argument to requestAsPromised must be a uri/url string or a request options object');
                done();
            });
    });

    it('should accept the URI as a `uri` property of the options object', function (done) {
        reqAP({uri:'uri'})
            .then(done)
            .catch(done.fail);
    });

    it('should accept the URI as a `url` property of the options object', function (done) {
        reqAP({url:'uri'})
            .then(done)
            .catch(done.fail);
    });

    describe('.defaults', function () {
        var defaultAP;

        beforeEach(function () {
            defaultAP = reqAP.defaults({uri:'default uri'});
        });

        it('should return a function', function () {
            expect(typeof defaultAP).toBe('function');
        });

        it('should return a promise from the given function', function () {
            expect(Q.isPromise(defaultAP())).toBe(true);
        });

        it('should allow setting default options', function (){
            defaultAP();

            var args = request.calls.mostRecent().args;
            expect(args[0]).toEqual({uri:'default uri'});
        });

        it('should not interfere with requestAsPromised options', function () {
            defaultAP();
            reqAP('not default');

            var args = request.calls.mostRecent().args;
            expect(args[0]).toEqual({uri:'not default'});
        });

        it('should not interfere with options set by separate calls to .defaults', function () {
            var alternateAP = reqAP.defaults('alternate');
            defaultAP();

            var args = request.calls.mostRecent().args;
            expect(args[0]).toEqual({uri:'default uri'});
        });
    });

    describe('convenience methods', function () {
        it('.get should set the method to GET', function () {
            reqAP.get('uri');

            var args = request.calls.mostRecent().args;
            expect(args[0].method).toBe('GET');
        });

        it('.put should set the method to PUT', function () {
            reqAP.put('uri');

            var args = request.calls.mostRecent().args;
            expect(args[0].method).toBe('PUT');
        });

        it('.post should set the method to POST', function () {
            reqAP.post('uri');

            var args = request.calls.mostRecent().args;
            expect(args[0].method).toBe('POST');
        });

        it('.del should set the method to DELETE', function () {
            reqAP.del('uri');

            var args = request.calls.mostRecent().args;
            expect(args[0].method).toBe('DELETE');
        });

        it('.delete should set the method to DELETE', function () {
            reqAP.delete('uri');

            var args = request.calls.mostRecent().args;
            expect(args[0].method).toBe('DELETE');
        });

        it('.head should set the method to HEAD', function () {
            reqAP.head('uri');

            var args = request.calls.mostRecent().args;
            expect(args[0].method).toBe('HEAD');
        });

        it('.patch should set the method to PATCH', function () {
            reqAP.patch('uri');

            var args = request.calls.mostRecent().args;
            expect(args[0].method).toBe('PATCH');
        });
    });
});