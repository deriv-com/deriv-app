import React, { useMemo } from 'react';
import { useRegulationFlags } from '@/hooks';
import { useActiveTradingAccount, useCFDAccountsList, useCFDCompareAccounts } from '@deriv/api-v2';
import CFDCompareAccountsCard from './CompareAccountsCard';
import { isCTraderAccountAdded } from './CompareAccountsConfig';

const CTraderCompareAccountsCard = () => {
    const { data: activeDerivTrading } = useActiveTradingAccount();
    const { isEU } = useRegulationFlags();

    const { data: compareAccounts, hasCTraderAccountAvailable } = useCFDCompareAccounts(isEU);

    const { is_virtual: isDemo = false } = activeDerivTrading ?? {};

    const { data: cfdAccounts } = useCFDAccountsList();

    const { ctraderAccount } = compareAccounts;

    const isCtraderAdded = useMemo(
        () => !!cfdAccounts && isCTraderAccountAdded(cfdAccounts.ctrader, isDemo),
        [cfdAccounts, isDemo]
    );

    if (isEU || !hasCTraderAccountAvailable || !ctraderAccount) return null;

    return (
        <CFDCompareAccountsCard
            isAccountAdded={isCtraderAdded}
            marketType={ctraderAccount.market_type}
            platform={ctraderAccount.platform}
            shortCode={ctraderAccount.shortcode}
        />
    );
};

export default CTraderCompareAccountsCard;
