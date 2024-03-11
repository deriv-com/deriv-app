import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import { CurrencyIcon, TradingAppIcon } from '../../../../../../../../components';
import { getLandingCompanyNameOfMT5Account, getMarketType } from '../../../../../../../../helpers';
import styles from './TransferAccountTile.module.scss';

const getAccountName = account => {
    if (account.account_type === 'binary') return account.currency;

    if (account.account_type === 'dxtrade') return 'Deriv X';

    if (account.account_type === 'ctrader') return 'cTrader';

    if (account.account_type === 'mt5') {
        const marketType = getMarketType(account.mt5_group)
            .split('')
            .map((char, i) => (i === 0 ? char.toUpperCase() : char))
            .join('');
        return `${marketType} ${getLandingCompanyNameOfMT5Account(account.mt5_group).toUpperCase()}`;
    }
};

const getIcon = (account, isMobile) => {
    if (account.account_type === 'binary') return <CurrencyIcon currency={account.currency} size='sm' />;

    if (account.account_type === 'dxtrade') return <TradingAppIcon name='DERIVX' size='sm' />;

    if (account.account_type === 'mt5') {
        return (
            <TradingAppIcon
                name={`${account.account_type.toUpperCase()}_${getMarketType(account.mt5_group).toUpperCase()}`}
                size='sm'
            />
        );
    }
};

const TransferAccountTile = account => {
    const { isMobile } = useDevice();

    return (
        <div className={styles.container}>
            <div className={styles.account}>
                {getIcon(account.account, isMobile)}
                <div className={styles['account-info']}>
                    <Text size='sm'>{getAccountName(account.account)}</Text>
                    <Text color='less-prominent' size='xs'>
                        {account.account.loginid}
                    </Text>
                </div>
            </div>
            <Text size='md'>10,000.00 USD</Text>
        </div>
    );
};

export default TransferAccountTile;
