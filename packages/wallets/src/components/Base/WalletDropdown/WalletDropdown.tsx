import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import ArrowIcon from '../../../public/images/pointed-down-arrow-icon.svg';
import reactNodeToString from '../../../utils/reactNodeToString';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import WalletTextField, { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import './WalletDropdown.scss';

type TProps = {
    disabled?: boolean;
    errorMessage?: WalletTextFieldProps['errorMessage'];
    icon?: React.ReactNode;
    isRequired?: boolean;
    label?: WalletTextFieldProps['label'];
    list: {
        text?: React.ReactNode;
        value?: string;
    }[];
    listHeight?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    name: WalletTextFieldProps['name'];
    onChange?: (inputValue: string) => void;
    onSelect: (value: string) => void;
    value?: WalletTextFieldProps['value'];
    variant?: 'comboBox' | 'prompt';
};

const WalletDropdown: React.FC<TProps> = ({
    disabled,
    errorMessage,
    icon = false,
    isRequired = false,
    label,
    list,
    listHeight = 'md',
    name,
    onChange,
    onSelect,
    value,
    variant = 'prompt',
}) => {
    const [items, setItems] = useState(list);
    const [hasSelected, setHasSelected] = useState(false);
    const [shouldFilterList, setShouldFilterList] = useState(false);
    const clearFilter = useCallback(() => {
        setShouldFilterList(false);
        setItems(list);
    }, [list]);
    const { closeMenu, getInputProps, getItemProps, getMenuProps, getToggleButtonProps, isOpen, openMenu } =
        useCombobox({
            defaultSelectedItem: items.find(item => item.value === value) ?? null,
            items,
            itemToString(item) {
                return item ? reactNodeToString(item.text) : '';
            },
            onInputValueChange({ inputValue }) {
                onChange?.(inputValue ?? '');
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
                closeMenu();
            },
        });

    const handleInputClick = useCallback(() => {
        variant === 'comboBox' && setShouldFilterList(true);

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }, [closeMenu, isOpen, openMenu, variant]);

    useEffect(() => {
        setItems(list);
    }, [list]);

    return (
        <div
            className={classNames('wallets-dropdown', {
                'wallets-dropdown--disabled': disabled,
            })}
            {...getToggleButtonProps()}
        >
            <div className='wallets-dropdown__content'>
                <WalletTextField
                    disabled={disabled}
                    errorMessage={errorMessage}
                    isInvalid={hasSelected && !value && isRequired}
                    label={label}
                    name={name}
                    onClickCapture={handleInputClick}
                    onFocus={() => setHasSelected(true)}
                    onKeyUp={() => setShouldFilterList(true)}
                    placeholder={reactNodeToString(label)}
                    readOnly={variant !== 'comboBox'}
                    renderLeftIcon={icon ? () => icon : undefined}
                    renderRightIcon={() => (
                        <button
                            className={classNames('wallets-dropdown__button', {
                                'wallets-dropdown__button--active': isOpen,
                            })}
                        >
                            <ArrowIcon />
                        </button>
                    )}
                    type='text'
                    value={value}
                    {...getInputProps()}
                />
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
