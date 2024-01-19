import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { customStyles } from '../../helpers';
import './AddEditPaymentMethodErrorModal.scss';

type TAddEditPaymentMethodErrorModalProps = {
    errorMessage: string;
    isOpen: boolean;
    onComfirm: () => void;
};

const AddEditPaymentMethodErrorModal = ({ errorMessage, isOpen, onComfirm }: TAddEditPaymentMethodErrorModalProps) => {
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    // TODO: Remember to translate these strings
    return (
        <ReactModal
            contentLabel="Something's not right"
            isOpen={isOpen}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <div className='p2p-v2-add-edit-payment-methods-modal__wrapper'>
                <Text color='prominent' weight='bold'>
                    {"Something's not right"}
                </Text>
                <Text color='prominent'>{errorMessage}</Text>
                <div className='p2p-v2-add-edit-payment-methods-modal__buttons'>
                    <Button onClick={onComfirm} size='lg'>
                        Ok
                    </Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default AddEditPaymentMethodErrorModal;
