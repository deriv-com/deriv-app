import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { customStyles } from '../../helpers';

type TCancelAddPaymentMethodModalProps = {
    isOpen: boolean;
    onCancel: () => void;
    onGoBack: () => void;
};

const CancelAddPaymentMethodModal = ({ isOpen, onCancel, onGoBack }: TCancelAddPaymentMethodModalProps) => {
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    // TODO: Remember to translate these strings
    return (
        <ReactModal
            contentLabel='Cancel adding this payment method?'
            isOpen={isOpen}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <div className='p2p-v2-payment-methods-modal__wrapper'>
                <Text color='prominent' weight='bold'>
                    Cancel adding this payment method?
                </Text>
                <Text color='prominent'>If you choose to cancel, the details you’ve entered will be lost.</Text>
                <div className='p2p-v2-payment-methods-modal__buttons'>
                    <Button
                        className='p2p-v2-payment-methods-modal__buttons--cancel'
                        onClick={onCancel}
                        size='lg'
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button onClick={onGoBack} size='lg'>
                        Go back
                    </Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default CancelAddPaymentMethodModal;
