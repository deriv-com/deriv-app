import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const WarningScamMessageTitle = () => (
    <div className='warning-scam-message--content__title'>
        <Text size='m' weight='bold'>
            <Localize i18n_default_text='Beware of fake links.' />
        </Text>
        <Text>
            <Localize i18n_default_text='A link can contain the word "Deriv" and still be fake.' />
        </Text>
    </div>
);

export default WarningScamMessageTitle;
