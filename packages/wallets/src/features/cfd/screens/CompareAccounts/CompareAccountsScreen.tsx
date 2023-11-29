import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCFDAccountsList, useCFDCompareAccounts } from '@deriv/api';
import { WalletText } from '../../../../components';
import CloseIcon from '../../../../public/images/ic-close-dark.svg';
import { CompareAccountsCarousel } from '../../components';
import CFDCompareAccountsCard from './CompareAccountsCard';
import { isCTraderAccountAdded, isDxtradeAccountAdded } from './compareAccountsConfig';
import './CompareAccountsScreen.scss';

const CompareAccountsScreen = () => {
    const history = useHistory();
    const { data: activeWallet } = useActiveWalletAccount();
    const { is_malta_wallet: isEuUser = false, is_virtual: isDemo = false } = activeWallet || {};

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

    const headerTitle = isEuUser
        ? `Deriv MT5 CFDs ${isDemo ? 'Demo' : 'real'} account`
        : `Compare CFDs ${isDemo ? 'demo ' : ''}accounts`;

    return (
        <div className='wallets-compare-accounts-container'>
            <div className='wallets-compare-accounts-header'>
                <div className='wallets-compare-accounts-header__title'>
                    <WalletText size='xl' weight='bold'>
                        {headerTitle}
                    </WalletText>
                </div>
                <CloseIcon
                    className='wallets-compare-accounts-header__close-icon'
                    onClick={() => {
                        history.push('/wallets');
                    }}
                />
            </div>
            <div className='wallets-compare-accounts-container__card-list'>
                <CompareAccountsCarousel>
                    {mt5Accounts?.map(item => (
                        <CFDCompareAccountsCard
                            isAccountAdded={item?.is_added}
                            isDemo={isDemo}
                            isEuUser={isEuUser}
                            key={`${item?.market_type} ${item?.shortcode}`}
                            marketType={item?.market_type}
                            platform={item?.platform}
                            shortCode={item?.shortcode}
                        />
                    ))}
                    {/* Renders Deriv X data */}
                    {mt5Accounts?.length && hasDxtradeAccountAvailable && dxtradeAccount && (
                        <CFDCompareAccountsCard
                            isAccountAdded={isDxtradeAdded}
                            isDemo={isDemo}
                            isEuUser={isEuUser}
                            marketType={dxtradeAccount.market_type}
                            platform={dxtradeAccount.platform}
                            shortCode={dxtradeAccount.shortcode}
                        />
                    )}
                    {/* Renders cTrader data */}
                    {mt5Accounts?.length && hasCTraderAccountAvailable && ctraderAccount && (
                        <CFDCompareAccountsCard
                            isAccountAdded={isCtraderAdded}
                            isDemo={isDemo}
                            isEuUser={isEuUser}
                            marketType={ctraderAccount.market_type}
                            platform={ctraderAccount.platform}
                            shortCode={ctraderAccount.shortcode}
                        />
                    )}
                </CompareAccountsCarousel>
            </div>
        </div>
    );
};

export default CompareAccountsScreen;
