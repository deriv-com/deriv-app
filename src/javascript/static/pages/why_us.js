const Scroll = require('../../_common/scroll');
const Client = require('../../app/base/client');

const WhyUs = (() => {
    const onLoad = () => {
        Scroll.sidebarScroll($('.why-us'));
        Client.activateByClientType();
    };

    const onUnload = () => {
        Scroll.offScroll();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = WhyUs;
