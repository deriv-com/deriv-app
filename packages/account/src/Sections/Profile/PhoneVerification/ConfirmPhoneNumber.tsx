import React from 'react';
import PhoneVerificationCard from './PhoneVerificationCard';
import { Button, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { Input } from '@deriv/components';
import { useSettings } from '@deriv/api';

const ConfirmPhoneNumber = () => {
    const { data: accountSettings } = useSettings();

    const phoneNumber = accountSettings.phone || '';
    return (
        <PhoneVerificationCard>
            <Text bold>
                <Localize i18n_default_text='Confirm your phone number' />
            </Text>
            <Input label={localize('Phone number')} disabled value={phoneNumber} />
            <div className='phone-verification__card--buttons_container'>
                <Button variant='secondary' color='black' fullWidth>
                    <Text bold>
                        <Localize i18n_default_text='Get code via SMS' />
                    </Text>
                </Button>
                <Button color='black' fullWidth>
                    <Text color='white' bold>
                        <Localize i18n_default_text='Get code via WhatsApp' />
                    </Text>
                </Button>
            </div>
        </PhoneVerificationCard>
    );
};

export default ConfirmPhoneNumber;
