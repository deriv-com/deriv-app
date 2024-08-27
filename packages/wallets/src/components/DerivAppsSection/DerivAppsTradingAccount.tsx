import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount, useActiveWalletAccount, useAuthorize } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import useDevice from '../../hooks/useDevice';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletMarketIcon } from '../WalletMarketIcon';

const DerivAppsTradingAccount = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { data: authorizeData } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();
    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const balance = balanceData?.[activeLinkedToTradingAccount?.loginid ?? '']?.balance;

    return (
        <div className='wallets-deriv-apps-section wallets-deriv-apps-section__border'>
            <div className={isMobile ? 'wallets-deriv-apps-section__icon-small' : 'wallets-deriv-apps-section__icon'}>
                <WalletMarketIcon icon='standard' size={isMobile ? 'md' : 'lg'} />
            </div>
            <div className='wallets-deriv-apps-section__details'>
                <div className='wallets-deriv-apps-section__title-and-badge'>
                    <Text size='sm'>
                        <Localize i18n_default_text='Options' />
                    </Text>
                    {activeWallet?.is_virtual && <WalletListCardBadge />}
                </div>
                {isBalanceLoading ? (
                    <div
                        className='wallets-skeleton wallets-deriv-apps-balance-loader'
                        data-testid='dt_deriv-apps-balance-loader'
                    />
                ) : (
                    <Text size='sm' weight='bold'>
                        {displayMoney(balance, activeLinkedToTradingAccount?.currency_config?.display_code, {
                            fractional_digits: activeLinkedToTradingAccount?.currency_config?.fractional_digits,
                            preferred_language: authorizeData?.preferred_language,
                        })}
                    </Text>
                )}
                <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                    {activeLinkedToTradingAccount?.loginid}
                </Text>
            </div>
            <button
                className='wallets-deriv-apps-section__button'
                data-testid='dt_deriv-apps-trading-account-transfer-button'
                onClick={() => {
                    history.push('/wallet/account-transfer', {
                        toAccountLoginId: activeLinkedToTradingAccount?.loginid,
                    });
                }}
            >
                <LabelPairedArrowUpArrowDownSmBoldIcon />
            </button>
        </div>
    );
};

export { DerivAppsTradingAccount };
