import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { customStyles } from '../../helpers';
import '../styles.scss';

type TCancelEditPaymentMethodModalProps = {
    isOpen: boolean;
    onCancel: () => void;
    onGoBack: () => void;
};

const CancelEditPaymentMethodModal = ({ isOpen, onCancel, onGoBack }: TCancelEditPaymentMethodModalProps) => {
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    // TODO: Remember to translate these strings
    return (
        <ReactModal
            contentLabel='Cancel your edits?'
            isOpen={isOpen}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <div className='p2p-v2-payment-methods-modal__wrapper'>
                <Text color='prominent' size='md' weight='bold'>
                    Cancel your edits?
                </Text>
                <Text color='prominent' size='sm' weight='normal'>
                    If you choose to cancel, the edited details will be lost.
                </Text>
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
                        {"Don't cancel"}
                    </Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default CancelEditPaymentMethodModal;
