import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TWalletHeaderBalance = {
    balance: string;
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
};

const WalletHeaderBalance = React.memo(({ balance = '0.00', currency = 'USD' }: TWalletHeaderBalance) => {
    const balance_title_size = 'xxs';
    const balance_amount_size = 'm';

    const balance_title_text = '<0>Wallet balance</0>';
    const balance_amount_text = `<0>${balance} ${currency}</0>`;

    return (
        <div className='wallet-header__balance-title-amount'>
            <Localize
                i18n_default_text={balance_title_text}
                components={[<Text key={0} color='less-prominent' size={balance_title_size} />]}
            />
            <Localize
                i18n_default_text={balance_amount_text}
                components={[<Text key={0} weight='bold' size={balance_amount_size} />]}
            />
        </div>
    );
});
WalletHeaderBalance.displayName = 'WalletHeaderBalance';
export default WalletHeaderBalance;
