const MetaTraderConfig = require('./metatrader.config');
const MetaTraderUI     = require('./metatrader.ui');
const Client           = require('../../../base/client');
const BinarySocket     = require('../../../base/socket');
const Validation       = require('../../../common/form_validation');
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;

const MetaTrader = (() => {
    let mt_companies;
    let show_new_account_popup = true;
    const accounts_info        = MetaTraderConfig.accounts_info;
    const actions_info         = MetaTraderConfig.actions_info;
    const fields               = MetaTraderConfig.fields;

    const mt_company = {};

    const onLoad = () => {
        BinarySocket.send({ statement: 1, limit: 1 });
        BinarySocket.wait('landing_company', 'get_account_status', 'statement').then(() => {
            setMTCompanies();
            if (isEligible()) {
                if (Client.get('is_virtual')) {
                    getAllAccountsInfo();
                } else {
                    BinarySocket.send({ get_limits: 1 }).then(getAllAccountsInfo);
                    getExchangeRates();
                }
            } else {
                MetaTraderUI.displayPageError(localize('Sorry, this feature is not available in your jurisdiction.'));
            }
        });
    };

    // we need to calculate min/max equivalent to 1 and 20000 USD, so get exchange rates for all currencies based on USD
    const getExchangeRates = () => BinarySocket.send({ exchange_rates: 1, base_currency: 'USD' });

    const setMTCompanies = () => {
        const mt_financial_company = State.getResponse('landing_company.mt_financial_company');
        const mt_gaming_company    = State.getResponse('landing_company.mt_gaming_company');

        // Check if mt_financial_company is offered, if not found, switch to mt_gaming_company
        const mt_landing_company = mt_financial_company || mt_gaming_company;

        // Check if any of the account type shortcodes from mt_landing_company account is maltainvest
        const is_financial = mt_landing_company ? Object.keys(mt_landing_company)
            .some((key) => mt_landing_company[key].shortcode === 'maltainvest') : undefined;

        mt_companies = mt_companies || MetaTraderConfig[is_financial ? 'configMtFinCompanies' : 'configMtCompanies']();
    };

    const isEligible = () => {
        setMTCompanies();
        let has_mt_company = false;
        Object.keys(mt_companies).forEach((company) => {
            Object.keys(mt_companies[company]).forEach((acc_type) => {
                mt_company[company] = State.getResponse(`landing_company.mt_${company}_company.${MetaTraderConfig.getMTFinancialAccountType(acc_type)}.shortcode`);
                if (mt_company[company]) {
                    has_mt_company = true;
                    addAccount(company);
                }
            });
        });
        return has_mt_company;
    };

    const addAccount = (company) => {
        Object.keys(mt_companies[company]).forEach((acc_type) => {
            const company_info     = mt_companies[company][acc_type];
            const mt5_account_type = company_info.mt5_account_type;
            const is_demo          = /^demo_/.test(acc_type);
            const type             = is_demo ? 'demo' : 'real';

            accounts_info[`${type}_${mt_company[company]}${mt5_account_type ? `_${mt5_account_type}` : ''}`] = {
                is_demo,
                mt5_account_type,
                account_type: is_demo ? 'demo' : company,
                max_leverage: company_info.max_leverage,
                short_title : company_info.short_title,
                title       : company_info.title,
            };
        });
    };

    const getAllAccountsInfo = () => {
        MetaTraderUI.init(submit, sendTopupDemo);
        BinarySocket.send({ mt5_login_list: 1 }).then((response) => {
            show_new_account_popup = Client.canChangeCurrency(State.getResponse('statement'), (response.mt5_login_list || []), false);
            allAccountsResponseHandler(response);
        });
    };

    const getDefaultAccount = () => {
        let default_account = '';
        if (MetaTraderConfig.hasAccount(Client.get('mt5_account'))) {
            default_account = Client.get('mt5_account');
        } else {
            default_account = MetaTraderConfig.getAllAccounts()[0] || '';
        }
        return default_account;
    };

    const setAccountDetails = (login, acc_type, data) => {
        if (data.mt5_login_list) {
            const info = data.mt5_login_list.find(mt5_account => mt5_account.login === login);
            if (info) {
                accounts_info[acc_type].info = info;
                MetaTraderUI.updateAccount(acc_type);
            }
        }
    };

    const makeRequestObject = (acc_type, action) => {
        const req = {};

        Object.keys(fields[action]).forEach((field) => {
            const field_obj = fields[action][field];
            if (!field_obj.request_field) return;

            if (field_obj.is_radio) {
                req[field_obj.request_field] = MetaTraderUI.$form().find(`input[name=${field_obj.id.slice(1)}]:checked`).val();
            } else {
                req[field_obj.request_field] = MetaTraderUI.$form().find(field_obj.id).val();
            }
        });

        if (!/^(verify_password_reset|revoke_mam)$/.test(action)) {
            // set main command
            req[`mt5_${action.replace(action === 'new_account_mam' ? '_mam' : '', '')}`] = 1;
        }

        // add additional fields
        $.extend(req, fields[action].additional_fields(acc_type, MetaTraderUI.getToken()));

        return req;
    };

    const submit = (e) => {
        e.preventDefault();

        if (show_new_account_popup) {
            MetaTraderUI.showNewAccountConfirmationPopup(
                e,
                () => show_new_account_popup = false,
                () => show_new_account_popup = true
            );

            return;
        }

        const $btn_submit = $(e.target);
        const acc_type    = $btn_submit.attr('acc_type');
        const action      = $btn_submit.attr('action');
        MetaTraderUI.hideFormMessage(action);
        if (Validation.validate(`#frm_${action}`)) {
            MetaTraderUI.disableButton(action);
            // further validations before submit (password_check)
            MetaTraderUI.postValidate(acc_type, action).then((is_ok) => {
                if (!is_ok) {
                    MetaTraderUI.enableButton(action);
                    return;
                }

                if (action === 'verify_password_reset_token') {
                    MetaTraderUI.setToken($('#txt_verification_code').val());
                    if (typeof actions_info[action].onSuccess === 'function') {
                        actions_info[action].onSuccess({}, MetaTraderUI.$form());
                    }
                    return;
                }

                const req = makeRequestObject(acc_type, action);
                BinarySocket.send(req).then((response) => {
                    if (response.error) {
                        MetaTraderUI.displayFormMessage(response.error.message, action);
                        if (typeof actions_info[action].onError === 'function') {
                            actions_info[action].onError(response, MetaTraderUI.$form());
                        }
                        if (/^MT5(Deposit|Withdrawal)Error$/.test(response.error.code)) {
                            getExchangeRates();
                        }
                    } else {
                        const login = actions_info[action].login ?
                            actions_info[action].login(response) : accounts_info[acc_type].info.login;
                        if (!accounts_info[acc_type].info) { // it's a new account
                            accounts_info[acc_type].info = { login, currency: getPropertyValue(response, ['mt5_new_account', 'currency']) };
                            MetaTraderUI.setAccountType(acc_type, true);
                            BinarySocket.send({ mt5_login_list: 1 });
                            MetaTraderUI.loadAction(null, acc_type);
                        } else {
                            // other than revoke mam, other actions are two forms in one action, so we need the parent action to be loaded for them
                            const parent_action = /password/.test(action) ? 'manage_password' : 'cashier';
                            MetaTraderUI.loadAction(action === 'revoke_mam' ? action : parent_action);
                        }
                        BinarySocket.send({ mt5_login_list: 1 }).then((response_login_list) => {
                            setAccountDetails(login, acc_type, response_login_list);
                            if (/^(revoke_mam|new_account_mam)/.test(action)) {
                                MetaTraderUI.showHideMAM(acc_type);
                            }
                        });
                        if (typeof actions_info[action].success_msg === 'function') {
                            const success_msg = actions_info[action].success_msg(response, acc_type);
                            if (actions_info[action].success_msg_selector) {
                                MetaTraderUI.displayMessage(actions_info[action].success_msg_selector, success_msg, 1);
                            } else {
                                MetaTraderUI.displayMainMessage(success_msg);
                            }
                        }
                        if (typeof actions_info[action].onSuccess === 'function') {
                            actions_info[action].onSuccess(response, MetaTraderUI.$form());
                        }
                    }
                    MetaTraderUI.enableButton(action, response);
                });
            });
        }
    };

    const allAccountsResponseHandler = (response) => {
        if (response.error) {
            MetaTraderUI.displayPageError(response.error.message || localize('Sorry, an error occurred while processing your request.'));
            return;
        }
        // Ignore old accounts which are not linked to any group or has deprecated group
        const mt5_login_list = (response.mt5_login_list || []).filter(obj => (
            obj.group && Client.getMT5AccountType(obj.group) in accounts_info
        ));

        // Update account info
        mt5_login_list.forEach((obj) => {
            const acc_type = Client.getMT5AccountType(obj.group);
            accounts_info[acc_type].info = { login: obj.login };
            setAccountDetails(obj.login, acc_type, response);
        });

        const current_acc_type = getDefaultAccount();
        Client.set('mt5_account', current_acc_type);
        MetaTraderUI.showHideMAM(current_acc_type);

        // Update types with no account
        Object.keys(accounts_info)
            .filter(acc_type => !MetaTraderConfig.hasAccount(acc_type))
            .forEach((acc_type) => { MetaTraderUI.updateAccount(acc_type); });
    };

    const sendTopupDemo = () => {
        MetaTraderUI.setTopupLoading(true);
        const acc_type = Client.get('mt5_account');
        const login    = accounts_info[acc_type].info.login;
        const req      = {
            mt5_deposit: 1,
            to_mt5     : login,
        };

        BinarySocket.send(req).then((response) => {
            if (response.error) {
                MetaTraderUI.displayPageError(response.error.message);
                MetaTraderUI.setTopupLoading(false);
            } else {
                MetaTraderUI.displayMainMessage(
                    localize(
                        '[_1] has been credited into your MT5 Demo Account: [_2].',
                        [`${MetaTraderConfig.getCurrency(acc_type)} 10,000.00`, login.toString()]
                    ));
                BinarySocket.send({ mt5_login_list: 1 }).then((res) => {
                    allAccountsResponseHandler(res);
                    MetaTraderUI.setTopupLoading(false);
                });
            }
        });
    };

    return {
        onLoad,
        isEligible,
    };
})();

module.exports = MetaTrader;
