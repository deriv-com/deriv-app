import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

export const SameDOBPhoneModalContent = () => {
    return (
        <div className='same-dob-phone-modal__content'>
            <Icon icon='IcAccountError' size={96} />
            <Text as='h1' align='center' weight='bold'>
                <Localize i18n_default_text='Account already exists' />
            </Text>
            <Text align='center' size='xs'>
                <Localize
                    i18n_default_text="Your details match an existing account. You can't <0/>make deposits or trade with a new account. <0/>Need help? Reach out via live chat."
                    components={[<br key={0} />]}
                />
            </Text>
        </div>
    );
};
