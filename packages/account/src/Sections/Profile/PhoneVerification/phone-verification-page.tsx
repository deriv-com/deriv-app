import React from 'react';
import './phone-verification.scss';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import ConfirmPhoneNumber from './confirm-phone-number';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';
import ConfirmYourEmail from './confirm-your-email';
import { Modal } from '@deriv/components';

const PhoneVerificationPage = () => {
    const [show_email_verification, shouldShowEmailVerification] = React.useState(true);
    const [show_cancel_verification_modal, setShowCancelVerificationModal] = React.useState(true);
    const history = useHistory();
    const handleBackButton = () => {
        setShowCancelVerificationModal(true);
        // history.push(routes.personal_details);
    };

    return (
        <div>
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
                        <Button color='black' fullWidth size='lg'>
                            <Text color='white' bold>
                                <Localize i18n_default_text='Go back' />
                            </Text>
                        </Button>
                        <Button
                            variant='secondary'
                            color='black'
                            fullWidth
                            size='lg'
                            onClick={() => setShowCancelVerificationModal(false)}
                        >
                            <Text bold>
                                <Localize i18n_default_text='Yes, cancel' />
                            </Text>
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <div className='phone-verification__redirect_button'>
                <LabelPairedArrowLeftCaptionFillIcon
                    width={24}
                    height={24}
                    className='phone-verification__redirect_button--icon'
                    onClick={handleBackButton}
                />
                <Text className='phone-verification__redirect_button--text' bold>
                    <Localize i18n_default_text='Phone number verification' />
                </Text>
            </div>
            {show_email_verification ? <ConfirmYourEmail /> : <ConfirmPhoneNumber />}
        </div>
    );
};

export default PhoneVerificationPage;
