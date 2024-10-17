import React from 'react';
import classNames from 'classnames';

const TradingAccountCardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={classNames('wallets-trading-account-card__content', className)}>{children}</div>
);

export default TradingAccountCardContent;
