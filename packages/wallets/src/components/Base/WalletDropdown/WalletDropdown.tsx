import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import ArrowIcon from '../../../public/images/pointed-down-arrow-icon.svg';
import reactNodeToString from '../../../utils/reactNodeToString';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import './WalletDropdown.scss';

type TProps = {
    icon?: React.ReactNode;
    label?: React.ReactNode;
    list: {
        text: React.ReactNode;
        value: string;
    }[];
    listHeight?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    maxWidth?: CSSProperties['maxWidth'];
    onSelect: (value: string) => void;
    type?: 'comboBox' | 'prompt';
    value: string | undefined;
};

const WalletDropdown: React.FC<TProps> = ({
    icon,
    label,
    list,
    listHeight = 'md',
    maxWidth = '19.5rem',
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
        selectedItem: items.find(item => item.value === value),
    });

    useEffect(() => {
        setItems(list);
    }, [list]);

    return (
        <div className='wallets-dropdown' style={{ maxWidth: `${maxWidth}` }}>
            <div className='wallets-dropdown__content'>
                {icon && <div className='wallets-dropdown__icon'>{icon}</div>}
                <input
                    className='wallets-dropdown__field'
                    id='dropdown-text'
                    onKeyUp={() => setShouldFilterList(true)}
                    placeholder={reactNodeToString(label)}
                    readOnly={type !== 'comboBox'}
                    type='text'
                    value={value}
                    {...getInputProps()}
                />
                <label
                    className={classNames('wallets-dropdown__label', {
                        'wallets-dropdown__label--with-icon': !!icon,
                    })}
                    htmlFor='dropdown-text'
                    {...getLabelProps()}
                >
                    {label}
                </label>
                <button
                    className={classNames('wallets-dropdown__button', {
                        'wallets-dropdown__button--active': isOpen,
                    })}
                    {...getToggleButtonProps()}
                >
                    <ArrowIcon />
                </button>
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
