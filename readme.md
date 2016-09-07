# Request-as-promised

A small utility that wraps [request] and converts it to return promises instead of using a callback pattern.

## Why?

There are at least a few existing implementations of this idea. What makes this one different?

* **Q.js**: To my knowledge, [Q.js][Q] is the most mature, well tested, and feature rich promise library in the JS ecosystem. Besides, it's used by protractor and Angular (sort of), and I spend a lot of time in those spaces. [Request-promise][request-promise] uses bluebird, which is also good, but adds a redundant dependency to most of my projects.
* **Syntax**: I've worked to maintain the existing syntax of request. Convenience functions like `defaults` and `get` are present and work as expected.
* **Why not?**: Reinvention is a good thing. It's been an interesting project, and there's few better ways to learn than by implementing something yourself.

## Should I use it?

Sure. I'll be using it myself for some projects. However, in researching this project I came across [got]. I'll be seriously considering it as an alternative to request where I can, and you should too.

### Installation

```
npm i --save request-as-promise
```

### Usage

```javascript
var reqAP = require('request-as-promise');

reqAP('example.com')
    .spread(function success(response, data) {
       // Do stuff with the response;
    });
```

You can give a URL string or an options object to `reqAP`. The options object will be passed along to `request`. See that project's documentation for details on the options object.

[request]: https://github.com/request/request
[Q]: https://github.com/kriskowal/q
[request-promise]: https://github.com/request/request-promise
[got]: https://github.com/sindresorhus/got