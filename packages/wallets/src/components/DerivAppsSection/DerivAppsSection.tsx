import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { DerivAppsGetAccount } from './DerivAppsGetAccount';
import { DerivAppsTradingAccount } from './DerivAppsTradingAccount';
import './DerivAppsSection.scss';

const DerivAppsSection: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const tradingAccountLoginId = activeWallet?.linked_to?.find(account => account?.platform === 'dtrade')?.loginid;

    return tradingAccountLoginId ? (
        <DerivAppsTradingAccount
            isDemo={activeWallet?.is_virtual}
            label={activeWallet?.landing_company_name}
            tradingAccountLoginId={tradingAccountLoginId}
        />
    ) : (
        <DerivAppsGetAccount isMaltaWallet={activeWallet?.is_malta_wallet} />
    );
};

export default DerivAppsSection;
