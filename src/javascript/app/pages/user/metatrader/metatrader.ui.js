const MetaTraderConfig = require('./metatrader.config');
const Client           = require('../../../base/client');
const Dialog           = require('../../../common/attach_dom/dialog');
const Currency         = require('../../../common/currency');
const Validation       = require('../../../common/form_validation');
const getTransferFee   = require('../../../../_common/base/currency_base').getTransferFee;
const getElementById   = require('../../../../_common/common_functions').getElementById;
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const urlForStatic     = require('../../../../_common/url').urlForStatic;
const getHashValue     = require('../../../../_common/url').getHashValue;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const MetaTraderUI = (() => {
    let $container,
        $list_cont,
        $mt5_account,
        $list,
        $detail,
        $action,
        $templates,
        $form,
        $main_msg,
        validations,
        submit,
        topup_demo,
        token,
        current_action_ui;

    const accounts_info = MetaTraderConfig.accounts_info;
    const actions_info  = MetaTraderConfig.actions_info;

    const init = (submit_func, topup_demo_func) => {
        token        = getHashValue('token');
        topup_demo   = topup_demo_func;
        submit       = submit_func;
        $container   = $('#mt_account_management');
        $mt5_account = $container.find('#mt5_account');
        $list_cont   = $container.find('#accounts_list');
        $list        = $list_cont.find('> div.list');
        $detail      = $container.find('#account_details');
        $action      = $container.find('#fst_action');
        $templates   = $container.find('#templates').remove();
        $main_msg    = $container.find('#main_msg');
        $container.find('[class*="act_"]').click(populateForm);

        MetaTraderConfig.setMessages($templates.find('#messages'));

        validations = MetaTraderConfig.validations();

        populateAccountTypes();
        populateAccountList();
    };

    const populateAccountList = () => {
        const $acc_name = $templates.find('> .acc-name');
        let acc_group_demo_set = false;
        let acc_group_real_set = false;
        let acc_group_mam_set  = false;
        Object.keys(accounts_info)
            .sort((a, b) => accounts_info[a].account_type > accounts_info[b].account_type ? 1 : -1)
            .sort((a, b) => (/mam/.test(a) && !/mam/.test(b) ? 1 : -1)) // Show MAM last
            .forEach((acc_type) => {
                if ($list.find(`[value="${acc_type}"]`).length === 0) {
                    if (/^demo/.test(acc_type)) {
                        if (!acc_group_demo_set) {
                            $list.append($('<div/>', { class: 'acc-group invisible', id: 'acc_group_demo', text: localize('Demo Accounts') }));
                            acc_group_demo_set = true;
                        }
                    } else if (/mam/.test(acc_type)) {
                        if (!acc_group_mam_set) {
                            $list.append($('<div/>', { class: 'acc-group invisible', id: 'acc_group_mam', text: localize('MAM Accounts') }));
                            acc_group_mam_set = true;
                        }
                    } else if (!acc_group_real_set) {
                        $list.append($('<div/>', { class: 'acc-group invisible', id: 'acc_group_real', text: localize('Real-Money Accounts') }));
                        acc_group_real_set = true;
                    }
                    const $acc_item = $acc_name.clone();
                    $acc_item.attr('value', acc_type);
                    $list.append($acc_item);
                }
            });

        const hideList = () => {
            $list_cont.slideUp('fast', () => { $mt5_account.removeClass('open'); });
        };

        // account switch events
        $mt5_account.off('click').on('click', (e) => {
            e.stopPropagation();
            if ($list_cont.is(':hidden')) {
                $mt5_account.addClass('open');
                $list_cont.slideDown('fast');
            } else {
                hideList();
            }
        });
        $list.off('click').on('click', '.acc-name', function () {
            if (!$(this).hasClass('disabled')) {
                setAccountType($(this).attr('value'), true);
            }
        });
        $(document).off('click.mt5_account_list').on('click.mt5_account_list', () => {
            hideList();
        });
    };

    const setAccountType = (acc_type, should_set_account) => {
        if ($mt5_account.attr('value') !== acc_type) {
            Client.set('mt5_account', acc_type);
            $mt5_account.attr('value', acc_type).removeClass('empty');
            setMTAccountText();
            $list.find('.acc-name').removeClass('selected');
            $list.find(`[value="${acc_type}"]`).addClass('selected');
            $action.setVisibility(0);
            if (should_set_account) {
                setCurrentAccount(acc_type);
                $.scrollTo($('h1'), 300, { offset: -10 });
            }
        }
    };

    const updateAccount = (acc_type) => {
        updateListItem(acc_type);
        setCurrentAccount(acc_type);
        showHideFinancialAuthenticate(acc_type);
    };

    const setMTAccountText = () => {
        const acc_type = $mt5_account.attr('value');
        if (acc_type) {
            const login = getPropertyValue(accounts_info[acc_type], ['info', 'login']);
            const title = `${accounts_info[acc_type].title}${ login ? ` (${login})` : '' }`;
            if (!new RegExp(title).test($mt5_account.text())) {
                $mt5_account.html(title);
            }
        }
    };

    const updateListItem = (acc_type) => {
        const $acc_item = $list.find(`[value="${acc_type}"]`);
        $acc_item.find('.mt-type').text(accounts_info[acc_type].title.replace(/(demo|real(\smam)*)\s/i, ''));
        if (accounts_info[acc_type].info) {
            setMTAccountText();
            $acc_item.find('.mt-login').text(`(${accounts_info[acc_type].info.login})`);
            $acc_item.setVisibility(1);
            if (/demo/.test(accounts_info[acc_type].account_type)) {
                $list.find('#acc_group_demo').setVisibility(1);
            } else if (/mam/.test(acc_type)) {
                $list.find('#acc_group_mam').setVisibility(1);
            } else {
                $list.find('#acc_group_real').setVisibility(1);
            }
            if (acc_type === Client.get('mt5_account')) {
                const mt_balance = Currency.formatMoney(MetaTraderConfig.getCurrency(acc_type),
                    +accounts_info[acc_type].info.balance);
                $acc_item.find('.mt-balance').html(mt_balance);
                $action.find('.mt5-balance').html(mt_balance);
            }
            if (Object.keys(accounts_info).every(type => accounts_info[type].info)) {
                $container.find('.act_new_account').remove();
            }
        } else {
            $acc_item.setVisibility(0);
        }
    };

    const displayAccountDescription = (acc_type) => {
        $container.find('#account_desc').html($templates.find(`.account-desc .${acc_type}`).clone());
    };

    const setCurrentAccount = (acc_type) => {
        if (Client.get('mt5_account') && Client.get('mt5_account') !== acc_type) return;

        if (current_action_ui !== 'new_account') {
            displayAccountDescription(acc_type);
        }

        if (accounts_info[acc_type].info) {
            // Update account info
            $detail.find('.acc-info div[data]').map(function () {
                const key     = $(this).attr('data');
                const info    = accounts_info[acc_type].info[key];
                const mapping = {
                    balance : () => (isNaN(info) ? '' : Currency.formatMoney(MetaTraderConfig.getCurrency(acc_type), +info)),
                    leverage: () => `1:${info}`,
                    login   : () => (`${info} (${/demo/.test(accounts_info[acc_type].account_type) ? localize('Demo Account') : localize('Real-Money Account')})`),
                };
                $(this).html(typeof mapping[key] === 'function' ? mapping[key]() : info);
            });

            setCounterpartyAndJurisdictionTooltip($('.acc-info div[data="login"]'), acc_type);

            // $container.find('.act_cashier').setVisibility(!types_info[acc_type].is_demo);
            if (current_action_ui !== 'new_account') {
                $container.find('.has-account').setVisibility(1);
            }
        } else {
            $detail.find('.acc-info, .acc-actions').setVisibility(0);
        }
        $('#mt_loading').remove();
        $container.setVisibility(1);

        setAccountType(acc_type);

        if ($action.hasClass('invisible')) {
            loadAction(defaultAction(acc_type));
        }
    };

    const defaultAction = acc_type => {
        let type = 'new_account';
        if (accounts_info[acc_type].info) {
            type = (accounts_info[acc_type].is_demo || Client.get('is_virtual') || getHashValue('token')) ? 'manage_password' : 'cashier';
            removeUrlHash(); // only load manage_password section on first page load if token in url, after that remove it from url
        }
        return type;
    };

    const loadAction = (action, acc_type) => {
        $container.find(`[class~=act_${action || defaultAction(acc_type)}]`).click();
    };

    const populateForm = (e) => {
        let $target = $(e.target);
        if ($target.prop('tagName').toLowerCase() !== 'a') {
            $target = $target.parents('a');
        }
        $main_msg.setVisibility(0);

        const acc_type = Client.get('mt5_account');
        const action   = $target.attr('class').split(' ').find(c => /^act_/.test(c)).replace('act_', '');

        const cloneForm = () => {
            $form = $templates.find(`#frm_${action}`).clone();
            $form.find(`.${/demo/.test(acc_type) ? 'demo' : 'real'}-only`).setVisibility(1);
            const formValues = (actions_info[action] || {}).formValues;
            if (formValues) formValues($form, acc_type, action);

            // append form
            $action.find('#frm_action').html($form).setVisibility(1).end()
                .setVisibility(1);

            if (action === 'manage_password') {
                $form.find('button[type="submit"]').append(accounts_info[acc_type].info.login ? ` ${localize('for account [_1]', accounts_info[acc_type].info.login)}` : '');
                if (!token) {
                    $form.find('#frm_verify_password_reset').setVisibility(1);
                } else if (!Validation.validEmailToken(token)) {
                    $form.find('#frm_verify_password_reset').find('#token_error').setVisibility(1).end().setVisibility(1);
                } else {
                    $form.find('#frm_password_reset').setVisibility(1);
                }
            }

            if (action === 'revoke_mam') {
                $form.find('#mam_id').text(accounts_info[acc_type].info.manager_id);
            }

            $form.find('button[type="submit"]').each(function() { // cashier has two different actions
                const this_action = $(this).attr('action');
                actions_info[this_action].$form = $(this).parents('form');
                $(this).attr({ acc_type }).on('click dblclick', submit);
                Validation.init(`#frm_${this_action}`, validations[this_action]);
            });

            handleNewAccountUI(action, acc_type, $target);
        };

        if (/manage_password|new_account/.test(action)) {
            cloneForm();
            return;
        }

        if (action === 'cashier') { // Manage Fund
            const client_currency = Client.get('currency');
            const mt_currency     = MetaTraderConfig.getCurrency(acc_type);
            cloneForm();
            setDemoTopupStatus();
            $form.find('.binary-account').text(`${localize('[_1] Account [_2]', ['Binary', Client.get('loginid')])}`);
            $form.find('.binary-balance').html(`${Currency.formatMoney(client_currency, Client.get('balance'))}`);
            $form.find('.mt5-account').text(`${localize('[_1] Account [_2]', [accounts_info[acc_type].title, accounts_info[acc_type].info.login])}`);
            $form.find('.mt5-balance').html(`${Currency.formatMoney(mt_currency, accounts_info[acc_type].info.balance)}`);
            $form.find('label[for="txt_amount_deposit"]').append(` ${client_currency}`);
            $form.find('label[for="txt_amount_withdrawal"]').append(` ${mt_currency}`);

            const should_show_transfer_fee = client_currency !== mt_currency;
            if (should_show_transfer_fee) {
                $('#transfer_fee_amount_to').text(getTransferFee(client_currency, mt_currency));
                $('#transfer_fee_minimum_to').text(Currency.getMinimumTransferFee(client_currency));
                $('#transfer_fee_amount_from').text(getTransferFee(mt_currency, client_currency));
                $('#transfer_fee_minimum_from').text(Currency.getMinimumTransferFee(mt_currency));
            }
            $form.find('#txt_amount_deposit, #txt_amount_withdrawal').siblings('.hint').setVisibility(should_show_transfer_fee);

            ['deposit', 'withdrawal'].forEach((act) => {
                actions_info[act].prerequisites(acc_type).then((error_msg) => {
                    if (error_msg) {
                        $container.find(`#frm_${act} .form`).replaceWith($('<p/>', { class: 'unavailable' }));
                        displayMessage(`#frm_${act} .unavailable`, error_msg, true);
                    }
                });
            });

            if (!accounts_info[acc_type].is_demo) {
                let msg = '';
                if (Client.get('is_virtual')) {
                    msg = MetaTraderConfig.needsRealMessage();
                } else if (!Client.get('currency')) { // client should set currency before accessing fund management section
                    msg = $templates.find('#msg_set_currency').html();
                } else if (Client.get('landing_company_shortcode') === 'iom') {
                    msg = MetaTraderConfig.needsFinancialMessage();
                }
                if (msg) {
                    displayMainMessage(msg, false);
                    $action.find('#frm_cashier').setVisibility(0);
                }
            }
            return;
        }

        actions_info[action].prerequisites(acc_type).then((error_msg) => {
            if (error_msg) { // does not meet one of prerequisites
                displayMainMessage(error_msg);
                $action.find('#frm_action').empty().end().setVisibility(1);
                $container.find('[class*="act_"]').removeClass('selected');
                $container.find(`[class~=act_${action}]`).addClass('selected');
                return;
            }

            if (!$action.find(`#frm_${action}`).length) {
                $main_msg.setVisibility(0);
            }

            cloneForm();
        });
    };

    // -----------------------
    // ----- New Account -----
    // -----------------------
    const handleNewAccountUI = (action, acc_type, $target) => {
        current_action_ui = action;

        const is_new_account = /new_account/.test(action);
        const $acc_actions = $container.find('.acc-actions');
        $acc_actions.find('.new-account').setVisibility(is_new_account);
        $acc_actions.find('.has-account').setVisibility(!is_new_account);
        $acc_actions.find('.has-mam').setVisibility(is_new_account ? 0 : getPropertyValue(accounts_info, [Client.get('mt5_account'), 'info', 'manager_id']));
        $detail.setVisibility(!is_new_account);

        $container.find('[class*="act_"]').removeClass('selected');
        // set active tab
        if (is_new_account) {
            $container.find(`[class~=act_${action}]`).addClass('selected');
        } else {
            $detail.setVisibility(1);
            $target.addClass('selected');
            return;
        }

        if (action === 'new_account_mam') { // there is no demo/real to choose from so set existed accounts right away
            if (Client.get('is_virtual')) {
                displayMainMessage(MetaTraderConfig.needsRealMessage());
                $action.find('#frm_action').empty();
                return;
            }
            updateAccountTypesUI('real');
        }

        // is_new_account
        displayAccountDescription(action);
        $form = actions_info[action].$form;
        if (Object.keys(accounts_info).every(a_type => !accounts_info[a_type].info)) {
            $form.find('#view_1 #btn_cancel').addClass('invisible');
        }

        // Navigation buttons: cancel, next, back
        $form.find('#btn_cancel').click(() => {
            loadAction(null, acc_type);
            displayAccountDescription(accounts_info[acc_type].info ? acc_type : 'new_account');
            $.scrollTo($('h1'), 300, { offset: -10 });
        });
        const displayStep = (step) => {
            $form.find('#mv_new_account div[id^="view_"]').setVisibility(0);
            $form.find(`#view_${step}`).setVisibility(1);
            $form.find('#view_2').find('.error-msg, .days_to_crack').setVisibility(0);
            $form.find('input').val('');
            $form.find(`.${/demo/.test(newAccountGetType()) ? 'real' : 'demo'}-only`).setVisibility(0);
        };
        $form.find('#btn_next').click(function() {
            if (!$(this).hasClass('button-disabled')) {
                $form.find('#view_2 button[type="submit"]').attr('acc_type', newAccountGetType());
                displayStep(2);
                const get_settings = State.getResponse('get_settings');
                if (get_settings.first_name && get_settings.last_name) {
                    $form.find('#txt_name').val(`${get_settings.first_name} ${get_settings.last_name}`);
                }
                $.scrollTo($container.find('.acc-actions'), 300, { offset: -10 });
            }
        });
        $form.find('#btn_back').click(() => { displayStep(1); });

        // Account type selection
        $form.find('.mt5_type_box').click(selectAccountTypeUI);
    };

    const newAccountGetType = () => `${$form.find('.step-1 .selected').attr('data-acc-type') || 'real'}_${$form.find('.step-2 .selected').attr('data-acc-type')}`;

    const selectAccountTypeUI = (e) => {
        const box_class = 'mt5_type_box';
        let $item = $(e.target);
        if (!$item.hasClass(box_class)) {
            $item = $item.parents(`.${box_class}`);
        }
        if (/\b(disabled|selected|existed)\b/.test($item.attr('class'))) return;
        $item.parents('.type-group').find(`.${box_class}.selected`).removeClass('selected');
        $item.addClass('selected');
        $('#new_account_financial_authenticate_msg').setVisibility(0);
        const selected_acc_type = $item.attr('data-acc-type');
        const action            = `new_account${/mamm/.test(selected_acc_type) ? '_mam' : ''}`;
        if (/(demo|real)/.test(selected_acc_type)) {
            displayAccountDescription(action);
            updateAccountTypesUI(selected_acc_type);
            $form.find('#view_1 #btn_next').addClass('button-disabled');
            $form.find('#view_1 .step-2').setVisibility(1);
            displayMessage('#new_account_msg', (selected_acc_type === 'real' && Client.get('is_virtual')) ? MetaTraderConfig.needsRealMessage() : '', true);
            $form.find('#new_account_no_deposit_bonus_msg').setVisibility(0);
        } else {
            const new_acc_type = newAccountGetType();
            displayAccountDescription(new_acc_type);
            actions_info[action].prerequisites(new_acc_type).then((error_msg) => {
                displayMessage('#new_account_msg', error_msg || '');
                $form.find('#view_1 #btn_next')[error_msg ? 'addClass' : 'removeClass']('button-disabled');
                $form.find('#view_1 #btn_cancel').removeClass('invisible');
            });
            // uncomment to show No Deposit Bonus note
            // $form.find('#new_account_no_deposit_bonus_msg').setVisibility(/real_vanuatu_standard/.test(new_acc_type));
        }
    };

    const updateAccountTypesUI = (type) => {
        Object.keys(accounts_info)
            .filter(acc_type => acc_type.indexOf(type) === 0)
            .forEach((acc_type) => {
                let class_name = (type === 'real' && Client.get('is_virtual')) ? 'disabled' : '';
                if (accounts_info[acc_type].info) {
                    class_name = 'existed';
                }
                $form.find(`.step-2 #${acc_type.replace(type, 'rbtn')}`)
                    .removeClass('existed disabled selected')
                    .addClass(class_name);
            });
    };

    const populateAccountTypes = () => {
        const $acc_template     = $($templates.find('#rbtn_template').parent().remove()[0]);
        const $acc_template_mt  = $templates.find('#frm_new_account #view_1 .step-2 .type-group');
        const $acc_template_mam = $templates.find('#frm_new_account_mam #view_1 .step-2 .type-group');
        if (!$acc_template.length || !$acc_template_mt.length || !$acc_template_mam.length) return;

        let count = 0;
        Object.keys(accounts_info)
            .filter(acc_type => !accounts_info[acc_type].is_demo && accounts_info[acc_type].mt5_account_type !== 'mamm') // toEnableMAM: remove second check
            .forEach((acc_type) => {
                // toEnableVanuatuAdvanced: remove vanuatu_advanced from regex below
                if (/labuan_standard|vanuatu_advanced/.test(acc_type)) {
                    return;
                }
                count++;
                const $acc  = $acc_template.clone();
                const type  = acc_type.split('_').slice(1).join('_');
                const image = accounts_info[acc_type].mt5_account_type.replace(/mamm(_)*/, '') || 'volatility_indices'; // image name can be (advanced|standard|volatility_indices)
                $acc.find('.mt5_type_box').attr({ id: `rbtn_${type}`, 'data-acc-type': type })
                    .find('img').attr('src', urlForStatic(`/images/pages/metatrader/icons/acc_${image}.svg`));
                $acc.find('p').text(accounts_info[acc_type].short_title);
                (/mam/.test(acc_type) ? $acc_template_mam : $acc_template_mt).append($acc);
            });
        $templates.find('.hl-types-of-accounts').setVisibility(count > 1);
    };

    // -------------------
    // ----- General -----
    // -------------------
    const postValidate = (acc_type, action) => {
        const validate = actions_info[action].pre_submit;
        return validate ? validate(actions_info[action].$form, acc_type, displayFormMessage) :
            new Promise(resolve => resolve(true));
    };

    const removeUrlHash = () => {
        const url = location.href.split('#')[0];
        window.history.replaceState({ url }, document.title, url);
    };

    const hideFormMessage = (action) => {
        actions_info[action].$form.find('#msg_form').html('').setVisibility(0);
    };

    const displayFormMessage = (message, action) => {
        actions_info[action].$form.find('#msg_form').html(message).setVisibility(1);
    };

    const displayMainMessage = (message, should_scroll = true) => {
        $main_msg.html(message).setVisibility(1);
        if (should_scroll) {
            $.scrollTo($action, 500, { offset: -80 });
        }
    };

    const displayMessage = (selector, message, is_centered) => {
        $container.find(selector).html(message).attr('class', `notice-msg hint ${is_centered ? 'center-text' : 'align-start'}`).setVisibility(message.length);
    };

    const displayPageError = (message) => {
        $('#page_msg').html(message).setVisibility(1);
        $('#mt_loading').remove();
    };

    const disableButton = (action) => {
        const $btn = actions_info[action].$form.find('button');
        if ($btn.length && !$btn.find('.barspinner').length) {
            $btn.attr('disabled', 'disabled');
            const $btn_text = $('<span/>', { text: $btn.text(), class: 'invisible' });
            showLoadingImage($btn[0], 'white');
            $btn.append($btn_text);
        }
    };

    const enableButton = (action, response = {}) => {
        const $btn = actions_info[action].$form.find('button');
        if ($btn.length && $btn.find('.barspinner').length) {
            $btn.removeAttr('disabled').html($btn.find('span').text());
        }
        if (/password_reset/.test(action)) {
            // after submit is done, reset token value
            resetManagePasswordTab(action, response);
        }
    };

    const resetManagePasswordTab = (action, response) => {
        const has_invalid_token = getPropertyValue(response, ['error', 'code']) === 'InvalidToken';
        if (!response.error || has_invalid_token) {
            token = '';
            if (action === 'password_reset') { // go back to verify reset password form
                loadAction('manage_password');
                if (!response.error) {
                    displayMainMessage(localize('The [_1] password of account number [_2] has been changed.', [response.echo_req.password_type, response.echo_req.login]));
                } else if (has_invalid_token) {
                    $form.find('#frm_verify_password_reset #token_error').setVisibility(1);
                }
            }
        }
    };

    const showHideMAM = (acc_type) => {
        const has_manager = getPropertyValue(accounts_info, [acc_type, 'info', 'manager_id']);
        $container.find('.has-mam').setVisibility(has_manager);
        if (!has_manager && $container.find('.acc-actions .has-mam').hasClass('selected')) {
            loadAction(defaultAction(acc_type));
        }
    };

    const showHideFinancialAuthenticate = (acc_type) => {
        if (MetaTraderConfig.hasAccount(acc_type) && accounts_info[acc_type].account_type === 'financial') {
            $('#financial_authenticate_msg').setVisibility(!MetaTraderConfig.isAuthenticated());
        }
    };

    const setCounterpartyAndJurisdictionTooltip = ($el, acc_type) => {
        const mt_financial_company = State.getResponse('landing_company.mt_financial_company');
        const mt_gaming_company = State.getResponse('landing_company.mt_gaming_company');
        const account = accounts_info[acc_type];
        let company;

        if (/standard/.test(account.mt5_account_type)) {
            company = mt_financial_company.standard;
        } else if (/advanced/.test(account.mt5_account_type)) {
            company = mt_financial_company.advanced;
        } else if (account.account_type === 'gaming' || (account.mt5_account_type === '' && account.account_type === 'demo')) {
            company = mt_gaming_company.standard;
        }

        $el.attr({
            'data-balloon'       : `${localize('Counterparty')}: ${company.name}, ${localize('Jurisdiction')}: ${company.country}`,
            'data-balloon-length': 'large',
        });
    };

    const setDemoTopupStatus = () => {
        const el_demo_topup_btn  = getElementById('demo_topup_btn');
        const el_loading         = getElementById('demo_topup_loading');
        const acc_type           = Client.get('mt5_account');
        const is_demo            = accounts_info[acc_type].is_demo;
        const topup_btn_text     = localize('Get [_1]', `${MetaTraderConfig.getCurrency(acc_type)} 10,000.00`);

        el_loading.setVisibility(0);
        el_demo_topup_btn.firstChild.innerText = topup_btn_text;

        if (is_demo) {
            const balance     = +accounts_info[acc_type].info.balance;
            const min_balance = 1000;

            if (balance <= min_balance) {
                enableDemoTopup(true, acc_type);
            } else {
                enableDemoTopup(false, acc_type);
            }
        }
    };

    const enableDemoTopup = (is_enabled, acc_type) => {
        const el_demo_topup_btn = getElementById('demo_topup_btn');
        const el_demo_topup_info = getElementById('demo_topup_info');

        const function_to_call = is_enabled ? 'addEventListener' : 'removeEventListener';
        el_demo_topup_btn[function_to_call]('click', topup_demo);

        el_demo_topup_btn.classList.add(is_enabled ? 'button' : 'button-disabled');
        el_demo_topup_btn.classList.remove(is_enabled ? 'button-disabled' : 'button');

        el_demo_topup_info.innerText = is_enabled
            ? localize('Your demo account balance is currently [_1] or less. You may top up your account with an additional [_2].', [`${MetaTraderConfig.getCurrency(acc_type)} 1,000.00`, `${MetaTraderConfig.getCurrency(acc_type)} 10,000.00`])
            : localize('You can top up your demo account with an additional [_1] if your balance is [_2] or less.', [`${MetaTraderConfig.getCurrency(acc_type)} 10,000.00`, `${MetaTraderConfig.getCurrency(acc_type)} 1,000.00`]);
    };

    const setTopupLoading = (is_loading) => {
        const el_demo_topup_btn  = getElementById('demo_topup_btn');
        const el_demo_topup_info = getElementById('demo_topup_info');
        const el_loading         = getElementById('demo_topup_loading');

        el_demo_topup_btn.setVisibility(!is_loading);
        el_demo_topup_info.setVisibility(!is_loading);
        el_loading.setVisibility(is_loading);

        if (!is_loading) {
            setDemoTopupStatus();
        }
    };

    const showNewAccountConfirmationPopup = (e, onConfirm, onAbort) => {

        Dialog.confirm({
            id               : 'create_mt5_popup_container',
            ok_text          : localize('Yes, I\'m sure'),
            cancel_text      : localize('Cancel'),
            localized_title  : localize('Are you sure?'),
            localized_message: localize('You will not be able to change your fiat account\'s currency after creating this MT5 account. Are you sure you want to proceed?'),
            onConfirm        : () => {
                onConfirm();
                submit(e);
            },
            onAbort,
        });
    };

    return {
        init,
        setAccountType,
        loadAction,
        updateAccount,
        postValidate,
        hideFormMessage,
        displayFormMessage,
        displayMainMessage,
        displayMessage,
        displayPageError,
        disableButton,
        enableButton,
        showHideMAM,
        setTopupLoading,
        showNewAccountConfirmationPopup,

        $form   : () => $form,
        getToken: () => token,
        setToken: (verification_code) => { token = verification_code; },
    };
})();

module.exports = MetaTraderUI;
