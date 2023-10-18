import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import ArrowIcon from '../../../public/images/pointed-down-arrow-icon.svg';
import { WalletText } from '../WalletText';
import styles from './WalletDropdown.module.css';

type TProps = {
    icon?: React.ReactNode;
    label?: string;
    list: {
        text: string;
        value: string;
    }[];
    listHeight?: 'lg' | 'md' | 'sm';
    onSelect: (value: string) => void;
    type?: 'comboBox' | 'prompt';
    value?: string;
};

const WalletDropdown: React.FC<TProps> = ({
    icon,
    label,
    list,
    listHeight = 'md',
    onSelect,
    type = 'prompt',
    value,
}) => {
    const [items, setItems] = useState(list);
    const [shouldFilterList, setShouldFilterList] = useState(false);
    const clearFilter = useCallback(() => {
        setShouldFilterList(false);
        setItems(list);
    }, [list]);
    const { getInputProps, getItemProps, getLabelProps, getMenuProps, getToggleButtonProps, isOpen } = useCombobox({
        defaultSelectedItem: items.find(item => item.value === value),
        items,
        itemToString(item) {
            return item ? item.text : '';
        },
        onInputValueChange({ inputValue }) {
            if (shouldFilterList) {
                setItems(list.filter(item => item.text.toLowerCase().includes(inputValue?.toLowerCase() ?? '')));
            }
        },
        onIsOpenChange({ isOpen }) {
            if (!isOpen) {
                clearFilter();
            }
        },
        onSelectedItemChange({ selectedItem }) {
            onSelect(selectedItem?.value ?? '');
        },
    });

    useEffect(() => {
        setItems(list);
    }, [list]);

    return (
        <div className={styles[`wallets-dropdown`]}>
            <div className={styles[`wallets-dropdown__content`]}>
                {icon && <div className={styles[`wallets-dropdown__icon`]}>{icon}</div>}
                <input
                    className={styles['wallets-dropdown__field']}
                    id='dropdown-text'
                    onKeyUp={() => setShouldFilterList(true)}
                    placeholder={label}
                    readOnly={type !== 'comboBox'}
                    type='text'
                    value={value}
                    {...getInputProps()}
                />
                <label
                    className={classNames(styles[`wallets-dropdown__label`], {
                        [styles[`wallets-dropdown__label--with-icon`]]: !!icon,
                    })}
                    htmlFor='dropdown-text'
                    {...getLabelProps()}
                >
                    {label}
                </label>
                <button
                    className={classNames(styles['wallets-dropdown__button'], {
                        [styles['wallets-dropdown__button--active']]: isOpen,
                    })}
                    {...getToggleButtonProps()}
                >
                    <ArrowIcon />
                </button>
            </div>
            <ul
                className={classNames(
                    styles['wallets-dropdown__items'],
                    styles[`wallets-dropdown__items--${listHeight}`]
                )}
                {...getMenuProps()}
            >
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={classNames(styles['wallets-dropdown__item'], {
                                [styles['wallets-dropdown__item--active']]: value === item.value,
                            })}
                            key={item.value}
                            onClick={() => clearFilter()}
                            {...getItemProps({ index, item })}
                        >
                            <WalletText size='sm' weight={value === item.value ? 'bold' : 'normal'}>
                                {item.text}
                            </WalletText>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default WalletDropdown;
