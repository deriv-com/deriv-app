export { loginAndGetBalance } from './Authenticate';

export { getBalance, observeBalance } from './Balance';

export { initTradeEngine, sleep, startTradeEngine, stopTradeEngine, tradeEngineObserver, watch } from './Engine';

export { isTradeAgainObserver } from './Observers';

export { getDetail, getSellPrice, observeOpenContract, subscribeToOpenContract, waitForAfter } from './OpenContract';

export {
    checkProposalReady,
    clearProposals,
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

export { default as Store } from './trade-engine-store';
