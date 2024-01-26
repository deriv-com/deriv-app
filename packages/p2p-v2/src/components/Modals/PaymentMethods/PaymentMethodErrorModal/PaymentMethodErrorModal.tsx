import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { customStyles } from '../../helpers';
import './PaymentMethodErrorModal.scss';
import '../styles.scss';

type TPaymentMethodErrorModalProps = {
    errorMessage: string;
    isModalOpen: boolean;
    onConfirm: () => void;
    title: string;
};

const PaymentMethodErrorModal = ({ errorMessage, isModalOpen, onConfirm, title }: TPaymentMethodErrorModalProps) => {
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    // TODO: Remember to translate these strings
    return (
        <ReactModal
            className='p2p-v2-payment-method-modal__modal'
            contentLabel={title}
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <div className='p2p-v2-payment-method-error-modal__wrapper'>
                <Text color='prominent' weight='bold'>
                    {title}
                </Text>
                <Text color='prominent'>{errorMessage}</Text>
                <div className='p2p-v2-payment-method-error-modal__buttons'>
                    <Button onClick={onConfirm} size='lg'>
                        Ok
                    </Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default PaymentMethodErrorModal;
