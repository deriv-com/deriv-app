import React, { ComponentProps, PropsWithChildren } from 'react';
import classNames from 'classnames';
import TradingAccountCardButton from './TradingAccountCardButton';
import TradingAccountCardContent from './TradingAccountCardContent';
import TradingAccountCardIcon from './TradingAccountCardIcon';
import './TradingAccountCard.scss';

type TProps = {
    className?: string;
    disabled?: ComponentProps<'button'>['disabled'];
    onClick?: ComponentProps<'button'>['onClick'];
};

const TradingAccountCard = ({ children, className, disabled, onClick }: PropsWithChildren<TProps>) => {
    return (
        <button
            className={classNames('wallets-trading-account-card', className)}
            data-testid='dt_wallets_trading_account_card'
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

TradingAccountCard.Icon = TradingAccountCardIcon;
TradingAccountCard.Content = TradingAccountCardContent;
TradingAccountCard.Button = TradingAccountCardButton;

export default TradingAccountCard;
