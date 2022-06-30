export { loginAndGetBalance } from './Authenticate';

export { getBalance, observeBalance } from './Balance';

export { candleField, candleValues, isCandleBlack } from './Candle';

export { initTradeEngine, sleep, startTradeEngine, stopTradeEngine, tradeEngineObserver, watch } from './Engine';

export { default as indicators } from './indicators';

export { dateTimeStringToTimestamp, getTime, miscAlert, miscConsole, miscPrompt, notify, notifyTelegram } from './misc';

export { isTradeAgainObserver } from './Observers';

export {
    getDetail,
    getSellPrice,
    isResult,
    readDetails,
    observeOpenContract,
    subscribeToOpenContract,
    waitForAfter,
} from './OpenContract';

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
} from './Proposal';

export { purchase } from './Purchase';

export { isSellAtMarketAvailable, sellAtMarket } from './Sell';

export {
    checkDirection,
    getLastDigit,
    getLastDigitList,
    getLastDigitsFromList,
    getLastTick,
    getOhlc,
    getOhlcFromEnd,
    getPipSize,
    getTicks,
    watchTicks,
} from './Ticks';

export {
    checkLimits,
    clearStatistics,
    getAccountStat,
    getTotalProfit,
    getTotalRuns,
    updateAndReturnTotalRuns,
    updateTotals,
} from './Total';
