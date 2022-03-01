import * as React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '../i18next';

const UnsupportedAccount = () => {
    return (
        <Text as='h1' align='center' size='xs' className='dp2p-unsupported-account'>
            <Localize i18n_default_text='This feature is only available for real-money USD accounts right now.' />
        </Text>
    );
};

export default UnsupportedAccount;
