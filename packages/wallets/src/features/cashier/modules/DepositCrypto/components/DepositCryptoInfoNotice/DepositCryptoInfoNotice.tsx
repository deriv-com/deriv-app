import React from 'react';
import { Localize } from '@deriv-com/translations';
import { SectionMessage, Text } from '@deriv-com/ui';

const DepositCryptoInfoNotice = () => {
    return (
        <SectionMessage title={<Localize i18n_default_text='Important:' />} variant='info'>
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Verify the address on this page before each deposit to avoid losing funds. Occasionally, the address could be updated.' />
            </Text>
        </SectionMessage>
    );
};

export default DepositCryptoInfoNotice;
