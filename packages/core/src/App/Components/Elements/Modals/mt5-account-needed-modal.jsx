import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MT5AccountNeededModal = ({
    is_eu,
    is_open,
    account_needed_modal_props: { target, target_label, target_dmt5_label },
    onClose,
    disableApp,
    enableApp,
    openRealAccountSignup,
}) => {
    const dmt5_label = is_eu ? localize('CFDs') : localize('Deriv MT5');
    const deriv_label = is_eu ? localize('Deriv Multipliers') : localize('Deriv');

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
                i18n_default_text='Please add a {{deriv_account}} account first before adding a {{dmt5_account}} account. Deposits and withdrawals for your {{dmt5_label}} account are done by transferring funds to and from your {{deriv_label}} account.'
                values={{
                    deriv_account: target_label,
                    dmt5_account: target_dmt5_label,
                    dmt5_label,
                    deriv_label,
                }}
            />
        </Dialog>
    );
};

MT5AccountNeededModal.propTypes = {
    account_needed_modal_props: PropTypes.shape({
        target: PropTypes.string,
        target_label: PropTypes.string,
        target_dmt5_label: PropTypes.string,
    }),
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_eu: PropTypes.bool,
    is_open: PropTypes.bool,
    onClose: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
    required_account: PropTypes.object,
};

export default connect(({ client, ui }) => ({
    is_open: ui.is_account_needed_modal_on,
    account_needed_modal_props: ui.account_needed_modal_props,
    onClose: ui.closeAccountNeededModal,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    openRealAccountSignup: ui.openRealAccountSignup,
    is_eu: client.is_eu,
}))(MT5AccountNeededModal);
