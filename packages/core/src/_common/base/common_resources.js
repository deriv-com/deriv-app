const BinarySocket = require('./socket_base');

const TradingTimesBase = (() => {
    const activeSymbols = fncUpdateUI => {
        BinarySocket.activeSymbols().then(fncUpdateUI);
    };
    const tradingTimes = fncUpdateUI => {
        BinarySocket.send({ trading_times: 'today' }).then(fncUpdateUI);
    };

    return {
        activeSymbols,
        tradingTimes,
    };
})();

module.exports = TradingTimesBase;
