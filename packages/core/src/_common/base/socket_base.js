const { CFD_PLATFORMS } = require('@deriv/shared');
const { ConnectionManager } = require('./connection-manager');

/*
 * An abstraction layer over native javascript WebSocket,
 * which provides additional functionality like
 * reopen the closed connection and process the buffered requests
 */
const BinarySocketBase = (() => {
    let deriv_api, binary_socket, connection_manager;

    let config = {};

    const availability = {
        is_up: true,
        is_updating: false,
        is_down: false,
    };

    const close = () => {
        binary_socket.close();
    };

    const handleLanguageChange = new_language => connection_manager?.handleLanguageChange(new_language);

    const handleLoginIDChange = () => connection_manager?.handleLoginIDChange();

    const hasReadyState = (...states) => connection_manager?.hasReadyState(states);

    const init = ({ options, client }) => {
        if (typeof options === 'object' && config !== options) {
            config = options;
        }
        connection_manager = new ConnectionManager({
            onChangeActiveConnection: connection_instance => {
                deriv_api = connection_instance.deriv_api;
                binary_socket = connection_instance.connection;
            },
            config,
            client_store: client,
        });
    };

    const openNewConnection = () => {};

    const isSiteUp = status => /^up$/i.test(status);

    const isSiteUpdating = status => /^updating$/i.test(status);

    const isSiteDown = status => /^down$/i.test(status);

    // if status is up or updating, consider site available
    // if status is down, consider site unavailable
    const setAvailability = status => {
        availability.is_up = isSiteUp(status);
        availability.is_updating = isSiteUpdating(status);
        availability.is_down = isSiteDown(status);
    };

    const wait = responses => {
        return connection_manager.wait(responses);
    };

    const subscribe = (request, cb) => deriv_api.subscribe(request).subscribe(cb, cb); // Delegate error handling to the callback

    const balanceAll = () => deriv_api.send({ balance: 1, account: 'all' });

    const subscribeBalanceAll = cb => subscribe({ balance: 1, account: 'all' }, cb);

    const subscribeBalanceActiveAccount = (cb, account) => subscribe({ balance: 1, account }, cb);

    const subscribeProposal = (req, cb) => subscribe({ proposal: 1, ...req }, cb);

    const subscribeProposalOpenContract = (contract_id = null, cb) =>
        subscribe({ proposal_open_contract: 1, ...(contract_id && { contract_id }) }, cb);

    const subscribeTicks = (symbol, cb) => subscribe({ ticks: symbol }, cb);

    const subscribeTicksHistory = (request_object, cb) => subscribe(request_object, cb);

    const subscribeTransaction = cb => subscribe({ transaction: 1 }, cb);

    const subscribeWebsiteStatus = cb => subscribe({ website_status: 1 }, cb);

    const buyAndSubscribe = request => {
        return new Promise(resolve => {
            let called = false;
            const subscriber = subscribe(request, response => {
                if (!called) {
                    called = true;
                    subscriber.unsubscribe();
                    resolve(response);
                }
            });
        });
    };

    const buy = ({ proposal_id, price }) => deriv_api.send({ buy: proposal_id, price });

    const sell = (contract_id, bid_price) => deriv_api.send({ sell: contract_id, price: bid_price });

    const cashier = (action, parameters = {}) => deriv_api.send({ cashier: action, ...parameters });

    const cancelCryptoTransaction = transaction_id =>
        deriv_api.send({ cashier_withdrawal_cancel: 1, id: transaction_id });

    const newAccountVirtual = (verification_code, client_password, residence, device_data) =>
        deriv_api.send({
            new_account_virtual: 1,
            verification_code,
            client_password,
            residence,
            ...device_data,
        });

    const setAccountCurrency = (currency, passthrough) =>
        deriv_api.send({
            set_account_currency: currency,
            ...(passthrough && { passthrough }),
        });

    const newAccountReal = values =>
        deriv_api.send({
            new_account_real: 1,
            ...values,
        });

    const newAccountRealMaltaInvest = values => deriv_api.send({ new_account_maltainvest: 1, ...values });

    const mt5NewAccount = values =>
        deriv_api.send({
            mt5_new_account: 1,
            ...values,
        });

    const getFinancialAssessment = () =>
        deriv_api.send({
            get_financial_assessment: 1,
        });

    const setFinancialAndTradingAssessment = payload => deriv_api.send({ set_financial_assessment: 1, ...payload });

    const profitTable = (limit, offset, date_boundaries) =>
        deriv_api.send({ profit_table: 1, description: 1, limit, offset, ...date_boundaries });

    const statement = (limit, offset, other_properties) =>
        deriv_api.send({ statement: 1, description: 1, limit, offset, ...other_properties });

    const verifyEmail = (email, type, payload = {}) => deriv_api.send({ verify_email: email, type, ...payload });

    const tradingPlatformPasswordChange = payload =>
        deriv_api.send({
            trading_platform_password_change: 1,
            ...payload,
        });

    const tradingPlatformInvestorPasswordChange = payload =>
        deriv_api.send({
            trading_platform_investor_password_change: 1,
            ...payload,
        });

    const tradingPlatformInvestorPasswordReset = payload =>
        deriv_api.send({
            trading_platform_investor_password_reset: 1,
            ...payload,
        });

    const tradingPlatformPasswordReset = payload =>
        deriv_api.send({
            trading_platform_password_reset: 1,
            ...payload,
        });

    const tradingPlatformAvailableAccounts = platform =>
        deriv_api.send({
            trading_platform_available_accounts: 1,
            platform,
        });

    const paymentAgentList = (country, currency) =>
        deriv_api.send({ paymentagent_list: country, ...(currency && { currency }) });

    const allPaymentAgentList = country => deriv_api.send({ paymentagent_list: country });

    const paymentAgentDetails = (passthrough, req_id) =>
        deriv_api.send({ paymentagent_details: 1, passthrough, req_id });

    const paymentAgentWithdraw = ({ amount, currency, dry_run = 0, loginid, verification_code }) =>
        deriv_api.send({
            amount,
            currency,
            dry_run,
            paymentagent_loginid: loginid,
            paymentagent_withdraw: 1,
            verification_code,
        });

    const cryptoWithdraw = ({ address, amount, verification_code, dry_run = 0 }) =>
        deriv_api.send({
            cashier: 'withdraw',
            provider: 'crypto',
            type: 'api',
            address,
            amount,
            verification_code,
            dry_run,
        });

    const cryptoConfig = () =>
        deriv_api.send({
            crypto_config: 1,
        });

    const paymentAgentTransfer = ({ amount, currency, description, transfer_to, dry_run = 0 }) =>
        deriv_api.send({
            amount,
            currency,
            description,
            transfer_to,
            paymentagent_transfer: 1,
            dry_run,
        });

    const activeSymbols = (mode = 'brief') => deriv_api.activeSymbols(mode);

    const transferBetweenAccounts = (account_from, account_to, currency, amount) =>
        deriv_api.send({
            transfer_between_accounts: 1,
            accounts: 'all',
            ...(account_from && {
                account_from,
                account_to,
                currency,
                amount,
            }),
        });

    const forgetStream = id => deriv_api.forget(id);

    const tncApproval = () => deriv_api.send({ tnc_approval: '1' });

    const contractUpdate = (contract_id, limit_order) =>
        deriv_api.send({
            contract_update: 1,
            contract_id,
            limit_order,
        });

    const contractUpdateHistory = contract_id =>
        deriv_api.send({
            contract_update_history: 1,
            contract_id,
        });

    const cancelContract = contract_id => deriv_api.send({ cancel: contract_id });

    const fetchLoginHistory = limit =>
        deriv_api.send({
            login_history: 1,
            limit,
        });

    // subscribe method export for P2P use only
    // so that subscribe remains private
    const p2pSubscribe = (request, cb) => subscribe(request, cb);
    const accountStatistics = () => deriv_api.send({ account_statistics: 1 });

    const realityCheck = () => deriv_api.send({ reality_check: 1 });

    const tradingServers = platform => deriv_api.send({ platform, trading_servers: 1 });

    const tradingPlatformAccountsList = platform =>
        deriv_api.send({
            trading_platform_accounts: 1,
            platform,
        });

    const tradingPlatformNewAccount = values =>
        deriv_api.send({
            trading_platform_new_account: 1,
            ...values,
        });

    const triggerMt5DryRun = ({ email }) =>
        deriv_api.send({
            account_type: 'financial',
            dry_run: 1,
            email,
            leverage: 100,
            mainPassword: 'Test1234',
            mt5_account_type: 'financial_stp',
            mt5_new_account: 1,
            name: 'test real labuan financial stp',
        });

    const getServiceToken = (platform, server) => {
        let temp_service = platform;
        if (platform === CFD_PLATFORMS.DERIVEZ) temp_service = 'pandats';

        return deriv_api.send({
            service_token: 1,
            service: temp_service,
            server,
        });
    };

    const changeEmail = api_request => deriv_api.send(api_request);

    return {
        init,
        openNewConnection,
        forgetStream,
        wait,
        availability,
        hasReadyState,
        isSiteDown,
        isSiteUpdating,
        clear: () => {
            // do nothing.
        },
        sendBuffered: () => {
            // do nothing.
        },
        getSocket: () => binary_socket,
        get: () => connection_manager?.active_connection?.deriv_api,
        getAvailability: () => availability,
        setOnDisconnect: onDisconnect => {
            config.onDisconnect = onDisconnect;
        },
        setOnReconnect: onReconnect => {
            config.onReconnect = onReconnect;
        },
        removeOnReconnect: () => {
            delete config.onReconnect;
        },
        removeOnDisconnect: () => {
            delete config.onDisconnect;
        },
        cache: delegateToObject({}, () => deriv_api.cache),
        storage: delegateToObject({}, () => deriv_api.storage),
        buy,
        buyAndSubscribe,
        sell,
        cashier,
        cancelCryptoTransaction,
        cancelContract,
        close,
        cryptoWithdraw,
        cryptoConfig,
        contractUpdate,
        contractUpdateHistory,
        getFinancialAssessment,
        setFinancialAndTradingAssessment,
        mt5NewAccount,
        newAccountVirtual,
        newAccountReal,
        newAccountRealMaltaInvest,
        p2pSubscribe,
        profitTable,
        statement,
        verifyEmail,
        tradingPlatformPasswordChange,
        tradingPlatformPasswordReset,
        tradingPlatformAvailableAccounts,
        tradingPlatformInvestorPasswordChange,
        tradingPlatformInvestorPasswordReset,
        activeSymbols,
        paymentAgentList,
        allPaymentAgentList,
        paymentAgentDetails,
        paymentAgentWithdraw,
        paymentAgentTransfer,
        setAccountCurrency,
        balanceAll,
        setAvailability,
        subscribeBalanceAll,
        subscribeBalanceActiveAccount,
        subscribeProposal,
        subscribeProposalOpenContract,
        subscribeTicks,
        subscribeTicksHistory,
        subscribeTransaction,
        subscribeWebsiteStatus,
        tncApproval,
        transferBetweenAccounts,
        fetchLoginHistory,
        handleLoginIDChange,
        handleLanguageChange,
        accountStatistics,
        realityCheck,
        tradingServers,
        tradingPlatformAccountsList,
        tradingPlatformNewAccount,
        triggerMt5DryRun,
        getServiceToken,
        changeEmail,
    };
})();

function delegateToObject(base_obj, extending_obj_getter) {
    return new Proxy(base_obj, {
        get(target, field) {
            if (target[field]) return target[field];

            const extending_obj =
                typeof extending_obj_getter === 'function' ? extending_obj_getter() : extending_obj_getter;

            if (!extending_obj) return undefined;

            const value = extending_obj[field];
            if (value) {
                if (typeof value === 'function') {
                    return value.bind(extending_obj);
                }
                return value;
            }

            return undefined;
        },
    });
}

const proxied_socket_base = delegateToObject(BinarySocketBase, () => BinarySocketBase.get());

const proxyForAuthorize = obj =>
    new Proxy(obj, {
        get(target, field) {
            if (target[field] && typeof target[field] !== 'function') {
                return proxyForAuthorize(target[field]);
            }
            return (...args) => BinarySocketBase?.wait('authorize').then(() => target[field](...args));
        },
    });

BinarySocketBase.authorized = proxyForAuthorize(proxied_socket_base);

module.exports = proxied_socket_base;
