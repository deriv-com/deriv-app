const PaymentAgentTransferUI = require('./payment_agent_transfer.ui');
const Client                 = require('../../../../base/client');
const BinarySocket           = require('../../../../base/socket');
const getDecimalPlaces       = require('../../../../common/currency').getDecimalPlaces;
const FormManager            = require('../../../../common/form_manager');
const localize               = require('../../../../../_common/localize').localize;
const State                  = require('../../../../../_common/storage').State;

const PaymentAgentTransfer = (() => {
    let is_authenticated_payment_agent,
        common_request_fields,
        $form_error;

    const onLoad = () => {
        PaymentAgentTransferUI.initValues();
        BinarySocket.wait('get_settings', 'balance').then(() => {
            const currency = Client.get('currency');
            if (!currency || +Client.get('balance') === 0) {
                $('#pa_transfer_loading').remove();
                $('#no_balance_error').setVisibility(1);
                return;
            }
            is_authenticated_payment_agent = State.getResponse('get_settings.is_authenticated_payment_agent');
            if (is_authenticated_payment_agent) {
                BinarySocket.send({
                    paymentagent_list: Client.get('residence'),
                    currency,
                }).then((response) => {
                    const pa_values = response.paymentagent_list.list.filter(
                        (a) => a.paymentagent_loginid === Client.get('loginid')
                    )[0];
                    init(pa_values, currency);
                });
            } else {
                setFormVisibility(false);
            }
        });
    };

    // Remove multiline and excess whitespaces from description text.
    const trimDescriptionContent = () => {
        document.getElementById('description').addEventListener('change', e => {
            e.srcElement.value = e.target.value.replace(/\s+/g, ' ');
        });
    };

    const init = (pa, currency) => {
        const form_id = '#frm_paymentagent_transfer';
        $form_error = $('#form_error');

        setFormVisibility(true);
        PaymentAgentTransferUI.updateFormView(currency);
        trimDescriptionContent();

        common_request_fields = [
            { request_field: 'paymentagent_transfer', value: 1 },
            { request_field: 'currency',              value: currency },
        ];

        FormManager.init(form_id, [
            { selector: '#client_id', validations: ['req', ['regular', { regex: /^\w+\d+$/, message: localize('Please enter a valid Login ID.') }]], request_field: 'transfer_to' },
            { selector: '#amount',    validations: ['req', ['number', { type: 'float', decimals: getDecimalPlaces(currency), min: pa ? pa.min_withdrawal : 10, max: pa ? pa.max_withdrawal : 2000 }], ['custom', { func: () => +Client.get('balance') >= +$('#amount').val(), message: localize('Insufficient balance.') }]] },
            { selector: '#description', validations: ['general'] },

            { request_field: 'dry_run', value: 1 },
        ].concat(common_request_fields));

        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: responseHandler,
            enable_button       : 1,
        });
    };

    const setFormVisibility = (is_visible) => {
        if (is_visible) {
            $('#pa_transfer_loading').remove();
            PaymentAgentTransferUI.showForm();
            PaymentAgentTransferUI.showNotes();
        } else {
            PaymentAgentTransferUI.hideForm();
            PaymentAgentTransferUI.hideNotes();
            if (!is_authenticated_payment_agent) {
                $('#pa_transfer_loading').remove();
                $('#not_pa_error').setVisibility(1);
            }
        }
    };

    const responseHandler = (response) => {
        const req   = response.echo_req;
        const error = response.error;

        if (error) {
            if (req.dry_run === 1) {
                $form_error.text(error.message).setVisibility(1);
                return;
            }
            PaymentAgentTransferUI.showTransferError(error.message);
            return;
        }

        if (response.paymentagent_transfer === 2) {
            PaymentAgentTransferUI.hideFirstForm();
            PaymentAgentTransferUI.showConfirmation();
            PaymentAgentTransferUI.updateConfirmView(response.client_to_full_name, req.transfer_to.toUpperCase(),
                req.amount, req.currency);
            initConfirm(req);
            return;
        }

        if (response.paymentagent_transfer === 1) {
            PaymentAgentTransferUI.hideFirstForm();
            PaymentAgentTransferUI.showDone();
            PaymentAgentTransferUI.updateDoneView(Client.get('loginid'), req.transfer_to.toUpperCase(), req.amount, req.currency);
        }
    };

    const initConfirm = (req) => {
        const confirm_form_id = '#frm_confirm_transfer';

        FormManager.init(confirm_form_id, [
            { request_field: 'transfer_to', value: req.transfer_to },
            { request_field: 'amount',      value: req.amount },
            { request_field: 'description', value: req.description },
        ].concat(common_request_fields));

        FormManager.handleSubmit({
            form_selector       : confirm_form_id,
            fnc_response_handler: responseHandler,
        });

        $('#back_transfer').off('click').click(() => {
            PaymentAgentTransferUI.showForm();
            PaymentAgentTransferUI.showNotes();
            PaymentAgentTransferUI.hideConfirmation();
            PaymentAgentTransferUI.hideDone();
            $form_error.setVisibility(0);
        });
    };

    return {
        onLoad,
    };
})();

module.exports = PaymentAgentTransfer;
