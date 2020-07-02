import PropTypes from 'prop-types';
import { Dialog } from '@deriv/components';
import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MT5AccountNeededModal = ({
    is_open,
    required_account: { target, target_label, target_dmt5_label },
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
            title={localize('{{deriv_account}} account required', {
                deriv_account: target_label,
            })}
            confirm_button_text={localize('Add {{deriv_account}} account', {
                deriv_account: target_label,
            })}
            onConfirm={createAccount}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={is_open}
        >
            <Localize
                i18n_default_text='{{deriv_account}} is required to have a {{dmt5_account}}'
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
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    openRealAccountSignup: ui.openRealAccountSignup,
}))(MT5AccountNeededModal);
