import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { FiatOnRampModule } from '../../modules';

const WalletFiatOnRamp = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const history = useHistory();
    const isOnrampAvailable = activeWallet?.currency_config && activeWallet.currency_config.platform.ramp.length > 0;

    useEffect(() => {
        if (!isOnrampAvailable) {
            history.push('/wallet/deposit');
        }
    }, [history, isOnrampAvailable]);

    return <FiatOnRampModule />;
};

export default WalletFiatOnRamp;
