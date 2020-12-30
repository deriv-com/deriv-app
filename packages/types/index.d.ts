/**
 * List of active symbols.
 */
export type ActiveSymbols = {
    /**
     * `1` if the symbol is tradable in a forward starting contract, `0` if not.
     */
    allow_forward_starting?: 0 | 1;
    /**
     * Amount the data feed is delayed (in minutes) due to Exchange licensing requirements. Only returned on `full` active symbols call.
     */
    delay_amount?: number;
    /**
     * Display name.
     */
    display_name: string;
    /**
     * `1` if market is currently open, `0` if closed.
     */
    exchange_is_open: 0 | 1;
    /**
     * Exchange name (for underlyings listed on a Stock Exchange). Only returned on `full` active symbols call.
     */
    exchange_name?: string;
    /**
     * Intraday interval minutes. Only returned on `full` active symbols call.
     */
    intraday_interval_minutes?: number;
    /**
     * `1` indicates that trading is currently suspended, `0` if not.
     */
    is_trading_suspended: 0 | 1;
    /**
     * Market category (forex, indices, etc).
     */
    market: string;
    /**
     * Translated market name.
     */
    market_display_name: string;
    /**
     * Pip size (i.e. minimum fluctuation amount).
     */
    pip: number;
    /**
     * For stock indices, the underlying currency for that instrument. Only returned on `full` active symbols call.
     */
    quoted_currency_symbol?: string;
    /**
     * Latest spot price of the underlying. Only returned on `full` active symbols call.
     */
    spot?: null | number;
    /**
     * Number of seconds elapsed since the last spot price. Only returned on `full` active symbols call.
     */
    spot_age?: string;
    /**
     * Latest spot epoch time. Only returned on `full` active symbols call.
     */
    spot_time?: string;
    /**
     * Submarket name.
     */
    submarket: string;
    /**
     * Translated submarket name.
     */
    submarket_display_name: string;
    /**
     * The symbol code for this underlying.
     */
    symbol: string;
    /**
     * Symbol type (forex, commodities, etc).
     */
    symbol_type: string;
    [k: string]: unknown;
}[];

/**
 * A message containing the list of active symbols.
 */
