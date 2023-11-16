import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import ArrowIcon from '../../../public/images/pointed-down-arrow-icon.svg';
import reactNodeToString from '../../../utils/reactNodeToString';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import { WalletTextField } from '../WalletTextField';
import './WalletDropdown.scss';

type TProps = {
    icon?: React.ReactNode;
    id?: string;
    label?: React.ReactNode;
    list: {
        text?: React.ReactNode;
        value?: string;
    }[];
    listHeight?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    onSelect: (value: string) => void;
    type?: 'comboBox' | 'prompt';
    value: string | undefined;
};

const WalletDropdown: React.FC<TProps> = ({
    icon = false,
    id = 'dropdown-text',
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
        items,
        itemToString(item) {
            return item ? reactNodeToString(item.text) : '';
        },
        onInputValueChange({ inputValue }) {
            if (shouldFilterList) {
                setItems(
                    list.filter(item =>
                        reactNodeToString(item.text)
                            .toLowerCase()
                            .includes(inputValue?.toLowerCase() ?? '')
                    )
                );
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
        selectedItem: items.find(item => item.value === value) ?? null,
    });

    useEffect(() => {
        setItems(list);
    }, [list]);

    return (
        <div className='wallets-dropdown'>
            <div className='wallets-dropdown__content'>
                <WalletTextField
                    id={id}
                    onKeyUp={() => setShouldFilterList(true)}
                    placeholder={reactNodeToString(label)}
                    readOnly={type !== 'comboBox'}
                    renderLeftIcon={() => icon}
                    renderRightIcon={() => (
                        <button
                            className={classNames('wallets-dropdown__button', {
                                'wallets-dropdown__button--active': isOpen,
                            })}
                            {...getToggleButtonProps()}
                        >
                            <ArrowIcon />
                        </button>
                    )}
                    type='text'
                    value={value}
                    {...getInputProps()}
                />
                <label
                    className={classNames('wallets-dropdown__label', {
                        'wallets-dropdown__label--with-icon': !!icon,
                    })}
                    htmlFor={id}
                    {...getLabelProps()}
                >
                    {label}
                </label>
            </div>
            <ul className={`wallets-dropdown__items wallets-dropdown__items--${listHeight}`} {...getMenuProps()}>
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={classNames('wallets-dropdown__item', {
                                'wallets-dropdown__item--active': value === item.value,
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
