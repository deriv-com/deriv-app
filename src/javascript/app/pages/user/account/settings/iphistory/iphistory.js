const IPHistoryInit = require('./iphistory.init');

const IPHistory = (() => {
    const onLoad = () => {
        IPHistoryInit.init();
    };

    const onUnload = () => {
        IPHistoryInit.clean();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = IPHistory;
