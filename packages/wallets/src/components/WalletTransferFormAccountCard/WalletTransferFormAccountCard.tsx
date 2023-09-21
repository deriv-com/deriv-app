import React, { useMemo } from 'react';
import { useAccountsList } from '@deriv/api';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletListCardIcon } from '../WalletListCardIcon';
import { WalletListCardTitle } from '../WalletListCardTitle';
import './WalletTransferFormAccountCard.scss';

type TProps = {
    loginId?: string;
};

const WalletTransferFromAccountCard: React.FC<TProps> = ({ loginId }) => {
    const formattedLandingCompany = (landingCompanyName?: string) =>
        landingCompanyName === 'virtual' ? 'Demo' : landingCompanyName?.toUpperCase() || 'SVG';
    const { data } = useAccountsList();
    const account = useMemo(() => data?.find(acc => acc.loginid === loginId), [data, loginId]);

    return (
        <div className='wallets-transfer-form-account-card'>
            <div className='wallets-transfer-form-account-card__content'>
                <div className='wallets-transfer-form-account-card__content__card'>
                    <WalletGradientBackground
                        currency={account?.currency_config?.display_code || 'USD'}
                        is_demo={account?.is_virtual}
                        type='card'
                    >
                        <div className='wallets-transfer-form-account-card-icon'>
                            <WalletListCardIcon small type={account?.currency_config?.display_code || 'USD'} />
                        </div>
                    </WalletGradientBackground>
                </div>
                <div className='wallets-transfer-form-account-card__details'>
                    <WalletListCardTitle currency={account?.currency_config?.display_code || 'USD'} />
                    <span className='wallets-transfer-form-account-card__details__balance'>
                        Balance: {account?.display_balance}
                    </span>
                </div>
            </div>
            <WalletListCardBadge
                is_demo={account?.is_virtual}
                label={formattedLandingCompany(account?.landing_company_name)}
            />
        </div>
    );
};

export default WalletTransferFromAccountCard;
