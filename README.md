# Node client for Usabilla API

[![Build Status](https://travis-ci.org/usabilla/api-js-node.svg?branch=master)](https://travis-ci.org/usabilla/api-js-node?branch=master) [![Coverage Status](https://coveralls.io/repos/github/usabilla/api-js-node/badge.svg?branch=master)](https://coveralls.io/github/usabilla/api-js-node?branch=master)

The Usabilla API Client for Node.js provides access to the Usabilla database from Node.js applications.

The client has the following features:
* Getting the buttons / campaigns / widgets / forms as well as the feedback they contain.
* Querying over the feedback with different parameters.

## Authentication

The client uses extensive authentication based on a request signing process. For more information,
please see our [developers guide](http://developers.usabilla.com)

## Getting started

Install node client through npm

```bash
$ npm install usabilla-api --save
```

### Usage

An example that displays the number of buttons:

```js
var Usabilla = require('usabilla-api');
var usabilla = new Usabilla('YOUR-ACCESS-KEY', 'YOUR-SECRET-KEY');

usabilla.websites.buttons.get().then((buttons) => {
    console.log('Number of buttons: ', buttons.length);
}).catch((reason) => {
    console.error(reason);
});
```

See the code in the 'example' folder for more advanced ideas on how to use the client.

## Contribute

Install the required packages

```bash
$ npm install
```

start the development environment

```bash
$ npm start
```

and run tests with

```bash
$ npm test
```

To keep tests running while developing

```bash
$ npm run test:watch
```

For linting

```bash
$ npm run lint
```

and to fix automatically any lint errors

```bash
$ npm run lint:fix
```

## Support

The Usabilla Node.js Client API is maintained by Usabilla Development Team. Everyone is encouraged to file bug reports,
feature requests, and pull requests through GitHub. This input is critical and will be carefully considered, but we
can’t promise a specific resolution or time frame for any request. For more information please email our Support Team
at support@usabilla.com
