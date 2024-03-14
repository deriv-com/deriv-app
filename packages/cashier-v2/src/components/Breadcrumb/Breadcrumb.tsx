import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import BreadcrumbSeparator from '../../assets/images/breadcrumb-separator.svg';
import styles from './Breadcrumb.module.scss';

type TItem = {
    text: string;
    value: number | string;
};

type TProps = {
    items: TItem[];
    onItemSelect: (item: TItem) => void;
};

const Breadcrumb: React.FC<TProps> = ({ items, onItemSelect }) => {
    return (
        <div className={styles.container}>
            {items.map((item: TItem, idx: number) => (
                <button
                    className={clsx(styles.item)}
                    data-testid='dt_breadcrumb_item'
                    key={item.value}
                    onClick={() => onItemSelect(item)}
                >
                    <Text
                        as='span'
                        className={styles.text}
                        color={idx === items.length - 1 ? 'general' : 'primary'}
                        size='sm'
                    >
                        {item.text}
                    </Text>
                    {idx < items.length - 1 && (
                        <div className={styles['breadcrumb-separator']}>
                            <BreadcrumbSeparator />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};

export default Breadcrumb;
