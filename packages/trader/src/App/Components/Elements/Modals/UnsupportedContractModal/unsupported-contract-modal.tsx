import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { website_name } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

type TUnsupportedContractModalProps = {
    is_loading?: boolean;
    is_visible?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const UnsupportedContractModal = observer(
    ({ is_loading, is_visible: is_modal_visible, onConfirm, onClose }: TUnsupportedContractModalProps) => {
        const { ui } = useStore();
        const { disableApp, enableApp, is_unsupported_contract_modal_visible } = ui;
        const is_visible = !!(is_unsupported_contract_modal_visible || is_modal_visible);

        return (
            <Dialog
                title={localize('We’re working on it')}
                confirm_button_text={localize('Stay on {{website_domain}}', { website_domain: website_name })}
                cancel_button_text={localize('Go to Deriv.com')}
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
    }
);

export default UnsupportedContractModal;
