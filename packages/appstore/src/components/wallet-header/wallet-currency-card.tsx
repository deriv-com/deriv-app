import React from 'react';
import { WalletIcon } from '@deriv/components';
import { TWalletAccount } from 'Types';

type TWalletCurrencyCard = Pick<TWalletAccount, 'is_demo' | 'currency' | 'icon'> & {
    gradient_class?: string;
    icon_type?: string;
};

const WalletCurrencyCard = ({ is_demo, currency, icon, icon_type, gradient_class }: TWalletCurrencyCard) => {
    return (
        <div className='wallet-header__currency' data-testid={`dt_${is_demo ? 'demo' : currency?.toLowerCase()}`}>
            <WalletIcon
                gradient_class={gradient_class}
                icon={icon}
                size='xlarge'
                type={icon_type}
                has_bg
                hide_watermark
            />
        </div>
    );
};

export default WalletCurrencyCard;
