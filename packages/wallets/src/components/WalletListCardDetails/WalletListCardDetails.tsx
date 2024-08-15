import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import { WalletListCardBalance } from '../WalletListCardBalance';
import WalletListCardDropdown from '../WalletListCardDropdown/WalletListCardDropdown';
import './WalletListCardDetails.scss';

const WalletListCardDetails = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const [isDemo, setIsDemo] = useState<boolean>(activeWallet?.is_virtual ?? false);

    useEffect(() => {
        // update isDemo only when receiving a new defined is_virtual value
        // ignore intermediate undefined state when fetching / loading
        if (typeof activeWallet?.is_virtual === 'boolean') {
            setIsDemo(activeWallet.is_virtual);
        }
    }, [activeWallet?.is_virtual]);

    return (
        <div className='wallets-list-details__container'>
            {isDemo ? (
                <Text>
                    <Localize i18n_default_text='USD Demo Wallet' />
                </Text>
            ) : (
                <WalletListCardDropdown />
            )}
            <div className='wallets-list-details__content'>
                <WalletListCardBalance />
                <WalletListCardActions />
            </div>
        </div>
    );
};

export default WalletListCardDetails;
