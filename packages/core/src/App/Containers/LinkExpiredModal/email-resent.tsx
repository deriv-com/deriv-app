import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const EmailResent = () => {
    return (
        <div className='link-expired__spaced-container__content link-expired__spaced-container__email_sent'>
            <Icon data_testid='dt_email-resent' icon='IcEmailVerificationResent' size={128} />
            <Text as='p' size='s' align='center'>
                <Localize i18n_default_text="<0>We've sent you an email.</0>" components={[<strong key={0} />]} />
            </Text>
            <Text as='p' size='s' align='center'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </Text>
        </div>
    );
};

export default EmailResent;
