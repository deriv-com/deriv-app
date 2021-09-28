import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Dialog } from '@deriv/components';
import { connect } from 'Stores/connect';

const ErrorDialog = ({ verification_code, requestWithdraw, error_message, setShouldShow, should_show }) => {
    return (
        <Dialog
            className='acc-prompt-dialog'
            title={localize('Error')}
            confirm_button_text={localize('Retry')}
            onConfirm={() => setShouldShow(false)}
            is_visible={should_show}
            requestWithdraw={requestWithdraw}
            verification_code={verification_code}
            has_close_icon
        >
            {error_message}
        </Dialog>
    );
};

ErrorDialog.propTypes = {
    error_message: PropTypes.string,
    setShouldShow: PropTypes.func,
    should_show: PropTypes.bool,
    requestWithdraw: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    error_message: modules.cashier.error_dialog.error_message,
    setShouldShow: modules.cashier.error_dialog.setShouldShow,
    should_show: modules.cashier.error_dialog.should_show,
    requestWithdraw: modules.cashier.requestWithdraw,
    verification_code: client.verification_code.payment_withdraw,
}))(ErrorDialog);
