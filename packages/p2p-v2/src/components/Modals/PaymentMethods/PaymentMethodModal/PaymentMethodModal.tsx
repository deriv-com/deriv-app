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
                <Text color='prominent' weight='bold'>
                    {title}
                </Text>
                <Text color='prominent'>{description}</Text>
                <div className='p2p-v2-payment-method-modal__buttons'>
                    <Button
                        className='p2p-v2-payment-method-modal__buttons--cancel'
                        onClick={e => {
                            e.currentTarget.setAttribute('disabled', 'disabled');
                            onConfirm();
                        }}
                        size='lg'
                        variant='outlined'
                    >
                        {secondaryButtonLabel}
                    </Button>
                    <Button
                        onClick={e => {
                            e.currentTarget.setAttribute('disabled', 'disabled');
                            onReject();
                        }}
                        size='lg'
                    >
                        {primaryButtonLabel}
                    </Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default PaymentMethodModal;
