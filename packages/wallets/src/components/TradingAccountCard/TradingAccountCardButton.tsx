import React from 'react';
import classNames from 'classnames';

const TradingAccountCardButton = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={classNames('wallets-trading-account-card__button', className)}>{children}</div>
);

export default TradingAccountCardButton;
