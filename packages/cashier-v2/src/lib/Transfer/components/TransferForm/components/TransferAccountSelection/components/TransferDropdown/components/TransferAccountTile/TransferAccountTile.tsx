import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import { CurrencyIcon, TradingAppIcon } from '../../../../../../../../../../components';
import { TTransferableAccounts } from '../../../../../../../../types';
import styles from './TransferAccountTile.module.scss';

type TProps = {
    account: TTransferableAccounts[number];
    iconSize?: React.ComponentProps<typeof CurrencyIcon>['size'] | React.ComponentProps<typeof TradingAppIcon>['size'];
    isActive?: boolean;
};

const getIcon = (
    accountType: TTransferableAccounts[number]['account_type'],
    currency: TTransferableAccounts[number]['currency'],
    iconSize: NonNullable<TProps['iconSize']>
) => {
    if (!currency) return null;

    if (accountType === 'binary') return <CurrencyIcon currency={currency} size={iconSize} />;

    if (accountType === 'dxtrade') return <TradingAppIcon name='DERIVX' size={iconSize} />;

    if (accountType === 'mt5') return <TradingAppIcon name='DMT5_DERIVED' size={iconSize} />;
};

const TransferAccountTile: React.FC<TProps> = ({ account, iconSize = 'sm', isActive = false }) => {
    const { account_type: accountType, currency, displayBalance, loginid } = account;
    const { isMobile } = useDevice();

    return (
        <div className={styles.container}>
            <div className={styles.account}>
                {getIcon(accountType, currency, iconSize)}
                <div className={styles['account-info']}>
                    <Text size='sm' weight={isActive ? 'bold' : 'normal'}>
                        {/* TODO: replace with correct data once it is available in backend and this function is untested
                        for now */}
                        {currency}
                    </Text>
                    <Text color='less-prominent' size='2xs'>
                        {loginid}
                    </Text>
                </div>
            </div>
            <Text size={isMobile ? 'md' : 'sm'} weight={isActive ? 'bold' : 'normal'}>
                {displayBalance}
            </Text>
        </div>
    );
};

export default TransferAccountTile;
