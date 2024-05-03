import React from 'react';
import './phone-verification.scss';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import ConfirmPhoneNumber from './confirm-phone-number';
import ConfirmYourEmail from './confirm-your-email';
import CancelPhoneVerificationModal from './cancel-phone-verification-modal';

const PhoneVerificationPage = () => {
    const [show_email_verification, shouldShowEmailVerification] = React.useState(true);
    const [should_show_cancel_verification_modal, setShouldShowCancelVerificationModal] = React.useState(false);
    const handleBackButton = () => {
        setShouldShowCancelVerificationModal(true);
    };

    return (
        <div>
            <CancelPhoneVerificationModal
                should_show_cancel_verification_modal={should_show_cancel_verification_modal}
                setShouldShowCancelVerificationModal={setShouldShowCancelVerificationModal}
            />
            <div className='phone-verification__redirect_button'>
                <LabelPairedArrowLeftCaptionFillIcon
                    width={24}
                    height={24}
                    data-testid='dt-phone-verification-back-btn'
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
