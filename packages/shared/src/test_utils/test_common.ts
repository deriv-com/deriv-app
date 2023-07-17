import { JSDOM } from 'jsdom';
import { reset } from '../utils/url/url';

const jsdom = new JSDOM();

const setURL = (url: string) => {
    jsdom.reconfigure({ url });
    // eslint-disable-next-line no-unused-expressions
    jsdom.window.location.href = url;
    reset();
};

module.exports = {
    expect,
    setURL,
    getApiToken: () => 'hhh9bfrbq0G3dRf',
};
