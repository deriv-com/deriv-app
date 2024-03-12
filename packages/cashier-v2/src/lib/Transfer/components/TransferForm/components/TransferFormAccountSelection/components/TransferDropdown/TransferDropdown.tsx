import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useCombobox } from 'downshift';
import { LabelPairedChevronDownMdRegularIcon, LabelPairedChevronUpMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import clsx from 'clsx';
import { TGenericSizes } from '../../../../../../../../hooks/types';
import reactNodeToString from '../../../../../../../../utils/react-node-to-string';
import { TransferDropdownList } from './components';
import './TransferDropdown.scss';
import styles from './TransferDropdown.module.scss';

type TProps = {
    content: React.ReactNode;
    disabled: boolean;
    icon?: React.ReactNode;
    isRequired?: boolean;
    label?: string;
    list: {
        account_type?: any;
        listItem?: React.ReactNode;
        value?: string;
    }[];
    listHeight?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    message?: string;
    onChange?: (inputValue: string) => void;
    onSelect: (value: string) => void;
    typeVariant?: 'listcard' | 'normal';
    value: string;
    variant?: 'comboBox' | 'prompt';
};

const TransferDropdown: React.FC<TProps> = ({
    content,
    disabled,
    label,
    list,
    listHeight = 'md',
    message,
    onChange,
    onSelect,
    typeVariant = 'normal',
    value,
    variant = 'prompt',
}) => {
    const [items, setItems] = useState(list);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(currentValue => !currentValue);

    return (
        <div className={styles.container}>
            <button className={styles['selection-container']} onClick={toggleMenu}>
                <div className={styles['selection-label']}>
                    <Text size='xs'>{label}</Text>
                </div>
                <div className={styles['selection-content']}>
                    {content}
                    <LabelPairedChevronDownMdRegularIcon
                        className={clsx(styles.arrow, {
                            [styles['arrow--flip']]: isOpen,
                        })}
                    />
                </div>
                <Text className={styles['helper-message']} color='less-prominent' size='xs'>
                    {message}
                </Text>
            </button>
            {isOpen && (
                <ul className={styles['items-container']}>
                    {items.find(item => item.account_type === 'mt5') && (
                        <TransferDropdownList
                            header='Deriv MT5 accounts'
                            items={items.filter(item => item.account_type === 'mt5')}
                        />
                    )}
                    {items.find(item => item.account_type === 'ctrader') && (
                        <TransferDropdownList
                            header='Deriv cTrader accounts'
                            items={items.filter(item => item.account_type === 'ctrader')}
                        />
                    )}
                    {items.find(item => item.account_type === 'dxtrade') && (
                        <TransferDropdownList
                            header='Deriv X accounts'
                            items={items.filter(item => item.account_type === 'dxtrade')}
                        />
                    )}
                    {items.find(item => item.account_type === 'binary') && (
                        <TransferDropdownList
                            header='Deriv accounts'
                            items={items.filter(item => item.account_type === 'binary')}
                        />
                    )}
                </ul>
            )}
        </div>
    );
};

export default TransferDropdown;
