import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MT5AccountNeededModal = ({
    is_open,
    account_needed_modal_props: { target, target_label, target_dmt5_label },
    onClose,
    disableApp,
    enableApp,
    openRealAccountSignup,
}) => {
    const createAccount = () => {
        onClose();
        openRealAccountSignup(target);
    };

    return (
        <Dialog
            title={localize('You’ll need a {{deriv_account}} account', {
                deriv_account: target_label,
            })}
            confirm_button_text={localize('Add {{deriv_account}} account', {
                deriv_account: target_label,
            })}
            onConfirm={createAccount}
            cancel_button_text={localize('Cancel')}
            onCancel={onClose}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_open}
        >
            <Localize
                i18n_default_text='Please add a {{deriv_account}} account first before adding a {{dmt5_account}} account. Deposits and withdrawals for your DMT5 account are done by transferring funds to and from your Deriv account.'
                values={{
                    deriv_account: target_label,
                    dmt5_account: target_dmt5_label,
                }}
            />
        </Dialog>
    );
};

MT5AccountNeededModal.propTypes = {
    is_open: PropTypes.bool,
    required_account: PropTypes.object,
    onClose: PropTypes.func,
};

export default connect(({ ui }) => ({
    is_open: ui.is_account_needed_modal_on,
    account_needed_modal_props: ui.account_needed_modal_props,
    onClose: ui.closeAccountNeededModal,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    openRealAccountSignup: ui.openRealAccountSignup,
}))(MT5AccountNeededModal);
