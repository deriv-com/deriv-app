import React from 'react';
import { useActiveWalletAccount, useCFDCompareAccounts, useIsEuRegion } from '@deriv/api-v2';
import useIsRtl from '../../../../hooks/useIsRtl';
import { CompareAccountsCarousel } from '../../components';
import CompareAccountsCard from './CompareAccountsCard';
import CompareAccountsHeader from './CompareAccountsHeader';
import './CompareAccountsScreen.scss';

const CompareAccountsScreen = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const isRtl = useIsRtl();
    const { data: isEuRegion, isLoading: isEuRegionLoading } = useIsEuRegion();
    const { is_virtual: isDemo = false } = activeWallet || {};

    const {
        data: compareAccounts,
        hasCTraderAccountAvailable,
        hasDxtradeAccountAvailable,
    } = useCFDCompareAccounts(isEuRegion);

    // Remove the hardcoded cTrader and Deriv X values and use the values from the API once it's ready
    const { ctraderAccount, dxtradeAccount, mt5Accounts } = compareAccounts;

    return (
        <div className='wallets-compare-accounts'>
            <CompareAccountsHeader isDemo={isDemo} isEuRegion={isEuRegion} isLoading={isEuRegionLoading} />
            <div className='wallets-compare-accounts__card-list'>
                <CompareAccountsCarousel isRtl={isRtl}>
                    {/* Renders MT5 data */}
                    {mt5Accounts
                        //@ts-expect-error needs backend type
                        ?.filter(mt5Account => mt5Account.is_default_jurisdiction === 'true')
                        .map((item, index) => (
                            <CompareAccountsCard
                                account={item}
                                isDemo={isDemo}
                                isEuRegion={isEuRegion}
                                key={`compare-accounts-${item?.product}-${index}`}
                            />
                        ))}
                    {/* Renders cTrader data */}
                    {mt5Accounts?.length && hasCTraderAccountAvailable && ctraderAccount && (
                        <CompareAccountsCard account={ctraderAccount} isDemo={isDemo} isEuRegion={isEuRegion} />
                    )}
                    {/* Renders Deriv X data */}
                    {mt5Accounts?.length && hasDxtradeAccountAvailable && dxtradeAccount && (
                        <CompareAccountsCard account={dxtradeAccount} isDemo={isDemo} isEuRegion={isEuRegion} />
                    )}
                </CompareAccountsCarousel>
            </div>
        </div>
    );
};

export default CompareAccountsScreen;
