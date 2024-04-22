import React from 'react';
import './phone-verification.scss';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import ConfirmPhoneNumber from './confirm-phone-number';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';
import ConfirmYourEmail from './confirm-your-email';

const PhoneVerificationPage = () => {
    const [show_email_verification, should_show_email_verification] = React.useState(true);
    const history = useHistory();
    const handleBackButton = () => {
        history.push(routes.personal_details);
    };

    return (
        <div>
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
