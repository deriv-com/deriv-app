import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../../../../../types';
import { TransferAccountTile } from '../TransferAccountTile';
import styles from './TransferDropdownList.module.scss';

type TProps = {
    accounts: Record<string, TTransferableAccounts>;
    onSelect: (account: TTransferableAccounts[number]) => void;
    value: TTransferFormikContext['fromAccount' | 'toAccount'];
};

const TransferDropdownList: React.FC<TProps> = ({ accounts, onSelect, value }) => {
    return (
        <div className={styles['items-container']}>
            {Object.entries(accounts).map(([headerTitle, accounts]) => {
                if (!accounts.length) return null;

                return (
                    <div className={styles['items-list']} key={headerTitle}>
                        <div className={styles['item-header']}>
                            <Text size='sm' weight='bold'>
                                {headerTitle}
                            </Text>
                        </div>
                        {accounts.map(account => {
                            return (
                                <button
                                    className={clsx(styles.item, {
                                        [styles['item--selected']]: account.loginid === value?.loginid,
                                    })}
                                    data-testid='dt_transfer_dropdown_items'
                                    key={account.loginid}
                                    onClick={() => onSelect(account)}
                                >
                                    <TransferAccountTile
                                        account={account}
                                        isActive={account.loginid === value?.loginid}
                                    />
                                </button>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default TransferDropdownList;
