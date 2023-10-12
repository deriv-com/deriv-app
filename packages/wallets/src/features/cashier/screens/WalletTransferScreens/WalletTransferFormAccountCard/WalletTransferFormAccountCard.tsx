import React from 'react';
import { useAccountsList } from '@deriv/api';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import { WalletListCardBadge } from '../WalletListCardBadge';
import './WalletTransferFormAccountCard.scss';

type TProps = {
    account?: NonNullable<ReturnType<typeof useAccountsList>['data']>[number];
    type?: 'input' | 'modal';
};

const WalletTransferFromAccountCard: React.FC<TProps> = ({ account, type = 'modal' }) => {
    const isInput = type === 'input';

    return (
        <div className='wallets-transfer-form-account-card'>
            <div
                className={`wallets-transfer-form-account-card__content ${
                    isInput ? 'wallets-transfer-form-account-card__content--is-input' : ''
                }`}
            >
                <div className='wallets-transfer-form-account-card__content__card'>
                    <WalletCurrencyCard
                        currency={account?.currency_config?.display_code || 'USD'}
                        isDemo={account?.is_virtual}
                        size={isInput ? 'sm' : 'md'}
                    />
                </div>
                <div className='wallets-transfer-form-account-card__details'>
                    <p
                        className={`wallets-transfer-form-account-card__details__title ${
                            isInput ? 'wallets-transfer-form-account-card__details__title--is-input' : ''
                        }`}
                    >
                        {account?.currency_config?.display_code || 'USD'} Wallet
                    </p>
                    <span
                        className={`wallets-transfer-form-account-card__details__balance ${
                            isInput ? 'wallets-transfer-form-account-card__details__balance--is-input' : ''
                        }`}
                    >
                        Balance: {account?.display_balance}
                    </span>
                </div>
            </div>
            {type === 'modal' && (
                <WalletListCardBadge isDemo={account?.is_virtual} label={account?.landing_company_name} />
            )}
        </div>
    );
};

export default WalletTransferFromAccountCard;
