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

    const { ctraderAccount, dxtradeAccount, mt5Accounts } = compareAccounts;

    return (
        <div className='wallets-compare-accounts'>
            <CompareAccountsHeader isDemo={isDemo} isEuRegion={isEuRegion} isLoading={isEuRegionLoading} />
            <div className='wallets-compare-accounts__card-list'>
                <CompareAccountsCarousel isRtl={isRtl}>
                    {mt5Accounts?.map((item, index) => (
                        <CompareAccountsCard
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            key={`compare-accounts-${item?.product}-${index}`}
                            marketType={item?.market_type}
                            platform={item?.platform}
                            product={item?.product}
                            shortCode={item?.shortcode}
                        />
                    ))}
                    {/* Renders cTrader data */}
                    {mt5Accounts?.length && hasCTraderAccountAvailable && ctraderAccount && (
                        <CompareAccountsCard
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            marketType={ctraderAccount.market_type}
                            platform={ctraderAccount.platform}
                            shortCode={ctraderAccount.shortcode}
                        />
                    )}
                    {/* Renders Deriv X data */}
                    {mt5Accounts?.length && hasDxtradeAccountAvailable && dxtradeAccount && (
                        <CompareAccountsCard
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
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
