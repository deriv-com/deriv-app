import React, { useMemo } from 'react';
import { useActiveTradingAccount, useCFDAccountsList, useCFDCompareAccounts, useIsEuRegion } from '@deriv/api';
import { CompareAccountsCarousel } from '../../components';
import CFDCompareAccountsCard from './CompareAccountsCard';
import { isCTraderAccountAdded, isDxtradeAccountAdded } from './CompareAccountsConfig';
import CompareAccountsHeader from './CompareAccountsHeader';

const CompareAccountsScreen = () => {
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: isEuRegion } = useIsEuRegion();

    const { is_mf: isEuUser = false, is_virtual: isDemo = false } = activeTrading || {};

    const { data: compareAccounts, hasCTraderAccountAvailable, hasDxtradeAccountAvailable } = useCFDCompareAccounts();
    const { data: cfdAccounts } = useCFDAccountsList();

    const { ctraderAccount, dxtradeAccount, mt5Accounts } = compareAccounts;

    const isDxtradeAdded = useMemo(
        () => !!cfdAccounts && isDxtradeAccountAdded(cfdAccounts.dxtrade, isDemo),
        [cfdAccounts, isDemo]
    );

    const isCtraderAdded = useMemo(
        () => !!cfdAccounts && isCTraderAccountAdded(cfdAccounts.ctrader, isDemo),
        [cfdAccounts, isDemo]
    );

    return (
        <div className='m-0 overflow-x-auto lg:w-full lg:h-full '>
            <CompareAccountsHeader isDemo={isDemo} isEuRegion={isEuRegion} />
            <div className='flex justify-center lg:my-0 lg:mx-auto max-w-[1232px]'>
                <CompareAccountsCarousel>
                    {mt5Accounts?.map(item => (
                        <CFDCompareAccountsCard
                            isAccountAdded={item?.is_added}
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            isEuUser={isEuUser}
                            key={`${item?.market_type} ${item?.shortcode}`}
                            marketType={item?.market_type}
                            platform={item?.platform}
                            shortCode={item?.shortcode}
                        />
                    ))}
                    {/* Renders cTrader data */}
                    {mt5Accounts?.length && hasCTraderAccountAvailable && ctraderAccount && (
                        <CFDCompareAccountsCard
                            isAccountAdded={isCtraderAdded}
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            isEuUser={isEuUser}
                            marketType={ctraderAccount.market_type}
                            platform={ctraderAccount.platform}
                            shortCode={ctraderAccount.shortcode}
                        />
                    )}
                    {/* Renders Deriv X data */}
                    {mt5Accounts?.length && hasDxtradeAccountAvailable && dxtradeAccount && (
                        <CFDCompareAccountsCard
                            isAccountAdded={isDxtradeAdded}
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            isEuUser={isEuUser}
                            marketType={dxtradeAccount.market_type}
                            platform={dxtradeAccount.platform}
                            shortCode={dxtradeAccount.shortcode}
                        />
                    )}
                </CompareAccountsCarousel>
            </div>
        </div>
    );
};

export default CompareAccountsScreen;
