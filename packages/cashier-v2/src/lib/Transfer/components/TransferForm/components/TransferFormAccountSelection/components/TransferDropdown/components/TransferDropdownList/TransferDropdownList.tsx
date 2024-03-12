import React from 'react';
import { Text } from '@deriv-com/ui';
import styles from './TransferDropdownList.module.scss';

type TProps = {
    header: string;
    items: any;
    onSelect: (value: string) => void;
};

const TransferDropdownList: React.FC<TProps> = ({ header, items, onSelect }) => {
    return (
        <div className={styles['items-list']}>
            <li className={styles['item-header']}>
                <Text size='sm' weight='bold'>
                    {header}
                </Text>
            </li>
            {items.map((item, index) => {
                return (
                    <li className={styles.item} key={item.loginid} onClick={() => onSelect(item.value)}>
                        {item.listItem}
                    </li>
                );
            })}
        </div>
    );
};

export default TransferDropdownList;
