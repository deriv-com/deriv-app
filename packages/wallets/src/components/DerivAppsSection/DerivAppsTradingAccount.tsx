import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount, useActiveWalletAccount, useBalance } from '@deriv/api-v2';
import { LabelPairedArrowsRotateSmBoldIcon, LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import useDevice from '../../hooks/useDevice';
import { WalletText } from '../Base';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletMarketIcon } from '../WalletMarketIcon';

const DerivAppsTradingAccount: React.FC = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { isLoading } = useBalance();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return (
        <div className='wallets-deriv-apps-section wallets-deriv-apps-section__border'>
            <div className={isMobile ? 'wallets-deriv-apps-section__icon-small' : 'wallets-deriv-apps-section__icon'}>
                <WalletMarketIcon icon='IcWalletOptionsLight' size={isMobile ? 'md' : 'lg'} />
            </div>
            <div className='wallets-deriv-apps-section__details'>
                <div className='wallets-deriv-apps-section__title-and-badge'>
                    <WalletText size='sm'>Options</WalletText>
                    <WalletListCardBadge isDemo={activeWallet?.is_virtual} label={activeWallet?.landing_company_name} />
                </div>
                {isLoading ? (
                    <div className='wallets-skeleton wallets-deriv-apps-balance-loader' />
                ) : (
                    <WalletText size='sm' weight='bold'>
                        {activeLinkedToTradingAccount?.display_balance}
                    </WalletText>
                )}
                <WalletText color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                    {activeLinkedToTradingAccount?.loginid}
                </WalletText>
            </div>
            <button
                className='wallets-deriv-apps-section__button'
                onClick={() => {
                    activeWallet?.is_virtual
                        ? history.push('/wallets/cashier/reset-balance')
                        : history.push('/wallets/cashier/transfer', {
                              toAccountLoginId: activeLinkedToTradingAccount?.loginid,
                          });
                }}
            >
                {activeWallet?.is_virtual ? (
                    <LabelPairedArrowsRotateSmBoldIcon />
                ) : (
                    <LabelPairedArrowUpArrowDownSmBoldIcon />
                )}
            </button>
        </div>
    );
};

export { DerivAppsTradingAccount };
