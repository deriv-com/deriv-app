import React, { useMemo } from 'react';
import { useRegulationFlags } from '@/hooks';
import { useActiveTradingAccount, useCFDAccountsList, useCFDCompareAccounts } from '@deriv/api-v2';
import CFDCompareAccountsCard from './CompareAccountsCard';
import { isDxtradeAccountAdded } from './CompareAccountsConfig';

const DerivXCompareAccountsCard = () => {
    const { data: activeDerivTrading } = useActiveTradingAccount();

    const { isEU } = useRegulationFlags();
    const { is_virtual: isDemo = false } = activeDerivTrading ?? {};

    const { data: cfdAccounts } = useCFDAccountsList();

    const { data: compareAccounts, hasDxtradeAccountAvailable } = useCFDCompareAccounts(isEU);

    const { dxtradeAccount } = compareAccounts;

    const isDxtradeAdded = useMemo(
        () => !!cfdAccounts && isDxtradeAccountAdded(cfdAccounts.dxtrade, isDemo),
        [cfdAccounts, isDemo]
    );

    if (isEU || !hasDxtradeAccountAvailable || !dxtradeAccount) return null;

    return (
        <CFDCompareAccountsCard
            isAccountAdded={isDxtradeAdded}
            marketType={dxtradeAccount.market_type}
            platform={dxtradeAccount.platform}
            shortCode={dxtradeAccount.shortcode}
        />
    );
};

export default DerivXCompareAccountsCard;
