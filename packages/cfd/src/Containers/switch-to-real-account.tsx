import React from 'react';
import { Dialog, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TSwitchToRealAccountModal = {
    is_open: boolean;
    onClose: () => void;
    disableApp: () => void;
    enableApp: () => void;
};

const SwitchToRealAccountModal = ({ is_open, onClose, disableApp, enableApp }: TSwitchToRealAccountModal) => {
    return (
        <Dialog
            className='switch-to-real-account-modal'
            confirm_button_text={localize('Ok')}
            onConfirm={onClose}
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_open}
        >
            <Icon icon={'IcPoaLock'} size={60} />
            <Text
                className='da-icon-with-message__text'
                as='p'
                size={isMobile() ? 'xxs' : 'xs'}
                color='general'
                line_height='m'
                align='center'
            >
                {localize('Switch to your real account to create a Deriv MT5 account')}
            </Text>
        </Dialog>
    );
};

export default connect(({ ui }: RootStore) => ({
    is_open: ui.is_switch_to_deriv_account_modal_visible,
    onClose: ui.openSwitchToRealAccountModal,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
}))(SwitchToRealAccountModal);
