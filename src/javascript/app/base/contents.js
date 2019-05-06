const Client         = require('./client');
const getElementById = require('../../_common/common_functions').getElementById;

const Contents = (() => {
    const onLoad = () => {
        Client.activateByClientType();
        // This is required for our css to work.
        getElementById('content').className = getElementById('content_class').textContent;
    };

    return {
        onLoad,
    };
})();

module.exports = Contents;
