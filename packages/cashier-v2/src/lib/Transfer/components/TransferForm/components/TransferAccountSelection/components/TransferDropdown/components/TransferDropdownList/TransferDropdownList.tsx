import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../../../../../types';
import { TransferAccountTile } from '../TransferAccountTile';
import styles from './TransferDropdownList.module.scss';

type TProps = {
    accounts: TTransferableAccounts;
    header: string;
    onSelect: (value: string) => void;
    value: TTransferFormikContext['fromAccount'] | TTransferFormikContext['toAccount'];
};

const TransferDropdownList: React.FC<TProps> = ({ accounts, header, onSelect, value }) => {
    return (
        <div className={styles['items-list']}>
            <li className={styles['item-header']}>
                <Text size='sm' weight='bold'>
                    {header}
                </Text>
            </li>
            {accounts.map(account => {
                return (
                    <li
                        className={clsx(styles.item, {
                            [styles['item--selected']]: account.loginid === value?.loginid,
                        })}
                        key={account.loginid}
                        onClick={() => onSelect(account.loginid ?? '')}
                    >
                        <TransferAccountTile account={account} />
                    </li>
                );
            })}
        </div>
    );
};

export default TransferDropdownList;
