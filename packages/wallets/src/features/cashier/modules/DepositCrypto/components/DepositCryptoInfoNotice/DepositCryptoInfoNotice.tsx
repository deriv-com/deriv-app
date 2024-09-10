import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { SectionMessage, Text } from '@deriv-com/ui';

const DepositCryptoInfoNotice = () => {
    const { data: activeWallet } = useActiveWalletAccount();

    if (activeWallet?.currency !== 'tUSDT') return null;

    return (
        <SectionMessage title={<Localize i18n_default_text='Important:' />} variant='info'>
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Verify the address on this page before each deposit to avoid losing funds.' />
            </Text>
        </SectionMessage>
    );
};

export default DepositCryptoInfoNotice;
