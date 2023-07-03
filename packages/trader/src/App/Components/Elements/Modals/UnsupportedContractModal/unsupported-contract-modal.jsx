import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { website_name } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const UnsupportedContractModal = observer(({ onConfirm, onClose }) => {
    const { ui } = useStore();
    const { disableApp, enableApp, is_loading, is_unsupported_contract_modal_visible: is_visible } = ui;

    return (
        <Dialog
            title={localize('We’re working on it')}
            confirm_button_text={localize('Stay on {{website_domain}}', { website_domain: website_name })}
            cancel_button_text={localize('Go to Binary.com')}
            onConfirm={onConfirm}
            onCancel={onClose}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
            is_closed_on_cancel
            is_visible={is_visible}
        >
            <Localize i18n_default_text='You’ve selected a trade type that is currently unsupported, but we’re working on it.' />
        </Dialog>
    );
});

UnsupportedContractModal.propTypes = {
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
};

export default UnsupportedContractModal;
