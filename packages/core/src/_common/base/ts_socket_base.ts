/* eslint-disable class-methods-use-this */
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, cloneObject, getPropertyValue, State } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

type TCallback = (response: object) => void;

interface IBaseRequest {
    passthrough?: object;
    req_id?: number;
}

interface IApiRequest extends IBaseRequest {
    change_email: string;
    new_email: string;
    verification_code: string;
    new_password?: string;
}

interface ITradingPlatformNewAccount extends IBaseRequest {
    account_type: string;
    currency: string;
    dry_run: number;
    market_type: string;
    password: string;
    platform: string;
    sub_account_type?: string;
}

interface IConfig {
    wsEvent?: (event: string) => void;
    onOpen?: (value: boolean | undefined) => void;
    onMessage?: (response: object) => void;
    onReconnect?: () => void;
    onDisconnect?: () => void;
}

class BinarySocketBase {
    deriv_api: any;
    public binary_socket?: WebSocket;
    // client_store: ClientStore = new ClientStore();
    public client_store: any;
    config: IConfig = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        wsEvent: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onOpen: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onMessage: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onReconnect: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDisconnect: () => {},
    };
    public wrong_app_id: string | number = 0;
    is_disconnect_called = false;
    is_connected_before = false;
    is_switching_socket = false;
    public availability = {
        is_up: true,
        is_updating: false,
        is_down: false,
    };

    public static instance: BinarySocketBase;
    public static getInstance(): BinarySocketBase {
        if (!BinarySocketBase.instance) {
            BinarySocketBase.instance = new BinarySocketBase();
        }
        return BinarySocketBase.instance;
    }

    public init({ options, client }: { options: IConfig; client: any }) {
        if (typeof options === 'object' && this.config !== options) {
            this.config = options;
        }
        this.client_store = client;
    }

    public openNewConnection(language = getLanguage()) {
        if (this.wrong_app_id === getAppId()) return;

        if (!this.is_switching_socket) this.config.wsEvent?.('init');

        if (this.isClose()) {
            this.is_disconnect_called = false;
            this.binary_socket = new WebSocket(this.getSocketUrl(language));
            this.deriv_api = new DerivAPIBasic({
                connection: this.binary_socket,
            });
        }

        this.deriv_api.onOpen().subscribe(() => {
            this.config.wsEvent?.('open');

            this.wait('website_status');

            if (this.client_store.is_logged_in) {
                const authorize_token = this.client_store.getToken();
                this.deriv_api.authorize(authorize_token);
            }

            if (typeof this.config.onOpen === 'function') {
                this.config.onOpen(this.isReady());
            }

            if (typeof this.config.onReconnect === 'function' && this.is_connected_before) {
                this.config.onReconnect();
            }

            if (!this.is_connected_before) {
                this.is_connected_before = true;
            }
        });

        this.deriv_api.onMessage().subscribe(
            ({
                data: response,
            }: {
                data: {
                    msg_type: string;
                };
            }) => {
                const msg_type = response.msg_type;
                State.set(['response', msg_type], cloneObject(response));

                this.config.wsEvent?.('message');

                if (getPropertyValue(response, ['error', 'code']) === 'InvalidAppID') {
                    this.wrong_app_id = getAppId();
                }

                if (typeof this.config.onMessage === 'function') {
                    this.config.onMessage(response);
                }
            }
        );

        this.deriv_api.onClose().subscribe(() => {
            if (!this.is_switching_socket) {
                this.config.wsEvent?.('close');
            } else {
                this.is_switching_socket = false;
            }

            if (
                this.wrong_app_id !== getAppId() &&
                typeof this.config.onDisconnect === 'function' &&
                !this.is_disconnect_called
            ) {
                this.config.onDisconnect();
                this.is_disconnect_called = true;
            }
        });
    }

    public forgetStream(id: number) {
        return this.deriv_api.forget(id);
    }

    public wait(...responses: Array<string>) {
        return this.deriv_api.expectResponse(
            ...responses.filter(type => {
                const isLoggedIn = type === 'authorize' && !this.client_store.is_logged_in;
                return !isLoggedIn;
            })
        );
    }

    public isReady() {
        return this.hasReadyState(1);
    }

    public isSiteDown(status: string) {
        return /^down$/i.test(status);
    }
    public clear() {
        // do nothing
    }

    public sendBuffered() {
        // do nothing.
    }

    get getSocket() {
        return this.binary_socket;
    }

    get get() {
        return this.deriv_api;
    }

    get getAvailability() {
        return this.availability;
    }

    set setOnDisconnect(updatedOnDisconnect: () => void) {
        this.config.onDisconnect = updatedOnDisconnect;
    }

    set setOnReconnect(updatedOnReconnect: () => void) {
        this.config.onReconnect = updatedOnReconnect;
    }

    public removeOnReconnect() {
        delete this.config.onReconnect;
    }

    public removeOnDisconnect() {
        delete this.config.onDisconnect;
    }
    get cache() {
        return this.deriv_api.cache;
    }

    get storage() {
        return this.deriv_api.storage;
    }

    public isSiteUpdating(status: string) {
        return /^updating$/i.test(status);
    }

    public buy({ proposal_id, price }: { proposal_id: number; price: number }) {
        return this.deriv_api.send({ buy: proposal_id, price });
    }

    public buyAndSubscribe(request: object) {
        return new Promise(resolve => {
            let called = false;
            const subscriber = this.subscribe(request, response => {
                if (!called) {
                    called = true;
                    subscriber.unsubscribe();
                    resolve(response);
                }
            });
        });
    }

    public sell(contract_id: number, bid_price: number) {
        return this.deriv_api.send({ sell: contract_id, price: bid_price });
    }

    public cashier(action: string, parameters = {}) {
        return this.deriv_api.send({ cashier: action, ...parameters });
    }

    public exchange_rates(from_currency: string) {
        return this.deriv_api.send({ exchange_rates: 1, base_currency: from_currency });
    }

    public cashierPayments({ provider, transaction_type }: { provider: string; transaction_type: string }) {
        return this.deriv_api.send({ cashier_payments: 1, provider, transaction_type });
    }

    public subscribeCashierPayments(cb: TCallback) {
        this.subscribe({ cashier_payments: 1, provider: 'crypto', transaction_type: 'all' }, cb);
    }

    public cancelCryptoTransaction(transaction_id: number) {
        return this.deriv_api.send({ cashier_withdrawal_cancel: 1, id: transaction_id });
    }

    public cancelContract(contract_id: number) {
        return this.deriv_api.send({ cancel: contract_id });
    }

    public close() {
        this.binary_socket?.close();
    }

    public cryptoWithdraw({
        address,
        amount,
        verification_code,
        dry_run = 0,
    }: {
        address: string;
        amount: number;
        verification_code: string;
        dry_run?: number;
    }) {
        return this.deriv_api.send({
            cashier: 'withdraw',
            provider: 'crypto',
            type: 'api',
            address,
            amount,
            verification_code,
            dry_run,
        });
    }

    public cryptoConfig() {
        this.deriv_api.send({
            crypto_config: 1,
        });
    }

    public contractUpdate(contract_id: number, limit_order: number) {
        return this.deriv_api.send({
            contract_update: 1,
            contract_id,
            limit_order,
        });
    }

    public contractUpdateHistory(contract_id: number) {
        return this.deriv_api.send({
            contract_update_history: 1,
            contract_id,
        });
    }

    public getFinancialAssessment() {
        return this.deriv_api.send({
            get_financial_assessment: 1,
        });
    }

    public setFinancialAndTradingAssessment(payload: object) {
        return this.deriv_api.send({ set_financial_assessment: 1, ...payload });
    }

    public mt5NewAccount(values: object) {
        return this.deriv_api.send({
            mt5_new_account: 1,
            ...values,
        });
    }

    public newAccountVirtual(
        verification_code: string,
        client_password: string,
        residence: string,
        device_data: object
    ) {
        return this.deriv_api.send({
            new_account_virtual: 1,
            verification_code,
            client_password,
            residence,
            ...device_data,
        });
    }

    public newAccountReal(values: object) {
        return this.deriv_api.send({
            new_account_real: 1,
            ...values,
        });
    }

    public newAccountRealMaltaInvest(values: object) {
        return this.deriv_api.send({ new_account_maltainvest: 1, ...values });
    }

    public p2pAdvertiserInfo() {
        return this.deriv_api.send({ p2p_advertiser_info: 1 });
    }

    // subscribe method export for P2P use only
    // so that subscribe remains private
    public p2pSubscribe(request: IBaseRequest, cb: TCallback) {
        return this.subscribe(request, cb);
    }

    public profitTable(limit: number, offset: number, date_boundaries: object) {
        return this.deriv_api.send({ profit_table: 1, description: 1, limit, offset, ...date_boundaries });
    }

    public statement(limit: number, offset: number, other_properties: object) {
        return this.deriv_api.send({ statement: 1, description: 1, limit, offset, ...other_properties });
    }

    public verifyEmail(email: string, type: string, payload = {}) {
        return this.deriv_api.send({ verify_email: email, type, ...payload });
    }

    public tradingPlatformPasswordChange(payload: object) {
        return this.deriv_api.send({
            trading_platform_password_change: 1,
            ...payload,
        });
    }

    public tradingPlatformPasswordReset(payload: object) {
        return this.deriv_api.send({
            trading_platform_password_reset: 1,
            ...payload,
        });
    }

    public tradingPlatformAvailableAccounts(platform: string) {
        return this.deriv_api.send({
            trading_platform_available_accounts: 1,
            platform,
        });
    }

    public tradingPlatformInvestorPasswordChange(payload: object) {
        return this.deriv_api.send({
            trading_platform_investor_password_change: 1,
            ...payload,
        });
    }

    public tradingPlatformInvestorPasswordReset(payload: object) {
        return this.deriv_api.send({
            trading_platform_investor_password_reset: 1,
            ...payload,
        });
    }

    public activeSymbols(mode = 'brief') {
        return this.deriv_api.activeSymbols(mode);
    }

    public paymentAgentList(country: string, currency: string) {
        return this.deriv_api.send({ paymentagent_list: country, ...(currency && { currency }) });
    }

    public allPaymentAgentList(country: string) {
        return this.deriv_api.send({ paymentagent_list: country });
    }

    public paymentAgentDetails(passthrough: object, req_id: number) {
        return this.deriv_api.send({ paymentagent_details: 1, passthrough, req_id });
    }

    public paymentAgentWithdraw({
        amount,
        currency,
        dry_run = 0,
        loginid,
        verification_code,
    }: {
        amount: number;
        currency: number;
        loginid: string;
        verification_code: string;
        dry_run?: number;
    }) {
        return this.deriv_api.send({
            amount,
            currency,
            dry_run,
            paymentagent_loginid: loginid,
            paymentagent_withdraw: 1,
            verification_code,
        });
    }

    public paymentAgentTransfer({
        amount,
        currency,
        description,
        transfer_to,
        dry_run = 0,
    }: {
        amount: number;
        currency: number;
        description: string;
        transfer_to: string;
        dry_run?: number;
    }) {
        return this.deriv_api.send({
            amount,
            currency,
            description,
            transfer_to,
            paymentagent_transfer: 1,
            dry_run,
        });
    }

    public balanceAll() {
        return this.deriv_api.send({ balance: 1, account: 'all' });
    }

    // if status is up or updating, consider site available
    // if status is down, consider site unavailable
    public setAvailability(status: string) {
        this.availability.is_up = this.isSiteUp(status);
        this.availability.is_updating = this.isSiteUpdating(status);
        this.availability.is_down = this.isSiteDown(status);
    }

    public subscribeBalanceAll(cb: TCallback) {
        return this.subscribe({ balance: 1, account: 'all' }, cb);
    }

    public subscribeBalanceActiveAccount(cb: TCallback, account: object) {
        return this.subscribe({ balance: 1, account }, cb);
    }

    public subscribeProposal(req: object, cb: TCallback) {
        return this.subscribe({ proposal: 1, ...req }, cb);
    }

    public setAccountCurrency(currency: number, passthrough: object) {
        return this.deriv_api.send({
            set_account_currency: currency,
            ...(passthrough && { passthrough }),
        });
    }

    public subscribeProposalOpenContract(contract_id: object, cb: TCallback) {
        return this.subscribe({ proposal_open_contract: 1, ...(contract_id && { contract_id }) }, cb);
    }

    public subscribeTicks(symbol: string, cb: TCallback) {
        return this.subscribe({ ticks: symbol }, cb);
    }

    public subscribeTicksHistory(request_object: object, cb: TCallback) {
        return this.subscribe(request_object, cb);
    }

    public subscribeTransaction(cb: TCallback) {
        return this.subscribe({ transaction: 1 }, cb);
    }

    public subscribeWebsiteStatus(cb: TCallback) {
        return this.subscribe({ website_status: 1 }, cb);
    }

    public tncApproval() {
        return this.deriv_api.send({ tnc_approval: '1' });
    }

    public transferBetweenAccounts(account_from: string, account_to: string, currency: string, amount: number) {
        return this.deriv_api.send({
            transfer_between_accounts: 1,
            accounts: 'all',
            ...(account_from && {
                account_from,
                account_to,
                currency,
                amount,
            }),
        });
    }

    public fetchLoginHistory(limit: number) {
        return this.deriv_api.send({
            login_history: 1,
            limit,
        });
    }

    public closeAndOpenNewConnection(language = getLanguage()) {
        this.close();
        this.is_switching_socket = true;
        this.openNewConnection(language);
    }

    public accountStatistics() {
        return this.deriv_api.send({ account_statistics: 1 });
    }

    public realityCheck() {
        return this.deriv_api.send({ reality_check: 1 });
    }

    public tradingServers(platform: string) {
        return this.deriv_api.send({ platform, trading_servers: 1 });
    }

    public tradingPlatformAccountsList(platform: string) {
        return this.deriv_api.send({
            trading_platform_accounts: 1,
            platform,
        });
    }

    public tradingPlatformNewAccount(values: ITradingPlatformNewAccount) {
        return this.deriv_api.send({
            trading_platform_new_account: 1,
            ...values,
        });
    }

    public triggerMt5DryRun({ email }: { email: string }) {
        return this.deriv_api.send({
            account_type: 'financial',
            dry_run: 1,
            email,
            leverage: 100,
            mainPassword: 'Test1234',
            mt5_account_type: 'financial_stp',
            mt5_new_account: 1,
            name: 'test real labuan financial stp',
        });
    }

    public getServiceToken(platform: number, server: string) {
        return this.deriv_api.send({
            service_token: 1,
            service: platform,
            server,
        });
    }

    public changeEmail(api_request: IApiRequest) {
        return this.deriv_api.send(api_request);
    }

    // private getSocketUrl(language: string): string {
    //     return `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${language}&brand=${website_name.toLowerCase()}`;
    // }

    // HINT: In order to remove unnecessary mock on getLanguage, getSocketUrl, etc, we just pass whatever is needed here.
    private getSocketUrl(language: string): string {
        return `wss://test.ws.com/websockets/v3?app_id=1010&l=en&brand=deriv`;
    }

    private isClose() {
        return !this.binary_socket || this.hasReadyState(2, 3);
    }

    private hasReadyState(...states: Array<number>) {
        return this.binary_socket && states.some(s => this.binary_socket?.readyState === s);
    }

    private isSiteUp(status: string) {
        return /^up$/i.test(status);
    }

    private subscribe(request: object, cb: TCallback) {
        return this.deriv_api.subscribe(request).subscribe(cb, cb); // Delegate error handling to the callback
    }
}

const socket = new BinarySocketBase();

type TSocketType = keyof BinarySocketBase;

export type TAuthorizedSocket = BinarySocketBase & { authorized?: BinarySocketBase };

const socket_proxy: TAuthorizedSocket = new Proxy(socket, {
    get: (target, field: TSocketType) => {
        if (Object.hasOwn(target, field) || target[field]) {
            return target[field];
        }
        const api = target.deriv_api;
        const value = api[field];
        if (value) {
            if (typeof value === 'function') {
                return value.bind(api);
            }
            return value;
        }
        return undefined;
    },
});

socket_proxy.authorized = new Proxy(socket_proxy, {
    get: (target, prop: TSocketType) => {
        if (Object.hasOwn(target, prop) || target[prop]) {
            return target[prop];
        }
        const api = target.deriv_api;
        if (Object.hasOwn(api, prop) || api[prop]) {
            if (typeof api[prop] === 'function') {
                return (...args: Array<unknown>) => target.wait('authorize').then(() => api[prop](...args));
            }
            return api[prop];
        }
        return undefined;
    },
});
export default socket_proxy;
