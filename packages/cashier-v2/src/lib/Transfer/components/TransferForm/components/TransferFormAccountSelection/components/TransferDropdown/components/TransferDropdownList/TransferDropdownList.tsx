import React from 'react';
import { Text } from '@deriv-com/ui';
import styles from './TransferDropdownList.module.scss';

type TProps = {
    header: string;
    items: any;
};

const TransferDropdownList: React.FC<TProps> = ({ header, items }) => {
    return (
        <div className={styles['items-list']}>
            <li className={styles['item-header']}>
                <Text size='sm' weight='bold'>
                    {header}
                </Text>
            </li>
            {items.map((item, index) => {
                return (
                    <li className={styles.item} key={item.loginid} {...item.props}>
                        {item.listItem}
                    </li>
                );
            })}
        </div>
    );
};

export default TransferDropdownList;
