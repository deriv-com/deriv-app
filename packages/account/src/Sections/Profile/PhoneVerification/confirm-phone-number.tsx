import React from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Button, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { Input } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

type TConfirmPhoneNumber = {
    setOtpVerification: (value: { show: boolean; phone_verification_type: string }) => void;
};

const ConfirmPhoneNumber = observer(({ setOtpVerification }: TConfirmPhoneNumber) => {
    const { client } = useStore();
    const { account_settings } = client;
    const phoneNumber = account_settings.phone || '';
    const handleSubmit = (phone_verification_type: string) => {
        setOtpVerification({ show: true, phone_verification_type });
    };

    return (
        <PhoneVerificationCard>
            <Text bold>
                <Localize i18n_default_text='Confirm your phone number' />
            </Text>
            <Input label={localize('Phone number')} value={phoneNumber} />
            <div className='phone-verification__card--buttons_container'>
                <Button variant='secondary' color='black' fullWidth size='lg' onClick={() => handleSubmit('SMS')}>
                    <Text bold>
                        <Localize i18n_default_text='Get code via SMS' />
                    </Text>
                </Button>
                <Button color='black' fullWidth size='lg' onClick={() => handleSubmit('WhatsApp')}>
                    <Text color='white' bold>
                        <Localize i18n_default_text='Get code via WhatsApp' />
                    </Text>
                </Button>
            </div>
        </PhoneVerificationCard>
    );
});

export default ConfirmPhoneNumber;
