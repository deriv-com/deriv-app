const refreshDropdown      = require('@binary-com/binary-style').selectDropdown;
const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client');
const BinarySocket         = require('../../base/socket');
const getDecimalPlaces     = require('../../common/currency').getDecimalPlaces;
const getPaWithdrawalLimit = require('../../common/currency').getPaWithdrawalLimit;
const FormManager          = require('../../common/form_manager');
const validEmailToken      = require('../../common/form_validation').validEmailToken;
const handleVerifyCode     = require('../../common/verification_code').handleVerifyCode;
const localize             = require('../../../_common/localize').localize;
const Url                  = require('../../../_common/url');
const isBinaryApp          = require('../../../config').isBinaryApp;

const PaymentAgentWithdraw = (() => {
    const view_ids  = {
        error  : '#viewError',
        notice : '#viewNotice',
        success: '#viewSuccess',
        confirm: '#viewConfirm',
        form   : '#viewForm',
    };
    const field_ids = {
        ddl_agents: '#ddlAgents',
        txt_agents: '#txtAgents',
        txt_amount: '#txtAmount',
        txt_desc  : '#txtDescription',
    };

    let $agent_error,
        $ddl_agents,
        $txt_agents,
        $views,
        agent_name,
        currency,
        token;

    // -----------------------
    // ----- Agents List -----
    // -----------------------
    const populateAgentsList = (response) => {
        $ddl_agents = $(field_ids.ddl_agents);
        $ddl_agents.empty();
        const pa_list = (response.paymentagent_list || {}).list;
        if (pa_list.length > 0) {
            checkToken(pa_list);
        } else {
            showPageError(localize('Payment Agent services are not available in your country or in your preferred currency.'));
        }
    };

    const checkToken = (pa_list) => {
        token = token || Url.getHashValue('token');
        if (!token) {
            BinarySocket.send({ verify_email: Client.get('email'), type: 'paymentagent_withdraw' });
            if (isBinaryApp()) {
                handleVerifyCode((verification_code) => {
                    token = verification_code;
                    checkToken($ddl_agents, pa_list);
                });
            } else {
                setActiveView(view_ids.notice);
            }
        } else if (!validEmailToken(token)) {
            showPageError('token_error');
        } else {
            insertListOption($ddl_agents, localize('Select payment agent'), '');
            for (let i = 0; i < pa_list.length; i++) {
                insertListOption($ddl_agents, pa_list[i].name, pa_list[i].paymentagent_loginid);
            }
            setActiveView(view_ids.form);

            const form_id = `#${$(view_ids.form).find('form').attr('id')}`;
            const $form   = $(form_id);
            const min     = getPaWithdrawalLimit(currency, 'min');
            const max     = getPaWithdrawalLimit(currency, 'max');

            $agent_error = $('.row-agent').find('.error-msg');
            $txt_agents  = $(field_ids.txt_agents);

            $form.find('.wrapper-row-agent').find('label').append($('<span />', { text: '*', class: 'required_field_asterisk' }));
            $form.find('label[for="txtAmount"]').text(`${localize('Amount in')} ${currency}`);
            trimDescriptionContent();
            FormManager.init(form_id, [
                { selector: field_ids.txt_amount,        validations: ['req', ['number', { type: 'float', decimals: getDecimalPlaces(currency), min, max }], ['custom', { func: () => +Client.get('balance') >= +$(field_ids.txt_amount).val(), message: localize('Insufficient balance.') }]], request_field: 'amount' },
                { selector: field_ids.txt_desc,          validations: ['general'], request_field: 'description' },

                { request_field: 'currency',              value: currency },
                { request_field: 'paymentagent_loginid',  value: getPALoginID },
                { request_field: 'paymentagent_withdraw', value: 1 },
                { request_field: 'dry_run',               value: 1 },
            ], true);

            $ddl_agents.on('change', () => {
                $agent_error.setVisibility(0);
                if ($txt_agents.val()) {
                    $txt_agents.val('');
                }
                if (!$ddl_agents.val()) {
                    // error handling
                    $agent_error.setVisibility(1);
                }
            });

            $txt_agents.on('keyup', () => {
                $agent_error.setVisibility(0);
                if ($ddl_agents.val()) {
                    $ddl_agents.val('');
                    refreshDropdown(field_ids.ddl_agents);
                }
                if (!$txt_agents.val()) {
                    // error handling
                    $agent_error.setVisibility(1);
                }
            });

            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: withdrawResponse,
                fnc_additional_check: checkAgent,
                enable_button       : true,
            });
        }
    };

    const getPALoginID = () => (
        $ddl_agents.val() || $txt_agents.val()
    );

    // Remove multiline and excess whitespaces from description text.
    const trimDescriptionContent = () => {
        document.getElementById('txtDescription').addEventListener('change', e => {
            e.srcElement.value = e.target.value.replace(/\s+/g, ' ');
        });
    };

    const insertListOption = ($ddl_object, item_text, item_value) => {
        $ddl_object.append($('<option/>', { value: item_value, text: item_text }));
    };

    // ----------------------------
    // ----- Withdraw Process -----
    // ----------------------------
    const withdrawResponse = (response) => {
        const request = response.echo_req;
        switch (response.paymentagent_withdraw) {
            case 2: { // dry_run success: showing the confirmation page
                setActiveView(view_ids.confirm);

                $('#lblAgentName').text(agent_name);
                $('#lblCurrency').text(request.currency);
                $('#lblAmount').text(request.amount);

                FormManager.init(view_ids.confirm, [
                    { request_field: 'paymentagent_loginid',  value: request.paymentagent_loginid },
                    { request_field: 'amount',                value: request.amount },
                    { request_field: 'description',           value: request.description },
                    { request_field: 'currency',              value: request.currency },
                    { request_field: 'paymentagent_withdraw', value: 1 },
                ], true);

                FormManager.handleSubmit({
                    form_selector       : view_ids.confirm,
                    fnc_response_handler: withdrawResponse,
                });

                $(`${view_ids.confirm} #btnBack`).click(() => {
                    setActiveView(view_ids.form);
                });
                break;
            }
            case 1: // withdrawal success
                setActiveView(view_ids.success);
                $('#successMessage').css('display', '')
                    .attr('class', 'success-msg')
                    .html($('<ul/>', { class: 'checked' }).append($('<li/>', { text: localize('Your request to withdraw [_1] [_2] from your account [_3] to Payment Agent [_4] account has been successfully processed.', [request.currency, request.amount, Client.get('loginid'), agent_name]) })));
                break;

            default: // error
                if (response.echo_req.dry_run === 1) {
                    setActiveView(view_ids.form);
                    $('#withdrawFormMessage').setVisibility(1).html(response.error.message);
                } else if (response.error.code === 'InvalidToken') {
                    showPageError(localize('Your token has expired or is invalid. Please click [_1]here[_2] to restart the verification process.', ['<a href="javascript:;" onclick="var url = location.href.split(\'#\')[0]; window.history.replaceState({ url }, document.title, url); window.location.reload();">', '</a>']));
                } else {
                    showPageError(response.error.message);
                }
                break;
        }
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    const showPageError = (err_msg, id) => {
        const $error = $(view_ids.error);
        $error.find(' > p').setVisibility(0);
        if (id) {
            $error.find(`#${id}`).setVisibility(1);
        } else {
            $error.find('#custom-error').html(err_msg).setVisibility(1);
        }
        setActiveView(view_ids.error);
    };

    // ----- View Control -----
    const setActiveView = (view_id) => {
        $views.setVisibility(0);
        $(view_id).setVisibility(1);
    };

    const onLoad = () => {
        if (!Client.get('currency')) {
            BinaryPjax.load(`${Url.urlFor('user/set-currency')}`);
            return;
        }
        BinarySocket.wait('get_account_status').then((data) => {
            $views = $('#paymentagent_withdrawal').find('.viewItem');
            $views.setVisibility(0);

            if (/(withdrawal|cashier)_locked/.test(data.get_account_status.status)) {
                showPageError('', 'withdrawal-locked-error');
            } else {
                currency = Client.get('currency');
                if (!currency || +Client.get('balance') === 0) {
                    showPageError(localize('Please [_1]deposit[_2] to your account.', [`<a href='${`${Url.urlFor('cashier/forwardws')}?action=deposit`}'>`, '</a>']));
                    return;
                }
                BinarySocket.send({
                    paymentagent_list: Client.get('residence'),
                    currency,
                })
                    .then(response => populateAgentsList(response));
            }
        });
    };

    const checkAgent = () => {
        if (!$ddl_agents.val() && !$txt_agents.val()) {
            $agent_error.setVisibility(1);
            return false;
        }
        // else
        setAgentName();
        return true;
    };

    const setAgentName = () => {
        agent_name = $ddl_agents.val() ? $ddl_agents.find('option:selected').text() : $txt_agents.val();
    };

    const onUnload = () => {
        token = '';
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = PaymentAgentWithdraw;
