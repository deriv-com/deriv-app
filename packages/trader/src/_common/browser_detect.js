// Firefox 1.0+
const isFirefox = () => typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
// eslint-disable-next-line no-undef
const isSafari = () =>
    /constructor/i.test(window.HTMLElement) ||
    (function(p) {
        return p.toString() === '[object SafariRemoteNotification]';
    })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));

// Edge 20+
const isEdge = () => !isIE && !!window.StyleMedia;

// Internet Explorer 6-11
const isIE = /* @cc_on!@ */ false || !!document.documentMode;

module.exports = {
    isFirefox,
    isSafari,
    isEdge,
};
