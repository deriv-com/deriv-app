const localize = require('../../../../../_common/localize').localize;

const PaymentAgentTransferUI = (() => {
    let $paymentagent_transfer,
        $confirm_transfer,
        $done_transfer,
        $notes_transfer;

    const initValues = () => {
        $paymentagent_transfer = $('#frm_paymentagent_transfer');
        $confirm_transfer      = $('#frm_confirm_transfer');
        $done_transfer         = $('#pa_transfer_done');
        $notes_transfer        = $('#paymentagent_transfer_notes');
    };

    const hideForm = () => { $paymentagent_transfer.setVisibility(0); };

    const showForm = () => { $paymentagent_transfer.setVisibility(1); };

    const hideConfirmation = () => { $confirm_transfer.setVisibility(0); };

    const showConfirmation = () => { $confirm_transfer.find('#msg_form').setVisibility(0).end().setVisibility(1); };

    const hideDone = () => { $done_transfer.setVisibility(0); };

    const showDone = () => { $done_transfer.setVisibility(1); };

    const hideNotes = () => { $notes_transfer.setVisibility(0); };

    const showNotes = () => { $notes_transfer.setVisibility(1); };

    const showTransferError = (err) => { $confirm_transfer.find('#msg_form').text(err).setVisibility(1); };

    const updateFormView = (currency) => { $paymentagent_transfer.find('label[for="amount"]').text(`${localize('Amount')} ${currency}`); };

    const updateConfirmView = (username, loginid, amount, currency) => {
        $confirm_transfer
            .find('#user_name')
            .empty()
            .text(username)
            .end()
            .find('#loginid')
            .empty()
            .text(loginid)
            .end()
            .find('#confirm_amount')
            .empty()
            .text(`${currency} ${amount}`);
    };

    const updateDoneView = (from_id, to_id, amount, currency) => {
        const confirm_msg     = localize('Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.', [
            amount,
            currency,
            from_id,
            to_id,
        ]);
        $done_transfer.find(' > #confirm_msg').text(confirm_msg).setVisibility(1);
    };

    const hideFirstForm = () => {
        hideForm();
        hideConfirmation();
        hideNotes();
    };

    return {
        initValues,
        hideForm,
        showForm,
        hideConfirmation,
        showConfirmation,
        hideDone,
        showDone,
        hideNotes,
        showNotes,
        showTransferError,
        updateFormView,
        updateConfirmView,
        updateDoneView,
        hideFirstForm,
    };
})();

module.exports = PaymentAgentTransferUI;
