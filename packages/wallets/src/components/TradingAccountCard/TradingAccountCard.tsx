import React, { ComponentProps } from 'react';
import './TradingAccountCard.scss';

type TProps = {
    disabled?: ComponentProps<'button'>['disabled'];
    leading?: React.ReactNode;
    onClick?: ComponentProps<'button'>['onClick'];
    trailing?: React.ReactNode;
};

const TradingAccountCard: React.FC<React.PropsWithChildren<TProps>> = ({
    children,
    disabled,
    leading,
    onClick,
    trailing,
}) => {
    return (
        <button
            className='wallets-trading-account-card'
            data-testid='dt_wallets_trading_account_card'
            disabled={disabled}
            onClick={onClick}
        >
            {leading}
            <div className='wallets-trading-account-card__content'>
                {children}
                {trailing}
            </div>
        </button>
    );
};

export default TradingAccountCard;
