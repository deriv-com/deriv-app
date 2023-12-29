import React from 'react';
import { THooks } from '../../types';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import WalletListCardBalance from '../WalletListCardBalance/WalletListCardBalance';
import WalletListCardDetails from '../WalletListCardDetails/WalletListCardDetails';
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

                <WalletListCardDetails
                    badge={badge}
                    isActive={isActive}
                    isDemo={isDemo}
                    loginid={loginid}
                    title={title}
                />
            </div>
            <WalletListCardBalance balance={balance} />
        </div>
    </div>
);

export default WalletListCard;
