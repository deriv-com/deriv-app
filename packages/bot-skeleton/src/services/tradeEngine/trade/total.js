import { getRoundedNumber } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { log_types } from '../../../constants/messages';
import { $scope } from './state';
import { createError, info, log } from '../utils';

const skeleton = {
    totalProfit: 0,
    totalWins: 0,
    totalLosses: 0,
    totalStake: 0,
    totalPayout: 0,
    totalRuns: 0,
};

const globalStat = {};

export const checkLimits = tradeOption => {
    if (!tradeOption.limitations) {
        return;
    }

    const {
        limitations: { maxLoss, maxTrades },
    } = tradeOption;

    if (maxLoss && maxTrades) {
        if ($scope.session.runs >= maxTrades) {
            throw createError('CustomLimitsReached', localize('Maximum number of trades reached'));
        }
        if ($scope.session.profit <= -maxLoss) {
            throw createError('CustomLimitsReached', localize('Maximum loss amount reached'));
        }
    }
};

export const clearStatistics = () => {
    $scope.session.runs = 0;
    $scope.session.profit = 0;
    if (!$scope.account_info) return;
    const { loginid: accountID } = $scope.account_info;
    globalStat[accountID] = { ...skeleton };
};

export const getAccountStat = () => {
    const { loginid: accountID } = $scope.account_info;

    if (!(accountID in globalStat)) {
        globalStat[accountID] = { ...skeleton };
    }

    return globalStat[accountID];
};

export const getTotalProfit = toString => {
    const currency = $scope.tradeOptions.currency;
    const accountStat = getAccountStat();

    return toString && accountStat.totalProfit !== 0
        ? getRoundedNumber(+accountStat.totalProfit, currency)
        : +accountStat.totalProfit;
};

export const getTotalRuns = () => {
    const accountStat = getAccountStat();
    return accountStat.totalRuns;
};

export const updateAndReturnTotalRuns = () => {
    $scope.session.runs++;
    const accountStat = getAccountStat();

    return ++accountStat.totalRuns;
};

export const updateTotals = contract => {
    const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;

    const profit = getRoundedNumber(Number(sellPrice) - Number(buyPrice), currency);

    const win = profit > 0;

    const accountStat = getAccountStat();

    accountStat.totalWins += win ? 1 : 0;

    accountStat.totalLosses += !win ? 1 : 0;

    $scope.session.profit = getRoundedNumber(Number($scope.session.profit) + Number(profit), currency);

    accountStat.totalProfit = getRoundedNumber(Number(accountStat.totalProfit) + Number(profit), currency);

    accountStat.totalStake = getRoundedNumber(Number(accountStat.totalStake) + Number(buyPrice), currency);

    accountStat.totalPayout = getRoundedNumber(Number(accountStat.totalPayout) + Number(sellPrice), currency);

    info({
        profit,
        contract,
        accountID: $scope.account_info.loginid,
        totalProfit: accountStat.totalProfit,
        totalWins: accountStat.totalWins,
        totalLosses: accountStat.totalLosses,
        totalStake: accountStat.totalStake,
        totalPayout: accountStat.totalPayout,
    });

    log(win ? log_types.PROFIT : log_types.LOST, { currency, profit });
};
