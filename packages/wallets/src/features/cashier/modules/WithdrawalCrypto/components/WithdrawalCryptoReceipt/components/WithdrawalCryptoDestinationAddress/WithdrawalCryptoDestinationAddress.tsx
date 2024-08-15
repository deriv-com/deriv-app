import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletClipboard } from '../../../../../../../../components';
import './WithdrawalCryptoDestinationAddress.scss';

const WithdrawalCryptoDestinationAddress: React.FC<{ address?: string }> = ({ address }) => {
    return (
        <div className='wallets-withdrawal-crypto-destination-address'>
            <div className='wallets-withdrawal-crypto-destination-address__title'>
                <Text color='less-prominent' size='2xs'>
                    <Localize i18n_default_text='Destination address' />
                </Text>
            </div>
            <div className='wallets-withdrawal-crypto-destination-address__content'>
                <Text size='sm' weight='bold'>
                    {address}
                </Text>
                <WalletClipboard textCopy={address ?? ''} />
            </div>
        </div>
    );
};

export default WithdrawalCryptoDestinationAddress;
