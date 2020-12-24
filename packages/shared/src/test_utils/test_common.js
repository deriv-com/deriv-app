const expect = require('chai').expect;
const jsdom = require('jsdom');
const reset = require('../utils/url/url').reset;

const setURL = url => {
    jsdom.changeURL(window, url);
    reset();
};

module.exports = {
    expect,
    setURL,
    getApiToken: () => 'hhh9bfrbq0G3dRf',
};
