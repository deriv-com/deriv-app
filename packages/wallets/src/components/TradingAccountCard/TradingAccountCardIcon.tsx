import React from 'react';
import classNames from 'classnames';
import { TCommonProps } from './TradingAccountCard';

const TradingAccountCardIcon = ({ children, className, 'data-testid': dataTestId }: TCommonProps) => (
    <div className={classNames('wallets-trading-account-card__icon', className)} data-testid={dataTestId}>
        {children}
    </div>
);

export default TradingAccountCardIcon;
