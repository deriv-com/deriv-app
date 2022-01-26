import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { website_name } from '@deriv/shared';

type UnsupportedContractModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_loading: boolean;
    is_visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const UnsupportedContractModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    onConfirm,
    onClose,
}: UnsupportedContractModalProps) => (
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

export default connect(({ ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
}))(UnsupportedContractModal);
