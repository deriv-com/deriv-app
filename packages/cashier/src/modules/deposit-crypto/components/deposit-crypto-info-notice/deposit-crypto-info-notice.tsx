import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { SectionMessage } from '@deriv-com/ui';

const DepositCryptoInfoNotice: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;

    if (currency !== 'tUSDT') return null;

    return (
        <SectionMessage title={<Localize i18n_default_text='Important:' />} variant='info'>
            <Text size='xs'>
                <Localize i18n_default_text='Verify the address on this page before each deposit to avoid losing funds.' />
            </Text>
        </SectionMessage>
    );
});

export default DepositCryptoInfoNotice;
