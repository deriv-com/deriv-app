import BinarySocket              from '_common/base/socket_base';
import SubscriptionManager       from '_common/base/subscription_manager';
import { isEmptyObject }         from '_common/utility';
import { trackJSNetworkMonitor } from './trackjs';

const WS = (() => {
    const activeSymbols = () =>
        BinarySocket.send({ active_symbols: 'brief' });

    const buy = (proposal_id, price) =>
        BinarySocket.send({ buy: proposal_id, price });

    const contractsFor = (symbol) =>
        BinarySocket.send({ contracts_for: symbol });

    const getAccountStatus = () =>
        BinarySocket.send({ get_account_status: 1 });

    const getSelfExclusion = () =>
        BinarySocket.send({ get_self_exclusion: 1 });

    const getSettings = () =>
        BinarySocket.send({ get_settings: 1 });

    const getTradingTimes = (date) =>
        BinarySocket.send({ trading_times: date });

    const landingCompany = (residence) =>
        BinarySocket.send({ landing_company: residence });

    const logout = () =>
        BinarySocket.send({ logout: 1 });

    const mt5LoginList = () =>
        BinarySocket.send({ mt5_login_list: 1 });

    const oauthApps = () =>
        BinarySocket.send({ oauth_apps: 1 });

    const payoutCurrencies = () =>
        BinarySocket.send({ payout_currencies: 1 });

    const portfolio = () =>
        BinarySocket.send({ portfolio: 1 });

    const profitTable = (limit, offset, date_boundaries) =>
        BinarySocket.send({ profit_table: 1, description: 1, limit, offset, ...date_boundaries });

    const proposalOpenContract = (contract_id) =>
        BinarySocket.send({ proposal_open_contract: 1, contract_id });

    const sell = (contract_id, price) =>
        BinarySocket.send({ sell: contract_id, price });

    const residenceList = () =>
        BinarySocket.send({ residence_list: 1 });

    const sellExpired = () =>
        BinarySocket.send({ sell_expired: 1 });

    const sendRequest = (request_object, force_request) =>
        Promise.resolve(!isEmptyObject(request_object) ? BinarySocket.send(request_object, force_request) : {});

    const statement = (limit, offset, date_boundaries) =>
        BinarySocket.send({ statement: 1, description: 1, limit, offset, ...date_boundaries });

    // ----- Streaming calls -----
    const forget = (msg_type, cb, match_values) =>
        SubscriptionManager.forget(msg_type, cb, match_values);

    const forgetAll = (...msg_types) =>
        SubscriptionManager.forgetAll(...msg_types);

    const subscribeBalance = (cb, is_forced) =>
        SubscriptionManager.subscribe('balance', { balance: 1, subscribe: 1 }, cb, is_forced);

    const subscribeProposal = (req, cb, should_forget_first) =>
        SubscriptionManager.subscribe('proposal', req, cb, should_forget_first);

    const subscribeProposalOpenContract = (contract_id = null, cb, should_forget_first) =>
        SubscriptionManager.subscribe('proposal_open_contract', { proposal_open_contract: 1, subscribe: 1, ...(contract_id && { contract_id }) }, cb, should_forget_first);

    const subscribeProposalOpenContractOnBuy = (buy_request) =>
        SubscriptionManager.addSubscriptionFromRequest(
            'proposal_open_contract',
            { ...buy_request, subscribe: 1 },
            { proposal_open_contract: 1, subscribe: 1 },
            ['contract_id'],
        );

    const subscribeTicks = (symbol, cb, should_forget_first) =>
        SubscriptionManager.subscribe('ticks', { ticks: symbol, subscribe: 1 }, cb, should_forget_first);

    const subscribeTicksHistory = (request_object, cb, should_forget_first) =>
        SubscriptionManager.subscribe('ticks_history', request_object, cb, should_forget_first);

    const subscribeTransaction = (cb, should_forget_first) =>
        SubscriptionManager.subscribe('transaction', { transaction: 1, subscribe: 1 }, cb, should_forget_first);

    const subscribeWebsiteStatus = (cb) =>
        SubscriptionManager.subscribe('website_status', { website_status: 1, subscribe: 1 }, cb);

    return {
        activeSymbols,
        buy,
        contractsFor,
        getAccountStatus,
        getSelfExclusion,
        getSettings,
        getTradingTimes,
        landingCompany,
        logout,
        mt5LoginList,
        oauthApps,
        portfolio,
        payoutCurrencies,
        profitTable,
        proposalOpenContract,
        residenceList,
        sell,
        sellExpired,
        sendRequest,
        statement,

        // streams
        forget,
        forgetAll,
        subscribeBalance,
        subscribeProposal,
        subscribeProposalOpenContract,
        subscribeProposalOpenContractOnBuy,
        subscribeTicks,
        subscribeTicksHistory,
        subscribeTransaction,
        subscribeWebsiteStatus,
    };
})();

export default trackJSNetworkMonitor(WS);
