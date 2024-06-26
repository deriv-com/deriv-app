import React from 'react';
import { useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { TSubscribedBalance } from '../../types';
import { DerivAppsGetAccount } from './DerivAppsGetAccount';
import { DerivAppsTradingAccount } from './DerivAppsTradingAccount';
import './DerivAppsSection.scss';

const DerivAppsSection: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return activeLinkedToTradingAccount?.loginid ? (
        <DerivAppsTradingAccount balance={balance} />
    ) : (
        <DerivAppsGetAccount />
    );
};

export default DerivAppsSection;
