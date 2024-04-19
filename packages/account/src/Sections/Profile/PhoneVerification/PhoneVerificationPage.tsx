import React from 'react';
import './phoneVerification.scss';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import ConfirmPhoneNumber from './ConfirmPhoneNumber';

type TPhoneVerificationPage = {
    setShowPhoneVerificationPage: (value: boolean) => void;
};

const PhoneVerificationPage = ({ setShowPhoneVerificationPage }: TPhoneVerificationPage) => {
    return (
        <div>
            <div className='phone-verification__redirect_button'>
                <LabelPairedArrowLeftCaptionFillIcon
                    width={24}
                    height={24}
                    className='phone-verification__redirect_button--icon'
                    onClick={() => setShowPhoneVerificationPage(false)}
                />
                <Text className='phone-verification__redirect_button--text' bold>
                    <Localize i18n_default_text='Phone number verification' />
                </Text>
            </div>
            <ConfirmPhoneNumber />
        </div>
    );
};

export default PhoneVerificationPage;
