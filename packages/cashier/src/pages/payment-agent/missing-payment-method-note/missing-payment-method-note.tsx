import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './missing-payment-method-note.scss';

const MissingPaymentMethodNote = () => {
    return (
        <div className='missing-payment-method-note'>
            <Text as='p' className='missing-payment-method-note__title' size='xs' lh='m' weight='bold'>
                <Localize i18n_default_text='Note' />
            </Text>
            <Text as='p' size='xxs' lh='s'>
                <Localize i18n_default_text='Some payment methods may not be listed here but payment agents may still offer them. If you can’t find your favourite method, contact the payment agents directly to check further.' />
            </Text>
        </div>
    );
};

export default MissingPaymentMethodNote;
