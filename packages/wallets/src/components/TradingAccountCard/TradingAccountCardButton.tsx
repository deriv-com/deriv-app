import React from 'react';
import classNames from 'classnames';
import { TCommonProps } from './TradingAccountCard';

const TradingAccountCardButton = ({ children, className, 'data-testid': dataTestId }: TCommonProps) => (
    <div className={classNames('wallets-trading-account-card__button', className)} data-testid={dataTestId}>
        {children}
    </div>
);

export default TradingAccountCardButton;
