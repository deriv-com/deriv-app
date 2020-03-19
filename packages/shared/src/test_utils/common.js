const expect = require('chai').expect;
const jsdom = require('jsdom');
const websocket = require('ws');
const Url = require('../utils/url/url.js');

const setURL = url => {
    jsdom.changeURL(window, url);
    Url.reset();
};

module.exports = {
    expect,
    setURL,
    getApiToken: () => 'hhh9bfrbq0G3dRf',
};
