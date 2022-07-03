export { loginAndGetBalance } from './authenticate';

export { getBalance, observeBalance } from './balance';

export { candleField, candleValues, isCandleBlack } from './candle';

export { initTradeEngine, sleep, startTradeEngine, stopTradeEngine, tradeEngineObserver, watch } from './engine';

export { default as indicators } from './indicators';

export { dateTimeStringToTimestamp, getTime, miscAlert, miscConsole, miscPrompt, notify, notifyTelegram } from './misc';

export { isTradeAgainObserver } from './observers';

export {
    getDetail,
    getSellPrice,
    isResult,
    readDetails,
    observeOpenContract,
    subscribeToOpenContract,
    waitForAfter,
} from './open-contract';

export {
    checkProposalReady,
    clearProposals,
    getAskPrice,
    getPayout,
    getProposal,
    getPurchaseReference,
    isNewTradeOption,
    makeProposals,
    observeProposals,
    renewProposalsOnPurchase,
    selectProposal,
} from './proposal';

export { purchase } from './purchase';

export { isSellAtMarketAvailable, sellAtMarket } from './sell';

export {
    checkDirection,
    getLastDigit,
    getLastDigitBinaryUtils,
    getLastDigitList,
    getLastDigitsFromList,
    getLastTick,
    getOhlc,
    getOhlcFromEnd,
    getPipSize,
    getTicks,
    watchTicks,
} from './ticks';

export {
    checkLimits,
    clearStatistics,
    getAccountStat,
    getTotalProfit,
    getTotalRuns,
    updateAndReturnTotalRuns,
    updateTotals,
} from './total';

export { $scope } from './state';
