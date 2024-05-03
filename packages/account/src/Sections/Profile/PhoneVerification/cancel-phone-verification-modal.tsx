import { Button, Text } from '@deriv-com/quill-ui';
import { Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import React from 'react';

type TCancelPhoneVerificationModal = {
    show_cancel_verification_modal: boolean;
    setShowCancelVerificationModal: (value: boolean) => void;
};

const CancelPhoneVerificationModal = ({
    show_cancel_verification_modal,
    setShowCancelVerificationModal,
}: TCancelPhoneVerificationModal) => {
    const history = useHistory();
    const handleCancelButton = () => {
        setShowCancelVerificationModal(false);
        history.goBack();
    };

    return (
        <Modal className='phone-verification__cancel-modal' is_open={show_cancel_verification_modal}>
            <Modal.Body>
                <div className='phone-verification__cancel-modal--contents'>
                    <Text bold>
                        <Localize i18n_default_text='Cancel phone number verification?' />
                    </Text>
                    <Text>
                        <Localize i18n_default_text='All details entered will be lost.' />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='phone-verification__cancel-modal--buttons'>
                    <Button color='black' fullWidth size='lg' onClick={() => setShowCancelVerificationModal(false)}>
                        <Text color='white' bold>
                            <Localize i18n_default_text='Go back' />
                        </Text>
                    </Button>
                    <Button variant='secondary' color='black' fullWidth size='lg' onClick={handleCancelButton}>
                        <Text bold>
                            <Localize i18n_default_text='Yes, cancel' />
                        </Text>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelPhoneVerificationModal;
