import React from 'react';
import { ModalWrapper, WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import './CancelTransactionModal.scss';

type TCancelTransactionModal = {
    onCancel: VoidFunction;
};

const CancelTransactionModal = ({ onCancel }: TCancelTransactionModal) => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    return (
        <ModalWrapper hideCloseButton>
            <div className='crypto-transactions-cancel-modal'>
                <WalletText lineHeight={isMobile ? 'md' : 'xl'} size='md' weight='bold'>
                    Cancel transaction
                </WalletText>
                <WalletText lineHeight={isMobile ? 'sm' : 'lg'} size='sm'>
                    Are you sure you want to cancel this transaction?
                </WalletText>
                <div className='crypto-transactions-cancel-modal-buttons-container'>
                    <WalletButton
                        color='transparent'
                        onClick={hide}
                        size='lg'
                        text="No, don't cancel"
                        variant='outlined'
                    />
                    <WalletButton color='primary' onClick={onCancel} size='lg' text='Yes, cancel' />
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CancelTransactionModal;
