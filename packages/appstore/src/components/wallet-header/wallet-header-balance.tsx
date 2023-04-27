import React from 'react';
import { Text, StatusBadge } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getStatusBadgeConfig } from '@deriv/account';
import { TAccountStatus } from './wallet-header';

type TWalletHeaderBalance = {
    account_status: TAccountStatus;
    balance: string;
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
};

const WalletHeaderBalance = React.memo(
    ({ account_status = '', balance = '0.00', currency = 'USD' }: TWalletHeaderBalance) => {
        const balance_title_size = 'xxs';
        const balance_amount_size = 'm';

        const balance_title_text = '<0>Wallet balance</0>';
        const balance_amount_text = `<0>${balance} ${currency}</0>`;

        // TODO: just for test use blank function and empty object. When BE will be ready change it!!!
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const { text: badge_text, icon: badge_icon } = getStatusBadgeConfig(account_status, () => {}, {});

        return (
            <div className='wallet-header__balance-title-amount'>
                {account_status ? (
                    <StatusBadge account_status={account_status} icon={badge_icon} text={badge_text} />
                ) : (
                    <React.Fragment>
                        <Localize
                            i18n_default_text={balance_title_text}
                            components={[<Text key={0} color='less-prominent' size={balance_title_size} />]}
                        />
                        <Localize
                            i18n_default_text={balance_amount_text}
                            components={[<Text key={0} weight='bold' size={balance_amount_size} />]}
                        />
                    </React.Fragment>
                )}
            </div>
        );
    }
);
WalletHeaderBalance.displayName = 'WalletHeaderBalance';
export default WalletHeaderBalance;