export interface ActiveSymbolsResponse {
    active_symbols?: ActiveSymbols;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'active_symbols';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Retrieve a list of all currently active symbols (underlying markets upon which contracts are available for trading).
 */
export interface ActiveSymbolsRequest {
    /**
     * If you use `brief`, only a subset of fields will be returned.
     */
    active_symbols: 'brief' | 'full';
    /**
     * [Optional] If you specify this field, only symbols available for trading by that landing company will be returned. If you are logged in, only symbols available for trading by your landing company will be returned regardless of what you specify in this field.
     */
    landing_company?: 'iom' | 'malta' | 'maltainvest' | 'svg' | 'virtual' | 'vanuatu' | 'champion' | 'champion-virtual';
    /**
     * [Optional] If you specify this field, only symbols that can be traded through that product type will be returned.
     */
    product_type?: 'basic';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * The result of the API token request made.
 */
export interface APITokenResponse {
    api_token?: ApiToken;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'api_token';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Contains the result of API token according to the type of request.
 */
export interface ApiToken {
    /**
     * Token deleted.
     */
    delete_token?: 1;
    /**
     * Token created.
     */
    new_token?: 1;
    /**
     * API tokens
     */
    tokens?: {
        /**
         * The token name specified when creating.
         */
        display_name?: string;
        /**
         * The last date which the token has been used.
         */
        last_used?: string;
        /**
         * List of permission scopes of the token.
         */
        scopes?: ('read' | 'trade' | 'trading_information' | 'payments' | 'admin')[];
        /**
         * The token that can be used to `authorize` with.
         */
        token?: string;
        /**
         * The IP restriction for the token. No restriction if empty.
         */
        valid_for_ip?: string;
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * This call manages API tokens
 */
export interface APITokenRequest {
    /**
     * Must be `1`
     */
    api_token: 1;
    /**
     * [Optional] The token to remove.
     */
    delete_token?: string;
    /**
     * [Optional] The name of the created token.
     */
    new_token?: string;
    /**
     * [Optional] List of permission scopes to provide with the token.
     */
    new_token_scopes?: ('read' | 'trade' | 'trading_information' | 'payments' | 'admin')[];
    /**
     * [Optional] If you set this parameter during token creation, then the token created will only work for the IP address that was used to create the token
     */
    valid_for_current_ip_only?: 0 | 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * 1 on success
 */
export type AppDelete = number;

/**
 * The result of delete application request made.
 */
export interface ApplicationDeleteResponse {
    app_delete?: AppDelete;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'app_delete';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The request for deleting an application.
 */
export interface ApplicationDeleteRequest {
    /**
     * Application app_id
     */
    app_delete: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with requested application details
 */
export interface ApplicationGetDetailsResponse {
    app_get?: AppGet;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'app_get';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The information of the requested application.
 */
export interface AppGet {
    /**
     * Application ID.
     */
    app_id: number;
    /**
     * Markup added to contract prices (as a percentage of contract payout).
     */
    app_markup_percentage: number;
    /**
     * Application's App Store URL.
     */
    appstore: string;
    /**
     * Application's GitHub page (for open-source projects).
     */
    github: string;
    /**
     * Application's Google Play URL.
     */
    googleplay: string;
    /**
     * Application's homepage URL.
     */
    homepage: string;
    /**
     * Application name.
     */
    name: string;
    /**
     * The URL to redirect to after a successful login.
     */
    redirect_uri: string;
    /**
     * Used when `verify_email` called. If available, a URL containing the verification token will send to the client's email, otherwise only the token will be sent.
     */
    verification_uri: string;
    [k: string]: unknown;
}
/**
 * To get the information of the OAuth application specified by 'app_id'
 */
export interface ApplicationGetDetailsRequest {
    /**
     * Application app_id
     */
    app_get: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * List of created applications for the authorized account.
 */
export type AppList = ApplicationObject[];

/**
 * A message with created applications
 */
export interface ApplicationListResponse {
    app_list?: AppList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'app_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
export interface ApplicationObject {
    /**
     * Application ID.
     */
    app_id: number;
    /**
     * Markup added to contract prices (as a percentage of contract payout).
     */
    app_markup_percentage: number;
    /**
     * Application's App Store URL.
     */
    appstore: null | string;
    /**
     * Application's GitHub page. (for open-source projects)
     */
    github: null | string;
    /**
     * Application's Google Play URL.
     */
    googleplay: null | string;
    /**
     * Application's homepage URL.
     */
    homepage: null | string;
    /**
     * Application name.
     */
    name: string;
    /**
     * The URL to redirect to after a successful login.
     */
    redirect_uri: string;
    /**
     * Used when `verify_email` called. If available, a URL containing the verification token will send to the client's email, otherwise only the token will be sent.
     */
    verification_uri: null | string;
    [k: string]: unknown;
}
/**
 * List all of the account's OAuth applications
 */
export interface ApplicationListRequest {
    /**
     * Must be `1`
     */
    app_list: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Per transaction reporting of app_markup
 */
export interface ApplicationMarkupDetailsResponse {
    app_markup_details?: AppMarkupDetails;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'app_markup_details';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * App Markup transaction details
 */
export interface AppMarkupDetails {
    /**
     * Array of returned transactions
     */
    transactions?: {
        /**
         * ID of the application where this contract was purchased.
         */
        app_id?: number;
        /**
         * The markup the client paid in their currency
         */
        app_markup?: number;
        /**
         * The markup the client paid in USD
         */
        app_markup_usd?: number;
        /**
         * The markup the client paid in the app developer's currency
         */
        app_markup_value?: number;
        /**
         * Currency code of the client
         */
        client_currcode?: string;
        /**
         * Login ID of the client
         */
        client_loginid?: string;
        /**
         * Currency code of the app developer
         */
        dev_currcode?: string;
        /**
         * Login ID of the app developer
         */
        dev_loginid?: string;
        /**
         * The transaction ID. Every contract (buy or sell) and every payment has a unique ID.
         */
        transaction_id?: number;
        /**
         * The epoch value of purchase time of transaction
         */
        transaction_time?: string;
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * Retrieve details of `app_markup` according to criteria specified.
 */
export interface ApplicationMarkupDetailsRequest {
    /**
     * Must be `1`
     */
    app_markup_details: 1;
    /**
     * [Optional] Specific application `app_id` to report on.
     */
    app_id?: number;
    /**
     * [Optional] Specific client loginid to report on, like CR12345
     */
    client_loginid?: string;
    /**
     * Start date (epoch or YYYY-MM-DD HH:MM:SS). Results are inclusive of this time.
     */
    date_from: string;
    /**
     * End date (epoch or YYYY-MM-DD HH::MM::SS). Results are inclusive of this time.
     */
    date_to: string;
    /**
     * [Optional] If set to 1, will return `app_markup` transaction details.
     */
    description?: 0 | 1;
    /**
     * [Optional] Apply upper limit to count of transactions received.
     */
    limit?: number;
    /**
     * [Optional] Number of transactions to skip.
     */
    offset?: number;
    /**
     * [Optional] Sort direction on `transaction_time`. Other fields sort order is ASC.
     */
    sort?: 'ASC' | 'DESC';
    /**
     * [Optional] One or more of the specified fields to sort on. Default sort field is by `transaction_time`.
     */
    sort_fields?:
        | []
        | ['app_id' | 'client_loginid' | 'transaction_time']
        | ['app_id' | 'client_loginid' | 'transaction_time', 'app_id' | 'client_loginid' | 'transaction_time']
        | [
              'app_id' | 'client_loginid' | 'transaction_time',
              'app_id' | 'client_loginid' | 'transaction_time',
              'app_id' | 'client_loginid' | 'transaction_time'
          ];
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with created application details
 */
export interface ApplicationRegisterResponse {
    app_register?: AppRegister;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'app_register';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The information of the created application.
 */
export interface AppRegister {
    /**
     * Application ID.
     */
    app_id: number;
    /**
     * Markup added to contract prices (as a percentage of contract payout).
     */
    app_markup_percentage: number;
    /**
     * Application's App Store URL.
     */
    appstore: string;
    /**
     * Application's GitHub page (for open-source projects).
     */
    github: string;
    /**
     * Application's Google Play URL.
     */
    googleplay: string;
    /**
     * Application's homepage URL.
     */
    homepage: string;
    /**
     * Application name.
     */
    name: string;
    /**
     * The URL to redirect to after a successful login.
     */
    redirect_uri: string;
    /**
     * Used when `verify_email` called. If available, a URL containing the verification token will send to the client's email, otherwise only the token will be sent.
     */
    verification_uri: string;
    [k: string]: unknown;
}
/**
 * Register a new OAuth application
 */
export interface ApplicationRegisterRequest {
    /**
     * Must be `1`
     */
    app_register: 1;
    /**
     * [Optional] Markup to be added to contract prices (as a percentage of contract payout).
     */
    app_markup_percentage?: number;
    /**
     * [Optional] Application's App Store URL (if applicable).
     */
    appstore?: string;
    /**
     * [Optional] Application's GitHub page (for open-source projects).
     */
    github?: string;
    /**
     * [Optional] Application's Google Play URL (if applicable).
     */
    googleplay?: string;
    /**
     * [Optional] Application's homepage URL.
     */
    homepage?: string;
    /**
     * Application name.
     */
    name: string;
    /**
     * The URL to redirect to after a successful login.
     */
    redirect_uri: string;
    /**
     * List of permission scopes to grant the application.
     */
    scopes: ('read' | 'trade' | 'trading_information' | 'payments' | 'admin')[];
    /**
     * [Optional] Used when `verify_email` called. If available, a URL containing the verification token will be sent to the client's email, otherwise only the token will be sent.
     */
    verification_uri?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with created application
 */
export interface ApplicationUpdateResponse {
    app_update?: AppUpdate;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'app_update';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Information of the updated application.
 */
export interface AppUpdate {
    /**
     * Application ID.
     */
    app_id?: number;
    /**
     * Markup added to contract prices (as a percentage of contract payout).
     */
    app_markup_percentage?: number;
    /**
     * Application's App Store URL.
     */
    appstore?: string;
    /**
     * Application's GitHub page (for open-source projects).
     */
    github?: string;
    /**
     * Application's Google Play URL.
     */
    googleplay?: string;
    /**
     * Application's homepage URL.
     */
    homepage?: string;
    /**
     * Application name.
     */
    name?: string;
    /**
     * The URL to redirect to after a successful login.
     */
    redirect_uri?: string;
    /**
     * Used when `verify_email` called. If available, a URL containing the verification token will be sent to the client's email, otherwise only the token will be sent.
     */
    verification_uri?: string;
    [k: string]: unknown;
}
/**
 * Update a new OAuth application
 */
export interface ApplicationUpdateRequest {
    /**
     * Application app_id.
     */
    app_update: number;
    /**
     * [Optional] Markup to be added to contract prices (as a percentage of contract payout).
     */
    app_markup_percentage?: number;
    /**
     * [Optional] Application's App Store URL (if applicable).
     */
    appstore?: string;
    /**
     * [Optional] Application's GitHub page (for open-source projects).
     */
    github?: string;
    /**
     * [Optional] Application's Google Play URL (if applicable).
     */
    googleplay?: string;
    /**
     * [Optional] Application's homepage URL.
     */
    homepage?: string;
    /**
     * Application name.
     */
    name: string;
    /**
     * The URL to redirect to after a successful login.
     */
    redirect_uri: string;
    /**
     * Change scopes will revoke all user's grants and log them out.
     */
    scopes: ('read' | 'trade' | 'trading_information' | 'payments' | 'admin')[];
    /**
     * [Optional] Used when `verify_email` called. If available, a URL containing the verification token will send to the client's email, otherwise only the token will be sent.
     */
    verification_uri?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * List of underlyings by their display name and symbol followed by their available contract types and duration boundaries.
 */
export type AssetIndex = unknown[];

/**
 * A message with Asset Index
 */
export interface AssetIndexResponse {
    asset_index?: AssetIndex;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'asset_index';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Retrieve a list of all available underlyings and the corresponding contract types and duration boundaries. If the user is logged in, only the assets available for that user's landing company will be returned.
 */
export interface AssetIndexRequest {
    /**
     * Must be `1`
     */
    asset_index: 1;
    /**
     * [Optional] If specified, will return only the underlyings for the specified landing company.
     */
    landing_company?: 'iom' | 'malta' | 'maltainvest' | 'svg' | 'virtual' | 'vanuatu' | 'champion' | 'champion-virtual';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message containing account information for the holder of that token.
 */
export interface AuthorizeResponse {
    authorize?: Authorize;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'authorize';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Account information for the holder of the token.
 */
export interface Authorize {
    /**
     * List of accounts for current user.
     */
    account_list?: {
        /**
         * Currency of specified account.
         */
        currency?: string;
        /**
         * Epoch of date till client has excluded him/herself from the website, only present if client is self excluded.
         */
        excluded_until?: number;
        /**
         * Boolean value: 1 or 0, indicating whether the account is marked as disabled or not.
         */
        is_disabled?: 1 | 0;
        /**
         * Boolean value: 1 or 0, indicating whether the account is a virtual-money account.
         */
        is_virtual?: 1 | 0;
        /**
         * Landing company shortcode the account belongs to.
         */
        landing_company_name?: string;
        /**
         * The account ID of specified account.
         */
        loginid?: string;
        [k: string]: unknown;
    }[];
    /**
     * Cash balance of the account.
     */
    balance?: number;
    /**
     * 2-letter country code (ISO standard).
     */
    country?: string;
    /**
     * Currency of the account.
     */
    currency?: string;
    /**
     * User email.
     */
    email?: string;
    /**
     * User's full name. Will be empty for virtual accounts.
     */
    fullname?: string;
    /**
     * Boolean value: 1 or 0, indicating whether the account is a virtual-money account.
     */
    is_virtual?: 0 | 1;
    /**
     * Landing company name the account belongs to.
     */
    landing_company_fullname?: string;
    /**
     * Landing company shortcode the account belongs to.
     */
    landing_company_name?: string;
    /**
     * Currencies in client's residence country
     */
    local_currencies?: {
        /**
         * Currency code
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[a-zA-Z0-9]{2,20}$".
         */
        [k: string]: {
            /**
             * Number of fractional digits.
             */
            fractional_digits: number;
            [k: string]: unknown;
        };
    };
    /**
     * The account ID that the token was issued for.
     */
    loginid?: string;
    /**
     * Scopes available to the token.
     */
    scopes?: string[];
    /**
     * List of landing company shortcodes the account can upgrade to.
     */
    upgradeable_landing_companies?: unknown[];
    /**
     * The internal user ID for this account.
     */
    user_id?: number;
    [k: string]: unknown;
}
/**
 * Authorize current WebSocket session to act on behalf of the owner of a given token. Must precede requests that need to access client account, for example purchasing and selling contracts or viewing portfolio.
 */
export interface AuthorizeRequest {
    /**
     * Authentication token. May be retrieved from https://www.binary.com/en/user/security/api_tokenws.html
     */
    authorize: string;
    /**
     * [Optional] Send this when you use api tokens for authorization and want to track activity using `login_history` call.
     */
    add_to_login_history?: 1 | 0;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Return details of user account balance
 */
export interface BalanceResponse {
    balance?: Balance;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'balance';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Current balance of one or more accounts.
 */
export interface Balance {
    /**
     * Balance of current account.
     */
    balance: number;
    /**
     * List of active accounts.
     */
    accounts?: {
        /**
         * Individual accounts details.
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^.+[0-9]{3,}$".
         */
        [k: string]: {
            /**
             * Account balance
             */
            balance: number;
            /**
             * Account balance converted the total currency.
             */
            converted_amount: number;
            /**
             * Account currency.
             */
            currency: string;
            /**
             * If set to 1, this is a demo account.
             */
            demo_account: 0 | 1;
            /**
             * Type of account.
             */
            type: 'mt5' | 'deriv';
        };
    };
    /**
     * Currency of current account.
     */
    currency: string;
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id?: string;
    /**
     * Client loginid.
     */
    loginid: string;
    /**
     * Summary totals of accounts by type.
     */
    total?: {
        /**
         * Total balance of all real money Deriv accounts.
         */
        deriv?: {
            /**
             * Total of balances.
             */
            amount: number;
            /**
             * Currency of total.
             */
            currency: string;
            [k: string]: unknown;
        };
        /**
         * Total balance of all demo Deriv accounts.
         */
        deriv_demo?: {
            /**
             * Total of balances.
             */
            amount: number;
            /**
             * Currency of total.
             */
            currency: string;
            [k: string]: unknown;
        };
        /**
         * Total balance of all MT5 real money accounts.
         */
        mt5?: {
            /**
             * Total balance of all MT5 accounts
             */
            amount: number;
            /**
             * Currency of total.
             */
            currency: string;
            [k: string]: unknown;
        };
        /**
         * Total balance of all MT5 demo accounts.
         */
        mt5_demo?: {
            /**
             * Total of balances.
             */
            amount: number;
            /**
             * Currency of total.
             */
            currency: string;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Get user account balance
 */
export interface BalanceRequest {
    /**
     * Must be `1`
     */
    balance: 1;
    /**
     * [Optional] If set to `all`, return the balances of all accounts one by one; if set to `current`, return the balance of current account; if set as an account id, return the balance of that account.
     */
    account?: string;
    /**
     * [Optional] If set to 1, will send updates whenever the balance changes.
     */
    subscribe?: 0 | 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with transaction results is received
 */
export interface BuyContractForMultipleAccountsResponse {
    buy_contract_for_multiple_accounts?: BuyContractForMultipleAccounts;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'buy_contract_for_multiple_accounts';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Receipt confirmation for the purchase
 */
export interface BuyContractForMultipleAccounts {
    /**
     * List of results containing transactions and/or errors for the bought contracts.
     */
    result: (
        | {
              /**
               * Actual effected purchase price
               */
              buy_price: number;
              /**
               * Internal contract identifier
               */
              contract_id: number;
              /**
               * The description of contract purchased
               */
              longcode: string;
              /**
               * Proposed payout value
               */
              payout: number;
              /**
               * Epoch value of the transaction purchase time
               */
              purchase_time: number;
              /**
               * Compact description of the contract purchased
               */
              shortcode: string;
              /**
               * Epoch value showing the expected start time of the contract
               */
              start_time: number;
              /**
               * The token designating the account
               */
              token: string;
              /**
               * Internal transaction identifier
               */
              transaction_id: number;
          }
        | {
              /**
               * An error code
               */
              code: string;
              /**
               * An error message localized according to the websocket
               */
              message_to_client: string;
              /**
               * The token designating the account
               */
              token: string;
          }
    )[];
}
/**
 * Buy a Contract for multiple Accounts specified by the `tokens` parameter. Note, although this is an authorized call, the contract is not bought for the authorized account.
 */
export interface BuyContractForMultipleAccountsRequest {
    /**
     * Either the ID received from a Price Proposal (`proposal` call), or `1` if contract buy parameters are passed in the `parameters` field.
     */
    buy_contract_for_multiple_accounts: string;
    /**
     * [Optional] Used to pass the parameters for contract buy.
     */
    parameters?: {
        /**
         * [Optional] Proposed `payout` or `stake` value
         */
        amount?: number;
        /**
         * [Optional] Markup added to contract prices (as a percentage of contract payout)
         */
        app_markup_percentage?: number;
        /**
         * [Optional] Barrier for the contract (or last digit prediction for digit contracts). Contracts less than 24 hours in duration would need a relative barrier (barriers which need +/-), where entry spot would be adjusted accordingly with that amount to define a barrier, except for Synthetic Indices as they support both relative and absolute barriers.
         */
        barrier?: string;
        /**
         * [Optional] Low barrier for the contract (for contracts with two barriers). Contracts less than 24 hours in duration would need a relative barrier (barriers which need +/-), where entry spot would be adjusted accordingly with that amount to define a barrier, except for Synthetic Indices as they support both relative and absolute barriers.
         */
        barrier2?: string;
        /**
         * [Optional] Indicate whether amount is 'payout' or 'stake'.
         */
        basis?: 'payout' | 'stake';
        /**
         * A valid contract-type
         */
        contract_type:
            | 'MULTUP'
            | 'MULTDOWN'
            | 'UPORDOWN'
            | 'EXPIRYRANGE'
            | 'ONETOUCH'
            | 'CALLE'
            | 'LBHIGHLOW'
            | 'ASIAND'
            | 'EXPIRYRANGEE'
            | 'DIGITDIFF'
            | 'DIGITMATCH'
            | 'DIGITOVER'
            | 'PUTE'
            | 'DIGITUNDER'
            | 'NOTOUCH'
            | 'CALL'
            | 'RANGE'
            | 'LBFLOATPUT'
            | 'DIGITODD'
            | 'PUT'
            | 'ASIANU'
            | 'LBFLOATCALL'
            | 'EXPIRYMISSE'
            | 'EXPIRYMISS'
            | 'DIGITEVEN'
            | 'TICKHIGH'
            | 'TICKLOW'
            | 'RESETCALL'
            | 'RESETPUT'
            | 'CALLSPREAD'
            | 'PUTSPREAD'
            | 'RUNHIGH'
            | 'RUNLOW';
        /**
         * This can only be the account-holder's currency
         */
        currency: string;
        /**
         * [Optional] Epoch value of the expiry time of the contract. You must either specify `date_expiry` or `duration`.
         */
        date_expiry?: number;
        /**
         * [Optional] For forward-starting contracts, epoch value of the starting time of the contract.
         */
        date_start?: number;
        /**
         * [Optional] Duration quantity
         */
        duration?: number;
        /**
         * [Optional] Duration unit is `s`: seconds, `m`: minutes, `h`: hours, `d`: days, `t`: ticks
         */
        duration_unit?: 'd' | 'm' | 's' | 'h' | 't';
        /**
         * [Optional] The multiplier for non-binary options. E.g. lookbacks.
         */
        multiplier?: number;
        /**
         * [Optional] The tick that is predicted to have the highest/lowest value - for tickhigh and ticklow contracts.
         */
        selected_tick?: number;
        /**
         * Symbol code
         */
        symbol: string;
    };
    /**
     * Maximum price at which to purchase the contract.
     */
    price: number;
    /**
     * List of API tokens identifying the accounts for which the contract is bought. Note: If the same token appears multiple times or if multiple tokens designate the same account, the contract is bought multiple times for this account.
     */
    tokens: string[];
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with transaction results is received
 */
export interface BuyContractResponse {
    buy?: Buy;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'buy';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Receipt confirmation for the purchase
 */
export interface Buy {
    /**
     * The new account balance after completion of the purchase
     */
    balance_after: number;
    /**
     * Actual effected purchase price
     */
    buy_price: number;
    /**
     * Internal contract identifier
     */
    contract_id: number;
    /**
     * The description of contract purchased
     */
    longcode: string;
    /**
     * Proposed payout value
     */
    payout: number;
    /**
     * Epoch value of the transaction purchase time
     */
    purchase_time: number;
    /**
     * Compact description of the contract purchased
     */
    shortcode: string;
    /**
     * Epoch value showing the expected start time of the contract
     */
    start_time: number;
    /**
     * Internal transaction identifier
     */
    transaction_id: number;
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Buy a Contract
 */
export interface BuyContractRequest {
    /**
     * Either the ID received from a Price Proposal (`proposal` call), or `1` if contract buy parameters are passed in the `parameters` field.
     */
    buy: string;
    /**
     * [Optional] Used to pass the parameters for contract buy.
     */
    parameters?: {
        /**
         * [Optional] Proposed payout or stake value
         */
        amount?: number;
        /**
         * [Optional] Markup added to contract prices (as a percentage of contract payout)
         */
        app_markup_percentage?: number;
        /**
         * [Optional] Barrier for the contract (or last digit prediction for digit contracts). Contracts less than 24 hours in duration would need a relative barrier (barriers which need +/-), where entry spot would be adjusted accordingly with that amount to define a barrier, except for Synthetic Indices as they support both relative and absolute barriers.
         */
        barrier?: string;
        /**
         * [Optional] Low barrier for the contract (for contracts with two barriers). Contracts less than 24 hours in duration would need a relative barrier (barriers which need +/-), where entry spot would be adjusted accordingly with that amount to define a barrier, except for Synthetic Indices as they support both relative and absolute barriers.
         */
        barrier2?: string;
        /**
         * [Optional] Indicates whether amount is 'payout' or 'stake' for binary options.
         */
        basis?: 'payout' | 'stake';
        /**
         * Cancellation duration option (only for `MULTUP` and `MULTDOWN` contracts).
         */
        cancellation?: string;
        /**
         * A valid contract-type
         */
        contract_type:
            | 'MULTUP'
            | 'MULTDOWN'
            | 'UPORDOWN'
            | 'EXPIRYRANGE'
            | 'ONETOUCH'
            | 'CALLE'
            | 'LBHIGHLOW'
            | 'ASIAND'
            | 'EXPIRYRANGEE'
            | 'DIGITDIFF'
            | 'DIGITMATCH'
            | 'DIGITOVER'
            | 'PUTE'
            | 'DIGITUNDER'
            | 'NOTOUCH'
            | 'CALL'
            | 'RANGE'
            | 'LBFLOATPUT'
            | 'DIGITODD'
            | 'PUT'
            | 'ASIANU'
            | 'LBFLOATCALL'
            | 'EXPIRYMISSE'
            | 'EXPIRYMISS'
            | 'DIGITEVEN'
            | 'TICKHIGH'
            | 'TICKLOW'
            | 'RESETCALL'
            | 'RESETPUT'
            | 'CALLSPREAD'
            | 'PUTSPREAD'
            | 'RUNHIGH'
            | 'RUNLOW';
        /**
         * This can only be the account-holder's currency
         */
        currency: string;
        /**
         * [Optional] Epoch value of the expiry time of the contract. You must either specify date_expiry or duration.
         */
        date_expiry?: number;
        /**
         * [Optional] For forward-starting contracts, epoch value of the starting time of the contract.
         */
        date_start?: number;
        /**
         * [Optional] Duration quantity
         */
        duration?: number;
        /**
         * [Optional] Duration unit is `s`: seconds, `m`: minutes, `h`: hours, `d`: days, `t`: ticks
         */
        duration_unit?: 'd' | 'm' | 's' | 'h' | 't';
        /**
         * Add an order to close the contract once the order condition is met (only for `MULTUP` and `MULTDOWN` contracts).
         */
        limit_order?: {
            /**
             * Contract will be automatically closed when the value of the contract reaches a specific loss.
             */
            stop_loss?: number;
            /**
             * Contract will be automatically closed when the value of the contract reaches a specific profit.
             */
            take_profit?: number;
        };
        /**
         * [Optional] The multiplier for non-binary options. E.g. lookbacks.
         */
        multiplier?: number;
        /**
         * [Optional] The product type.
         */
        product_type?: 'basic';
        /**
         * [Optional] The tick that is predicted to have the highest/lowest value - for tickhigh and ticklow contracts.
         */
        selected_tick?: number;
        /**
         * Symbol code
         */
        symbol: string;
        /**
         * [Optional] An epoch value of a predefined trading period start time
         */
        trading_period_start?: number;
    };
    /**
     * Maximum price at which to purchase the contract.
     */
    price: number;
    /**
     * [Optional] `1` to stream.
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with transaction results is received
 */
export interface CancelAContractResponse {
    cancel?: Cancel;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'cancel';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Receipt for the transaction
 */
export interface Cancel {
    /**
     * New account balance after completion of the sale
     */
    balance_after?: number;
    /**
     * Internal contract identifier for the sold contract
     */
    contract_id?: number;
    /**
     * Internal transaction identifier for the corresponding buy transaction
     */
    reference_id?: number;
    /**
     * Actual effected sale price
     */
    sold_for?: number;
    /**
     * Internal transaction identifier for the sale transaction
     */
    transaction_id?: number;
    [k: string]: unknown;
}
/**
 * Cancel contract with contract id
 */
export interface CancelAContractRequest {
    /**
     * Value should be the `contract_id` which received from the `portfolio` call.
     */
    cancel: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Possible error codes are:
 * - `ASK_TNC_APPROVAL`: API call `tnc_approval`
 * - `ASK_AUTHENTICATE`
 * - `ASK_UK_FUNDS_PROTECTION`: API call `tnc_approval`
 * - `ASK_CURRENCY`: API call `set_account_currency`
 * - `ASK_EMAIL_VERIFY`: API call `verify_email`
 * - `ASK_FIX_DETAILS`: API call `set_settings`
 */
export type Cashier =
    | string
    | {
          /**
           * Type of operation, which is requested.
           */
          action?: 'deposit';
          /**
           * [Optional] Result for deposit operation.
           */
          deposit?: {
              /**
               * Address for crypto deposit.
               */
              address?: string;
              [k: string]: unknown;
          };
          [k: string]: unknown;
      };

/**
 * Cashier information for the specified type.
 */
export interface CashierInformationResponse {
    cashier?: Cashier;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'cashier';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Request the cashier info for the specified type.
 */
export interface CashierInformationRequest {
    /**
     * Operation which needs to be requested from cashier
     */
    cashier: 'deposit' | 'withdraw';
    /**
     * [Optional] Cashier provider. `crypto` will be default option for crypto currency accounts.
     */
    provider?: 'doughflow' | 'crypto';
    /**
     * [Optional] Data need to be returned from cashier. `api` is supported only for `crypto` provider with `deposit` operation.
     */
    type?: 'url' | 'api';
    /**
     * [Optional] Email verification code (received from a `verify_email` call, which must be done first)
     */
    verification_code?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Contains the historical and the most recent update status of the contract
 */
export type ContractUpdateHistory = {
    /**
     * Display name of the changed parameter.
     */
    display_name?: string;
    /**
     * The amount.
     */
    order_amount?: string;
    /**
     * The epoch when the changed was done.
     */
    order_date?: number;
    /**
     * The contract parameter updated.
     */
    order_type?: string;
    /**
     * The pip-sized barrier value.
     */
    value?: null | string;
    [k: string]: unknown;
}[];

/**
 * Contract update history status
 */
export interface UpdateContractHistoryResponse {
    contract_update_history?: ContractUpdateHistory;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'contract_update_history';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Request for contract update history.
 */
export interface UpdateContractHistoryRequest {
    /**
     * Must be `1`
     */
    contract_update_history: 1;
    /**
     * Internal unique contract identifier.
     */
    contract_id: number;
    /**
     * [Optional] Maximum number of historical updates to receive.
     */
    limit?: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Contract update status
 */
export interface UpdateContractResponse {
    contract_update?: ContractUpdate;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'contract_update';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Contains the update status of the request
 */
export interface ContractUpdate {
    /**
     * The target spot price where the contract will be closed automatically at the loss specified by the user.
     */
    stop_loss?: {
        /**
         * Localized display name
         */
        display_name?: string;
        /**
         * Stop loss amount
         */
        order_amount?: null | number;
        /**
         * Stop loss order epoch
         */
        order_date?: number;
        /**
         * Stop loss pip-sized barrier value
         */
        value?: null | string;
        [k: string]: unknown;
    };
    /**
     * The target spot price where the contract will be closed automatically at the profit specified by the user.
     */
    take_profit?: {
        /**
         * Localized display name
         */
        display_name?: string;
        /**
         * Take profit amount
         */
        order_amount?: null | number;
        /**
         * Take profit order epoch
         */
        order_date?: number;
        /**
         * Take profit pip-sized barrier value
         */
        value?: null | string;
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
/**
 * Update a contract condition.
 */
export interface UpdateContractRequest {
    /**
     * Must be `1`
     */
    contract_update: 1;
    /**
     * Internal unique contract identifier.
     */
    contract_id: number;
    /**
     * Specify limit order to update.
     */
    limit_order: {
        /**
         * New stop loss value for a contract. To cancel, pass `null`.
         */
        stop_loss?: null | number;
        /**
         * New take profit value for a contract. To cancel, pass `null`.
         */
        take_profit?: null | number;
    };
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Get the list of currently available contracts
 */
export interface ContractsForSymbolResponse {
    contracts_for?: ContractsFor;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'contracts_for';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * List of available contracts. Note: if the user is authenticated, then only contracts allowed under his account will be returned.
 */
export interface ContractsFor {
    /**
     * Array of available contracts details
     */
    available: [
        {
            /**
             * Array of available barriers for a predefined trading period
             */
            available_barriers?: [unknown, ...unknown[]];
            /**
             * Category of barrier.
             */
            barrier_category: string;
            /**
             * Number of barriers.
             */
            barriers: number;
            /**
             * Category of contract.
             */
            contract_category: string;
            /**
             * Category of the contract.
             */
            contract_category_display: string;
            /**
             * Type of contract.
             */
            contract_type: string;
            /**
             * Type of contract.
             */
            contracts_display?: string;
            /**
             * Name of exchange
             */
            exchange_name: string;
            /**
             * Array of barriers already expired
             */
            expired_barriers?: unknown[];
            /**
             * Expiry Type.
             */
            expiry_type: string;
            /**
             * Array of returned forward starting options
             */
            forward_starting_options?: [
                {
                    /**
                     * The epoch value for the closing date of forward starting session.
                     */
                    close?: string;
                    /**
                     * The epoch value for the date of forward starting session.
                     */
                    date?: string;
                    /**
                     * The epoch value for the opening date of forward starting session.
                     */
                    open?: string;
                    [k: string]: unknown;
                },
                ...{
                    /**
                     * The epoch value for the closing date of forward starting session.
                     */
                    close?: string;
                    /**
                     * The epoch value for the date of forward starting session.
                     */
                    date?: string;
                    /**
                     * The epoch value for the opening date of forward starting session.
                     */
                    open?: string;
                    [k: string]: unknown;
                }[]
            ];
            /**
             * Type of market.
             */
            market: string;
            /**
             * Maximum contract duration
             */
            max_contract_duration: string;
            /**
             * Minimum contract duration.
             */
            min_contract_duration: string;
            /**
             * Maximum payout.
             */
            payout_limit?: number;
            /**
             * Type of sentiment.
             */
            sentiment: string;
            /**
             * Start Type.
             */
            start_type: string;
            /**
             * Type of submarket.
             */
            submarket: string;
            /**
             * A hash of predefined trading period
             */
            trading_period?: {
                [k: string]: unknown;
            };
            /**
             * Symbol code
             */
            underlying_symbol: string;
            [k: string]: unknown;
        },
        ...{
            /**
             * Array of available barriers for a predefined trading period
             */
            available_barriers?: [unknown, ...unknown[]];
            /**
             * Category of barrier.
             */
            barrier_category: string;
            /**
             * Number of barriers.
             */
            barriers: number;
            /**
             * Category of contract.
             */
            contract_category: string;
            /**
             * Category of the contract.
             */
            contract_category_display: string;
            /**
             * Type of contract.
             */
            contract_type: string;
            /**
             * Type of contract.
             */
            contracts_display?: string;
            /**
             * Name of exchange
             */
            exchange_name: string;
            /**
             * Array of barriers already expired
             */
            expired_barriers?: unknown[];
            /**
             * Expiry Type.
             */
            expiry_type: string;
            /**
             * Array of returned forward starting options
             */
            forward_starting_options?: [
                {
                    /**
                     * The epoch value for the closing date of forward starting session.
                     */
                    close?: string;
                    /**
                     * The epoch value for the date of forward starting session.
                     */
                    date?: string;
                    /**
                     * The epoch value for the opening date of forward starting session.
                     */
                    open?: string;
                    [k: string]: unknown;
                },
                ...{
                    /**
                     * The epoch value for the closing date of forward starting session.
                     */
                    close?: string;
                    /**
                     * The epoch value for the date of forward starting session.
                     */
                    date?: string;
                    /**
                     * The epoch value for the opening date of forward starting session.
                     */
                    open?: string;
                    [k: string]: unknown;
                }[]
            ];
            /**
             * Type of market.
             */
            market: string;
            /**
             * Maximum contract duration
             */
            max_contract_duration: string;
            /**
             * Minimum contract duration.
             */
            min_contract_duration: string;
            /**
             * Maximum payout.
             */
            payout_limit?: number;
            /**
             * Type of sentiment.
             */
            sentiment: string;
            /**
             * Start Type.
             */
            start_type: string;
            /**
             * Type of submarket.
             */
            submarket: string;
            /**
             * A hash of predefined trading period
             */
            trading_period?: {
                [k: string]: unknown;
            };
            /**
             * Symbol code
             */
            underlying_symbol: string;
            [k: string]: unknown;
        }[]
    ];
    /**
     * Symbol's next market-close time as an epoch value
     */
    close?: number | null;
    /**
     * Indicates the feed license for symbol, for example whether its realtime or delayed
     */
    feed_license?: string;
    /**
     * Count of contracts available
     */
    hit_count?: number;
    /**
     * Symbol's next market-open time as an epoch value
     */
    open?: number | null;
    /**
     * Current spot price for this underlying
     */
    spot?: null | number;
    [k: string]: unknown;
}
/**
 * For a given symbol, get the list of currently available contracts, and the latest barrier and duration limits for each contract.
 */
export interface ContractsForSymbolRequest {
    /**
     * The short symbol name (obtained from `active_symbols` call).
     */
    contracts_for: string;
    /**
     * [Optional] Currency of the contract's stake and payout (obtained from `payout_currencies` call).
     */
    currency?: string;
    /**
     * [Optional] Indicates which landing company to get a list of contracts for. If you are logged in, your account's landing company will override this field.
     */
    landing_company?: 'iom' | 'malta' | 'maltainvest' | 'svg' | 'virtual' | 'vanuatu' | 'champion' | 'champion-virtual';
    /**
     * [Optional] If you specify this field, only contracts tradable through that contract type will be returned.
     */
    product_type?: 'basic';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Copy start confirmation. Returns 1 is success.
 */
export type CopyStart = number;

/**
 * A message with results is received
 */
export interface CopyTradingStartResponse {
    copy_start?: CopyStart;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'copy_start';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Start copy trader bets
 */
export interface CopyTradingStartRequest {
    /**
     * API tokens identifying the accounts of trader which will be used to copy trades
     */
    copy_start: string;
    /**
     * [Optional] Used to set assets to be copied. E.x ["frxUSDJPY", "R_50"]
     */
    assets?: string | string[];
    /**
     * [Optional] Used to set maximum trade stake to be copied.
     */
    max_trade_stake?: number;
    /**
     * [Optional] Used to set minimal trade stake to be copied.
     */
    min_trade_stake?: number;
    /**
     * [Optional] Used to set trade types to be copied. E.x ["CALL", "PUT"]
     */
    trade_types?: string | string[];
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Copy stopping confirmation. Returns 1 is success.
 */
export type CopyStop = number;

/**
 * A message with results is received
 */
export interface CopyTradingStopResponse {
    copy_stop?: CopyStop;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'copy_stop';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Stop copy trader bets
 */
export interface CopyTradingStopRequest {
    /**
     * API tokens identifying the accounts which needs not to be copied
     */
    copy_stop: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Details of copiers and/or traders for Copy Trading
 */
export interface CopyTradingListResponse {
    copytrading_list?: CopytradingList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'copytrading_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The trading information of copiers or traders.
 */
export interface CopytradingList {
    /**
     * List of users who are currently copy trading the authenticated user
     */
    copiers: {
        /**
         * The loginid of the copier's account.
         */
        loginid: string;
        [k: string]: unknown;
    }[];
    /**
     * List of traders being followed by the authenticated user
     */
    traders: {
        /**
         * The list of assets to copy the trades of.
         */
        assets?: string[];
        /**
         * The loginid of the trader's account.
         */
        loginid?: string;
        /**
         * Maximum trading stake set for the trader.
         */
        max_trade_stake?: null | number;
        /**
         * Minimum trading stake set for the trader.
         */
        min_trade_stake?: null | number;
        /**
         * The token provided for the trader.
         */
        token?: string;
        /**
         * The type of trades set.
         */
        trade_types?: string[];
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * Retrieves a list of active copiers and/or traders for Copy Trading
 */
export interface CopyTradingListRequest {
    /**
     * Must be `1`
     */
    copytrading_list: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * The statistics of the trader.
 */
export interface CopyTradingStatisticsResponse {
    copytrading_statistics?: CopytradingStatistics;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'copytrading_statistics';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Statistics of the trader
 */
export interface CopytradingStatistics {
    /**
     * This is the epoch the investor started trading.
     */
    active_since: number;
    /**
     * Average seconds of keeping positions open.
     */
    avg_duration: number;
    /**
     * Average loss of trades in percentage.
     */
    avg_loss: number;
    /**
     * Average profitable trades in percentage.
     */
    avg_profit: number;
    /**
     * Number of copiers for this trader.
     */
    copiers: number;
    /**
     * Represents the net change in equity for a 12-month period.
     */
    last_12months_profitable_trades: number;
    /**
     * Represents the net change in equity per month.
     */
    monthly_profitable_trades: {
        /**
         * Monthly profitable trades in percentage.
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[0-9]{4}\-[0-9]{2}$".
         */
        [k: string]: number;
    };
    /**
     * Trader performance probability.
     */
    performance_probability: number;
    /**
     * Total number of trades for all time.
     */
    total_trades: number;
    /**
     * Represents the portfolio distribution by markets.
     */
    trades_breakdown: {
        /**
         * Number of trades in percentage.
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^\w+$".
         */
        [k: string]: number;
    };
    /**
     * Number of profit trades in percentage.
     */
    trades_profitable: number;
    /**
     * Represents the net change in equity per year.
     */
    yearly_profitable_trades?: {
        /**
         * Yearly profitable trades in percentage.
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[0-9]{4}$".
         */
        [k: string]: number;
    };
}
/**
 * Retrieve performance, trading, risk and copiers statistics of trader.
 */
export interface CopyTradingStatisticsRequest {
    /**
     * Must be `1`
     */
    copytrading_statistics: 1;
    /**
     * The ID of the target trader.
     */
    trader_id: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Receive details of uploaded authentication documents
 */
export interface DocumentUploadResponse {
    document_upload?: DocumentUpload;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'document_upload';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Details of the uploaded documents.
 */
export interface DocumentUpload {
    /**
     * Current call type, add this to your binary payload metadata
     */
    call_type: number;
    /**
     * Hex encoded SHA-1 checksum of the file
     */
    checksum?: string;
    /**
     * File size
     */
    size?: number;
    /**
     * Upload status (`success` or `failure`)
     */
    status?: string;
    /**
     * Current upload ID, add this to your binary payload metadata
     */
    upload_id: number;
    [k: string]: unknown;
}
/**
 * Request KYC information from client
 */
export interface DocumentUploadRequest {
    /**
     * Must be `1`
     */
    document_upload: 1;
    /**
     * Document file format
     */
    document_format: 'PNG' | 'JPG' | 'JPEG' | 'GIF' | 'PDF';
    /**
     * [Optional] Document ID (required for Passport, Proof of ID and Driver's License)
     */
    document_id?: string;
    /**
     * Document type
     */
    document_type:
        | 'passport'
        | 'national_identity_card'
        | 'driving_licence'
        | 'utility_bill'
        | 'bankstatement'
        | 'power_of_attorney'
        | 'amlglobalcheck'
        | 'docverification'
        | 'proofid'
        | 'driverslicense'
        | 'proofaddress'
        | 'other';
    /**
     * The checksum of the file to be uploaded
     */
    expected_checksum: string;
    /**
     * [Optional] Document expiration date (required for Passport, Proof of ID and Driver's License)
     */
    expiration_date?: string;
    /**
     * Document size (should be less than 3MB)
     */
    file_size: number;
    /**
     * [Optional] To determine document side
     */
    page_type?: 'front' | 'back' | 'photo';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A list of economic events.
 */
export interface EconomicCalendarResponse {
    economic_calendar?: EconomicCalendar;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'economic_calendar';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Economic calendar.
 */
export interface EconomicCalendar {
    /**
     * Array of economic events
     */
    events?: {
        /**
         * Actual value.
         */
        actual?: {
            /**
             * Actual value.
             */
            display_value?: string;
            [k: string]: unknown;
        };
        /**
         * Currency symbol.
         */
        currency?: string;
        /**
         * Event name.
         */
        event_name?: string;
        /**
         * Forecasted value.
         */
        forecast?: {
            /**
             * Forecasted value.
             */
            display_value?: string;
            [k: string]: unknown;
        };
        /**
         * Impact.
         */
        impact?: number;
        /**
         * Previous value.
         */
        previous?: {
            /**
             * Previous value.
             */
            display_value?: string;
            [k: string]: unknown;
        };
        /**
         * Release date.
         */
        release_date?: number;
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * Specify a currency to receive a list of events related to that specific currency. For example, specifying USD will return a list of USD-related events. If the currency is omitted, you will receive a list for all currencies.
 */
export interface EconomicCalendarRequest {
    /**
     * Must be `1`
     */
    economic_calendar: 1;
    /**
     * [Optional] Currency symbol.
     */
    currency?: string;
    /**
     * [Optional] End date.
     */
    end_date?: number;
    /**
     * [Optional] Start date.
     */
    start_date?: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * The exchange rate values from the specified base currency to all currencies supported by the system.
 */
export interface ExchangeRatesResponse {
    exchange_rates?: ExchangeRates;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'exchange_rates';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Exchange rate values from base to all other currencies
 */
export interface ExchangeRates {
    /**
     * Base currency
     */
    base_currency?: string;
    /**
     * Date retrieval epoch time represented as an integer number
     */
    date?: number;
    /**
     * Rates of exchanging a unit of base currency into the target currencies
     */
    rates?: {
        /**
         * The rate of exchanging a unit of the base currency into a target currency (represented by the key)
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[a-zA-Z0-9]{2,20}$".
         */
        [k: string]: number;
    };
    [k: string]: unknown;
}
/**
 * Retrieves the exchange rates from a base currency to all currencies supported by the system.
 */
export interface ExchangeRatesRequest {
    /**
     * Must be `1`
     */
    exchange_rates: 1;
    /**
     * Base currency (can be obtained from `payout_currencies` call)
     */
    base_currency: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * IDs of the cancelled streams
 */
export type ForgetAll = unknown[];

/**
 * The result of forget all request made.
 */
export interface ForgetAllResponse {
    forget_all?: ForgetAll;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'forget_all';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Valid stream types that can be used to unsubscribe from.
 */
export type StreamTypes =
    | 'balance'
    | 'candles'
    | 'p2p_advertiser'
    | 'p2p_order'
    | 'proposal'
    | 'proposal_open_contract'
    | 'ticks'
    | 'transaction'
    | 'website_status';

/**
 * Immediately cancel the real-time streams of messages of given type.
 */
export interface ForgetAllRequest {
    /**
     * Cancel all streams by type. The value can be either a single type e.g. `"ticks"`, or an array of multiple types e.g. `["candles", "ticks"]`.
     */
    forget_all: StreamTypes | StreamTypes[];
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * If set to 1, stream exited and stopped. If set to 0, stream did not exist.
 */
export type Forget = 0 | 1;

/**
 * The result of forget request made.
 */
export interface ForgetResponse {
    forget?: Forget;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'forget';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Immediately cancel the real-time stream of messages with a specific ID.
 */
export interface ForgetRequest {
    /**
     * ID of the real-time stream of messages to cancel.
     */
    forget: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with Account Status
 */
export interface AccountStatusResponse {
    get_account_status?: GetAccountStatus;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'get_account_status';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Account status details
 */
export interface GetAccountStatus {
    /**
     * This represents the authentication status of the user and it includes what authentication is needed.
     */
    authentication?: {
        /**
         * The authentication status for document.
         */
        document?: {
            /**
             * This is the epoch of the document expiry date.
             */
            expiry_date?: number;
            /**
             * This represents the current status of the proof of address document submitted for authentication.
             */
            status?: 'none' | 'pending' | 'rejected' | 'verified' | 'expired' | 'suspected';
            [k: string]: unknown;
        };
        /**
         * The authentication status for identity.
         */
        identity?: {
            /**
             * This is the epoch of the document expiry date.
             */
            expiry_date?: number;
            /**
             * This shows the information about the authentication services implemented
             */
            services?: {
                /**
                 * This shows the information related to Onfido supported services
                 */
                onfido?: {
                    /**
                     * This shows the list of documents types supported by Onfido
                     */
                    documents?: string[];
                    /**
                     * This shows the information if the country is supported by Onfido
                     */
                    is_country_supported?: 1 | 0;
                    [k: string]: unknown;
                };
                [k: string]: unknown;
            };
            /**
             * This represent the current status for proof of identity document submitted for authentication.
             */
            status?: 'none' | 'pending' | 'rejected' | 'verified' | 'expired' | 'suspected';
            [k: string]: unknown;
        };
        /**
         * An array containing the list of required authentication.
         */
        needs_verification: string[];
        [k: string]: unknown;
    };
    /**
     * Provides cashier details for client currency.
     */
    currency_config: {
        /**
         * Client currency
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[a-zA-Z0-9]{2,20}$".
         */
        [k: string]: {
            /**
             * Deposit is allowed for currency or not
             */
            is_deposit_suspended?: 0 | 1;
            /**
             * Withdrawal is allowed for currency or not
             */
            is_withdrawal_suspended?: 0 | 1;
            [k: string]: unknown;
        };
    };
    /**
     * Indicates whether the client should be prompted to authenticate their account.
     */
    prompt_client_to_authenticate: 1 | 0;
    /**
     * Client risk classification: `low`, `standard`, `high`.
     */
    risk_classification: string;
    /**
     * Account status. Possible status:
     * - `address_verified`: client's address is verified by third party services.
     * - `allow_document_upload`: client is allowed to upload documents.
     * - `age_verification`: client is age-verified.
     * - `authenticated`: client is fully authenticated.
     * - `cashier_locked`: cashier is locked.
     * - `closed`: client has closed the account.
     * - `crs_tin_information`: client has updated tax related information.
     * - `disabled`: account is disabled.
     * - `document_expired`: client's submitted proof-of-identity documents have expired.
     * - `document_expiring_soon`: client's submitted proof-of-identity documents are expiring within a month.
     * - `duplicate_account`: this client's account has been marked as duplicate.
     * - `financial_assessment_not_complete`: client should complete their financial assessment.
     * - `financial_information_not_complete`: client has not completed financial assessment.
     * - `financial_risk_approval`: client has accepted financial risk disclosure.
     * - `max_turnover_limit_not_set`: client has not set financial limits on their account. Applies to UK and Malta clients.
     * - `mt5_withdrawal_locked`: MT5 deposits allowed, but withdrawal is not allowed.
     * - `no_trading`: trading is disabled.
     * - `no_withdrawal_or_trading`: client cannot trade or withdraw but can deposit.
     * - `pa_withdrawal_explicitly_allowed`: withdrawal through payment agent is allowed.
     * - `professional`: this client has opted for a professional account.
     * - `professional_requested`: this client has requested for a professional account.
     * - `professional_rejected`: this client's request for a professional account has been rejected.
     * - `proveid_pending`: this client's identity is being validated. Applies for MX account with GB residence only.
     * - `proveid_requested`: this client has made a request to have their identity be validated.
     * - `social_signup`: this client is using social signup.
     * - `trading_experience_not_complete`: client has not completed the trading experience questionnaire.
     * - `ukgc_funds_protection`: client has acknowledged UKGC funds protection notice.
     * - `unwelcome`: client cannot deposit or buy contracts, but can withdraw or sell contracts.
     * - `withdrawal_locked`: deposits allowed but withdrawals are not allowed.
     */
    status: string[];
    [k: string]: unknown;
}
/**
 * Get Account Status
 */
export interface AccountStatusRequest {
    /**
     * Must be `1`
     */
    get_account_status: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * This call gets the financial assessment details of client's account.
 */
export interface GetFinancialAssessmentResponse {
    get_financial_assessment?: GetFinancialAssessment;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'get_financial_assessment';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Client's financial assessment details
 */
export interface GetFinancialAssessment {
    /**
     * The anticipated account turnover
     */
    account_turnover?: string;
    /**
     * Binary options trading experience
     */
    binary_options_trading_experience?: string;
    /**
     * Binary options trading frequency
     */
    binary_options_trading_frequency?: string;
    /**
     * CFD Score
     */
    cfd_score?: number;
    /**
     * CFDs trading experience
     */
    cfd_trading_experience?: string;
    /**
     * CFDs trading frequency
     */
    cfd_trading_frequency?: string;
    /**
     * Level of Education
     */
    education_level?: string;
    /**
     * Industry of Employment
     */
    employment_industry?: string;
    /**
     * Employment Status
     */
    employment_status?: string;
    /**
     * Estimated Net Worth
     */
    estimated_worth?: string;
    /**
     * Financial Information Score
     */
    financial_information_score?: number;
    /**
     * Forex trading experience
     */
    forex_trading_experience?: string;
    /**
     * Forex trading frequency
     */
    forex_trading_frequency?: string;
    /**
     * Income Source
     */
    income_source?: string;
    /**
     * Net Annual Income
     */
    net_income?: string;
    /**
     * Occupation
     */
    occupation?: string;
    /**
     * Trading experience in other financial instruments
     */
    other_instruments_trading_experience?: string;
    /**
     * Trading frequency in other financial instruments
     */
    other_instruments_trading_frequency?: string;
    /**
     * Source of wealth
     */
    source_of_wealth?: string;
    /**
     * Total Score
     */
    total_score?: number;
    /**
     * Trading Experience Score
     */
    trading_score?: number;
    [k: string]: unknown;
}
/**
 * This call gets the financial assessment details. The 'financial assessment' is a questionnaire that clients of certain Landing Companies need to complete, due to regulatory and KYC (know your client) requirements.
 */
export interface GetFinancialAssessmentRequest {
    /**
     * Must be `1`
     */
    get_financial_assessment: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Trading and Withdrawal Limits
 */
export interface AccountLimitsResponse {
    get_limits?: GetLimits;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'get_limits';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Trading limits of real account user
 */
export interface GetLimits {
    /**
     * Maximum account cash balance
     */
    account_balance?: number;
    /**
     * Maximum daily turnover
     */
    daily_turnover?: number;
    /**
     * Lifetime withdrawal limit
     */
    lifetime_limit?: number;
    /**
     * Contains limitation information for each market.
     */
    market_specific?: {
        /**
         * List of limitation profiles for each market
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^(commodities|forex|indices|synthetic_index)$".
         */
        [k: string]: {
            /**
             * The submarket display name.
             */
            name?: string;
            /**
             * The limit of payout for the submarket
             */
            payout_limit?: number;
            /**
             * The limitation profile name.
             */
            profile_name?: string;
            /**
             * The limit of turnover for the submarket
             */
            turnover_limit?: number;
            [k: string]: unknown;
        }[];
    };
    /**
     * Number of days for num_of_days_limit withdrawal limit
     */
    num_of_days?: number;
    /**
     * Withdrawal limit for num_of_days days
     */
    num_of_days_limit?: number;
    /**
     * Maximum number of open positions
     */
    open_positions?: number;
    /**
     * Maximum aggregate payouts on open positions
     */
    payout?: number;
    /**
     * Maximum payout for each symbol based on different barrier types.
     */
    payout_per_symbol?: null | {
        /**
         * Maximum aggregate payouts on open positions per symbol for contracts where barrier is same as entry spot.
         */
        atm?: null | number;
        /**
         * Maximum aggregate payouts on open positions per symbol for contract where barrier is different from entry spot.
         */
        non_atm?: {
            /**
             * Maximum aggregate payouts on open positions per symbol for contract where barrier is different from entry spot and duration is less than and equal to seven days
             */
            less_than_seven_days?: number;
            /**
             * Maximum aggregate payouts on open positions per symbol for contract where barrier is different from entry spot and duration is more to seven days
             */
            more_than_seven_days?: number;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    };
    /**
     * Maximum aggregate payouts on open positions per symbol and contract type. This limit can be exceeded up to the overall payout limit if there is no prior open position.
     */
    payout_per_symbol_and_contract_type?: number;
    /**
     * Amount left to reach withdrawal limit
     */
    remainder?: number;
    /**
     * Total withdrawal for num_of_days days
     */
    withdrawal_for_x_days_monetary?: number;
    /**
     * Total withdrawal since inception
     */
    withdrawal_since_inception_monetary?: number;
    [k: string]: unknown;
}
/**
 * Trading and Withdrawal Limits for a given user
 */
export interface AccountLimitsRequest {
    /**
     * Must be `1`
     */
    get_limits: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with User Self-Exclusion
 */
export interface GetSelfExclusionResponse {
    get_self_exclusion?: GetSelfExclusion;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'get_self_exclusion';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * List of values set for self exclusion.
 */
export interface GetSelfExclusion {
    /**
     * Exclude me from the website (for a minimum of 6 months, up to a maximum of 5 years). Note: uplifting this self-exclusion may require contacting the company.
     */
    exclude_until?: string;
    /**
     * 30-day limit on deposits
     */
    max_30day_deposit?: number;
    /**
     * 30-day limit on losses
     */
    max_30day_losses?: number;
    /**
     * 30-day turnover limit
     */
    max_30day_turnover?: number;
    /**
     * 7-day limit on deposits
     */
    max_7day_deposit?: number;
    /**
     * 7-day limit on losses
     */
    max_7day_losses?: number;
    /**
     * 7-day turnover limit
     */
    max_7day_turnover?: number;
    /**
     * Maximum account cash balance
     */
    max_balance?: number;
    /**
     * Daily limit on deposits
     */
    max_deposit?: number;
    /**
     * Daily limit on losses
     */
    max_losses?: number;
    /**
     * Maximum number of open positions
     */
    max_open_bets?: number;
    /**
     * Daily turnover limit
     */
    max_turnover?: number;
    /**
     * Session duration limit, in minutes
     */
    session_duration_limit?: number;
    /**
     * Exclude me from the website (for up to 6 weeks). The time is in epoch format. Note: unlike `exclude_until`, this self-exclusion will be lifted automatically at the expiry of the timeout period.
     */
    timeout_until?: number;
    [k: string]: unknown;
}
/**
 * Allows users to exclude themselves from the website for certain periods of time, or to set limits on their trading activities. This facility is a regulatory requirement for certain Landing Companies.
 */
export interface GetSelfExclusionRequest {
    /**
     * Must be `1`
     */
    get_self_exclusion: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with User Settings
 */
export interface GetAccountSettingsResponse {
    get_settings?: GetSettings;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'get_settings';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * User information and settings.
 */
export interface GetSettings {
    /**
     * Purpose and reason for requesting the account opening. Only applicable for real money account.
     */
    account_opening_reason?: null | string;
    /**
     * City (note: Only available for users who have at least one real account)
     */
    address_city?: string;
    /**
     * Address line 1 (note: Only available for users who have at least one real account)
     */
    address_line_1?: string;
    /**
     * Address line 2 (note: Only available for users who have at least one real account)
     */
    address_line_2?: string;
    /**
     * Post Code (note: Only available for users who have at least one real account)
     */
    address_postcode?: string;
    /**
     * State (note: Only available for users who have at least one real account)
     */
    address_state?: string;
    /**
     * Boolean value 1 or 0, indicating permission to allow others to follow your trades. Note: not applicable for Virtual account. Only allow for real money account.
     */
    allow_copiers?: 0 | 1;
    /**
     * Country of legal citizenship, 2-letter country code.
     */
    citizen?: string;
    /**
     * Latest terms and conditions version accepted by client
     */
    client_tnc_status?: null | string;
    /**
     * User Country (same as residence field) - deprecated
     */
    country?: null | string;
    /**
     * 2-letter country code ISO standard
     */
    country_code?: null | string;
    /**
     * Epoch of user's birthday (note: Only available for users who have at least one real account)
     */
    date_of_birth?: number | null;
    /**
     * User Email
     */
    email?: string;
    /**
     * Boolean value 1 or 0, indicating permission to use email address for any contact which may include marketing
     */
    email_consent?: 0 | 1;
    /**
     * First name (note: Only available for users who have at least one real account)
     */
    first_name?: string;
    /**
     * Returns 1 if the client has a secret answer, 0 otherwise.
     */
    has_secret_answer?: 0 | 1;
    /**
     * A list of profile fields which are immutable (read-only unless they are not set yet) due to landing company regulations and the current status of the account.
     */
    immutable_fields?: string[];
    /**
     * Boolean value 1 or 0, indicating whether is payment agent (note: not applicable for virtual money accounts)
     */
    is_authenticated_payment_agent?: 0 | 1;
    /**
     * Last name (note: Only available for users who have at least one real account)
     */
    last_name?: string;
    /**
     * Indicates client's self-declaration of not being a PEP/RCA (Politically Exposed Person/Relatives and Close Associates). Note: returned for real accounts only.
     */
    non_pep_declaration?: 0 | 1;
    /**
     * Telephone (note: Only available for users who have at least one real account)
     */
    phone?: string;
    /**
     * Place of birth, 2-letter country code.
     */
    place_of_birth?: null | string;
    /**
     * Boolean value 1 or 0, indicating if client has requested professional status.
     */
    request_professional_status?: 0 | 1;
    /**
     * User Country
     */
    residence?: null | string;
    /**
     * Salutation (note: Only available for users who have at least one real account)
     */
    salutation?: string;
    /**
     * Tax identification number. Only applicable for real money account.
     */
    tax_identification_number?: null | string;
    /**
     * Residence for tax purpose. Comma separated iso country code if multiple jurisdictions. Only applicable for real money account.
     */
    tax_residence?: null | string;
    /**
     * Hash generated using user details to verify whether the user is legitimate for our customer support system.
     */
    user_hash?: null | string;
    [k: string]: unknown;
}
/**
 * Get User Settings (email, date of birth, address etc)
 */
export interface GetAccountSettingsRequest {
    /**
     * Must be `1`
     */
    get_settings: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with Landing Company.
 */
export interface LandingCompanyDetailsResponse {
    landing_company_details?: LandingCompanyDetails;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'landing_company_details';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The detailed information of the requested landing company.
 */
export interface LandingCompanyDetails {
    /**
     * Landing Company address.
     */
    address?: string[] | null;
    /**
     * Special conditions for changing sensitive fields
     */
    changeable_fields?: {
        [k: string]: unknown;
    };
    /**
     * Landing Company country.
     */
    country?: string;
    currency_config?: CurrencyConfigStructure;
    /**
     * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
     */
    has_reality_check?: 0 | 1;
    /**
     * Allowed contract types for this Landing Company
     */
    legal_allowed_contract_categories?: string[];
    /**
     * Allowable currencies for accounts with this Landing Company.
     */
    legal_allowed_currencies?: string[];
    /**
     * Allowed markets for this Landing Company
     */
    legal_allowed_markets?: string[];
    /**
     * Default currency of client accounts with this Landing Company.
     */
    legal_default_currency?: string;
    /**
     * Landing Company name.
     */
    name?: string;
    /**
     * Legal requirements for the given Landing Company.
     */
    requirements?: {
        [k: string]: unknown;
    };
    /**
     * Landing Company shortcode.
     */
    shortcode?: string;
    [k: string]: unknown;
}
/**
 * The configuration of each currency.
 */
export interface CurrencyConfigStructure {
    market?: Market;
    [k: string]: unknown;
}
/**
 * Name of market.
 */
export interface Market {
    currency?: Currency;
    [k: string]: unknown;
}
/**
 * Currency Symbol.
 */
export interface Currency {
    /**
     * Maximum payout for this currency in this market.
     */
    max_payout?: number;
    /**
     * Minimum stake for this currency in this market.
     */
    min_stake?: number;
    [k: string]: unknown;
}
/**
 * The company has a number of licensed subsidiaries in various jurisdictions, which are called Landing Companies (and which are wholly owned subsidiaries of the Deriv Group). This call provides information about each Landing Company.
 */
export interface LandingCompanyDetailsRequest {
    /**
     * Landing company shortcode.
     */
    landing_company_details:
        | 'iom'
        | 'malta'
        | 'maltainvest'
        | 'svg'
        | 'virtual'
        | 'vanuatu'
        | 'champion'
        | 'champion-virtual';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns the Landing Company for clients of a given country.
 */
export interface LandingCompanyResponse {
    landing_company?: LandingCompany;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'landing_company';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Landing Company
 */
export interface LandingCompany {
    /**
     * Landing Company for financial contracts (all except Synthetic Indices)
     */
    financial_company?: null | {
        /**
         * Landing Company address
         */
        address?: string[] | null;
        /**
         * Special conditions for changing sensitive fields
         */
        changeable_fields?: {
            [k: string]: unknown;
        };
        /**
         * Landing Company country of incorporation
         */
        country?: string;
        /**
         * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
         */
        has_reality_check?: 1 | 0;
        /**
         * Allowed contract types for this Landing Company
         */
        legal_allowed_contract_categories?: string[];
        /**
         * Allowed account currencies for this Landing Company
         */
        legal_allowed_currencies?: string[];
        /**
         * Allowed markets for this Landing Company
         */
        legal_allowed_markets?: string[];
        /**
         * Default account currency
         */
        legal_default_currency?: string;
        /**
         * Landing Company legal name
         */
        name?: string;
        /**
         * Landing Company short code
         */
        shortcode?: string;
        [k: string]: unknown;
    };
    /**
     * Landing Company for gaming contracts (Synthetic Indices)
     */
    gaming_company?: null | {
        /**
         * Landing Company address
         */
        address?: string[] | null;
        /**
         * Special conditions for changing sensitive fields
         */
        changeable_fields?: {
            [k: string]: unknown;
        };
        /**
         * Landing Company country of incorporation
         */
        country?: string;
        /**
         * Allowed contract types
         */
        legal_allowed_contract_categories?: string[];
        /**
         * Allowable currencies
         */
        legal_allowed_currencies?: string[];
        /**
         * Allowable markets
         */
        legal_allowed_markets?: string[];
        /**
         * Default account currency
         */
        legal_default_currency?: string;
        /**
         * Landing Company legal name
         */
        name?: string;
        /**
         * Landing Company short code
         */
        shortcode?: string;
        [k: string]: unknown;
    };
    /**
     * Country code
     */
    id?: string;
    /**
     * Landing Company for MT5 financial contracts (all except Synthetic Indices), currently divided into Financial STP, Financial (standard), and Swap-Free as subtypes.
     */
    mt_financial_company?: null | {
        /**
         * Contain details for landing company for financial subtype. The Financial account is suitable for a wide range of traders, both new and experienced. It gives you mid-range leverage and variable spreads that give you a great deal of flexibility for whatever position you wish to take in the market.
         */
        financial?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types for this Landing Company
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowed account currencies for this Landing Company
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowed markets for this Landing Company
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
            /**
             * Landing Company short code
             */
            shortcode?: string;
            [k: string]: unknown;
        };
        /**
         * Contain details for landing company for Financial STP subtype. The Financial STP account provides you with tight spreads, higher ticket size and offers a variety of FX pairs from majors to exotics. It is a straight through processing (STP) account with direct access to FX liquidity from various providers.
         */
        financial_stp?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types for this Landing Company
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowed account currencies for this Landing Company
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowed markets for this Landing Company
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
            /**
             * Landing Company short code
             */
            shortcode?: string;
            [k: string]: unknown;
        };
        /**
         * Contains details for Landing Company for swap-free subtype. The Swap-Free account is suitable for a wide range of traders, both new and experienced. It gives you mid-range leverage and variable spreads that give you a great deal of flexibility for whatever position you wish to take in the market with zero swap fee.
         */
        swap_free?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types for this Landing Company
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowed account currencies for this Landing Company
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowed markets for this Landing Company
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
            /**
             * Landing Company short code
             */
            shortcode?: string;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    };
    /**
     * Landing Company for MT5 standard gaming contracts (Synthetic Indices), currently divided into Financial (standard), and Swap-Free as subtypes.
     */
    mt_gaming_company?: null | {
        /**
         * Landing Company for MT5 gaming contracts (Synthetic Indices)
         */
        financial?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            /**
             * Allowed contract types
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowable currencies
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowable markets
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
            /**
             * Legal requirements for the Landing Company
             */
            requirements?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company short code
             */
            shortcode?: string;
            [k: string]: unknown;
        };
        /**
         * Landing Company for MT5 swap free gaming contracts (Synthetic Indices)
         */
        swap_free?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            /**
             * Allowed contract types
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowable currencies
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowable markets
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
            /**
             * Legal requirements for the Landing Company
             */
            requirements?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company short code
             */
            shortcode?: string;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    };
    /**
     * Country name
     */
    name?: string;
    [k: string]: unknown;
}
/**
 * Client's 2-letter country code (obtained from `residence_list` call).
 */
export type LandingCompany = string;

/**
 * The company has a number of licensed subsidiaries in various jurisdictions, which are called Landing Companies. This call will return the appropriate Landing Company for clients of a given country. The landing company may differ for Gaming contracts (Synthetic Indices) and Financial contracts (Forex, Stock Indices, Commodities).
 */
export interface LandingCompanyRequest {
    landing_company: LandingCompany;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Array of records of client login/logout activities
 */
export type LoginHistory = {
    /**
     * Type of action.
     */
    action: string;
    /**
     * Provides details about browser, device used during login or logout
     */
    environment: string;
    /**
     * Status of activity: 1 - success, 0 - failure
     */
    status: 0 | 1;
    /**
     * Epoch time of the activity
     */
    time: number;
    [k: string]: unknown;
}[];

/**
 * Recent login/logout history records
 */
export interface LoginHistoryResponse {
    login_history?: LoginHistory;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'login_history';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Retrieve a summary of login history for user.
 */
export interface LoginHistoryRequest {
    /**
     * Must be `1`
     */
    login_history: 1;
    /**
     * [Optional] Apply limit to count of login history records.
     */
    limit?: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * The result of logout request which is 1
 */
export type Logout = 1;

/**
 * The response of logout request made.
 */
export interface LogOutResponse {
    logout?: Logout;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'logout';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Logout the session
 */
export interface LogOutRequest {
    /**
     * Must be `1`
     */
    logout: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * 1 on success
 */
export type Mt5Deposit = number;

/**
 * The result of MT5 deposit request.
 */
export interface MT5DepositResponse {
    mt5_deposit?: Mt5Deposit;
    /**
     * Withdrawal reference ID of Binary account
     */
    binary_transaction_id?: number;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_deposit';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * This call allows deposit into MT5 account from Binary account.
 */
export interface MT5DepositRequest {
    /**
     * Must be `1`
     */
    mt5_deposit: 1;
    /**
     * Amount to deposit (in the currency of from_binary); min = $1 or an equivalent amount, max = $20000 or an equivalent amount
     */
    amount?: number;
    /**
     * Binary account loginid to transfer money from
     */
    from_binary?: string;
    /**
     * MT5 account login to deposit money to
     */
    to_mt5: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Get MT5 user settings
 */
export interface MT5GetSettingResponse {
    mt5_get_settings?: Mt5GetSettings;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_get_settings';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * MT5 user account details
 */
export interface Mt5GetSettings {
    /**
     * Account type.
     */
    account_type?: 'demo' | 'real';
    /**
     * The address of the user. The maximum length of the address is 128 characters.
     */
    address?: string;
    /**
     * Account balance.
     */
    balance?: string;
    /**
     * User's city of residence.
     */
    city?: string;
    /**
     * Name of the client's company. The maximum length of the company name is 64 characters.
     */
    company?: string;
    /**
     * 2-letter country code.
     */
    country?: string;
    /**
     * MT5 account currency (`USD` or `EUR`) that depends on the MT5 company (`vanuatu`, `svg`, `malta`).
     */
    currency?: string;
    /**
     * Email address.
     */
    email?: string;
    /**
     * The group where account belongs to.
     */
    group?: string;
    /**
     * Landing company shortcode of the MT5 account.
     */
    landing_company_short?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'samoa' | 'svg' | 'vanuatu';
    /**
     * Client leverage (from 1 to 1000).
     */
    leverage?: number;
    /**
     * Login ID of the user's MT5 account.
     */
    login?: string;
    /**
     * Market type
     */
    market_type?: 'financial' | 'gaming';
    /**
     * Client's name. The maximum length of a client's symbol name is 128 characters.
     */
    name?: string;
    /**
     * User's phone number.
     */
    phone?: string;
    /**
     * The user's phone password.
     */
    phonePassword?: string;
    /**
     * User's state (region) of residence.
     */
    state?: string;
    /**
     * Sub account type
     */
    sub_account_type?: 'financial' | 'financial_stp' | 'swap_free';
    /**
     * User's zip code.
     */
    zipCode?: string;
    [k: string]: unknown;
}
/**
 * Get MT5 user account settings
 */
export interface MT5GetSettingRequest {
    /**
     * Must be `1`
     */
    mt5_get_settings: 1;
    /**
     * MT5 user login
     */
    login: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Array containing MT5 account objects.
 */
export type Mt5LoginList = DetailsOfEachMT5Loginid[];

/**
 * Get list of MT5 accounts for client.
 */
export interface MT5AccountsListResponse {
    mt5_login_list?: Mt5LoginList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_login_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
export interface DetailsOfEachMT5Loginid {
    /**
     * Account type.
     */
    account_type?: 'demo' | 'real';
    /**
     * Balance of the MT5 account.
     */
    balance?: number;
    /**
     * Residence of the MT5 account.
     */
    country?: string;
    /**
     * Currency of the MT5 account.
     */
    currency?: string;
    /**
     * Account balance, formatted to appropriate decimal places.
     */
    display_balance?: string;
    /**
     * Email address of the MT5 account.
     */
    email?: string;
    /**
     * Group type of the MT5 account, e.g. `demo\svg_financial`
     */
    group?: string;
    /**
     * Landing company shortcode of the MT5 account.
     */
    landing_company_short?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'samoa' | 'svg' | 'vanuatu';
    /**
     * Leverage of the MT5 account (1 to 1000).
     */
    leverage?: number;
    /**
     * Login of MT5 account.
     */
    login?: string;
    /**
     * Market type
     */
    market_type?: 'financial' | 'gaming';
    /**
     * Name of the owner of the MT5 account.
     */
    name?: string;
    /**
     * Sub account type
     */
    sub_account_type?: 'financial' | 'financial_stp' | 'swap_free';
    [k: string]: unknown;
}
/**
 * Get list of MT5 accounts for client
 */
export interface MT5AccountsListRequest {
    /**
     * Must be `1`
     */
    mt5_login_list: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Create MT5 account Receive
 */
export interface MT5NewAccountResponse {
    mt5_new_account?: Mt5NewAccount;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_new_account';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * New MT5 account details
 */
export interface Mt5NewAccount {
    /**
     * Account type.
     */
    account_type?: 'demo' | 'gaming' | 'financial';
    /**
     * Account balance.
     */
    balance?: number;
    /**
     * MT5 account currency (`USD` or `EUR`) that depends on the MT5 company (`vanuatu`, `svg`, `malta`).
     */
    currency?: string;
    /**
     * Account balance, formatted to appropriate decimal places.
     */
    display_balance?: string;
    /**
     * Login ID of the user's new MT5 account. Login could have 2 types of prefixes: MTD, MTR. MTD - for demo accounts and MTR for real money accounts.
     */
    login?: string;
    /**
     * With default value of conventional, unavailable for `financial_stp` sub account type.
     */
    mt5_account_category?: 'conventional' | 'swap_free';
    /**
     * Sub account type, present only when account type is either `demo` or `financial`.
     */
    mt5_account_type?: 'financial' | 'financial_stp';
    [k: string]: unknown;
}
/**
 * This call creates new MT5 user, either demo or real money user.
 */
export interface MT5NewAccountRequest {
    /**
     * Must be `1`
     */
    mt5_new_account: 1;
    /**
     * Account type. If set to 'financial', setting 'mt5_account_type' is also required.
     */
    account_type: 'demo' | 'gaming' | 'financial';
    /**
     * [Optional] The address of the user. The maximum length of this address field is 128 characters.
     */
    address?: string;
    /**
     * [Optional] User's city of residence.
     */
    city?: string;
    /**
     * [Optional] Name of the client's company. The maximum length of the company name is 64 characters.
     */
    company?: string;
    /**
     * [Optional] 2-letter country code (value received from `residence_list` call).
     */
    country?: string;
    /**
     * [Optional] MT5 account currency, the default value will be the qualified account currency.
     */
    currency?: string;
    /**
     * [Optional] If set to 1, only validation is performed.
     */
    dry_run?: 0 | 1;
    /**
     * Email address
     */
    email: string;
    /**
     * [Optional] The investor password of the account. For validation (Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address).
     */
    investPassword?: string;
    /**
     * Client leverage (from 1 to 1000).
     */
    leverage: number;
    /**
     * The master password of the account. For validation (Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address). This field is required.
     */
    mainPassword: string;
    /**
     * [Optional] To choose whether account is conventional or swap_free. Unavailable for financial_stp MT5_account_type
     */
    mt5_account_category?: 'conventional' | 'swap_free';
    /**
     * [Optional] Financial: Variable spreads, High leverage. Financial STP: Variable spreads, Medium Leverage, more products. If 'account_type' set to 'financial', setting 'mt5_account_type' is also required.
     */
    mt5_account_type?: 'financial' | 'financial_stp';
    /**
     * Client's name. The maximum length here is 101 characters.
     */
    name: string;
    /**
     * [Optional] User's phone number.
     */
    phone?: string;
    /**
     * [Optional] The user's phone password.
     */
    phonePassword?: string;
    /**
     * [Optional] User's state (region) of residence.
     */
    state?: string;
    /**
     * [Optional] User's zip code.
     */
    zipCode?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * `1` on success
 */
export type Mt5PasswordChange = number;

/**
 * MT5 user password change receive
 */
export interface MT5PasswordChangeResponse {
    mt5_password_change?: Mt5PasswordChange;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_password_change';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * To change passwords of the MT5 account.
 */
export interface MT5PasswordChangeRequest {
    /**
     * Must be `1`
     */
    mt5_password_change: 1;
    /**
     * MT5 user login
     */
    login: string;
    /**
     * New password of the account. For validation (Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address).
     */
    new_password: string;
    /**
     * Old password for validation (non-empty string, accepts any printable ASCII character)
     */
    old_password: string;
    /**
     * [Optional] Type of the password to change.
     */
    password_type?: 'main' | 'investor';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * `1` on success
 */
export type Mt5PasswordCheck = number;

/**
 * MT5 user password check receive
 */
export interface MT5PasswordCheckResponse {
    mt5_password_check?: Mt5PasswordCheck;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_password_check';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * This call validates the main password for the MT5 user
 */
export interface MT5PasswordCheckRequest {
    /**
     * Must be `1`
     */
    mt5_password_check: 1;
    /**
     * MT5 user login
     */
    login: string;
    /**
     * The password of the account.
     */
    password: string;
    /**
     * [Optional] Type of the password to check.
     */
    password_type?: 'main' | 'investor';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * `1` on success
 */
export type Mt5PasswordReset = number;

/**
 * MT5 user password reset receive
 */
export interface MT5PasswordResetResponse {
    mt5_password_reset?: Mt5PasswordReset;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_password_reset';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * To reset the password of MT5 account.
 */
export interface MT5PasswordResetRequest {
    /**
     * Must be `1`
     */
    mt5_password_reset: 1;
    /**
     * MT5 user login
     */
    login: string;
    /**
     * New password of the account. For validation (Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address).
     */
    new_password: string;
    /**
     * [Optional] Type of the password to reset.
     */
    password_type?: 'main' | 'investor';
    /**
     * Email verification code (received from a `verify_email` call, which must be done first)
     */
    verification_code: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * `1` on success
 */
export type Mt5Withdrawal = number;

/**
 * The result of MT5 withdrawal request made.
 */
export interface MT5WithdrawalResponse {
    mt5_withdrawal?: Mt5Withdrawal;
    /**
     * Deposit reference ID of Binary account.
     */
    binary_transaction_id?: number;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'mt5_withdrawal';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * This call allows withdrawal from MT5 account to Binary account.
 */
export interface MT5WithdrawalRequest {
    /**
     * Must be `1`
     */
    mt5_withdrawal: 1;
    /**
     * Amount to withdraw (in the currency of the MT5 account); min = $1 or an equivalent amount, max = $20000 or an equivalent amount.
     */
    amount: number;
    /**
     * MT5 account login to withdraw money from
     */
    from_mt5: string;
    /**
     * Binary account loginid to transfer money to
     */
    to_binary: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Create maltainvest account Receive
 */
export interface NewRealMoneyAccountDerivInvestmentEuropeLtdResponse {
    new_account_maltainvest?: NewAccountMaltainvest;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'new_account_maltainvest';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * New `maltainvest` account details
 */
export interface NewAccountMaltainvest {
    /**
     * Client ID of new `maltainvest` account
     */
    client_id: string;
    /**
     * Landing company full name
     */
    landing_company: string;
    /**
     * Landing company shortcode
     */
    landing_company_short?: string;
    /**
     * OAuth token for client's login session
     */
    oauth_token: string;
    [k: string]: unknown;
}
/**
 * This call opens a new real-money account with the `maltainvest` Landing Company. This call can be made from a virtual-money account or real-money account at Deriv (Europe) Limited. If it is the latter, client information fields in this call will be ignored and data from your existing real-money account will be used.
 */
export interface NewRealMoneyAccountDerivInvestmentEuropeLtdRequest {
    /**
     * Must be `1`
     */
    new_account_maltainvest: 1;
    /**
     * Show whether client has accepted risk disclaimer.
     */
    accept_risk: 0 | 1;
    /**
     * [Optional] Purpose and reason for requesting the account opening.
     */
    account_opening_reason?: 'Speculative' | 'Income Earning' | 'Hedging';
    /**
     * [Optional] The anticipated account turnover.
     */
    account_turnover?:
        | 'Less than $25,000'
        | '$25,000 - $50,000'
        | '$50,001 - $100,000'
        | '$100,001 - $500,000'
        | 'Over $500,000';
    /**
     * Within 35 characters
     */
    address_city: string;
    /**
     * Within 70 characters.
     */
    address_line_1: string;
    /**
     * [Optional] Within 70 characters.
     */
    address_line_2?: string;
    /**
     * [Optional] Within 20 characters and may not contain '+'.
     */
    address_postcode?: string;
    /**
     * [Optional] Possible value receive from `states_list` call.
     */
    address_state?: string;
    /**
     * [Optional] Affiliate token, within 32 characters.
     */
    affiliate_token?: string;
    /**
     * [Optional] Binary options trading experience.
     */
    binary_options_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] Binary options trading frequency.
     */
    binary_options_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * [Optional] CFDs trading experience.
     */
    cfd_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] CFDs trading frequency.
     */
    cfd_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * [Optional] Country of legal citizenship, 2-letter country code. Possible value receive from `residence_list` call.
     */
    citizen?: string;
    /**
     * [Optional] Indicates whether this is for a client requesting an account with professional status.
     */
    client_type?: 'professional' | 'retail';
    /**
     * Date of birth format: yyyy-mm-dd.
     */
    date_of_birth: string;
    /**
     * Level of Education
     */
    education_level: 'Primary' | 'Secondary' | 'Tertiary';
    /**
     * Industry of Employment.
     */
    employment_industry:
        | 'Construction'
        | 'Education'
        | 'Finance'
        | 'Health'
        | 'Tourism'
        | 'Information & Communications Technology'
        | 'Science & Engineering'
        | 'Legal'
        | 'Social & Cultural'
        | 'Agriculture'
        | 'Real Estate'
        | 'Food Services'
        | 'Manufacturing'
        | 'Unemployed';
    /**
     * [Optional] Employment Status.
     */
    employment_status?: 'Employed' | 'Pensioner' | 'Self-Employed' | 'Student' | 'Unemployed';
    /**
     * Estimated Net Worth.
     */
    estimated_worth:
        | 'Less than $100,000'
        | '$100,000 - $250,000'
        | '$250,001 - $500,000'
        | '$500,001 - $1,000,000'
        | 'Over $1,000,000';
    /**
     * Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes.
     */
    first_name: string;
    /**
     * [Optional] Forex trading experience.
     */
    forex_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] Forex trading frequency.
     */
    forex_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * Income Source.
     */
    income_source:
        | 'Salaried Employee'
        | 'Self-Employed'
        | 'Investments & Dividends'
        | 'Pension'
        | 'State Benefits'
        | 'Savings & Inheritance';
    /**
     * Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes.
     */
    last_name: string;
    /**
     * Net Annual Income.
     */
    net_income:
        | 'Less than $25,000'
        | '$25,000 - $50,000'
        | '$50,001 - $100,000'
        | '$100,001 - $500,000'
        | 'Over $500,000';
    /**
     * [Optional] Indicates client's self-declaration of not being a PEP/RCA.
     */
    non_pep_declaration?: number;
    /**
     * Occupation.
     */
    occupation:
        | 'Chief Executives, Senior Officials and Legislators'
        | 'Managers'
        | 'Professionals'
        | 'Clerks'
        | 'Personal Care, Sales and Service Workers'
        | 'Agricultural, Forestry and Fishery Workers'
        | 'Craft, Metal, Electrical and Electronics Workers'
        | 'Plant and Machine Operators and Assemblers'
        | 'Cleaners and Helpers'
        | 'Mining, Construction, Manufacturing and Transport Workers'
        | 'Armed Forces'
        | 'Government Officers'
        | 'Students'
        | 'Unemployed';
    /**
     * [Optional] Trading experience in other financial instruments.
     */
    other_instruments_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] Trading frequency in other financial instruments.
     */
    other_instruments_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * [Optional] Starting with `+` followed by 8-35 digits, allowing hyphens or space.
     */
    phone?: string;
    /**
     * [Optional] Place of birth, 2-letter country code.
     */
    place_of_birth?: string;
    /**
     * 2-letter country code, possible value receive from `residence_list` call.
     */
    residence: string;
    /**
     * Accept any value in enum list.
     */
    salutation: 'Mr' | 'Mrs' | 'Ms' | 'Miss';
    /**
     * [Optional] Answer to secret question, within 4-50 characters.
     */
    secret_answer?: string;
    /**
     * [Optional] Accept any value in enum list.
     */
    secret_question?:
        | "Mother's maiden name"
        | 'Name of your pet'
        | 'Name of first love'
        | 'Memorable town/city'
        | 'Memorable date'
        | 'Favourite dish'
        | 'Brand of first car'
        | 'Favourite artist';
    /**
     * [Optional] Source of wealth.
     */
    source_of_wealth?:
        | 'Accumulation of Income/Savings'
        | 'Cash Business'
        | 'Company Ownership'
        | 'Divorce Settlement'
        | 'Inheritance'
        | 'Investment Income'
        | 'Sale of Property';
    /**
     * Tax identification number. Only applicable for real money account. Required for `maltainvest` landing company.
     */
    tax_identification_number: string;
    /**
     * Residence for tax purpose. Comma separated iso country code if multiple jurisdictions. Only applicable for real money account. Required for `maltainvest` landing company.
     */
    tax_residence: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Create real account Receive
 */
export interface NewRealMoneyAccountDefaultLandingCompanyResponse {
    new_account_real?: NewAccountReal;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'new_account_real';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * New real money account details
 */
export interface NewAccountReal {
    /**
     * Client ID of new real money account
     */
    client_id: string;
    /**
     * Landing company full name
     */
    landing_company: string;
    /**
     * Landing company shortcode
     */
    landing_company_short?: string;
    /**
     * OAuth token for client's login session
     */
    oauth_token: string;
    [k: string]: unknown;
}
/**
 * This call opens a new real-money account. This call can be made from a virtual-money or a real-money account. If it is the latter, client information fields in this call will be ignored and data from your existing real-money account will be used.
 */
export interface NewRealMoneyAccountDefaultLandingCompanyRequest {
    /**
     * Must be `1`
     */
    new_account_real: 1;
    /**
     * [Optional] Purpose and reason for requesting the account opening.
     */
    account_opening_reason?: 'Speculative' | 'Income Earning' | 'Hedging' | 'Peer-to-peer exchange';
    /**
     * [Optional] The anticipated account turnover.
     */
    account_turnover?:
        | 'Less than $25,000'
        | '$25,000 - $50,000'
        | '$50,001 - $100,000'
        | '$100,001 - $500,000'
        | 'Over $500,000';
    /**
     * [Optional] Within 35 characters.
     */
    address_city?: string;
    /**
     * [Optional] Mailing address.
     */
    address_line_1?: string;
    /**
     * [Optional] Within 70 characters.
     */
    address_line_2?: string;
    /**
     * [Optional] Within 20 characters and may not contain '+'.
     */
    address_postcode?: string;
    /**
     * [Optional] Possible value receive from `states_list` call.
     */
    address_state?: string;
    /**
     * [Optional] Affiliate token, within 32 characters.
     */
    affiliate_token?: string;
    /**
     * [Optional] Country of legal citizenship, 2-letter country code.
     */
    citizen?: null | string;
    /**
     * [Optional] Indicates whether this is for a client requesting an account with professional status.
     */
    client_type?: 'professional' | 'retail';
    /**
     * [Optional] To set currency of the account. List of supported currencies can be acquired with `payout_currencies` call.
     */
    currency?: string;
    /**
     * Date of birth format: `yyyy-mm-dd`.
     */
    date_of_birth?: string;
    /**
     * Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes.
     */
    first_name?: string;
    /**
     * Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes.
     */
    last_name?: string;
    /**
     * [Optional] Indicates client's self-declaration of not being a PEP/RCA (Politically Exposed Person/Relatives and Close Associates).
     */
    non_pep_declaration?: number;
    /**
     * [Optional] Starting with `+` followed by 8-35 digits, allowing hyphens or space.
     */
    phone?: string;
    /**
     * [Optional] Place of birth, 2-letter country code.
     */
    place_of_birth?: string;
    /**
     * 2-letter country code, possible value receive from `residence_list` call.
     */
    residence: string;
    /**
     * [Optional] Accept any value in enum list.
     */
    salutation?: 'Mr' | 'Mrs' | 'Ms' | 'Miss';
    /**
     * [Optional] Answer to secret question, within 4-50 characters. Required for new account and existing client details will be used if client open another account.
     */
    secret_answer?: string;
    /**
     * [Optional] Accept any value in enum list. Required for new account and existing client details will be used if client open another account.
     */
    secret_question?:
        | "Mother's maiden name"
        | 'Name of your pet'
        | 'Name of first love'
        | 'Memorable town/city'
        | 'Memorable date'
        | 'Favourite dish'
        | 'Brand of first car'
        | 'Favourite artist';
    /**
     * [Optional] Tax identification number. Only applicable for real money account. Required for `maltainvest` landing company.
     */
    tax_identification_number?: string;
    /**
     * [Optional] Residence for tax purpose. Comma separated iso country code if multiple jurisdictions. Only applicable for real money account. Required for `maltainvest` landing company.
     */
    tax_residence?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Create virtual-money account
 */
export interface NewVirtualMoneyAccountResponse {
    new_account_virtual?: NewAccountVirtual;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'new_account_virtual';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * New virtual-money account details
 */
export interface NewAccountVirtual {
    /**
     * Account balance
     */
    balance: number;
    /**
     * Client ID of the new virtual-money account
     */
    client_id: string;
    /**
     * Account currency
     */
    currency: string;
    /**
     * Email of the new virtual-money account
     */
    email: string;
    /**
     * Oauth token for the client's login session (so that the user may be logged in immediately)
     */
    oauth_token: string;
    [k: string]: unknown;
}
/**
 * Create a new virtual-money account.
 */
export interface NewVirtualMoneyAccountRequest {
    /**
     * Must be `1`
     */
    new_account_virtual: 1;
    /**
     * [Optional] Affiliate token, within 32 characters.
     */
    affiliate_token?: string;
    /**
     * Password (Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address).
     */
    client_password: string;
    /**
     * [Optional] Date of first contact, format: `yyyy-mm-dd` in GMT timezone.
     */
    date_first_contact?: string;
    /**
     * [Optional] Google Click Identifier to track source.
     */
    gclid_url?: string;
    /**
     * 2-letter country code (obtained from `residence_list` call).
     */
    residence: string;
    /**
     * [Optional] Show whether user has used mobile or desktop.
     */
    signup_device?: 'desktop' | 'mobile';
    /**
     * [Optional] Identifier of particular ad
     */
    utm_ad_id?: string;
    /**
     * [Optional] Identifier of ad group in the campaign
     */
    utm_adgroup_id?: string;
    /**
     * [Optional] Unique identifier of click on AdRoll ads platform
     */
    utm_adrollclk_id?: string;
    /**
     * [Optional] Identifies a specific product promotion or strategic campaign such as a spring sale or other promotions.
     */
    utm_campaign?: string;
    /**
     * [Optional] Identifier of paid ad campaign
     */
    utm_campaign_id?: string;
    /**
     * [Optional] Used to differentiate similar content, or links within the same ad
     */
    utm_content?: string;
    /**
     * [Optional] Unique identifier of click on Facebook ads platform
     */
    utm_fbcl_id?: string;
    /**
     * [Optional] Unique visitor identifier on Google Ads platform.
     */
    utm_gl_client_id?: string;
    /**
     * [Optional] Identifies the medium the link was used upon such as: email, CPC, or other methods of sharing.
     */
    utm_medium?: string;
    /**
     * [Optional] Unique click identifier on Microsoft Bing ads platform.
     */
    utm_msclk_id?: string;
    /**
     * [Optional] Identifies the source of traffic such as: search engine, newsletter, or other referral.
     */
    utm_source?: string;
    /**
     * [Optional] Used to send information related to the campaign term like paid search keywords
     */
    utm_term?: string;
    /**
     * Email verification code (received from a `verify_email` call, which must be done first).
     */
    verification_code: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * List of OAuth applications that used for the authorized account.
 */
export type OauthApps = ApplicationObject[];

/**
 * A message with used applications
 */
export interface OAuthApplicationsResponse {
    oauth_apps?: OauthApps;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'oauth_apps';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
export interface ApplicationObject {
    /**
     * Application ID.
     */
    app_id: number;
    /**
     * Markup added to contract prices (as a percentage of contract payout)
     */
    app_markup_percentage: number;
    /**
     * The last date which the application has been used.
     */
    last_used: null | string;
    /**
     * Application name
     */
    name: string;
    /**
     * The list of permission scopes grant for each app.
     */
    scopes: string[];
    [k: string]: unknown;
}
/**
 * List all my used OAuth applications.
 */
export interface OAuthApplicationsRequest {
    /**
     * Must be `1`
     */
    oauth_apps: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns the information of the created  P2P (Peer to Peer) advert.
 */
export interface P2PAdvertCreateResponse {
    p2p_advert_create?: P2PAdvertCreate;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advert_create';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The information of the created P2P advert.
 */
export interface P2PAdvertCreate {
    /**
     * Currency for this advert. This is the system currency to be transferred between advertiser and client.
     */
    account_currency: string;
    advertiser_details: AdvertiserDetails;
    /**
     * The total amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    amount: number;
    /**
     * The total amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    amount_display: string;
    /**
     * Advertiser contact information. Only applicable for 'sell adverts'.
     */
    contact_info?: string;
    /**
     * Type of transaction from the opposite party's perspective.
     */
    counterparty_type: 'buy' | 'sell';
    /**
     * The target country code of the advert.
     */
    country: string;
    /**
     * The advert creation time in epoch.
     */
    created_time: number;
    /**
     * General information about the advert.
     */
    description: string;
    /**
     * The unique identifier for this advert.
     */
    id: string;
    /**
     * The activation status of the advert.
     */
    is_active: 0 | 1;
    /**
     * Local currency for this advert. This is the form of payment to be arranged directly between advertiser and client.
     */
    local_currency: string;
    /**
     * Maximum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    max_order_amount: number;
    /**
     * Maximum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    max_order_amount_display: string;
    /**
     * Minimum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    min_order_amount: number;
    /**
     * Minimum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    min_order_amount_display: string;
    /**
     * Payment instructions. Only applicable for 'sell adverts'.
     */
    payment_info?: string;
    /**
     * The payment method.
     */
    payment_method: 'bank_transfer';
    /**
     * Cost of the advert in local currency.
     */
    price: number;
    /**
     * Cost of the advert in local currency, formatted to appropriate decimal places.
     */
    price_display: string;
    /**
     * Conversion rate from account currency to local currency.
     */
    rate: number;
    /**
     * Conversion rate from account currency to local currency, formatted to appropriate decimal places.
     */
    rate_display: string;
    /**
     * Amount currently available for orders, in `account_currency`. It is only visible for advertisers.
     */
    remaining_amount: number;
    /**
     * Amount currently available for orders, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    remaining_amount_display: string;
    /**
     * Whether this is a buy or a sell.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advertiser for this advert.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Creates a P2P (Peer to Peer) advert. Can only be used by an approved P2P advertiser. **This API call is still in Beta.**
 */
export interface P2PAdvertCreateRequest {
    /**
     * Must be 1
     */
    p2p_advert_create: 1;
    /**
     * The total amount of the advert, in advertiser's account currency.
     */
    amount: number;
    /**
     * [Optional] Advertiser contact information. Only applicable for 'sell adverts'.
     */
    contact_info?: string;
    /**
     * [Optional] General information about the advert.
     */
    description?: string;
    /**
     * [Optional] Local currency for this advert. If not provided, will use the currency of client's residence by default.
     */
    local_currency?: string;
    /**
     * Maximum allowed amount for the orders of this advert, in advertiser's `account_currency`. Should be less than or equal to total `amount` of the advert.
     */
    max_order_amount: number;
    /**
     * Minimum allowed amount for the orders of this advert, in advertiser's `account_currency`. Should be less than `max_order_amount`.
     */
    min_order_amount: number;
    /**
     * [Optional] Payment instructions. Only applicable for 'sell adverts'.
     */
    payment_info?: string;
    /**
     * The payment method.
     */
    payment_method: 'bank_transfer';
    /**
     * Conversion rate from advertiser's account currency to `local_currency`.
     */
    rate: number;
    /**
     * Whether this is a buy or a sell.
     */
    type: 'buy' | 'sell';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns information about the given advert ID.
 */
export interface P2PAdvertInformationResponse {
    p2p_advert_info?: P2PAdvertInfo;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advert_info';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * P2P advert information.
 */
export interface P2PAdvertInfo {
    /**
     * Currency for this advert. This is the system currency to be transferred between advertiser and client.
     */
    account_currency: string;
    advertiser_details: AdvertiserDetails;
    /**
     * The total amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    amount?: number;
    /**
     * The total amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    amount_display?: string;
    /**
     * Advertiser contact information. Only applicable for 'sell adverts'.
     */
    contact_info?: string;
    /**
     * Type of transaction from the opposite party's perspective.
     */
    counterparty_type: 'buy' | 'sell';
    /**
     * The target country code of the advert.
     */
    country: string;
    /**
     * The advert creation time in epoch.
     */
    created_time: number;
    /**
     * General information about the advert.
     */
    description: string;
    /**
     * The unique identifier for this advert.
     */
    id: string;
    /**
     * The activation status of the advert.
     */
    is_active: 0 | 1;
    /**
     * Local currency for this advert. This is the form of payment to be arranged directly between advertiser and client.
     */
    local_currency: string;
    /**
     * Maximum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    max_order_amount?: number;
    /**
     * Maximum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    max_order_amount_display?: string;
    /**
     * Maximum order amount at this time, in `account_currency`.
     */
    max_order_amount_limit: number;
    /**
     * Maximum order amount at this time, in `account_currency`, formatted to appropriate decimal places.
     */
    max_order_amount_limit_display: string;
    /**
     * Minimum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    min_order_amount?: number;
    /**
     * Minimum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    min_order_amount_display?: string;
    /**
     * Minimum order amount at this time, in `account_currency`.
     */
    min_order_amount_limit: number;
    /**
     * Minimum order amount at this time, in `account_currency`, formatted to appropriate decimal places.
     */
    min_order_amount_limit_display: string;
    /**
     * Payment instructions. Only applicable for 'sell adverts'.
     */
    payment_info?: string;
    /**
     * The payment method.
     */
    payment_method: 'bank_transfer';
    /**
     * Cost of the advert in local currency.
     */
    price: number;
    /**
     * Cost of the advert in local currency, formatted to appropriate decimal places.
     */
    price_display: string;
    /**
     * Conversion rate from account currency to local currency.
     */
    rate: number;
    /**
     * Conversion rate from account currency to local currency, formatted to appropriate decimal places.
     */
    rate_display: string;
    /**
     * Amount currently available for orders, in `account_currency`. It is only visible for advertisers.
     */
    remaining_amount?: number;
    /**
     * Amount currently available for orders, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    remaining_amount_display?: string;
    /**
     * Whether this is a buy or a sell.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advertiser for this advert.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Retrieve information about a P2P advert. **This API call is still in Beta.**
 */
export interface P2PAdvertInformationRequest {
    /**
     * Must be 1
     */
    p2p_advert_info: 1;
    /**
     * The unique identifier for this advert.
     */
    id: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Available adverts matching the requested criteria.
 */
export interface P2PAdvertListResponse {
    p2p_advert_list?: P2PAdvertList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advert_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * P2P adverts list.
 */
export interface P2PAdvertList {
    /**
     * List of adverts.
     */
    list: {
        /**
         * Currency for this advert. This is the system currency to be transferred between advertiser and client.
         */
        account_currency: string;
        advertiser_details: AdvertiserDetails;
        /**
         * The total amount specified in advert, in `account_currency`. It is only visible for advertisers.
         */
        amount?: number;
        /**
         * The total amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
         */
        amount_display?: string;
        /**
         * Advertiser contact information. Only applicable for 'sell adverts'.
         */
        contact_info?: string;
        /**
         * Type of transaction from the opposite party's perspective.
         */
        counterparty_type: 'buy' | 'sell';
        /**
         * The target country code of the advert.
         */
        country: string;
        /**
         * The advert creation time in epoch.
         */
        created_time: number;
        /**
         * General information about the advert.
         */
        description: string;
        /**
         * The unique identifier for this advert.
         */
        id: string;
        /**
         * The activation status of the advert.
         */
        is_active: 0 | 1;
        /**
         * Local currency for this advert. This is the form of payment to be arranged directly between advertiser and client.
         */
        local_currency: string;
        /**
         * Maximum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
         */
        max_order_amount?: number;
        /**
         * Maximum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
         */
        max_order_amount_display?: string;
        /**
         * Maximum order amount at this time, in `account_currency`.
         */
        max_order_amount_limit: number;
        /**
         * Maximum order amount at this time, in `account_currency`, formatted to appropriate decimal places.
         */
        max_order_amount_limit_display: string;
        /**
         * Minimum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
         */
        min_order_amount?: number;
        /**
         * Minimum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
         */
        min_order_amount_display?: string;
        /**
         * Minimum order amount at this time, in `account_currency`.
         */
        min_order_amount_limit: number;
        /**
         * Minimum order amount at this time, in `account_currency`, formatted to appropriate decimal places.
         */
        min_order_amount_limit_display: string;
        /**
         * Payment instructions. Only applicable for 'sell adverts'.
         */
        payment_info?: string;
        /**
         * The payment method.
         */
        payment_method: 'bank_transfer';
        /**
         * Cost of the advert in local currency.
         */
        price: number;
        /**
         * Cost of the advert in local currency, formatted to appropriate decimal places.
         */
        price_display: string;
        /**
         * Conversion rate from account currency to local currency.
         */
        rate: number;
        /**
         * Conversion rate from account currency to local currency, formatted to appropriate decimal places.
         */
        rate_display: string;
        /**
         * Amount currently available for orders, in `account_currency`. It is only visible for advertisers.
         */
        remaining_amount?: number;
        /**
         * Amount currently available for orders, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
         */
        remaining_amount_display?: string;
        /**
         * Whether this is a buy or a sell.
         */
        type: 'buy' | 'sell';
    }[];
    [k: string]: unknown;
}
/**
 * Details of the advertiser for this advert.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Returns available adverts for use with `p2p_order_create`. **This API call is still in Beta.**
 */
export interface P2PAdvertListRequest {
    /**
     * Must be 1
     */
    p2p_advert_list: 1;
    /**
     * [Optional] Which advertiser to list adverts for.
     */
    advertiser_id?: string;
    /**
     * [Optional] How much to buy or sell, used to calculate prices.
     */
    amount?: number;
    /**
     * [Optional] Filter the adverts by `counterparty_type`.
     */
    counterparty_type?: 'buy' | 'sell';
    /**
     * [Optional] Used for paging.
     */
    limit?: number;
    /**
     * [Optional] Currency to conduct payment transaction in, defaults to the main currency for the client's country.
     */
    local_currency?: string;
    /**
     * [Optional] Used for paging.
     */
    offset?: number;
    /**
     * [Optional] If set to 1, ads that exceed this account's balance or turnover limits will not be shown.
     */
    use_client_limits?: 0 | 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns information about the updated advert.
 */
export interface P2PAdvertUpdateResponse {
    p2p_advert_update?: P2PAdvertUpdate;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advert_update';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * P2P updated advert information.
 */
export interface P2PAdvertUpdate {
    /**
     * Currency for this advert. This is the system currency to be transferred between advertiser and client.
     */
    account_currency: string;
    advertiser_details: AdvertiserDetails;
    /**
     * The total amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    amount: number;
    /**
     * The total amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    amount_display: string;
    /**
     * Advertiser contact information. Only applicable for 'sell adverts'.
     */
    contact_info?: string;
    /**
     * Type of transaction from the opposite party's perspective.
     */
    counterparty_type: 'buy' | 'sell';
    /**
     * The target country code of the advert.
     */
    country: string;
    /**
     * The advert creation time in epoch.
     */
    created_time: number;
    /**
     * General information about the advert.
     */
    description: string;
    /**
     * The unique identifier for this advert.
     */
    id: string;
    /**
     * The activation status of the advert.
     */
    is_active: 0 | 1;
    /**
     * Local currency for this advert. This is the form of payment to be arranged directly between advertiser and client.
     */
    local_currency: string;
    /**
     * Maximum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    max_order_amount: number;
    /**
     * Maximum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    max_order_amount_display: string;
    /**
     * Minimum order amount specified in advert, in `account_currency`. It is only visible for advertisers.
     */
    min_order_amount: number;
    /**
     * Minimum order amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    min_order_amount_display: string;
    /**
     * Payment instructions. Only applicable for 'sell adverts'.
     */
    payment_info?: string;
    /**
     * The payment method.
     */
    payment_method: 'bank_transfer';
    /**
     * Cost of the advert in local currency.
     */
    price: number;
    /**
     * Cost of the advert in local currency, formatted to appropriate decimal places.
     */
    price_display: string;
    /**
     * Conversion rate from account currency to local currency.
     */
    rate: number;
    /**
     * Conversion rate from account currency to local currency, formatted to appropriate decimal places.
     */
    rate_display: string;
    /**
     * Amount currently available for orders, in `account_currency`. It is only visible for advertisers.
     */
    remaining_amount: number;
    /**
     * Amount currently available for orders, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
     */
    remaining_amount_display: string;
    /**
     * Whether this is a buy or a sell.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advertiser for this advert.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Updates a P2P advert. Can only be used by the advertiser. **This API call is still in Beta.**
 */
export interface P2PAdvertUpdateRequest {
    /**
     * Must be 1
     */
    p2p_advert_update: 1;
    /**
     * [Optional] If set to 1, permanently deletes the advert.
     */
    delete?: 0 | 1;
    /**
     * The unique identifier for this advert.
     */
    id: string;
    /**
     * [Optional] Activate or deactivate the advert.
     */
    is_active?: 0 | 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * All adverts belonging to the current advertiser.
 */
export interface P2PAdvertiserAdvertsResponse {
    p2p_advertiser_adverts?: P2PAdvertiserAdverts;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advertiser_adverts';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * List of the P2P advertiser adverts.
 */
export interface P2PAdvertiserAdverts {
    /**
     * List of advertiser adverts.
     */
    list: {
        /**
         * Currency for this advert. This is the system currency to be transferred between advertiser and client.
         */
        account_currency: string;
        advertiser_details: AdvertiserDetails;
        /**
         * The total amount specified in advert, in `account_currency`. It is only visible for advertisers.
         */
        amount: number;
        /**
         * The total amount specified in advert, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
         */
        amount_display: string;
        /**
         * Advertiser contact information. Only applicable for 'sell adverts'.
         */
        contact_info: string;
        /**
         * This is the type of transaction from the counterparty's perspective.
         */
        counterparty_type: 'buy' | 'sell';
        /**
         * The target country code of the advert.
         */
        country: string;
        /**
         * The advert creation time in epoch.
         */
        created_time: number;
        /**
         * General information about the advert.
         */
        description: string;
        /**
         * The unique identifier for this advert.
         */
        id: string;
        /**
         * The activation status of the advert.
         */
        is_active: 0 | 1;
        /**
         * Local currency for this advert. This is the form of payment to be arranged directly between advertiser and client.
         */
        local_currency: string;
        /**
         * Maximum order amount, in `account_currency`.
         */
        max_order_amount: number;
        /**
         * Maximum order amount, in `account_currency`, formatted to appropriate decimal places.
         */
        max_order_amount_display: string;
        /**
         * Minimum order amount, in `account_currency`.
         */
        min_order_amount: number;
        /**
         * Minimum order amount, in `account_currency`, formatted to appropriate decimal places.
         */
        min_order_amount_display: string;
        /**
         * Payment instructions. Only applicable for 'sell adverts'.
         */
        payment_info: string;
        /**
         * The payment method.
         */
        payment_method: 'bank_transfer';
        /**
         * Cost of the advert in local currency.
         */
        price: number;
        /**
         * Cost of the advert in local currency, formatted to appropriate decimal places.
         */
        price_display: string;
        /**
         * Conversion rate from account currency to local currency.
         */
        rate: number;
        /**
         * Conversion rate from account currency to local currency, formatted to appropriate decimal places.
         */
        rate_display: string;
        /**
         * Amount currently available for orders, in `account_currency`. It is only visible for advertisers.
         */
        remaining_amount: number;
        /**
         * Amount currently available for orders, in `account_currency`, formatted to appropriate decimal places. It is only visible for advertisers.
         */
        remaining_amount_display: string;
        /**
         * Whether this is a buy or a sell.
         */
        type: 'buy' | 'sell';
    }[];
    [k: string]: unknown;
}
/**
 * Details of the advertiser for this advert.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Returns all P2P adverts created by the authorized client. Can only be used by a registered P2P advertiser. **This API call is still in Beta.**
 */
export interface P2PAdvertiserAdvertsRequest {
    /**
     * Must be 1
     */
    p2p_advertiser_adverts: 1;
    /**
     * [Optional] Used for paging.
     */
    limit?: number;
    /**
     * [Optional] Used for paging.
     */
    offset?: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns information of the created advertiser.
 */
export interface P2PAdvertiserCreateResponse {
    p2p_advertiser_create?: P2PAdvertiserCreate;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advertiser_create';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * P2P advertiser information.
 */
export interface P2PAdvertiserCreate {
    /**
     * Amount of funds available to sell on P2P. May be less than account balance according to deposit methods used.
     */
    balance_available?: number;
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's identify has been verified.
     */
    basic_verification?: 1 | 0;
    /**
     * The percentage of completed orders out of total orders as a buyer within the past 30 days.
     */
    buy_completion_rate: null | number;
    /**
     * The number of buy order completed within the past 30 days.
     */
    buy_orders_count: number;
    /**
     * The average time in seconds taken to cancel orders as a buyer within the past 30 days.
     */
    cancel_time_avg: number | null;
    /**
     * The token to be used for authenticating the client for chat.
     */
    chat_token: string;
    /**
     * The unique identifier for the chat user.
     */
    chat_user_id: string;
    /**
     * Advertiser's contact information.
     */
    contact_info: string;
    /**
     * The epoch time that the client became an advertiser.
     */
    created_time: number;
    /**
     * Total value of P2P buy transactions in the past 24 hours.
     */
    daily_buy?: string;
    /**
     * Maximum allowed value of P2P buy transactions in a 24 hour period.
     */
    daily_buy_limit?: string;
    /**
     * Total value of P2P sell transactions in the past 24 hours.
     */
    daily_sell?: string;
    /**
     * Maximum allowed value of P2P sell transactions in a 24 hour period.
     */
    daily_sell_limit?: string;
    /**
     * Default description that can be used every time an advert is created.
     */
    default_advert_description?: string;
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's address has been verified.
     */
    full_verification?: 1 | 0;
    /**
     * The advertiser's identification number.
     */
    id: string;
    /**
     * The approval status of the advertiser.
     */
    is_approved: 0 | 1;
    /**
     * Indicates if the advertiser's active adverts are listed. When `0`, adverts won't be listed regardless if they are active or not.
     */
    is_listed: 0 | 1;
    /**
     * The advertiser's displayed name.
     */
    name: string;
    /**
     * Advertiser's payment information.
     */
    payment_info: string;
    /**
     * The average time in seconds taken to release funds as a seller within the past 30 days.
     */
    release_time_avg: number | null;
    /**
     * The percentage of completed orders out of total orders as a seller within the past 30 days.
     */
    sell_completion_rate: null | number;
    /**
     * The number of sell order orders completed within the past 30 days.
     */
    sell_orders_count: number;
    /**
     * When `1`, the advertiser's real name will be displayed to other users on adverts and orders.
     */
    show_name?: 0 | 1;
    /**
     * The percentage of completed orders out of all orders within the past 30 days.
     */
    total_completion_rate: null | number;
    /**
     * The total number of orders completed since advertiser registration.
     */
    total_orders_count: number;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Registers the client as a P2P advertiser. **This API call is still in Beta.**
 */
export interface P2PAdvertiserCreateRequest {
    /**
     * Must be 1
     */
    p2p_advertiser_create: 1;
    /**
     * [Optional] Advertiser's contact information, to be used as a default for new sell adverts.
     */
    contact_info?: string;
    /**
     * [Optional] Default description that can be used every time an advert is created.
     */
    default_advert_description?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
    /**
     * [Optional] Advertiser's payment information, to be used as a default for new sell adverts.
     */
    payment_info?: string;
    /**
     * [Optional] If set to 1, will send updates whenever there is an update to advertiser
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns information about the given advertiser ID.
 */
export interface P2PAdvertiserInformationResponse {
    p2p_advertiser_info?: P2PAdvertiserInfo;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advertiser_info';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * P2P advertiser information.
 */
export interface P2PAdvertiserInfo {
    /**
     * Amount of funds available to sell on P2P. May be less than account balance according to deposit methods used.
     */
    balance_available?: number;
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's identify has been verified.
     */
    basic_verification: 1 | 0;
    /**
     * The percentage of completed orders out of total orders as a buyer within the past 30 days.
     */
    buy_completion_rate: null | number;
    /**
     * The number of buy order completed within the past 30 days.
     */
    buy_orders_count: number;
    /**
     * The average time in seconds taken to cancel orders as a buyer within the past 30 days.
     */
    cancel_time_avg: number | null;
    /**
     * The token to be used for authenticating the client for chat.
     */
    chat_token?: string;
    /**
     * The unique identifier for the chat user.
     */
    chat_user_id?: string;
    /**
     * Advertiser's contact information.
     */
    contact_info?: string;
    /**
     * The epoch time that the client became an advertiser.
     */
    created_time: number;
    /**
     * Total value of P2P buy transactions in the past 24 hours.
     */
    daily_buy?: string;
    /**
     * Maximum allowed value of P2P buy transactions in a 24 hour period.
     */
    daily_buy_limit?: string;
    /**
     * Total value of P2P sell transactions in the past 24 hours.
     */
    daily_sell?: string;
    /**
     * Maximum allowed value of P2P sell transactions in a 24 hour period.
     */
    daily_sell_limit?: string;
    /**
     * Default description that can be used every time an advert is created.
     */
    default_advert_description?: string;
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's address has been verified.
     */
    full_verification: 1 | 0;
    /**
     * The advertiser's identification number.
     */
    id: string;
    /**
     * The approval status of the advertiser.
     */
    is_approved: 0 | 1;
    /**
     * Indicates if the advertiser's active adverts are listed. When `0`, adverts won't be listed regardless if they are active or not.
     */
    is_listed: 0 | 1;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
    /**
     * Advertiser's payment information.
     */
    payment_info?: string;
    /**
     * The average time in seconds taken to release funds as a seller within the past 30 days.
     */
    release_time_avg: number | null;
    /**
     * The percentage of completed orders out of total orders as a seller within the past 30 days.
     */
    sell_completion_rate: null | number;
    /**
     * The number of sell order orders completed within the past 30 days.
     */
    sell_orders_count: number;
    /**
     * When `1`, the advertiser's real name will be displayed on to other users on adverts and orders.
     */
    show_name?: 0 | 1;
    /**
     * The percentage of completed orders out of all orders within the past 30 days.
     */
    total_completion_rate: null | number;
    /**
     * The total number of orders completed since advertiser registration.
     */
    total_orders_count: number;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Retrieve information about a P2P advertiser. **This API call is still in Beta.**
 */
export interface P2PAdvertiserInformationRequest {
    /**
     * Must be 1
     */
    p2p_advertiser_info: 1;
    /**
     * [Optional] The unique identifier for this advertiser. If not provided, returns advertiser information about the current account.
     */
    id?: string;
    /**
     * [Optional] If set to 1, will send updates whenever there is an update to advertiser
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns historical trade statistics of a P2P advertiser.
 */
export interface P2PAdvertiserStatisticsResponse {
    p2p_advertiser_stats?: P2PAdvertiserStats;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advertiser_stats';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * P2P advertiser statistics.
 */
export interface P2PAdvertiserStats {
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's identify has been verified.
     */
    basic_verification: 1 | 0;
    /**
     * The percentage of completed orders out of total orders as a buyer within the requested time period.
     */
    buy_completion_rate: null | number;
    /**
     * The number of buy order completed within the requested time period.
     */
    buy_orders_count: number;
    /**
     * The average time taken to cancel orders as a buyer within the requested time period, in seconds.
     */
    cancel_time_avg: number | null;
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's address has been verified.
     */
    full_verification: 1 | 0;
    /**
     * The average time taken to release funds as a seller within the requested time period, in seconds.
     */
    release_time_avg: number | null;
    /**
     * The percentage of completed orders out of total orders as a seller within the requested time period.
     */
    sell_completion_rate: null | number;
    /**
     * The number of bselluy order orders completed within the requested time period.
     */
    sell_orders_count: number;
    /**
     * The percentage of completed orders out of all orders within the past 30 days.
     */
    total_completion_rate: null | number;
    /**
     * The total number of orders created since advertiser registration.
     */
    total_orders_count: number;
}
/**
 * Retrieve historical trade statistics of a P2P advertiser. **This API call is still in Beta.**
 */
export interface P2PAdvertiserStatisticsRequest {
    /**
     * Must be 1
     */
    p2p_advertiser_stats: 1;
    /**
     * [Optional] The time period to create statistics for, in days. If not provided, 30 days will be used.
     */
    days?: number;
    /**
     * [Optional] The unique identifier for this advertiser. If not provided, returns advertiser statistics of the current account.
     */
    id?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Returns latest information of the advertiser.
 */
export interface P2PAdvertiserUpdateResponse {
    p2p_advertiser_update?: P2PAdvertiserUpdate;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_advertiser_update';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * P2P advertiser information.
 */
export interface P2PAdvertiserUpdate {
    /**
     * Amount of funds available to sell on P2P. May be less than account balance according to deposit methods used.
     */
    balance_available?: number;
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's identify has been verified.
     */
    basic_verification: 1 | 0;
    /**
     * The percentage of completed orders out of total orders as a buyer within the past 30 days.
     */
    buy_completion_rate: null | number;
    /**
     * The number of buy order completed within the past 30 days.
     */
    buy_orders_count: number;
    /**
     * The average time in seconds taken to cancel orders as a buyer within the past 30 days.
     */
    cancel_time_avg: number | null;
    /**
     * The token to be used for authenticating the client for chat.
     */
    chat_token?: string;
    /**
     * The unique identifier for the chat user.
     */
    chat_user_id?: string;
    /**
     * Advertiser's contact information.
     */
    contact_info?: string;
    /**
     * The epoch time that the client became an advertiser.
     */
    created_time: number;
    /**
     * Total value of P2P buy transactions in the past 24 hours.
     */
    daily_buy?: string;
    /**
     * Maximum allowed value of P2P buy transactions in a 24 hour period.
     */
    daily_buy_limit?: string;
    /**
     * Total value of P2P sell transactions in the past 24 hours.
     */
    daily_sell?: string;
    /**
     * Maximum allowed value of P2P sell transactions in a 24 hour period.
     */
    daily_sell_limit?: string;
    /**
     * Default description that can be used every time an advert is created.
     */
    default_advert_description?: string;
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * Boolean value: 1 or 0, indicating whether the advertiser's address has been verified.
     */
    full_verification: 1 | 0;
    /**
     * The advertiser's identification number.
     */
    id: string;
    /**
     * The approval status of the advertiser.
     */
    is_approved: 0 | 1;
    /**
     * Indicates if the advertiser's active adverts are listed. When `0`, adverts won't be listed regardless if they are active or not.
     */
    is_listed: 0 | 1;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
    /**
     * Advertiser's payment information.
     */
    payment_info?: string;
    /**
     * The average time in seconds taken to release funds as a seller within the past 30 days.
     */
    release_time_avg: number | null;
    /**
     * The percentage of completed orders out of total orders as a seller within the past 30 days.
     */
    sell_completion_rate: null | number;
    /**
     * The number of sell order orders completed within the past 30 days.
     */
    sell_orders_count: number;
    /**
     * When `1`, the advertiser's real name will be displayed on to other users on adverts and orders.
     */
    show_name?: 0 | 1;
    /**
     * The percentage of completed orders out of all orders within the past 30 days.
     */
    total_completion_rate: null | number;
    /**
     * The total number of orders completed since advertiser registration.
     */
    total_orders_count: number;
}
/**
 * Update the information of the P2P advertiser for the current account. Can only be used by an approved P2P advertiser. **This API call is still in Beta.**
 */
export interface P2PAdvertiserUpdateRequest {
    /**
     * Must be 1
     */
    p2p_advertiser_update: 1;
    /**
     * [Optional] Advertiser's contact information, to be used as a default for new sell adverts.
     */
    contact_info?: string;
    /**
     * [Optional] Default description that can be used every time an advert is created.
     */
    default_advert_description?: string;
    /**
     * [Optional] Used to set if the advertiser's adverts could be listed. When `0`, adverts won't be listed regardless of they are active or not. This doesn't change the `is_active` of each individual advert.
     */
    is_listed?: 0 | 1;
    /**
     * [Optional] Advertiser's payment information, to be used as a default for new sell adverts.
     */
    payment_info?: string;
    /**
     * [Optional] When `1`, the advertiser's real name will be displayed on to other users on adverts and orders.
     */
    show_name?: 0 | 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Information of the created P2P chat.
 */
export interface P2PChatCreateResponse {
    p2p_chat_create?: P2PChatCreate;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_chat_create';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Information of the P2P chat.
 */
export interface P2PChatCreate {
    /**
     * The URL to be used to initialise the chat for the requested order.
     */
    channel_url: string;
    /**
     * The unique identifier for the order that the chat belongs to.
     */
    order_id: string;
}
/**
 * Creates a P2P chat for the specified order. **This API call is still in Beta.**
 */
export interface P2PChatCreateRequest {
    /**
     * Must be 1
     */
    p2p_chat_create: 1;
    /**
     * The unique identifier for the order to create the chat for.
     */
    order_id: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Result of the P2P order cancellation.
 */
export interface P2POrderCancelResponse {
    /**
     * Cancellation details
     */
    p2p_order_cancel?: {
        /**
         * The unique identifier for the order.
         */
        id: string;
        /**
         * The new status of the order.
         */
        status: 'cancelled';
    };
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_order_cancel';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Cancel a P2P order. **This API call is still in Beta.**
 */
export interface P2POrderCancelRequest {
    /**
     * Must be 1
     */
    p2p_order_cancel: 1;
    /**
     * The unique identifier for this order.
     */
    id: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Result of the P2P order confirmation.
 */
export interface P2POrderConfirmResponse {
    /**
     * Confirmation details
     */
    p2p_order_confirm?: {
        /**
         * The unique identifier for the order.
         */
        id: string;
        /**
         * The new status of the order.
         */
        status: 'buyer-confirmed' | 'completed';
    };
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_order_confirm';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Confirm a P2P order. **This API call is still in Beta.**
 */
export interface P2POrderConfirmRequest {
    /**
     * Must be 1
     */
    p2p_order_confirm: 1;
    /**
     * The unique identifier for this order.
     */
    id: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * The information about the created P2P order.
 */
export interface P2POrderCreateResponse {
    p2p_order_create?: P2POrderCreate;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_order_create';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Information of the creates P2P order.
 */
export interface P2POrderCreate {
    /**
     * The currency of order.
     */
    account_currency: string;
    advert_details: AdvertDetails;
    advertiser_details: AdvertiserDetails;
    /**
     * The amount of the order.
     */
    amount: number;
    /**
     * The amount of the order, formatted to appropriate decimal places.
     */
    amount_display: string;
    /**
     * The URL to be used to initialise the chat for this order.
     */
    chat_channel_url: string;
    client_details: ClientDetails;
    /**
     * Seller contact information.
     */
    contact_info: string;
    /**
     * The epoch time of the order creation.
     */
    created_time: number;
    dispute_details: DisputeDetails;
    /**
     * The epoch time in which the order will be expired.
     */
    expiry_time: number;
    /**
     * The unique identifier for this order.
     */
    id: string;
    /**
     * `1` if the order is created for the advert of the current client, otherwise `0`.
     */
    is_incoming: 0 | 1;
    /**
     * Local currency for this order.
     */
    local_currency: string;
    /**
     * Payment instructions.
     */
    payment_info: string;
    /**
     * Cost in local currency.
     */
    price: number;
    /**
     * Cost in local currency, formatted to appropriate decimal places.
     */
    price_display: string;
    /**
     * Conversion rate of the order.
     */
    rate: number;
    /**
     * Conversion rate of the order, formatted to appropriate decimal places.
     */
    rate_display: string;
    /**
     * The status of the created order.
     */
    status: 'pending';
    /**
     * Type of the order.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advert for this order.
 */
export interface AdvertDetails {
    /**
     * General information about the advert.
     */
    description: string;
    /**
     * The unique identifier for the advert.
     */
    id: string;
    /**
     * The payment method.
     */
    payment_method: string;
    /**
     * Type of the advert.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advertiser for this order.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's account identifier.
     */
    loginid: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Details of the client who created the order.
 */
export interface ClientDetails {
    /**
     * The client's first name.
     */
    first_name?: string;
    /**
     * The client's unique P2P identifier.
     */
    id: string;
    /**
     * The client's last name.
     */
    last_name?: string;
    /**
     * The client's account identifier.
     */
    loginid: string;
    /**
     * The client's displayed name.
     */
    name: string;
}
/**
 * Details of the order dispute.
 */
export interface DisputeDetails {
    /**
     * The dispute reason
     */
    dispute_reason: null | string;
    /**
     * The loginid of the client who's raising the dispute
     */
    disputer_loginid: null | string;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Creates a P2P order for the specified advert. **This API call is still in Beta.**
 */
export interface P2POrderCreateRequest {
    /**
     * Must be 1
     */
    p2p_order_create: 1;
    /**
     * The unique identifier for the advert to create an order against.
     */
    advert_id: string;
    /**
     * The amount of currency to be bought or sold.
     */
    amount: number;
    /**
     * [Optional] Seller contact information. Only applicable for 'sell orders'.
     */
    contact_info?: string;
    /**
     * [Optional] Payment instructions. Only applicable for 'sell orders'.
     */
    payment_info?: string;
    /**
     * [Optional] If set to 1, will send updates whenever there is an update to the order.
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Information of the P2P order.
 */
export interface P2POrderInformationResponse {
    p2p_order_info?: P2POrderInfo;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_order_info';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The information of P2P order.
 */
export interface P2POrderInfo {
    /**
     * The currency of order.
     */
    account_currency: string;
    advert_details: AdvertDetails;
    advertiser_details: AdvertiserDetails;
    /**
     * The amount of the order.
     */
    amount: number;
    /**
     * The amount of the order, formatted to appropriate decimal places.
     */
    amount_display: string;
    /**
     * The URL to be used to initialise the chat for this order.
     */
    chat_channel_url: string;
    client_details: ClientDetails;
    /**
     * Seller contact information.
     */
    contact_info: string;
    /**
     * The epoch time of the order creation.
     */
    created_time: number;
    dispute_details: DisputeDetails;
    /**
     * The epoch time in which the order will be expired.
     */
    expiry_time: number;
    /**
     * The unique identifier for this order.
     */
    id: string;
    /**
     * `1` if the order is created for the advert of the current client, otherwise `0`.
     */
    is_incoming: 0 | 1;
    /**
     * Local currency for this order.
     */
    local_currency: string;
    /**
     * Payment instructions.
     */
    payment_info: string;
    /**
     * Cost in local currency.
     */
    price: number;
    /**
     * Cost in local currency, formatted to appropriate decimal places.
     */
    price_display: string;
    /**
     * Conversion rate of the order.
     */
    rate: number;
    /**
     * Conversion rate of the order, formatted to appropriate decimal places.
     */
    rate_display: string;
    /**
     * Current order status.
     */
    status:
        | 'pending'
        | 'buyer-confirmed'
        | 'cancelled'
        | 'timed-out'
        | 'blocked'
        | 'refunded'
        | 'completed'
        | 'disputed'
        | 'dispute-refunded'
        | 'dispute-completed';
    /**
     * Whether this is a buy or a sell.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advert for this order.
 */
export interface AdvertDetails {
    /**
     * General information about the advert.
     */
    description: string;
    /**
     * The unique identifier for the advert.
     */
    id: string;
    /**
     * The payment method.
     */
    payment_method: string;
    /**
     * Type of the advert.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advertiser for this order.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's account identifier.
     */
    loginid: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Details of the client who created the order.
 */
export interface ClientDetails {
    /**
     * The client's first name.
     */
    first_name?: string;
    /**
     * The client's unique P2P identifier.
     */
    id: string;
    /**
     * The client's last name.
     */
    last_name?: string;
    /**
     * The client's account identifier.
     */
    loginid: string;
    /**
     * The client's displayed name.
     */
    name: string;
}
/**
 * Details of the order dispute.
 */
export interface DisputeDetails {
    /**
     * The dispute reason
     */
    dispute_reason: null | string;
    /**
     * The loginid of the client who's raising the dispute
     */
    disputer_loginid: null | string;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Retrieves the information about a P2P order. **This API call is still in Beta.**
 */
export interface P2POrderInformationRequest {
    /**
     * Must be 1
     */
    p2p_order_info: 1;
    /**
     * The unique identifier for the order.
     */
    id: string;
    /**
     * [Optional] If set to 1, will send updates whenever there is an update to order
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * All orders matching the requested criteria.
 */
export interface P2POrderListResponse {
    p2p_order_list?: P2POrderList;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'p2p_order_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * List of P2P orders.
 */
export interface P2POrderList {
    /**
     * List of orders.
     */
    list: {
        /**
         * The currency to be bought or sold.
         */
        account_currency: string;
        advert_details: AdvertDetails;
        advertiser_details: AdvertiserDetails;
        /**
         * The amount of the order.
         */
        amount: number;
        /**
         * The amount of the order, formatted to appropriate decimal places.
         */
        amount_display: string;
        /**
         * The URL to be used to initialise the chat for this order.
         */
        chat_channel_url: string;
        client_details?: ClientDetails;
        /**
         * Seller contact information.
         */
        contact_info: string;
        /**
         * The epoch time of the order creation.
         */
        created_time: number;
        dispute_details: DisputeDetails;
        /**
         * The epoch time in which the order will be expired.
         */
        expiry_time: number;
        /**
         * The unique identifier for this order.
         */
        id: string;
        /**
         * `1` if the order is created for the advert of the current client, otherwise `0`.
         */
        is_incoming: 0 | 1;
        /**
         * Local currency for this order.
         */
        local_currency: string;
        /**
         * Payment instructions.
         */
        payment_info: string;
        /**
         * Cost in local currency.
         */
        price: number;
        /**
         * Cost in local currency, formatted to appropriate decimal places.
         */
        price_display: string;
        /**
         * Conversion rate of the order.
         */
        rate: number;
        /**
         * Conversion rate of the order, formatted to appropriate decimal places.
         */
        rate_display: string;
        /**
         * Current order status.
         */
        status:
            | 'pending'
            | 'buyer-confirmed'
            | 'cancelled'
            | 'timed-out'
            | 'blocked'
            | 'refunded'
            | 'completed'
            | 'disputed'
            | 'dispute-refunded'
            | 'dispute-completed';
        /**
         * Whether this is a buy or a sell.
         */
        type: 'buy' | 'sell';
        [k: string]: unknown;
    }[];
}
/**
 * Details of the advert for this order.
 */
export interface AdvertDetails {
    /**
     * General information about the advert.
     */
    description: string;
    /**
     * The unique identifier for the advert.
     */
    id: string;
    /**
     * The payment method.
     */
    payment_method: string;
    /**
     * Type of the advert.
     */
    type: 'buy' | 'sell';
}
/**
 * Details of the advertiser for this order.
 */
export interface AdvertiserDetails {
    /**
     * The advertiser's first name.
     */
    first_name?: string;
    /**
     * The advertiser's unique identifier.
     */
    id: string;
    /**
     * The advertiser's last name.
     */
    last_name?: string;
    /**
     * The advertiser's account identifier.
     */
    loginid: string;
    /**
     * The advertiser's displayed name.
     */
    name: string;
}
/**
 * Details of the client who created the order.
 */
export interface ClientDetails {
    /**
     * The client's first name.
     */
    first_name?: string;
    /**
     * The client's unique P2P identifier.
     */
    id: string;
    /**
     * The client's last name.
     */
    last_name?: string;
    /**
     * The client's account identifier.
     */
    loginid: string;
    /**
     * The client's displayed name.
     */
    name: string;
}
/**
 * Details of the order dispute.
 */
export interface DisputeDetails {
    /**
     * The dispute reason
     */
    dispute_reason: null | string;
    /**
     * The loginid of the client who's raising the dispute
     */
    disputer_loginid: null | string;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * List active orders. **This API call is still in Beta.**
 */
export interface P2POrderListRequest {
    /**
     * Must be 1
     */
    p2p_order_list: 1;
    /**
     * [Optional] Should be 1 to list active, 0 to list inactive (historical).
     */
    active?: 0 | 1;
    /**
     * [Optional] If present, lists orders applying to a specific advert.
     */
    advert_id?: string;
    /**
     * [Optional] Used for paging.
     */
    limit?: number;
    /**
     * [Optional] Used for paging.
     */
    offset?: number;
    /**
     * [Optional] If set to 1, will send updates whenever there is a change to any order belonging to you.
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with Payment Agent List
 */
export interface PaymentAgentListResponse {
    paymentagent_list?: PaymentagentList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'paymentagent_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Payment Agent List
 */
export interface PaymentagentList {
    /**
     * The list of countries in which payment agent is available.
     */
    available_countries?: (null | string)[][];
    /**
     * List of payment agents available in the requested country.
     */
    list: {
        /**
         * Currencies that are accepted by this payment agent.
         */
        currencies?: string;
        /**
         * Commission amount applied on deposits made through this payment agent.
         */
        deposit_commission?: string;
        /**
         * Payment agent's email address.
         */
        email?: string;
        /**
         * More descriptions about this payment agent.
         */
        further_information?: string;
        /**
         * Maximum withdrawal allowed for transactions through this payment agent.
         */
        max_withdrawal?: null | string;
        /**
         * Minimum withdrawal allowed for transactions through this payment agent.
         */
        min_withdrawal?: null | string;
        /**
         * Payment agent's name.
         */
        name?: string;
        /**
         * Payment agent's loginid.
         */
        paymentagent_loginid?: string;
        /**
         * A summary about payment agent.
         */
        summary?: string;
        /**
         * Comma separated list of supported banks.
         */
        supported_banks?: null | string;
        /**
         * Payment agent's phone number.
         */
        telephone?: string;
        /**
         * Payment agent's website URL.
         */
        url?: string;
        /**
         * Commission amount applied on withdrawals made through this payment agent.
         */
        withdrawal_commission?: string;
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * Client's 2-letter country code (obtained from `residence_list` call).
 */
export type PaymentAgentTargetCountry = string;

/**
 * Will return a list of Payment Agents for a given country for a given currency. Payment agents allow users to deposit and withdraw funds using local payment methods that might not be available via the main website's cashier system.
 */
export interface PaymentAgentListRequest {
    paymentagent_list: PaymentAgentTargetCountry;
    /**
     * [Optional] If specified, only payment agents that supports that currency will be returned (obtained from `payout_currencies` call).
     */
    currency?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * If set to `1`, transfer success. If set to `2`, dry-run success.
 */
export type PaymentagentTransfer = 1 | 2;

/**
 * The result of transfer request made.
 */
export interface PaymentAgentTransferResponse {
    paymentagent_transfer?: PaymentagentTransfer;
    /**
     * The `transfer_to` client full name
     */
    client_to_full_name?: string;
    /**
     * The `transfer_to` client loginid
     */
    client_to_loginid?: string;
    /**
     * Reference ID of transfer performed
     */
    transaction_id?: number;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'paymentagent_transfer';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Payment Agent Transfer - this call is available only to accounts that are approved Payment Agents.
 */
export interface PaymentAgentTransferRequest {
    /**
     * Must be `1`
     */
    paymentagent_transfer: 1;
    /**
     * The amount to transfer.
     */
    amount: number;
    /**
     * Currency code.
     */
    currency: string;
    /**
     * [Optional] Remarks about the transfer.
     */
    description?: string;
    /**
     * [Optional] If set to `1`, just do validation.
     */
    dry_run?: 0 | 1;
    /**
     * The loginid of the recipient account.
     */
    transfer_to: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * If set to `1`, withdrawal success. If set to `2`, dry-run success.
 */
export type PaymentagentWithdraw = 1 | 2;

/**
 * The result of payment agent withdrawal request made.
 */
export interface PaymentAgentWithdrawResponse {
    paymentagent_withdraw?: PaymentagentWithdraw;
    /**
     * Payment agent name.
     */
    paymentagent_name?: string;
    /**
     * Reference ID of withdrawal performed.
     */
    transaction_id?: number;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'paymentagent_withdraw';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Initiate a withdrawal to an approved Payment Agent.
 */
export interface PaymentAgentWithdrawRequest {
    /**
     * Must be `1`
     */
    paymentagent_withdraw: 1;
    /**
     * The amount to withdraw to the payment agent.
     */
    amount: number;
    /**
     * The currency code.
     */
    currency: string;
    /**
     * [Optional] Remarks about the withdraw. Only letters, numbers, space, period, comma, - ' are allowed.
     */
    description?: string;
    /**
     * [Optional] If set to 1, just do validation.
     */
    dry_run?: 0 | 1;
    /**
     * The payment agent loginid received from the `paymentagent_list` call.
     */
    paymentagent_loginid: string;
    /**
     * Email verification code (received from a `verify_email` call, which must be done first)
     */
    verification_code: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Available payout currencies. Note: if a user is logged in, only the currency available for the account will be returned.
 */
export type PayoutCurrencies = string[];

/**
 * List of available payout currencies.
 */
export interface PayoutCurrenciesResponse {
    payout_currencies?: PayoutCurrencies;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'payout_currencies';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Retrieve a list of available option payout currencies. If a user is logged in, only the currencies available for the account will be returned.
 */
export interface PayoutCurrenciesRequest {
    /**
     * Must be `1`
     */
    payout_currencies: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Will return 'pong'
 */
export type Ping = 'pong';

/**
 * The response of ping request.
 */
export interface PingResponse {
    ping?: Ping;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'ping';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * To send the ping request to the server. Mostly used to test the connection or to keep it alive.
 */
export interface PingRequest {
    /**
     * Must be `1`
     */
    ping: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * List of open positions.
 */
export type Contracts = Portfolio1[];

/**
 * Receive a list of outstanding options in the user's portfolio
 */
export interface PortfolioResponse {
    portfolio?: Portfolio;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'portfolio';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Current account's open positions.
 */
export interface Portfolio {
    contracts: Contracts;
    [k: string]: unknown;
}
/**
 * The details of each open position.
 */
export interface Portfolio1 {
    /**
     * ID of the application where this contract was purchased.
     */
    app_id?: number | null;
    /**
     * Buy price
     */
    buy_price?: number;
    /**
     * Internal contract identifier number (to be used in a `proposal_open_contract` API call).
     */
    contract_id?: number;
    /**
     * Contract type
     */
    contract_type?: string;
    /**
     * Contract currency
     */
    currency?: string;
    /**
     * Epoch of start date
     */
    date_start?: number;
    /**
     * Epoch of expiry time
     */
    expiry_time?: number;
    /**
     * Contract description
     */
    longcode?: string;
    /**
     * Payout price
     */
    payout?: number;
    /**
     * Epoch of purchase time
     */
    purchase_time?: number;
    /**
     * Symbol code
     */
    symbol?: string;
    /**
     * It is the transaction ID. Every contract (buy or sell) and every payment has a unique ID.
     */
    transaction_id?: number;
    [k: string]: unknown;
}
/**
 * Receive information about my current portfolio of outstanding options
 */
export interface PortfolioRequest {
    /**
     * Must be `1`
     */
    portfolio: 1;
    /**
     * Return only contracts of the specified types
     */
    contract_type?: (
        | 'ASIAND'
        | 'ASIANU'
        | 'CALL'
        | 'CALLE'
        | 'CALLSPREAD'
        | 'DIGITDIFF'
        | 'DIGITEVEN'
        | 'DIGITMATCH'
        | 'DIGITODD'
        | 'DIGITOVER'
        | 'DIGITUNDER'
        | 'EXPIRYMISSE'
        | 'EXPIRYMISS'
        | 'EXPIRYRANGE'
        | 'EXPIRYRANGEE'
        | 'LBFLOATCALL'
        | 'LBFLOATPUT'
        | 'LBHIGHLOW'
        | 'MULTDOWN'
        | 'MULTUP'
        | 'NOTOUCH'
        | 'ONETOUCH'
        | 'PUT'
        | 'PUTE'
        | 'PUTSPREAD'
        | 'RANGE'
        | 'RESETCALL'
        | 'RESETPUT'
        | 'RUNHIGH'
        | 'RUNLOW'
        | 'TICKHIGH'
        | 'TICKLOW'
        | 'UPORDOWN'
    )[];
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A summary of account profit table is received
 */
export interface ProfitTableResponse {
    profit_table?: ProfitTable;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'profit_table';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Account Profit Table.
 */
export interface ProfitTable {
    /**
     * Number of transactions returned in this call
     */
    count?: number;
    /**
     * Array of returned transactions
     */
    transactions?: {
        /**
         * ID of the application where this contract was purchased.
         */
        app_id?: number | null;
        /**
         * The buy price
         */
        buy_price?: number;
        /**
         * The unique contract identifier.
         */
        contract_id?: number | null;
        /**
         * The description of contract purchased if description is set to 1
         */
        longcode?: string;
        /**
         * Payout price
         */
        payout?: number;
        /**
         * Epoch purchase time of the transaction
         */
        purchase_time?: number;
        /**
         * The price the contract sold for.
         */
        sell_price?: number;
        /**
         * Epoch sell time of the transaction
         */
        sell_time?: number | null;
        /**
         * Compact description of the contract purchased if description is set to 1
         */
        shortcode?: string;
        /**
         * The transaction Identifier. Every contract (buy or sell) and every payment has a unique transaction identifier.
         */
        transaction_id?: number;
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * Retrieve a summary of account Profit Table, according to given search criteria
 */
export interface ProfitTableRequest {
    /**
     * Must be `1`
     */
    profit_table: 1;
    /**
     * Return only contracts of the specified types
     */
    contract_type?: (
        | 'ASIAND'
        | 'ASIANU'
        | 'CALL'
        | 'CALLE'
        | 'CALLSPREAD'
        | 'DIGITDIFF'
        | 'DIGITEVEN'
        | 'DIGITMATCH'
        | 'DIGITODD'
        | 'DIGITOVER'
        | 'DIGITUNDER'
        | 'EXPIRYMISSE'
        | 'EXPIRYMISS'
        | 'EXPIRYRANGE'
        | 'EXPIRYRANGEE'
        | 'LBFLOATCALL'
        | 'LBFLOATPUT'
        | 'LBHIGHLOW'
        | 'MULTDOWN'
        | 'MULTUP'
        | 'NOTOUCH'
        | 'ONETOUCH'
        | 'PUT'
        | 'PUTE'
        | 'PUTSPREAD'
        | 'RANGE'
        | 'RESETCALL'
        | 'RESETPUT'
        | 'RUNHIGH'
        | 'RUNLOW'
        | 'TICKHIGH'
        | 'TICKLOW'
        | 'UPORDOWN'
    )[];
    /**
     * [Optional] Start date (epoch or YYYY-MM-DD)
     */
    date_from?: string;
    /**
     * [Optional] End date (epoch or YYYY-MM-DD)
     */
    date_to?: string;
    /**
     * [Optional] If set to 1, will return full contracts description.
     */
    description?: 0 | 1;
    /**
     * [Optional] Apply upper limit to count of transactions received.
     */
    limit?: number;
    /**
     * [Optional] Number of transactions to skip.
     */
    offset?: number;
    /**
     * [Optional] Sort direction.
     */
    sort?: 'ASC' | 'DESC';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Tick details around contract start and end time.
 */
export type AuditDetailsForExpiredContract = null | {
    /**
     * Ticks for tick expiry contract from start time till expiry.
     */
    all_ticks?: {
        /**
         * Epoch time of a tick or the contract start or end time.
         */
        epoch?: number;
        /**
         * A flag used to highlight the record in front-end applications.
         */
        flag?: null | string;
        /**
         * A short description of the data. It could be a tick or a time associated with the contract.
         */
        name?: null | string;
        /**
         * The spot value at the given epoch.
         */
        tick?: null | number;
        /**
         * The spot value with the correct precision at the given epoch.
         */
        tick_display_value?: null | string;
        [k: string]: unknown;
    }[];
    /**
     * Ticks around contract end time.
     */
    contract_end?: {
        /**
         * Epoch time of a tick or the contract start or end time.
         */
        epoch?: number;
        /**
         * A flag used to highlight the record in front-end applications.
         */
        flag?: null | string;
        /**
         * A short description of the data. It could be a tick or a time associated with the contract.
         */
        name?: null | string;
        /**
         * The spot value at the given epoch.
         */
        tick?: null | number;
        /**
         * The spot value with the correct precision at the given epoch.
         */
        tick_display_value?: null | string;
        [k: string]: unknown;
    }[];
    /**
     * Ticks around contract start time.
     */
    contract_start?: {
        /**
         * Epoch time of a tick or the contract start or end time.
         */
        epoch?: number;
        /**
         * A flag used to highlight the record in front-end applications.
         */
        flag?: null | string;
        /**
         * A short description of the data. It could be a tick or a time associated with the contract.
         */
        name?: null | string;
        /**
         * The spot value at the given epoch.
         */
        tick?: null | number;
        /**
         * The spot value with the correct precision at the given epoch.
         */
        tick_display_value?: null | string;
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
};
/**
 * Contract status. Will be `sold` if the contract was sold back before expiry, `won` if won and `lost` if lost at expiry. Otherwise will be `open`
 */
export type ContractStatus = 'open' | 'sold' | 'won' | 'lost' | 'cancelled' | null;

/**
 * Latest price and other details for an open contract in the user's portfolio
 */
export interface PriceProposalOpenContractsResponse {
    proposal_open_contract?: ProposalOpenContract;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type?: 'proposal_open_contract';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Latest price and other details for an open contract
 */
export interface ProposalOpenContract {
    audit_details?: AuditDetailsForExpiredContract;
    /**
     * Barrier of the contract (if any).
     */
    barrier?: null | string;
    /**
     * The number of barriers a contract has.
     */
    barrier_count?: number;
    /**
     * Price at which the contract could be sold back to the company.
     */
    bid_price?: number;
    /**
     * Price at which contract was purchased
     */
    buy_price?: number;
    /**
     * Contains information about contract cancellation option.
     */
    cancellation?: {
        /**
         * Ask price of contract cancellation option.
         */
        ask_price?: number;
        /**
         * Expiry time in epoch for contract cancellation option.
         */
        date_expiry?: number;
        [k: string]: unknown;
    };
    /**
     * Commission in payout currency amount.
     */
    commision?: null | number;
    /**
     * The internal contract identifier
     */
    contract_id?: number;
    /**
     * Contract type.
     */
    contract_type?: string;
    /**
     * The currency code of the contract.
     */
    currency?: string;
    /**
     * Spot value if we have license to stream this symbol.
     */
    current_spot?: number;
    /**
     * Spot value with the correct precision if we have license to stream this symbol.
     */
    current_spot_display_value?: string;
    /**
     * The corresponding time of the current spot.
     */
    current_spot_time?: number;
    /**
     * Expiry date (epoch) of the Contract. Please note that it is not applicable for tick trade contracts.
     */
    date_expiry?: number;
    /**
     * Settlement date (epoch) of the contract.
     */
    date_settlement?: number;
    /**
     * Start date (epoch) of the contract.
     */
    date_start?: number;
    /**
     * Display name of underlying
     */
    display_name?: string;
    /**
     * The `bid_price` with the correct precision
     */
    display_value?: string;
    /**
     * Same as `entry_tick`. For backwards compatibility.
     */
    entry_spot?: null | number;
    /**
     * Same as `entry_tick_display_value`. For backwards compatibility.
     */
    entry_spot_display_value?: null | string;
    /**
     * This is the entry spot of the contract. For contracts starting immediately it is the next tick after the start time. For forward-starting contracts it is the spot at the start time.
     */
    entry_tick?: number;
    /**
     * This is the entry spot with the correct precision of the contract. For contracts starting immediately it is the next tick after the start time. For forward-starting contracts it is the spot at the start time.
     */
    entry_tick_display_value?: string;
    /**
     * This is the epoch time of the entry tick.
     */
    entry_tick_time?: number;
    /**
     * Exit tick can refer to the latest tick at the end time, the tick that fulfils the contract's winning or losing condition for path dependent contracts (Touch/No Touch and Stays Between/Goes Outside) or the tick at which the contract is sold before expiry.
     */
    exit_tick?: number;
    /**
     * Exit tick can refer to the latest tick at the end time, the tick that fulfils the contract's winning or losing condition for path dependent contracts (Touch/No Touch and Stays Between/Goes Outside) or the tick at which the contract is sold before expiry.
     */
    exit_tick_display_value?: string;
    /**
     * This is the epoch time of the exit tick. Note that since certain instruments don't tick every second, the exit tick time may be a few seconds before the end time.
     */
    exit_tick_time?: number;
    /**
     * High barrier of the contract (if any).
     */
    high_barrier?: string;
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id?: string;
    /**
     * Whether the contract is expired or not.
     */
    is_expired?: 0 | 1;
    /**
     * Whether the contract is forward-starting or not.
     */
    is_forward_starting?: 0 | 1;
    /**
     * Whether the contract is an intraday contract.
     */
    is_intraday?: 0 | 1;
    /**
     * Whether the contract expiry price will depend on the path of the market (e.g. One Touch contract).
     */
    is_path_dependent?: 0 | 1;
    /**
     * Whether the contract is settleable or not.
     */
    is_settleable?: 0 | 1;
    /**
     * Whether the contract is sold or not.
     */
    is_sold?: 0 | 1;
    /**
     * Whether the contract can be cancelled.
     */
    is_valid_to_cancel?: 0 | 1;
    /**
     * Whether the contract can be sold back to the company.
     */
    is_valid_to_sell?: 0 | 1;
    /**
     * Orders are applicable to `MULTUP` and `MULTDOWN` contracts only.
     */
    limit_order?: {
        /**
         * Contains information where the contract will be closed automatically at the loss specified by the user.
         */
        stop_loss?: {
            /**
             * Localized display name
             */
            display_name?: string;
            /**
             * Stop loss amount
             */
            order_amount?: null | number;
            /**
             * Stop loss order epoch
             */
            order_date?: number;
            /**
             * Pip-sized barrier value
             */
            value?: null | string;
            [k: string]: unknown;
        };
        /**
         * Contains information where the contract will be closed automatically when the value of the contract is close to zero. This is set by the us.
         */
        stop_out?: {
            /**
             * Localized display name
             */
            display_name?: string;
            /**
             * Stop out amount
             */
            order_amount?: number;
            /**
             * Stop out order epoch
             */
            order_date?: number;
            /**
             * Pip-sized barrier value
             */
            value?: string;
            [k: string]: unknown;
        };
        /**
         * Contain information where the contract will be closed automatically at the profit specified by the user.
         */
        take_profit?: {
            /**
             * Localized display name
             */
            display_name?: string;
            /**
             * Take profit amount
             */
            order_amount?: null | number;
            /**
             * Take profit order epoch
             */
            order_date?: number;
            /**
             * Pip-sized barrier value
             */
            value?: null | string;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    };
    /**
     * Text description of the contract purchased, Example: Win payout if Volatility 100 Index is strictly higher than entry spot at 10 minutes after contract start time.
     */
    longcode?: string;
    /**
     * Low barrier of the contract (if any).
     */
    low_barrier?: string;
    /**
     * [Only for lookback trades] Multiplier applies when calculating the final payoff for each type of lookback. e.g. (Exit spot - Lowest historical price) * multiplier = Payout
     */
    multiplier?: number;
    /**
     * Payout value of the contract.
     */
    payout?: number;
    /**
     * The latest bid price minus buy price.
     */
    profit?: number;
    /**
     * Profit in percentage.
     */
    profit_percentage?: number;
    /**
     * Epoch of purchase time, will be same as `date_start` for all contracts except forward starting contracts.
     */
    purchase_time?: number;
    /**
     * [Only for reset trades] The epoch time of a barrier reset.
     */
    reset_time?: number;
    /**
     * Price at which contract was sold, only available when contract has been sold.
     */
    sell_price?: number;
    /**
     * Latest spot value at the sell time. (only present for contracts already sold). Will no longer be supported in the next API release.
     */
    sell_spot?: number;
    /**
     * Latest spot value with the correct precision at the sell time. (only present for contracts already sold). Will no longer be supported in the next API release.
     */
    sell_spot_display_value?: string;
    /**
     * Epoch time of the sell spot. Note that since certain underlyings don't tick every second, the sell spot time may be a few seconds before the sell time. (only present for contracts already sold). Will no longer be supported in the next API release.
     */
    sell_spot_time?: number;
    /**
     * Epoch time of when the contract was sold (only present for contracts already sold)
     */
    sell_time?: number | null;
    /**
     * Coded description of the contract purchased.
     */
    shortcode?: string;
    status?: ContractStatus;
    /**
     * Only for tick trades, number of ticks
     */
    tick_count?: number;
    /**
     * Tick stream from entry to end time.
     */
    tick_stream?: {
        /**
         * Epoch time of a tick or the contract start or end time.
         */
        epoch?: number;
        /**
         * The spot value at the given epoch.
         */
        tick?: null | number;
        /**
         * The spot value with the correct precision at the given epoch.
         */
        tick_display_value?: null | string;
        [k: string]: unknown;
    }[];
    transaction_ids?: TransactionIdsForContract;
    /**
     * The underlying symbol code.
     */
    underlying?: string;
    /**
     * Error message if validation fails
     */
    validation_error?: string;
    [k: string]: unknown;
}
/**
 * Every contract has buy and sell transaction ids, i.e. when you purchase a contract we associate it with buy transaction id, and if contract is already sold we associate that with sell transaction id.
 */
export interface TransactionIdsForContract {
    /**
     * Buy transaction ID for that contract
     */
    buy?: number;
    /**
     * Sell transaction ID for that contract, only present when contract is already sold.
     */
    sell?: number;
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Get latest price (and other information) for a contract in the user's portfolio
 */
export interface PriceProposalOpenContractsRequest {
    /**
     * Must be `1`
     */
    proposal_open_contract: 1;
    /**
     * [Optional] Contract ID received from a `portfolio` request. If not set, you will receive stream of all open contracts.
     */
    contract_id?: number;
    /**
     * [Optional] `1` to stream.
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Latest price and other details for a given contract
 */
export interface PriceProposalResponse {
    proposal?: Proposal;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'proposal';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Latest price and other details for a given contract
 */
export interface Proposal {
    /**
     * The ask price.
     */
    ask_price: number;
    /**
     * Contains information about contract cancellation option.
     */
    cancellation?: {
        /**
         * Ask price of contract cancellation option.
         */
        ask_price?: number;
        /**
         * Expiry time in epoch for contract cancellation option.
         */
        date_expiry?: number;
        [k: string]: unknown;
    };
    /**
     * Commission changed in percentage (%).
     */
    commission?: null | number;
    /**
     * The start date of the contract.
     */
    date_start: number;
    /**
     * Same as `ask_price`.
     */
    display_value: string;
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    /**
     * Contains limit order information. (Only applicable for contract with limit order).
     */
    limit_order?: {
        /**
         * Contains information where the contract will be closed automatically at the loss specified by the user.
         */
        stop_loss?: {
            /**
             * Localized display name
             */
            display_name?: string;
            /**
             * Stop loss amount
             */
            order_amount?: null | number;
            /**
             * Stop loss order epoch
             */
            order_date?: number;
            /**
             * Pip-sized barrier value
             */
            value?: null | string;
            [k: string]: unknown;
        };
        /**
         * Contains information where the contract will be closed automatically when the value of the contract is close to zero. This is set by the us.
         */
        stop_out?: {
            /**
             * Localized display name
             */
            display_name?: string;
            /**
             * Stop out amount
             */
            order_amount?: number;
            /**
             * Stop out order epoch
             */
            order_date?: number;
            /**
             * Pip-sized barrier value
             */
            value?: string;
            [k: string]: unknown;
        };
        /**
         * Contains information where the contract will be closed automatically at the profit specified by the user.
         */
        take_profit?: {
            /**
             * Localized display name
             */
            display_name?: string;
            /**
             * Take profit amount
             */
            order_amount?: null | number;
            /**
             * Take profit order epoch
             */
            order_date?: number;
            /**
             * Pip-sized barrier value
             */
            value?: null | string;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    };
    /**
     * Example: Win payout if Random 100 Index is strictly higher than entry spot at 15 minutes after contract start time.
     */
    longcode: string;
    /**
     * [Only for lookback trades] Multiplier applies when calculating the final payoff for each type of lookback. e.g. (Exit spot - Lowest historical price) * multiplier = Payout
     */
    multiplier?: number;
    /**
     * The payout amount of the contract.
     */
    payout: number;
    /**
     * Spot value (if there are no Exchange data-feed licensing restrictions for the underlying symbol).
     */
    spot: number;
    /**
     * The corresponding time of the spot value.
     */
    spot_time: number;
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Gets latest price for a specific contract.
 */
export interface PriceProposalRequest {
    /**
     * Must be `1`
     */
    proposal: 1;
    /**
     * [Optional] Proposed contract payout or stake, or multiplier (for lookbacks).
     */
    amount?: number;
    /**
     * [Optional] Barrier for the contract (or last digit prediction for digit contracts). Contracts less than 24 hours in duration would need a relative barrier (barriers which need +/-), where entry spot would be adjusted accordingly with that amount to define a barrier, except for Synthetic Indices as they support both relative and absolute barriers. Not needed for lookbacks.
     */
    barrier?: string;
    /**
     * [Optional] Low barrier for the contract (for contracts with two barriers). Contracts less than 24 hours in duration would need a relative barrier (barriers which need +/-), where entry spot would be adjusted accordingly with that amount to define a barrier, except for Synthetic Indices as they support both relative and absolute barriers. Not needed for lookbacks.
     */
    barrier2?: string;
    /**
     * [Optional] Indicates type of the `amount`.
     */
    basis?: 'payout' | 'stake';
    /**
     * Cancellation duration option (only for `MULTUP` and `MULTDOWN` contracts).
     */
    cancellation?: string;
    /**
     * The proposed contract type
     */
    contract_type:
        | 'MULTUP'
        | 'MULTDOWN'
        | 'UPORDOWN'
        | 'EXPIRYRANGE'
        | 'ONETOUCH'
        | 'CALLE'
        | 'LBHIGHLOW'
        | 'ASIAND'
        | 'EXPIRYRANGEE'
        | 'DIGITDIFF'
        | 'DIGITMATCH'
        | 'DIGITOVER'
        | 'PUTE'
        | 'DIGITUNDER'
        | 'NOTOUCH'
        | 'CALL'
        | 'RANGE'
        | 'LBFLOATPUT'
        | 'DIGITODD'
        | 'PUT'
        | 'ASIANU'
        | 'LBFLOATCALL'
        | 'EXPIRYMISSE'
        | 'EXPIRYMISS'
        | 'DIGITEVEN'
        | 'TICKHIGH'
        | 'TICKLOW'
        | 'RESETCALL'
        | 'RESETPUT'
        | 'CALLSPREAD'
        | 'PUTSPREAD'
        | 'RUNHIGH'
        | 'RUNLOW';
    /**
     * This can only be the account-holder's currency (obtained from `payout_currencies` call).
     */
    currency: string;
    /**
     * [Optional] Epoch value of the expiry time of the contract. Either date_expiry or duration is required.
     */
    date_expiry?: number;
    /**
     * [Optional] Indicates epoch value of the starting time of the contract. If left empty, the start time of the contract is now.
     */
    date_start?: number;
    /**
     * [Optional] Duration quantity. Either date_expiry or duration is required.
     */
    duration?: number;
    /**
     * [Optional] Duration unit - `s`: seconds, `m`: minutes, `h`: hours, `d`: days, `t`: ticks.
     */
    duration_unit?: 'd' | 'm' | 's' | 'h' | 't';
    /**
     * Add an order to close the contract once the order condition is met (only for `MULTUP` and `MULTDOWN` contracts). Supported orders: `take_profit`, `stop_loss`.
     */
    limit_order?: {
        /**
         * Contract will be automatically closed when the value of the contract reaches a specific loss.
         */
        stop_loss?: number;
        /**
         * Contract will be automatically closed when the value of the contract reaches a specific profit.
         */
        take_profit?: number;
    };
    /**
     * [Optional] The multiplier for non-binary options. E.g. lookbacks.
     */
    multiplier?: number;
    /**
     * [Optional] The product type.
     */
    product_type?: 'basic';
    /**
     * [Optional] The tick that is predicted to have the highest/lowest value - for `TICKHIGH` and `TICKLOW` contracts.
     */
    selected_tick?: number;
    /**
     * [Optional] 1 - to initiate a realtime stream of prices. Note that tick trades (without a user-defined barrier), digit trades and less than 24 hours at-the-money contracts for the following underlying symbols are not streamed: `R_10`, `R_25`, `R_50`, `R_75`, `R_100`, `RDBULL`, `RDBEAR` (this is because their price is constant).
     */
    subscribe?: 1;
    /**
     * The short symbol name (obtained from `active_symbols` call).
     */
    symbol: string;
    /**
     * [Optional] Required only for multi-barrier trading. Defines the epoch value of the trading period start time.
     */
    trading_period_start?: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * This gives summary of client's trades and account for reality check
 */
export interface RealityCheckResponse {
    reality_check?: RealityCheck;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'reality_check';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Reality check summary of trades.
 */
export interface RealityCheck {
    /**
     * Total amount of contract purchased.
     */
    buy_amount?: number;
    /**
     * Total count of contract purchased.
     */
    buy_count?: number;
    /**
     * Currency of client account i.e currency for trading
     */
    currency?: string;
    /**
     * Client loginid.
     */
    loginid?: string;
    /**
     * Total count of contracts that are not yet expired.
     */
    open_contract_count?: number;
    /**
     * Indicative profit of contract as per current market price.
     */
    potential_profit?: number;
    /**
     * Total amount of contracts sold.
     */
    sell_amount?: number;
    /**
     * Total count of contract sold.
     */
    sell_count?: number;
    /**
     * Reality check summary start time epoch
     */
    start_time?: number;
    [k: string]: unknown;
}
/**
 * Retrieve summary of client's trades and account for the Reality Check facility. A 'reality check' means a display of time elapsed since the session began, and associated client profit/loss. The Reality Check facility is a regulatory requirement for certain landing companies.
 */
export interface RealityCheckRequest {
    /**
     * Must be `1`
     */
    reality_check: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * List of countries for account opening
 */
export type ResidenceList = {
    /**
     * IDD code of country
     */
    phone_idd?: null | string;
    /**
     * Country full name
     */
    text?: string;
    /**
     * Country tax identifier format
     */
    tin_format?: string[];
    /**
     * 2-letter country code
     */
    value?: string;
    [k: string]: unknown;
}[];

/**
 * A message with Residence List
 */
export interface CountriesListResponse {
    residence_list?: ResidenceList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'residence_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * This call returns a list of countries and 2-letter country codes, suitable for populating the account opening form.
 */
export interface CountriesListRequest {
    /**
     * Must be `1`
     */
    residence_list: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * `1` on success
 */
export type RevokeOauthApp = number;

/**
 * A message with revoking a used application
 */
export interface RevokeOauthApplicationResponse {
    revoke_oauth_app?: RevokeOauthApp;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'revoke_oauth_app';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Used for revoking access of particular app.
 */
export interface RevokeOauthApplicationRequest {
    /**
     * The application ID to revoke.
     */
    revoke_oauth_app: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Confirmation of the sale status for the selected contracts and accounts.
 */
export interface SellContractsMultipleAccountsResponse {
    sell_contract_for_multiple_accounts?: SellContractForMultipleAccounts;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'sell_contract_for_multiple_accounts';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Status information for each affected account.
 */
export interface SellContractForMultipleAccounts {
    /**
     * The result of sell for multiple accounts request.
     */
    result?: (
        | ReceiptForTheTransaction
        | {
              /**
               * An error code
               */
              code: string;
              /**
               * An error message localized according to the websocket
               */
              message_to_client: string;
              /**
               * The token designating the account
               */
              token: string;
          }
    )[];
}
/**
 * Receipt for the transaction
 */
export interface ReceiptForTheTransaction {
    /**
     * New account balance after completion of the sale
     */
    balance_after: number;
    /**
     * Internal contract identifier
     */
    contract_id: number;
    /**
     * Internal transaction identifier for the corresponding transaction
     */
    reference_id: number;
    /**
     * Actual effected sale price
     */
    sell_price: number;
    /**
     * date and time of sale `YYYY-MM-dd hh:mm:ss` format
     */
    sell_time?: string;
    /**
     * Internal transaction identifier for the contract sale transaction
     */
    transaction_id: number;
}
/**
 * Sell contracts for multiple accounts simultaneously. Uses the shortcode response from `buy_contract_for_multiple_accounts` to identify the contract, and authorisation tokens to select which accounts to sell those contracts on. Note that only the accounts identified by the tokens will be affected. This will not sell the contract on the currently-authorised account unless you include the token for the current account.
 */
export interface SellContractsMultipleAccountsRequest {
    /**
     * Must be `1`
     */
    sell_contract_for_multiple_accounts: 1;
    /**
     * Minimum price at which to sell the contract, or `0` for 'sell at market'.
     */
    price: number;
    /**
     * An internal ID used to identify the contract which was originally bought. This is returned from the `buy` and `buy_contract_for_multiple_accounts` calls.
     */
    shortcode: string;
    /**
     * Authorisation tokens which select the accounts to sell use for the affected accounts.
     */
    tokens: string[];
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * The result of sell expired contract
 */
export interface SellExpiredContractsResponse {
    sell_expired?: SellExpired;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'sell_expired';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Sell expired contract object containing count of contracts sold
 */
export interface SellExpired {
    /**
     * The number of contracts that has been sold.
     */
    count?: number;
    [k: string]: unknown;
}
/**
 * This call will try to sell any expired contracts and return the number of sold contracts.
 */
export interface SellExpiredContractsRequest {
    /**
     * Must be `1`
     */
    sell_expired: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with transaction results is received
 */
export interface SellContractResponse {
    sell?: Sell;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'sell';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Receipt for the transaction
 */
export interface Sell {
    /**
     * New account balance after completion of the sale
     */
    balance_after?: number;
    /**
     * Internal contract identifier for the sold contract
     */
    contract_id?: number;
    /**
     * Internal transaction identifier for the corresponding buy transaction
     */
    reference_id?: number;
    /**
     * Actual effected sale price
     */
    sold_for?: number;
    /**
     * Internal transaction identifier for the sale transaction
     */
    transaction_id?: number;
    [k: string]: unknown;
}
/**
 * Sell a Contract as identified from a previous `portfolio` call.
 */
export interface SellContractRequest {
    /**
     * Pass contract_id received from the `portfolio` call.
     */
    sell: number;
    /**
     * Minimum price at which to sell the contract, or `0` for 'sell at market'.
     */
    price: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * `1`: success, `0`: no change
 */
export type SetAccountCurrency = 0 | 1;

/**
 * Status of set account currency call
 */
export interface SetAccountCurrencyResponse {
    set_account_currency?: SetAccountCurrency;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'set_account_currency';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Set account currency, this will be default currency for your account i.e currency for trading, deposit. Please note that account currency can only be set once, and then can never be changed.
 */
export interface SetAccountCurrencyRequest {
    /**
     * Currency of the account. List of supported currencies can be acquired with `payout_currencies` call.
     */
    set_account_currency: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Set Financial Assessment Receive
 */
export interface SetFinancialAssessmentResponse {
    set_financial_assessment?: SetFinancialAssessment;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'set_financial_assessment';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The financial assessment score assigned to the submitted financial assessment
 */
export interface SetFinancialAssessment {
    /**
     * CFD score based on answers
     */
    cfd_score?: number;
    /**
     * Financial information score based on answers
     */
    financial_information_score?: number;
    /**
     * Financial Assessment score based on answers
     */
    total_score?: number;
    /**
     * Trading experience score based on answers
     */
    trading_score?: number;
    [k: string]: unknown;
}
/**
 * This call sets the financial assessment details based on the client's answers to analyze whether they possess the experience and knowledge to understand the risks involved with binary options trading.
 */
export interface SetFinancialAssessmentRequest {
    /**
     * Must be `1`
     */
    set_financial_assessment: 1;
    /**
     * [Optional] The anticipated account turnover.
     */
    account_turnover?:
        | 'Less than $25,000'
        | '$25,000 - $50,000'
        | '$50,001 - $100,000'
        | '$100,001 - $500,000'
        | 'Over $500,000';
    /**
     * [Optional] Binary options trading experience.
     */
    binary_options_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] Binary options trading frequency.
     */
    binary_options_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * [Optional] CFDs trading experience.
     */
    cfd_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] CFDs trading frequency.
     */
    cfd_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * Level of Education.
     */
    education_level: 'Primary' | 'Secondary' | 'Tertiary';
    /**
     * Industry of Employment.
     */
    employment_industry:
        | 'Construction'
        | 'Education'
        | 'Finance'
        | 'Health'
        | 'Tourism'
        | 'Information & Communications Technology'
        | 'Science & Engineering'
        | 'Legal'
        | 'Social & Cultural'
        | 'Agriculture'
        | 'Real Estate'
        | 'Food Services'
        | 'Manufacturing'
        | 'Unemployed';
    /**
     * [Optional] Employment Status.
     */
    employment_status?: 'Employed' | 'Pensioner' | 'Self-Employed' | 'Student' | 'Unemployed';
    /**
     * Estimated Net Worth.
     */
    estimated_worth:
        | 'Less than $100,000'
        | '$100,000 - $250,000'
        | '$250,001 - $500,000'
        | '$500,001 - $1,000,000'
        | 'Over $1,000,000';
    /**
     * [Optional] Forex trading experience.
     */
    forex_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] Forex trading frequency.
     */
    forex_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * Income Source.
     */
    income_source:
        | 'Salaried Employee'
        | 'Self-Employed'
        | 'Investments & Dividends'
        | 'Pension'
        | 'State Benefits'
        | 'Savings & Inheritance';
    /**
     * Net Annual Income.
     */
    net_income:
        | 'Less than $25,000'
        | '$25,000 - $50,000'
        | '$50,001 - $100,000'
        | '$100,001 - $500,000'
        | 'Over $500,000';
    /**
     * Occupation.
     */
    occupation:
        | 'Chief Executives, Senior Officials and Legislators'
        | 'Managers'
        | 'Professionals'
        | 'Clerks'
        | 'Personal Care, Sales and Service Workers'
        | 'Agricultural, Forestry and Fishery Workers'
        | 'Craft, Metal, Electrical and Electronics Workers'
        | 'Plant and Machine Operators and Assemblers'
        | 'Cleaners and Helpers'
        | 'Mining, Construction, Manufacturing and Transport Workers'
        | 'Armed Forces'
        | 'Government Officers'
        | 'Students'
        | 'Unemployed';
    /**
     * [Optional] Trading experience in other financial instruments.
     */
    other_instruments_trading_experience?: '0-1 year' | '1-2 years' | 'Over 3 years';
    /**
     * [Optional] Trading frequency in other financial instruments.
     */
    other_instruments_trading_frequency?:
        | '0-5 transactions in the past 12 months'
        | '6-10 transactions in the past 12 months'
        | '11-39 transactions in the past 12 months'
        | '40 transactions or more in the past 12 months';
    /**
     * [Optional] Source of wealth.
     */
    source_of_wealth?:
        | 'Accumulation of Income/Savings'
        | 'Cash Business'
        | 'Company Ownership'
        | 'Divorce Settlement'
        | 'Inheritance'
        | 'Investment Income'
        | 'Sale of Property';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * `1` on success
 */
export type SetSelfExclusion = number;

/**
 * A message with User Self-Exclusion
 */
export interface SetSelfExclusionResponse {
    set_self_exclusion?: SetSelfExclusion;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'set_self_exclusion';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Set Self-Exclusion (this call should be used in conjunction with `get_self_exclusion`)
 */
export interface SetSelfExclusionRequest {
    /**
     * Must be `1`
     */
    set_self_exclusion: 1;
    /**
     * [Optional] Exclude me from the website (for a minimum of 6 months, up to a maximum of 5 years). Note: uplifting this self-exclusion may require contacting the company.
     */
    exclude_until?: null | string;
    /**
     * [Optional] 7-day limit on deposits.
     */
    max_30day_deposit?: null | number;
    /**
     * [Optional] 30-day limit on losses.
     */
    max_30day_losses?: null | number;
    /**
     * [Optional] 30-day turnover limit.
     */
    max_30day_turnover?: null | number;
    /**
     * [Optional] 7-day limit on deposits.
     */
    max_7day_deposit?: null | number;
    /**
     * [Optional] 7-day limit on losses.
     */
    max_7day_losses?: null | number;
    /**
     * [Optional] 7-day turnover limit.
     */
    max_7day_turnover?: null | number;
    /**
     * [Optional] Maximum account cash balance.
     */
    max_balance?: null | number;
    /**
     * [Optional] Daily deposit limit.
     */
    max_deposit?: null | number;
    /**
     * [Optional] Daily limit on losses.
     */
    max_losses?: null | number;
    /**
     * [Optional] Maximum number of open positions.
     */
    max_open_bets?: number | null;
    /**
     * [Optional] Daily turnover limit.
     */
    max_turnover?: null | number;
    /**
     * [Optional] Session duration limit, in minutes.
     */
    session_duration_limit?: number | null;
    /**
     * [Optional] Exclude me from the website (for up to 6 weeks). Requires time in epoch format. Note: unlike `exclude_until`, this self-exclusion will be lifted automatically at the expiry of the timeout period.
     */
    timeout_until?: number | null;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * 1 on success
 */
export type SetSettings = number;

/**
 * A message with User Settings
 */
export interface SetAccountSettingsResponse {
    set_settings?: SetSettings;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'set_settings';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Set User Settings (this call should be used in conjunction with `get_settings`)
 */
export interface SetAccountSettingsRequest {
    /**
     * Must be `1`
     */
    set_settings: 1;
    /**
     * [Optional] Purpose and reason for requesting the account opening. Only applicable for real money account. Required for clients that have not set it yet. Can only be set once.
     */
    account_opening_reason?: 'Speculative' | 'Income Earning' | 'Hedging' | 'Peer-to-peer exchange';
    /**
     * [Optional] Note: not applicable for virtual account. Required field for real money account.
     */
    address_city?: string;
    /**
     * [Optional] Note: not applicable for virtual account. Required field for real money account.
     */
    address_line_1?: string;
    /**
     * [Optional] Note: not applicable for virtual account. Optional field for real money account.
     */
    address_line_2?: null | string;
    /**
     * [Optional] Note: not applicable for virtual account. Optional field for real money account.
     */
    address_postcode?: string;
    /**
     * [Optional] Note: not applicable for virtual account. Optional field for real money account.
     */
    address_state?: string;
    /**
     * [Optional] Boolean value 1 or 0, indicating permission to allow others to follow your trades. Note: not applicable for Virtual account. Only allow for real money account.
     */
    allow_copiers?: 0 | 1;
    /**
     * [Optional] Country of legal citizenship, 2-letter country code.
     */
    citizen?: null | string;
    /**
     * [Optional] Date of birth format: yyyy-mm-dd (can only be changed on unauthenticated svg accounts).
     */
    date_of_birth?: string;
    /**
     * [Optional] Boolean value 1 or 0, indicating permission to use email address for any contact which may include marketing
     */
    email_consent?: 0 | 1;
    /**
     * [Optional] Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes (can only be changed on unauthenticated svg accounts).
     */
    first_name?: string;
    /**
     * [Optional] Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes (can only be changed on unauthenticated svg accounts).
     */
    last_name?: string;
    /**
     * [Optional] Indicates client's self-declaration of not being a PEP/RCA (Politically Exposed Person/Relatives and Close Associates). Effective for real accounts only.
     */
    non_pep_declaration?: 1;
    /**
     * [Optional] Note: not applicable for virtual account. Required field for real money account. Starting with `+` followed by 8-35 digits, allowing hyphens or space.
     */
    phone?: string;
    /**
     * [Optional] Place of birth, 2-letter country code.
     */
    place_of_birth?: string;
    /**
     * [Optional] Required when client wants to be treated as professional. Applicable for financial accounts only.
     */
    request_professional_status?: 1;
    /**
     * [Optional] 2-letter country code. Note: not applicable for real money account. Only allow for Virtual account without residence set.
     */
    residence?: null | string;
    /**
     * [Optional] Accept any value in enum list (can only be changed on unauthenticated svg accounts).
     */
    salutation?: 'Mr' | 'Mrs' | 'Ms' | 'Miss';
    /**
     * [Optional] Answer to secret question, within 4-50 characters. Required for new account and existing client details will be used if client opens another account.
     */
    secret_answer?: string;
    /**
     * [Optional] Accept any value in enum list. Required for new account and existing client details will be used if client opens another account.
     */
    secret_question?:
        | "Mother's maiden name"
        | 'Name of your pet'
        | 'Name of first love'
        | 'Memorable town/city'
        | 'Memorable date'
        | 'Favourite dish'
        | 'Brand of first car'
        | 'Favourite artist';
    /**
     * [Optional] Tax identification number. Only applicable for real money account. Required for maltainvest landing company.
     */
    tax_identification_number?: string;
    /**
     * [Optional] Residence for tax purpose. Comma separated iso country code if multiple jurisdictions. Only applicable for real money account. Required for maltainvest landing company.
     */
    tax_residence?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A summary of account statement is received
 */
export interface StatementResponse {
    statement?: Statement;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'statement';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Account statement.
 */
export interface Statement {
    /**
     * Number of transactions returned in this call
     */
    count?: number;
    /**
     * Array of returned transactions
     */
    transactions?: {
        /**
         * It is the type of action.
         */
        action_type?: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'hold' | 'release' | 'adjustment' | 'virtual_credit';
        /**
         * It is the amount of transaction.
         */
        amount?: number;
        /**
         * ID of the application where this contract was purchased.
         */
        app_id?: number | null;
        /**
         * It is the remaining balance.
         */
        balance_after?: number;
        /**
         * It is the contract ID.
         */
        contract_id?: number | null;
        /**
         * The description of contract purchased if description is set to `1`.
         */
        longcode?: string;
        /**
         * Payout price
         */
        payout?: null | number;
        /**
         * Time at which contract was purchased, present only for sell transaction
         */
        purchase_time?: number;
        /**
         * Internal transaction identifier for the corresponding buy transaction ( set only for contract selling )
         */
        reference_id?: number | null;
        /**
         * Compact description of the contract purchased if description is set to `1`.
         */
        shortcode?: null | string;
        /**
         * It is the transaction ID. In statement every contract (buy or sell) and every payment has a unique ID.
         */
        transaction_id?: number;
        /**
         * It is the time of transaction.
         */
        transaction_time?: number;
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * Retrieve a summary of account transactions, according to given search criteria
 */
export interface StatementRequest {
    /**
     * Must be `1`
     */
    statement: 1;
    /**
     * [Optional] To filter the statement according to the type of transaction.
     */
    action_type?: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'escrow' | 'adjustment' | 'virtual_credit';
    /**
     * [Optional] Start date (epoch)
     */
    date_from?: number;
    /**
     * [Optional] End date (epoch)
     */
    date_to?: number;
    /**
     * [Optional] If set to 1, will return full contracts description.
     */
    description?: 0 | 1;
    /**
     * [Optional] Maximum number of transactions to receive.
     */
    limit?: number;
    /**
     * [Optional] Number of transactions to skip.
     */
    offset?: number;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * List of states.
 */
export type StatesList = {
    /**
     * The state name.
     */
    text?: string;
    /**
     * The state code.
     */
    value?: string;
    [k: string]: unknown;
}[];

/**
 * A message with States List
 */
export interface StatesListResponse {
    states_list?: StatesList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'states_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Client's 2-letter country code (obtained from `residence_list` call)
 */
export type StatesList = string;

/**
 * For a given country, returns a list of States of that country. This is useful to populate the account opening form.
 */
export interface StatesListRequest {
    states_list: StatesList;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Array of OHLC (open/high/low/close) price values for the given time (only for style=`candles`)
 */
export type Candles = {
    /**
     * It is the close price value for the given time
     */
    close?: number;
    /**
     * It is an epoch value
     */
    epoch?: number;
    /**
     * It is the high price value for the given time
     */
    high?: number;
    /**
     * It is the low price value for the given time
     */
    low?: number;
    /**
     * It is the open price value for the given time
     */
    open?: number;
    [k: string]: unknown;
}[];

/**
 * Historic tick data for a single symbol
 */
export interface TicksHistoryResponse {
    candles?: Candles;
    history?: History;
    /**
     * Indicates the number of decimal points that the returned amounts must be displayed with
     */
    pip_size?: number;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Type of the response according to the `style` sent in request. Would be `history` or `candles` for the first response, and `tick` or `ohlc` for the rest when subscribed.
     */
    msg_type: 'history' | 'tick' | 'candles' | 'ohlc';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Historic tick data for a given symbol. Note: this will always return the latest possible set of ticks with accordance to the parameters specified.
 */
export interface History {
    /**
     * An array containing list of tick values for the corresponding epoch values in `times` array.
     */
    prices?: number[];
    /**
     * An array containing list of epoch values for the corresponding tick values in `prices` array.
     */
    times?: number[];
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Get historic tick data for a given symbol.
 */
export interface TicksHistoryRequest {
    /**
     * Short symbol name (obtained from the `active_symbols` call).
     */
    ticks_history: string;
    /**
     * [Optional] 1 - if the market is closed at the end time, or license limit is before end time, adjust interval backwards to compensate.
     */
    adjust_start_time?: 1;
    /**
     * [Optional] An upper limit on ticks to receive.
     */
    count?: number & string;
    /**
     * Epoch value representing the latest boundary of the returned ticks. If `latest` is specified, this will be the latest available timestamp.
     */
    end: string;
    /**
     * [Optional] Only applicable for style: `candles`. Candle time-dimension width setting. (default: `60`).
     */
    granularity?: 60 | 120 | 180 | 300 | 600 | 900 | 1800 | 3600 | 7200 | 14400 | 28800 | 86400;
    /**
     * [Optional] Epoch value representing the earliest boundary of the returned ticks.
     * - For `"style": "ticks"`: this will default to 1 day ago.
     * - For `"style": "candles"`: it will default to 1 day ago if count or granularity is undefined.
     */
    start?: number;
    /**
     * [Optional] The tick-output style.
     */
    style?: 'candles' | 'ticks';
    /**
     * [Optional] 1 - to send updates whenever a new tick is received.
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Latest spot price for a given symbol. Continuous responses with a frequency of up to one second.
 */
export interface TicksStreamResponse {
    tick?: TickSpotData;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Type of the response.
     */
    msg_type: 'tick';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Tick by tick list of streamed data
 */
export interface TickSpotData {
    /**
     * Market ask at the epoch
     */
    ask?: number;
    /**
     * Market bid at the epoch
     */
    bid?: number;
    /**
     * Epoch time of the tick
     */
    epoch?: number;
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id?: string;
    /**
     * Indicates the number of decimal points that the returned amounts must be displayed with
     */
    pip_size: number;
    /**
     * Market value at the epoch
     */
    quote?: number;
    /**
     * Symbol
     */
    symbol?: string;
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Initiate a continuous stream of spot price updates for a given symbol.
 */
export interface TicksStreamRequest {
    /**
     * The short symbol name or array of symbols (obtained from `active_symbols` call).
     */
    ticks: string | string[];
    /**
     * [Optional] If set to 1, will send updates whenever a new tick is received.
     */
    subscribe?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Epoch of server time.
 */
export type Time = number;

/**
 * The result of server time request.
 */
export interface ServerTimeResponse {
    time?: Time;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'time';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Request back-end server epoch time.
 */
export interface ServerTimeRequest {
    /**
     * Must be `1`
     */
    time: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Set terms and conditions 1: success
 */
export type TncApproval = 1;

/**
 * The result of T&C approval request.
 */
export interface TermsAndConditionsApprovalResponse {
    tnc_approval?: TncApproval;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'tnc_approval';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * To approve the latest version of terms and conditions.
 */
export interface TermsAndConditionsApprovalRequest {
    /**
     * Must be `1`
     */
    tnc_approval: 1;
    /**
     * [Optional] For `ASK_UK_FUNDS_PROTECTION` in `cashier`.
     */
    ukgc_funds_protection?: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * The result of virtual money top up
 */
export interface TopUpVirtualMoneyAccountResponse {
    topup_virtual?: TopupVirtual;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'topup_virtual';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The information regarding a successful top up for a virtual money account
 */
export interface TopupVirtual {
    /**
     * Top up amount
     */
    amount?: number;
    /**
     * Top up currency string
     */
    currency?: string;
    [k: string]: unknown;
}
/**
 * When a virtual-money's account balance becomes low, it can be topped up using this call.
 */
export interface TopUpVirtualMoneyAccountRequest {
    /**
     * Must be `1`
     */
    topup_virtual: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * List of underlyings by their display name and symbol followed by their available contract types and trading duration boundaries.
 */
export type TradingDurations = {
    /**
     * The market in which the underlyings listed in `symbol` located.
     */
    market?: {
        /**
         * Translated market name.
         */
        display_name?: string;
        /**
         * Market name.
         */
        name?: string;
        [k: string]: unknown;
    };
    /**
     * The submarket in which the underlyings listed in `symbol` located.
     */
    submarket?: {
        /**
         * Translated submarket name.
         */
        display_name?: string;
        /**
         * Submarket name.
         */
        name?: string;
        [k: string]: unknown;
    };
    /**
     * List of underlying symbols.
     */
    symbol?: {
        /**
         * Translated symbol name.
         */
        display_name?: string;
        /**
         * Symbol name.
         */
        name?: string;
        [k: string]: unknown;
    }[];
    /**
     * List of trade durations available for symbols and contract combinations.
     */
    trade_durations?: {
        /**
         * List of trade durations available for the symbols.
         */
        durations?: {
            /**
             * Translated duration type name.
             */
            display_name?: string;
            /**
             * Maximum allowed duration for this type.
             */
            max?: number;
            /**
             * Minimum allowed duration for this type.
             */
            min?: number;
            /**
             * Duration type name.
             */
            name?: string;
            [k: string]: unknown;
        }[];
        /**
         * List of trade types available for the symbols.
         */
        trade_type?: {
            /**
             * Translated trade type name.
             */
            display_name?: string;
            /**
             * Trade type name.
             */
            name?: string;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}[];

/**
 * A message with trading duration information for symbol and contract combinations.
 */
export interface TradingDurationsResponse {
    trading_durations?: TradingDurations;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'trading_durations';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Retrieve a list of all available underlyings and the corresponding contract types and trading duration boundaries. If the user is logged in, only the assets available for that user's landing company will be returned.
 */
export interface TradingDurationsRequest {
    /**
     * Must be `1`
     */
    trading_durations: 1;
    /**
     * [Optional] If specified, will return only the underlyings for the specified landing company.
     */
    landing_company?: 'iom' | 'malta' | 'maltainvest' | 'svg' | 'virtual' | 'vanuatu' | 'champion' | 'champion-virtual';
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * A message with Trading Times
 */
export interface TradingTimesResponse {
    trading_times?: TradingTimes;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'trading_times';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * The trading times structure is a hierarchy as follows: Market -> SubMarket -> Underlyings
 */
export interface TradingTimes {
    /**
     * An array of markets
     */
    markets: {
        /**
         * Market name
         */
        name: string;
        /**
         * An array of submarkets
         */
        submarkets?: {
            /**
             * Submarket name
             */
            name: string;
            /**
             * Symbols array
             */
            symbols?: {
                /**
                 * Events
                 */
                events?: unknown[];
                /**
                 * Symbol name
                 */
                name: string;
                /**
                 * Symbol shortcode
                 */
                symbol: string;
                /**
                 * Open, close and settlement times
                 */
                times?: {
                    [k: string]: unknown;
                };
                /**
                 * Trading days
                 */
                trading_days?: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[];
                [k: string]: unknown;
            }[];
            [k: string]: unknown;
        }[];
        [k: string]: unknown;
    }[];
    [k: string]: unknown;
}
/**
 * Receive a list of market opening times for a given date.
 */
export interface TradingTimesRequest {
    /**
     * Date to receive market opening times for. (`yyyy-mm-dd` format. `today` can also be specified).
     */
    trading_times: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Return transaction updates
 */
export interface TransactionsStreamResponse {
    transaction?: Transaction;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'transaction';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Realtime stream of user transaction updates.
 */
export interface Transaction {
    /**
     * The transaction type.
     */
    action?: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'escrow' | 'adjustment' | 'virtual_credit';
    /**
     * It is the amount of transaction performed.
     */
    amount?: number;
    /**
     * Balance amount
     */
    balance?: number;
    /**
     * Barrier of the contract. Only applicable to single barrier contracts. Could be undefined if a contract does not have a barrier.
     */
    barrier?: null | number | string;
    /**
     * It is the contract ID.
     */
    contract_id?: number | null;
    /**
     * Transaction currency
     */
    currency?: string;
    /**
     * Epoch value of the expiry time of the contract. Please note that in case of buy transaction this is approximate value not exact one.
     */
    date_expiry?: number;
    /**
     * Display name of symbol
     */
    display_name?: string;
    /**
     * The high barrier of a contract. Only applicable to double barrier contracts.
     */
    high_barrier?: number | string;
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id?: string;
    /**
     * Description of contract purchased
     */
    longcode?: string;
    /**
     * The low barrier of a contract. Only applicable to double barrier contracts.
     */
    low_barrier?: string;
    /**
     * Time at which contract was purchased, present only for sell transaction
     */
    purchase_time?: number;
    /**
     * The pip-sized target spot price where the contract will be closed automatically at the loss specified by the user.
     */
    stop_loss?: null | string;
    /**
     * The pip-sized target spot price where the contract will be closed automatically when the value of the contract is close to zero. This is set by the us.
     */
    stop_out?: null | string;
    /**
     * Symbol code
     */
    symbol?: string;
    /**
     * The pip-sized target spot price where the contract will be closed automatically at the profit specified by the user.
     */
    take_profit?: null | string;
    /**
     * It is the transaction ID. Every contract (buy or sell) or payment has a unique ID.
     */
    transaction_id?: number;
    /**
     * Time at which transaction was performed: for buy it is purchase time, for sell it is sell time.
     */
    transaction_time?: number;
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Subscribe to transaction notifications
 */
export interface TransactionsStreamRequest {
    /**
     * Must be `1`
     */
    transaction: 1;
    /**
     * If set to 1, will send updates whenever there is an update to transactions. If not to 1 then it will not return any records.
     */
    subscribe: 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * If set to 1, transfer succeeded.
 */
export type TransferBetweenAccounts = 0 | 1;

/**
 * The result of transfer order.
 */
export interface TransferBetweenAccountsResponse {
    transfer_between_accounts?: TransferBetweenAccounts;
    /**
     * The available accounts to transfer, or the accounts affected by a successful transfer.
     */
    accounts?: {
        /**
         * Type of the account.
         */
        account_type?: 'binary' | 'mt5';
        /**
         * Account balance.
         */
        balance?: string;
        /**
         * Default account currency.
         */
        currency?: string;
        /**
         * Client loginid.
         */
        loginid?: string;
        /**
         * The group of mt5 account.
         */
        mt5_group?: string;
        [k: string]: unknown;
    }[];
    /**
     * The account to client full name
     */
    client_to_full_name?: string;
    /**
     * The account to client loginid
     */
    client_to_loginid?: string;
    /**
     * Reference ID of transfer performed
     */
    transaction_id?: number;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'transfer_between_accounts';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * This call allows transfers between accounts held by a given user. Transfer funds between your fiat and cryptocurrency accounts (for a fee). Please note that account_from should be same as current authorized account.
 */
export interface TransferBetweenAccountsRequest {
    /**
     * If `account_from` or `account_to` is not provided, it just returns the available accounts.
     */
    transfer_between_accounts: 1;
    /**
     * [Optional] The loginid of the account to transfer funds from.
     */
    account_from?: string;
    /**
     * [Optional] The loginid of the account to transfer funds to.
     */
    account_to?: string;
    /**
     * [Optional] To control the list of accounts returned when `account_from` or `account_to` is not provided. `brief` will only include financial trading accounts with account_type equal to `binary` and can be faster. `all` will include accounts with both `mt5` and `binary` account_type
     */
    accounts?: 'all' | 'brief';
    /**
     * [Optional] The amount to transfer.
     */
    amount?: number;
    /**
     * [Optional] Currency code.
     */
    currency?: string;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * 1 for success (secure code has been sent to the email address)
 */
export type VerifyEmail = 0 | 1;

/**
 * Verify Email Receive
 */
export interface VerifyEmailResponse {
    verify_email?: VerifyEmail;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'verify_email';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Verify an email address for various purposes. The system will send an email to the address containing a security code for verification.
 */
export interface VerifyEmailRequest {
    /**
     * Email address to be verified.
     */
    verify_email: string;
    /**
     * Purpose of the email verification call.
     */
    type: 'account_opening' | 'reset_password' | 'paymentagent_withdraw' | 'payment_withdraw' | 'mt5_password_reset';
    /**
     * [Optional] Extra parameters that can be attached to the verify email link URL.
     */
    url_parameters?: {
        /**
         * [Optional] Affiliate token, within 32 characters.
         */
        affiliate_token?: string;
        /**
         * [Optional] Date of first contact, format: yyyy-mm-dd in GMT timezone.
         */
        date_first_contact?: string;
        /**
         * [Optional] Google Click Identifier to track source.
         */
        gclid_url?: string;
        /**
         * [Optional] Show whether user has used mobile or desktop.
         */
        signup_device?: 'desktop' | 'mobile';
        /**
         * [Optional] Identifier of particular ad
         */
        utm_ad_id?: string;
        /**
         * [Optional] Identifier of ad group in the campaign
         */
        utm_adgroup_id?: string;
        /**
         * [Optional] Unique identifier of click on AdRoll ads platform
         */
        utm_adrollclk_id?: string;
        /**
         * [Optional] Identifies a specific product promotion or strategic campaign such as a spring sale or other promotions.
         */
        utm_campaign?: string;
        /**
         * [Optional] Identifier of paid ad campaign
         */
        utm_campaign_id?: string;
        /**
         * [Optional] Used to differentiate similar content, or links within the same ad
         */
        utm_content?: string;
        /**
         * [Optional] Unique identifier of click on Facebook ads platform
         */
        utm_fbcl_id?: string;
        /**
         * [Optional] Unique visitor identifier on Google Ads platform.
         */
        utm_gl_client_id?: string;
        /**
         * [Optional] Identifies the medium the link was used upon such as: email, CPC, or other methods of sharing.
         */
        utm_medium?: string;
        /**
         * [Optional] Unique click identifier on Microsoft Bing ads platform.
         */
        utm_msclk_id?: string;
        /**
         * [Optional] Identifies the source of traffic such as: search engine, newsletter, or other referral.
         */
        utm_source?: string;
        /**
         * [Optional] Used to send information related to the campaign term like paid search keywords
         */
        utm_term?: string;
    };
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
/**
 * Server status alongside general settings like call limits, currencies information, supported languages, etc.
 */
export interface ServerStatusResponse {
    website_status?: WebsiteStatus;
    subscription?: SubscriptionInformation;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'website_status';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
/**
 * Server status and other information regarding general settings
 */
export interface WebsiteStatus {
    /**
     * Maximum number of API calls during specified period of time.
     */
    api_call_limits: {
        /**
         * Maximum subscription to proposal calls.
         */
        max_proposal_subscription: {
            /**
             * Describes which calls this limit applies to.
             */
            applies_to: string;
            /**
             * Maximum number of allowed calls.
             */
            max: number;
            [k: string]: unknown;
        };
        /**
         * Maximum number of general requests allowed during specified period of time.
         */
        max_requestes_general: {
            /**
             * Describes which calls this limit applies to.
             */
            applies_to: string;
            /**
             * The maximum of allowed calls per hour.
             */
            hourly: number;
            /**
             * The maximum of allowed calls per minute.
             */
            minutely: number;
            [k: string]: unknown;
        };
        /**
         * Maximum number of outcome requests allowed during specified period of time.
         */
        max_requests_outcome: {
            /**
             * Describes which calls this limit applies to.
             */
            applies_to: string;
            /**
             * The maximum of allowed calls per hour.
             */
            hourly: number;
            /**
             * The maximum of allowed calls per minute.
             */
            minutely: number;
            [k: string]: unknown;
        };
        /**
         * Maximum number of pricing requests allowed during specified period of time.
         */
        max_requests_pricing: {
            /**
             * Describes which calls this limit applies to.
             */
            applies_to: string;
            /**
             * The maximum of allowed calls per hour.
             */
            hourly: number;
            /**
             * The maximum of allowed calls per minute.
             */
            minutely: number;
            [k: string]: unknown;
        };
        [k: string]: unknown;
    };
    /**
     * Country code of connected IP
     */
    clients_country?: string;
    /**
     * Provides minimum withdrawal for all crypto currency in USD
     */
    crypto_config: {
        /**
         * Crypto-currency code
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[a-zA-Z0-9]{2,20}$".
         */
        [k: string]: {
            /**
             * Minimum withdrawal for the currency in USD.
             */
            minimum_withdrawal: number;
            [k: string]: unknown;
        };
    };
    /**
     * Available currencies and their information
     */
    currencies_config: {
        /**
         * Currency code
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[a-zA-Z0-9]{2,20}$".
         */
        [k: string]: {
            /**
             * Number of fractional digits.
             */
            fractional_digits: number;
            /**
             * Current status for payment deposit for the currency
             */
            is_deposit_suspended: 0 | 1;
            /**
             * Current status for the currency
             */
            is_suspended: 0 | 1;
            /**
             * Current status for payment withdrawal for the currency
             */
            is_withdrawal_suspended: 0 | 1;
            /**
             * Default stake value for the currency.
             */
            stake_default: number;
            /**
             * Fees and range of allowed amount for transfer between accounts with different types of currencies.
             */
            transfer_between_accounts: {
                /**
                 * The fee that applies for transfer between accounts with different types of currencies.
                 */
                fees: {
                    /**
                     * Currency code.
                     *
                     * This interface was referenced by `undefined`'s JSON-Schema definition
                     * via the `patternProperty` "^[a-zA-Z0-9]{2,20}$".
                     */
                    [k: string]: number;
                };
                /**
                 * Range of allowed amount for transfer between accounts.
                 */
                limits: {
                    /**
                     * Maximum allowed amount for transfer between accounts with different types of currencies.
                     */
                    max?: number;
                    /**
                     * Minimum allowed amount for transfer between accounts with different types of currencies.
                     */
                    min: number;
                    [k: string]: unknown;
                } | null;
                [k: string]: unknown;
            };
            /**
             * Type of the currency.
             */
            type: 'fiat' | 'crypto';
            [k: string]: unknown;
        };
    };
    /**
     * Text for site status banner, contains problem description. shown only if set by the system.
     */
    message?: string;
    /**
     * The current status of the website.
     */
    site_status?: 'up' | 'down';
    /**
     * Provides codes for languages supported.
     */
    supported_languages?: string[];
    /**
     * Latest terms and conditions version.
     */
    terms_conditions_version?: string;
    [k: string]: unknown;
}
/**
 * For subscription requests only.
 */
export interface SubscriptionInformation {
    /**
     * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
     */
    id: string;
    [k: string]: unknown;
}
/**
 * Request server status.
 */
export interface ServerStatusRequest {
    /**
     * Must be `1`
     */
    website_status: 1;
    /**
     * [Optional] `1` to stream the server/website status updates.
     */
    subscribe?: 0 | 1;
    /**
     * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
     */
    passthrough?: {
        [k: string]: unknown;
    };
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
}
