import React from 'react';
import { Trans } from 'react-i18next';
import { useBalance } from '@deriv/api-v2';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import './WalletListCardBalance.scss';

type TProps = {
    balance: THooks.WalletAccountsList['display_balance'];
};

const WalletListCardBalance: React.FC<TProps> = ({ balance }) => {
    const { isLoading } = useBalance();
    return (
        <div className='wallets-balance__container'>
            {isLoading ? (
                <div
                    className='wallets-skeleton wallets-balance--loader'
                    data-testid='dt_wallet_list_card_balance_loader'
                />
            ) : (
                <WalletText align='right' size='xl' weight='bold'>
                    <Trans defaults={balance} />
                </WalletText>
            )}
        </div>
    );
};

export default WalletListCardBalance;
