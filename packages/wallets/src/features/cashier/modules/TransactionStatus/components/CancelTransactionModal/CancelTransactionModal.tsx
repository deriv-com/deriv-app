import React, { useCallback } from 'react';
import { useCancelTransaction } from '@deriv/api';
import { ModalWrapper, WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import { THooks } from '../../../../../../types';
import './CancelTransactionModal.scss';

type TCancelTransactionModal = {
    transactionId: THooks.CryptoTransactions['id'];
};

const CancelTransactionModal: React.FC<TCancelTransactionModal> = ({ transactionId }) => {
    const { mutate } = useCancelTransaction();
    const { hide } = useModal();
    const { isMobile } = useDevice();

    const onCancel = useCallback(() => {
        mutate({ id: transactionId });
        hide();
    }, [hide, mutate, transactionId]);

    return (
        <ModalWrapper hideCloseButton>
            <div className='crypto-transactions-cancel-modal'>
                <WalletText lineHeight={isMobile ? 'md' : 'xl'} weight='bold'>
                    Cancel transaction
                </WalletText>
                <WalletText lineHeight={isMobile ? 'sm' : 'lg'} size='sm'>
                    Are you sure you want to cancel this transaction?
                </WalletText>
                <div className='crypto-transactions-cancel-modal__buttons-container'>
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
