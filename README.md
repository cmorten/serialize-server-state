<p align="center">
  <h1 align="center">serialize-server-state</h1>
</p>
<p align="center">
A fast, secure serializer for server JSON state.
</p>
<p align="center">
   <a href="https://github.com/cmorten/serialize-server-state/tags/"><img src="https://img.shields.io/github/tag/cmorten/serialize-server-state" alt="serialize-server-state versions" /></a>
   <a href="https://www.npmjs.com/package/serialize-server-state"><img alt="serialize-server-state available on NPM" src="https://img.shields.io/npm/dy/serialize-server-state"></a>
   <img src="https://github.com/cmorten/serialize-server-state/workflows/Test/badge.svg" alt="Current test status" />
   <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs are welcome" /></a>
   <a href="https://github.com/cmorten/serialize-server-state/issues/"><img src="https://img.shields.io/github/issues/cmorten/serialize-server-state" alt="serialize-server-state issues" /></a>
   <img src="https://img.shields.io/github/stars/cmorten/serialize-server-state" alt="serialize-server-state stars" />
   <img src="https://img.shields.io/github/forks/cmorten/serialize-server-state" alt="serialize-server-state forks" />
   <img src="https://img.shields.io/github/license/cmorten/serialize-server-state" alt="serialize-server-state license" />
   <a href="https://GitHub.com/cmorten/serialize-server-state/graphs/commit-activity"><img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="serialize-server-state is maintained" /></a>
</p>

---

## Getting started

### Install the dependencies

In your terminal:

```sh
$ yarn add serialize-server-state
# or
$ npm install serialize-server-state
```

### Write your code

See below for the [Redux Server Rendering](https://redux.js.org/usage/server-rendering/#inject-initial-component-html-and-state) example adapted to use the `serialize-server-state` package:

```js
const serialize = require("serialize-server-state");

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${serialize(preloadedState)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}
```

## Motivation

This package attempts to act as a balance between security and performance.

When server rendering JSON state it can be very easy to stumble upon cross-site scripting issues so care is needed. See the [Redux Security Considerations](https://redux.js.org/usage/server-rendering/#security-considerations) for discussion on this topic.

Packages such as [`jsesc`](https://www.npmjs.com/package/jsesc) and [`serialize-javascript`](https://www.npmjs.com/package/serialize-javascript) exist and handle a wide range of security issues very well (from XSS to unicode issues) but are not very performant - for a lot of use-cases these packages almost offer _too_ much.

If you are attempting to render state which you _know_ to be JSON serializable, and will be assigning to a value within a script context, then this package might be for you.

`serialize-server-state` is up to 2x faster than the above packages for serialization, and implements the optimally performant deserialization technique by rendering the state as a string within `JSON.parse()`, see [this article on Redux state transfer performance](https://joreteg.com/blog/improving-redux-state-transfer-performance).

This package mitigates XSS by following the [WHATWG HTML Specification recommendation](https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements) and gracefully handles awkward characters such as line separators with the appropriate escaping.

**Note:** Please always assess your use-case for security before using this package.

## Benchmark

```console
$ yarn bench

jsesc x 125 ops/sec ±1.97% (79 runs sampled)
serialize-javascript x 334 ops/sec ±1.96% (88 runs sampled)
serialize-server-state x 646 ops/sec ±1.17% (89 runs sampled)
The fastest option is serialize-server-state
```

Machine specs:

```console
$ system_profiler SPSoftwareDataType SPHardwareDataType

Software:

    System Software Overview:

      System Version: macOS 12.6.2 (21G320)
      Kernel Version: Darwin 21.6.0
      Boot Volume: Macintosh HD
      Boot Mode: Normal
      Secure Virtual Memory: Enabled
      System Integrity Protection: Enabled

Hardware:

    Hardware Overview:

      Model Name: MacBook Air
      Model Identifier: MacBookAir7,2
      Processor Name: Dual-Core Intel Core i5
      Processor Speed: 1.8 GHz
      Number of Processors: 1
      Total Number of Cores: 2
      L2 Cache (per Core): 256 KB
      L3 Cache: 3 MB
      Hyper-Threading Technology: Enabled
      Memory: 8 GB
      System Firmware Version: 476.0.0.0.0
      OS Loader Version: 540.120.3~22
      SMC Version (system): 2.27f2
```

## Contributing

Please check out the [CONTRIBUTING](./docs/CONTRIBUTING.md) docs.

## Changelog

Please check out the [releases page](https://github.com/cmorten/serialize-server-state/releases).

---

## License

`serialize-server-state` is licensed under the [MIT License](./LICENSE.md).
