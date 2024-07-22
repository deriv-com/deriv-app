import React from 'react';
import classNames from 'classnames';

const TradingAccountCardIcon = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={classNames('wallets-trading-account-card__icon', className)}>{children}</div>
);

export default TradingAccountCardIcon;
