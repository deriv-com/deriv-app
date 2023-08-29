import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import WalletCFDCard from 'Components/wallet-cfd-card';
import './cfd-wallet-success-dialog.scss';

type TCFDWalletSuccessDialog = {
    is_open: boolean;
    toggleModal?: () => void;
    onSubmit?: () => void;
};

const CFDWalletSuccessDialog = observer(({ is_open, toggleModal, onSubmit }: TCFDWalletSuccessDialog) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <Modal
            className='cfd-wallet-dialog'
            has_close_icon={false}
            is_open={is_open}
            shouldCloseOnEscape={false}
            small
            toggleModal={toggleModal}
            width={is_mobile ? '298px' : '392px'}
        >
            <Modal.Body>
                <div className='cfd-wallet-dialog__card'>
                    <WalletCFDCard />
                </div>
                <div className='cfd-wallet-dialog__wrapper-text'>
                    <Text as='h2' weight='bold' align='center' size={is_mobile ? 'xs' : 's'}>
                        {localize('Your MT5 CFDs demo account is ready')}
                    </Text>
                    <Text as='p' size={is_mobile ? 'xxs' : 'xs'} line_height='s' align='center'>
                        {localize('You can now start practicing trading with your MT5 CFDs demo account.')}
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='cfd-wallet-dialog__btn' primary onClick={onSubmit} large>
                    {localize('Continue')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CFDWalletSuccessDialog;
