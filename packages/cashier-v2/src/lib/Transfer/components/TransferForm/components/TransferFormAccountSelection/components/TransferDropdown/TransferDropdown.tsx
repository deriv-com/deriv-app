import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Text, useOnClickOutside } from '@deriv-com/ui';
import { TGenericSizes } from '../../../../../../../../hooks/types';
import { TransferDropdownList } from './components';
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

const TransferDropdown: React.FC<TProps> = ({ content, label, list, message, onSelect, value }) => {
    const clickOutsideRef = useRef(null);
    const [items, setItems] = useState(list);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(currentValue => !currentValue);

    useOnClickOutside(clickOutsideRef, () => {
        setIsOpen(false);
    });

    const onSelectItem = (value: string) => {
        setIsOpen(false);
        return onSelect(value);
    };

    return (
        <div className={styles.container} ref={clickOutsideRef}>
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
                            onSelect={onSelectItem}
                        />
                    )}
                    {items.find(item => item.account_type === 'ctrader') && (
                        <TransferDropdownList
                            header='Deriv cTrader accounts'
                            items={items.filter(item => item.account_type === 'ctrader')}
                            onSelect={onSelectItem}
                        />
                    )}
                    {items.find(item => item.account_type === 'dxtrade') && (
                        <TransferDropdownList
                            header='Deriv X accounts'
                            items={items.filter(item => item.account_type === 'dxtrade')}
                            onSelect={onSelectItem}
                        />
                    )}
                    {items.find(item => item.account_type === 'binary') && (
                        <TransferDropdownList
                            header='Deriv accounts'
                            items={items.filter(item => item.account_type === 'binary')}
                            onSelect={onSelectItem}
                        />
                    )}
                </ul>
            )}
        </div>
    );
};

export default TransferDropdown;
