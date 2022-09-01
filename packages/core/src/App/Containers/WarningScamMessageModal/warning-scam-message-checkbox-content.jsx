import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const WarningScamMessageCheckbox = ({ understandMessage }) => (
    <div className='warning-scam-message__checkbox-container'>
        <input
            type='checkbox'
            className='warning-scam-message__checkbox-container--checkbox'
            onChange={understandMessage}
        />
        <Text size='xxs'>
            <Localize i18n_default_text="I've read the above carefully." />
        </Text>
    </div>
);

export default WarningScamMessageCheckbox;
