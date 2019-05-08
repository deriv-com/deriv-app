const Dropdown             = require('@binary-com/binary-style').selectDropdown;
const moment               = require('moment');
const setIsForNewAccount   = require('./account/settings/personal_details').setIsForNewAccount;
const GetCurrency          = require('./get_currency');
const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client');
const populateAccountsList = require('../../base/header').populateAccountsList;
const BinarySocket         = require('../../base/socket');
const Currency             = require('../../common/currency');
const FormManager          = require('../../common/form_manager');
const isCryptocurrency     = require('../../../_common/base/currency_base').isCryptocurrency;
const getElementById       = require('../../../_common/common_functions').getElementById;
const localize             = require('../../../_common/localize').localize;
const State                = require('../../../_common/storage').State;
const urlFor               = require('../../../_common/url').urlFor;
const showLoadingImage     = require('../../../_common/utility').showLoadingImage;

const Accounts = (() => {
    let landing_company;
    const form_id = '#new_accounts';

    const TableHeaders = (() => {
        let table_headers;

        const initTableHeaders = () => ({
            account             : localize('Account'),
            available_markets   : localize('Available Markets'),
            available_currencies: localize('Available Currencies'),
            type                : localize('Type'),
            currency            : localize('Currency'),
        });

        return {
            get: () => {
                if (!table_headers) {
                    table_headers = initTableHeaders();
                }
                return table_headers;
            },
        };
    })();

    const onLoad = () => {
        if (!Client.get('residence')) {
            // ask client to set residence first since cannot wait landing_company otherwise
            BinaryPjax.load(urlFor('user/settings/detailsws'));
        }
        BinarySocket.send({ statement: 1, limit: 1 });
        BinarySocket.wait('landing_company', 'get_settings', 'statement', 'mt5_login_list').then(() => {
            landing_company           = State.getResponse('landing_company');
            const can_change_currency = Client.canChangeCurrency(State.getResponse('statement'), State.getResponse('mt5_login_list'));

            populateExistingAccounts();

            let element_to_show = '#no_new_accounts_wrapper';
            const upgrade_info  = Client.getUpgradeInfo();
            if (upgrade_info.can_upgrade) {
                populateNewAccounts(upgrade_info);
                element_to_show = '#new_accounts_wrapper';
            }

            if (upgrade_info.can_open_multi) {
                populateMultiAccount();
            } else if (!can_change_currency) {
                doneLoading(element_to_show);
            }

            if (can_change_currency) {
                addChangeCurrencyOption();
                element_to_show = '#new_accounts_wrapper';
                if (!upgrade_info.can_open_multi) {
                    doneLoading(element_to_show);
                }
            }
        });
    };

    const doneLoading = (element_to_show) => {
        $(element_to_show).setVisibility(1);
        $('#accounts_loading').remove();
        $('#accounts_wrapper').setVisibility(1);
    };

    const getCompanyName = account => Client.getLandingCompanyValue(account, landing_company, 'name');

    const getCompanyCountry = account => Client.getLandingCompanyValue(account, landing_company, 'country');

    const populateNewAccounts = (upgrade_info) => {
        const table_headers = TableHeaders.get();
        const new_account   = upgrade_info;
        const account       = {
            real     : new_account.type === 'real',
            financial: new_account.type === 'financial',
        };
        const new_account_title    = new_account.type === 'financial' ? localize('Financial Account') : localize('Real Account');
        const available_currencies = Client.getLandingCompanyValue(account, landing_company, 'legal_allowed_currencies');
        const currencies_name_list = Currency.getCurrencyNameList(available_currencies);
        $(form_id).find('tbody')
            .append($('<tr/>')
                .append($('<td/>', { datath: table_headers.account }).html($('<span/>', {
                    text                 : new_account_title,
                    'data-balloon'       : `${localize('Counterparty')}: ${getCompanyName(account)}, ${localize('Jurisdiction')}: ${getCompanyCountry(account)}`,
                    'data-balloon-length': 'large',
                })))
                .append($('<td/>', { text: getAvailableMarkets(account), datath: table_headers.available_markets }))
                .append($('<td/>', { text: currencies_name_list.join(', '), datath: table_headers.available_currencies }))
                .append($('<td/>')
                    .html($('<a/>', { class: 'button', href: urlFor(new_account.upgrade_link) })
                        .html($('<span/>', { text: localize('Create') })))));
    };

    const addChangeCurrencyOption = () => {
        const table_headers = TableHeaders.get();
        const loginid       = Client.get('loginid');

        // Set the table row
        $(form_id).find('tbody')
            .append($('<tr/>', { id: 'change_account_currency' })
                .append($('<td/>', { datath: table_headers.account }).html($('<span/>', {
                    text: loginid,
                })))
                .append($('<td/>', { text: getAvailableMarkets(loginid), datath: table_headers.available_markets }))
                .append($('<td/>', { class: 'account-currency', datath: table_headers.available_currencies }))
                .append($('<td/>', { id: 'change_currency_action' })
                    .html($('<button/>', { id: 'change_currency_btn', class: 'button no-margin', type: 'button', text: localize('Change') }).click(sendCurrencyChangeReq))));

        // Add and convert available currencies into dropdown if multi, or label if single
        populateChangeCurrencyDropdown(getCurrencyChangeOptions());

        // Replace note to reflect ability to change currency
        $('#note > .hint').text(`${localize('Note: You are limited to one fiat currency account. The currency of your fiat account can be changed before you deposit into your fiat account for the first time or create an MT5 account. You may also open one account for each supported cryptocurrency.')}`);
    };

    const getCurrencyChangeOptions = () => {
        const allowed_currencies   = Client.getLandingCompanyValue(Client.get('loginid'), landing_company, 'legal_allowed_currencies');
        const current_currencies   = GetCurrency.getCurrenciesOfOtherAccounts();

        current_currencies.push(Client.get('currency'));

        return allowed_currencies.filter(
            currency => !current_currencies.includes(currency) && !isCryptocurrency(currency)
        );
    };

    const populateChangeCurrencyDropdown = (available_currencies) => {
        const change_currency_id       = 'change_account_currencies';
        const $change_account_currency = $('#change_account_currency');

        if (available_currencies.length > 1) {
            const $currencies = $('<div/>');
            $currencies.append(Currency.getCurrencyList(available_currencies).html());
            $change_account_currency.find('.account-currency').html($('<select/>', { id: change_currency_id }).html($currencies.html()));
            Dropdown(`#${change_currency_id}`, true); // Explicitly set true to enable option group
        } else {
            $change_account_currency.find('.account-currency').html($('<label/>', { id: change_currency_id, 'data-value': available_currencies, text: Currency.getCurrencyFullName(available_currencies) }));
        }
    };

    const sendCurrencyChangeReq = () => {
        const set_account_currency   = getElementById('change_account_currencies').value || getElementById('change_account_currencies').getAttribute('data-value');
        const currency_before_change = Client.get('currency');
        const $change_currency_btn   = $('#change_currency_btn');
        const setLoadingImage        = (is_visible) => is_visible ? showLoadingImage($change_currency_btn, 'white') : $change_currency_btn.html(localize('Change'));
        setLoadingImage(true);

        BinarySocket.send({ set_account_currency }).then(res => {
            if (res.error) {
                showError(res.error.message, 'change_currency_error', 'change_account_currency');
                setLoadingImage(false);
            } else if (res.set_account_currency === 1) {
                const balance   = BinarySocket.send({ balance: 1 });
                const authorize = BinarySocket.send({ authorize: Client.get('token') }, { forced: true });
                Promise.all([balance, authorize]).then(() => {
                    setLoadingImage(false);
                    handleCurrencyChange(currency_before_change, set_account_currency);
                });
            }
        });
    };

    const handleCurrencyChange = (from, to) => {
        populateAccountsList();
        localStorage.setItem('has_changed_currency', `${from}-${to}`);
        BinaryPjax.load(urlFor('user/set-currency'));
    };

    const populateExistingAccounts = () => {
        const all_login_ids = Client.getAllLoginids();
        // Populate active loginids first.
        all_login_ids
            .filter(loginid => !Client.get('is_disabled', loginid) && !Client.get('excluded_until', loginid))
            .sort((a, b) => a > b)
            .forEach((loginid) => {
                appendExistingAccounts(loginid);
            });

        // Populate disabled or self excluded loginids.
        all_login_ids
            .filter(loginid => Client.get('is_disabled', loginid) || Client.get('excluded_until', loginid))
            .sort((a, b) => a > b)
            .forEach((loginid) => {
                appendExistingAccounts(loginid);
            });
    };

    const appendExistingAccounts = (loginid) => {
        const table_headers     = TableHeaders.get();
        const account_currency  = Client.get('currency', loginid);
        const account_type_prop = { text: Client.getAccountTitle(loginid) };

        if (!Client.isAccountOfType('virtual', loginid)) {
            const company_name    = getCompanyName(loginid);
            const company_country = getCompanyCountry(loginid);
            account_type_prop['data-balloon'] = `${localize('Counterparty')}: ${company_name}, ${localize('Jurisdiction')}: ${company_country}`;
            account_type_prop['data-balloon-length'] = 'large';
        }

        const is_disabled    = Client.get('is_disabled', loginid);
        const excluded_until = Client.get('excluded_until', loginid);
        let txt_markets = '';
        if (is_disabled) {
            txt_markets = localize('This account is disabled');
        } else if (excluded_until) {
            txt_markets = localize('This account is excluded until [_1]', moment(+excluded_until * 1000).format('YYYY-MM-DD HH:mm:ss Z'));
        } else {
            txt_markets = getAvailableMarkets(loginid);
        }

        $('#existing_accounts').find('tbody')
            .append($('<tr/>', { id: loginid, class: ((is_disabled || excluded_until) ? 'color-dark-white' : '') })
                .append($('<td/>', { text: loginid, datath: table_headers.account }))
                .append($('<td/>', { datath: table_headers.type }).html($('<span/>', account_type_prop)))
                .append($('<td/>', { text: txt_markets, datath: table_headers.available_markets }))
                .append($('<td/>', { datath: table_headers.currency })
                    .html(!account_currency && loginid === Client.get('loginid') ? $('<a/>', { class: 'button', href: urlFor('user/set-currency') }).html($('<span/>', { text: localize('Set Currency') })) : (Currency.getCurrencyFullName(account_currency) || '-'))));

        if (is_disabled || excluded_until) {
            $('#note_support').setVisibility(1);
        }
    };

    const getAvailableMarkets = (loginid) => {
        let legal_allowed_markets = Client.getLandingCompanyValue(loginid, landing_company, 'legal_allowed_markets') || '';
        if (Array.isArray(legal_allowed_markets) && legal_allowed_markets.length) {
            legal_allowed_markets =
                legal_allowed_markets
                    .map(market => getMarketName(market))
                    .filter((value, index, self) => value && self.indexOf(value) === index)
                    .join(', ');
        }
        return legal_allowed_markets;
    };

    const MarketsConfig = (() => {
        let markets_config;

        const initMarketsConfig = () => ({
            commodities: localize('Commodities'),
            forex      : localize('Forex'),
            indices    : localize('Indices'),
            stocks     : localize('Stocks'),
            volidx     : localize('Volatility Indices'),
        });

        return {
            get: () => {
                if (!markets_config) {
                    markets_config = initMarketsConfig();
                }
                return markets_config;
            },
        };
    })();

    const getMarketName = market => MarketsConfig.get()[market] || '';

    const populateMultiAccount = () => {
        const table_headers = TableHeaders.get();
        const currencies    = GetCurrency.getCurrencies(landing_company);
        const account       = { real: 1 };
        $(form_id).find('tbody')
            .append($('<tr/>', { id: 'new_account_opening' })
                .append($('<td/>', { datath: table_headers.account }).html($('<span/>', {
                    text                 : localize('Real Account'),
                    'data-balloon'       : `${localize('Counterparty')}: ${getCompanyName(account)}, ${localize('Jurisdiction')}: ${getCompanyCountry(account)}`,
                    'data-balloon-length': 'large',
                })))
                .append($('<td/>', { text: getAvailableMarkets({ real: 1 }), datath: table_headers.available_markets }))
                .append($('<td/>', { class: 'account-currency', datath: table_headers.available_currencies }))
                .append($('<td/>').html($('<button/>', { text: localize('Create'), type: 'submit' }))));

        $('#note').setVisibility(1);

        const $new_account_opening = $('#new_account_opening');
        if (currencies.length > 1) {
            const $currencies = $('<div/>');
            $currencies.append(Currency.getCurrencyList(currencies).html());
            $new_account_opening.find('.account-currency').html($('<select/>', { id: 'new_account_currency' }).html($currencies.html()));
        } else {
            $new_account_opening.find('.account-currency').html($('<label/>', { id: 'new_account_currency', 'data-value': currencies, text: Currency.getCurrencyFullName(currencies) }));
        }

        // need to make it visible before adding the form manager event on it
        doneLoading('#new_accounts_wrapper');

        const el_select_currency = /select/i.test(getElementById('new_account_currency').nodeName);
        FormManager.init(form_id, [{ selector: '#new_account_currency', request_field: 'currency', validations: [el_select_currency ? 'req' : ''], hide_asterisk: true }].concat(populateReq()));

        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: newAccountResponse,
        });
    };

    const newAccountResponse = (response) => {
        if (response.error) {
            if (/InsufficientAccountDetails|InputValidationFailed/.test(response.error.code)) {
                setIsForNewAccount(true);
                // ask client to set any missing information
                BinaryPjax.load(urlFor('user/settings/detailsws'));
            } else {
                showError(response.error.message, 'new_account_error', 'new_account_opening');
            }
        } else {
            const new_account = response.new_account_real;
            localStorage.setItem('is_new_account', 1);
            Client.processNewAccount({
                email       : Client.get('email'),
                loginid     : new_account.client_id,
                token       : new_account.oauth_token,
                redirect_url: urlFor('user/set-currency'),
            });
        }
    };

    const showError = (localized_text, error_message_id, error_message_parent_id) => {
        $(`#${error_message_id}`).remove();
        $(`#${error_message_parent_id}`).find('button').parent().append($('<p/>', { class: 'error-msg', id: error_message_id, text: localized_text }));
    };

    const populateReq = () => {
        const get_settings = State.getResponse('get_settings');
        const dob          = moment.utc(+get_settings.date_of_birth * 1000).format('YYYY-MM-DD');
        const req          = [
            { request_field: 'new_account_real',       value: 1 },
            { request_field: 'date_of_birth',          value: dob },
            { request_field: 'salutation',             value: get_settings.salutation },
            { request_field: 'first_name',             value: get_settings.first_name },
            { request_field: 'last_name',              value: get_settings.last_name },
            { request_field: 'address_line_1',         value: get_settings.address_line_1 },
            { request_field: 'address_line_2',         value: get_settings.address_line_2 },
            { request_field: 'address_city',           value: get_settings.address_city },
            { request_field: 'address_state',          value: get_settings.address_state },
            { request_field: 'address_postcode',       value: get_settings.address_postcode },
            { request_field: 'phone',                  value: get_settings.phone },
            { request_field: 'account_opening_reason', value: get_settings.account_opening_reason },
            { request_field: 'citizen',                value: get_settings.citizen },
            { request_field: 'place_of_birth',         value: get_settings.place_of_birth },
            { request_field: 'residence',              value: Client.get('residence') },
        ];
        if (get_settings.tax_identification_number) {
            req.push({ request_field: 'tax_identification_number', value: get_settings.tax_identification_number });
        }
        if (get_settings.tax_residence) {
            req.push({ request_field: 'tax_residence', value: get_settings.tax_residence });
        }
        return req;
    };

    return {
        onLoad,
    };
})();

module.exports = Accounts;
