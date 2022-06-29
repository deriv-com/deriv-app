import {
    getDetail,
    getProposal,
    getPurchaseReference,
    getSellPrice,
    initTradeEngine,
    isSellAtMarketAvailable,
    isTradeAgainObserver,
    purchase,
    sellAtMarket,
    sleep,
    startTradeEngine,
    stopTradeEngine,
    tradeEngineObserver,
    watch,
} from '../trade';

const getBotInterface = () => {
    return {
        alert: (...args) => alert(...args), // eslint-disable-line no-alert
        console: {
            log(...args) {
                // eslint-disable-next-line no-console
                console.log(new Date().toLocaleTimeString(), ...args);
            },
        },
        getAskPrice: contract_type => Number(getProposal(contract_type).ask_price),
        getPayout: contract_type => Number(getProposal(contract_type).payout),
        getSellPrice: () => getSellPrice(),
        getPurchaseReference: () => getPurchaseReference(),
        init: (...args) => initTradeEngine(...args),
        isResult: result => getDetail(10) === result,
        isSellAvailable: () => isSellAtMarketAvailable(),
        isTradeAgain: result => isTradeAgainObserver(result),
        prompt: (...args) => prompt(...args), // eslint-disable-line no-alert
        purchase: contract_type => purchase(contract_type),
        readDetails: i => getDetail(i - 1),
        sellAtMarket: () => sellAtMarket(),
        sleep: (...args) => sleep(...args),
        start: (...args) => startTradeEngine(...args),
        stop: () => stopTradeEngine(),
        tradeEngineObserver: () => tradeEngineObserver(),
        watch: (...args) => watch(...args),
    };
};

export default getBotInterface;
