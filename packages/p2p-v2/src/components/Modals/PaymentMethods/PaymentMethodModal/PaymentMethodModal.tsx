import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Button, Text } from '@deriv-com/ui';
import { customStyles } from '../../helpers';
import '../styles.scss';

type TPaymentMethodModalProps = {
    description?: string;
    isModalOpen: boolean;
    onConfirm: () => void;
    onReject: () => void;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    title?: string;
};

const PaymentMethodModal = ({
    description,
    isModalOpen,
    onConfirm,
    onReject,
    primaryButtonLabel,
    secondaryButtonLabel,
    title,
}: TPaymentMethodModalProps) => {
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
            <div className='p2p-v2-payment-method-modal__wrapper'>
                <Text weight='bold'>{title}</Text>
                <Text>{description}</Text>
                <div className='p2p-v2-payment-method-modal__buttons'>
                    <Button
                        className='border-2'
                        color='black'
                        onClick={e => {
                            e.currentTarget.setAttribute('disabled', 'disabled');
                            onConfirm();
                        }}
                        size='lg'
                        variant='outlined'
                    >
                        <Text lineHeight='6xl' weight='bold'>
                            {secondaryButtonLabel}
                        </Text>
                    </Button>
                    <Button
                        onClick={e => {
                            e.currentTarget.setAttribute('disabled', 'disabled');
                            onReject();
                        }}
                        size='lg'
                    >
                        <Text lineHeight='6xl' weight='bold'>
                            {primaryButtonLabel}
                        </Text>
                    </Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default PaymentMethodModal;
