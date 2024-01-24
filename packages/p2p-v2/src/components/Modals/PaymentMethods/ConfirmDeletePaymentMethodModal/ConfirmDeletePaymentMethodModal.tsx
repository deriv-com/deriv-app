import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { customStyles } from '../../helpers';
import '../styles.scss';

type TConfirmDeletePaymentMethodModalProps = {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    paymentMethodName?: string;
};

const ConfirmDeletePaymentMethodModal = ({
    isOpen,
    onCancel,
    onConfirm,
    paymentMethodName,
}: TConfirmDeletePaymentMethodModalProps) => {
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    // TODO: Remember to translate these strings
    return (
        <ReactModal
            className='p2p-v2-payment-methods-modal__modal'
            contentLabel={`Delete ${paymentMethodName}?`}
            isOpen={isOpen}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <div className='p2p-v2-payment-methods-modal__wrapper'>
                <Text color='prominent' weight='bold'>
                    {`Delete ${paymentMethodName}?`}
                </Text>
                <Text color='prominent' size='sm'>
                    Are you sure you want to remove this payment method?
                </Text>
                <div className='p2p-v2-payment-methods-modal__buttons'>
                    <Button
                        className='p2p-v2-payment-methods-modal__buttons--cancel'
                        onClick={e => {
                            e.currentTarget.setAttribute('disabled', 'disabled');
                            onConfirm();
                        }}
                        size='lg'
                        variant='outlined'
                    >
                        Yes, remove
                    </Button>
                    <Button onClick={onCancel} size='lg'>
                        No
                    </Button>
                </div>
            </div>
        </ReactModal>
    );
};
export default ConfirmDeletePaymentMethodModal;
