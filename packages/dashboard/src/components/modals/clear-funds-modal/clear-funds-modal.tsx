import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useStores } from 'Stores';

const ClearFundsModal: React.FC = () => {
    const { ui_store } = useStores();
    const { is_clear_funds_modal_open, toggleClearFundsModal } = ui_store;

    const closeModal = () => {
        toggleClearFundsModal();
    };

    return (
        <Modal
            className='dw-clear-funds-modal'
            is_open={is_clear_funds_modal_open}
            should_header_stick_body={false}
            small
            title={localize('Please clear your funds in all wallets')}
            toggleModal={closeModal}
        >
            <div className='dw-clear-funds-modal__body'>
                <Icon className='dw-clear-funds-modal__body-icon' icon='IcWalletClearFunds' size={128} />
                <Text className='dw-clear-funds-modal__body-text' size={isMobile() ? 'xxs' : 'xs'} align='center'>
                    {localize(
                        'Please clear your funds in all wallets by transferring into apps or withdraw before changing back to the current version of Deriv.'
                    )}
                </Text>
            </div>
            <Modal.Footer className='dw-clear-funds-modal__footer'>
                <Button onClick={closeModal} has_effect text={localize('Close')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(ClearFundsModal);
