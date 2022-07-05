import getInterface from './Interface';

export {
    // Authentication
    loginAndGetBalance,
    // Balance
    getBalance,
    observeBalance,
    // Candle
    candleField,
    candleValues,
    isCandleBlack,
    // Engine
    initTradeEngine,
    sleep,
    startTradeEngine,
    stopTradeEngine,
    tradeEngineObserver,
    watch,
    // Indicators
    indicators,
    // Misc
    dateTimeStringToTimestamp,
    getTime,
    miscAlert,
    miscConsole,
    miscPrompt,
    notify,
    notifyTelegram,
    // Observer
    isTradeAgainObserver,
    // Open Contract
    getDetail,
    getSellPrice,
    isResult,
    readDetails,
    observeOpenContract,
    subscribeToOpenContract,
    waitForAfter,
    // Proposal
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
    // Purchase
    purchase,
    // Sell
    isSellAtMarketAvailable,
    sellAtMarket,
    // Ticks
    checkDirection,
    getDirection,
    getLastDigit,
    getLastDigitHelpers,
    getLastDigitBinaryUtils,
    getLastDigitList,
    getLastDigitsFromList,
    getLastTick,
    getOhlc,
    getOhlcFromEnd,
    getPipSize,
    getTicks,
    watchTicks,
    // Total
    checkLimits,
    clearStatistics,
    getAccountStat,
    getTotalProfit,
    getTotalRuns,
    updateAndReturnTotalRuns,
    updateTotals,
    // Scope
    $scope,
    Services,
} from './tradeEngine';

export default getInterface;
