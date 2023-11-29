import React from 'react';
import { THooks } from '../../types';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import WalletListCardIBalance from '../WalletListCardIBalance/WalletListCardIBalance';
import WalletListCardIDetails from '../WalletListCardIDetails/WalletListCardIDetails';
import './WalletListCard.scss';

type TProps = {
    badge?: THooks.WalletAccountsList['landing_company_name'];
    balance: THooks.WalletAccountsList['display_balance'];
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    isActive: THooks.WalletAccountsList['is_active'];
    isDemo: THooks.WalletAccountsList['is_virtual'];
    loginid: THooks.WalletAccountsList['loginid'];
    title: Exclude<THooks.WalletAccountsList['currency'], undefined>;
};

const WalletListCard: React.FC<TProps> = ({ badge, balance, currency, isActive, isDemo, loginid, title }) => (
    <div className='wallets-list-header__card_container'>
        <div className='wallets-list-header__content'>
            <div className='wallets-list-header__details-container'>
                <WalletCurrencyCard currency={currency} isDemo={isDemo} />

                <WalletListCardIDetails
                    badge={badge}
                    currency={currency}
                    isActive={isActive}
                    isDemo={isDemo}
                    loginid={loginid}
                    title={title}
                />
            </div>
            <WalletListCardIBalance balance={balance} />
        </div>
    </div>
);

export default WalletListCard;
