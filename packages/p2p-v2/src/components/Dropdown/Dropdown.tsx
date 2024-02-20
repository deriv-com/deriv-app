import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useCombobox } from 'downshift';
import { TextField, TextFieldProps } from '@/components';
import { reactNodeToString } from '@/utils';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './Dropdown.scss';

type TGenericSizes = '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '5xl' | '6xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';

type TProps = {
    disabled?: boolean;
    errorMessage?: TextFieldProps['errorMessage'];
    icon?: React.ReactNode;
    isRequired?: boolean;
    label?: TextFieldProps['label'];
    list: {
        text?: React.ReactNode;
        value?: string;
    }[];
    listHeight?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    name: TextFieldProps['name'];
    onChange?: (inputValue: string) => void;
    onSelect: (value: string) => void;
    value?: TextFieldProps['value'];
    variant?: 'comboBox' | 'prompt';
};

const Dropdown: React.FC<TProps> = ({
    disabled = false,
    errorMessage = '',
    icon = false,
    isRequired = false,
    label = '',
    list,
    listHeight = 'md',
    name,
    onChange = () => {
        // do nothing
    },
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
            className={clsx('p2p-v2-dropdown', {
                'p2p-v2-dropdown--disabled': disabled,
            })}
            {...getToggleButtonProps()}
        >
            <div className='p2p-v2-dropdown__content'>
                <TextField
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
                            className={clsx('p2p-v2-dropdown__button', {
                                'p2p-v2-dropdown__button--active': isOpen,
                            })}
                        >
                            <LabelPairedChevronDownMdRegularIcon />
                        </button>
                    )}
                    type='text'
                    value={value}
                    {...getInputProps()}
                />
            </div>
            <ul className={`p2p-v2-dropdown__items p2p-v2-dropdown__items--${listHeight}`} {...getMenuProps()}>
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={clsx('p2p-v2-dropdown__item', {
                                'p2p-v2-dropdown__item--active': value === item.value,
                            })}
                            key={item.value}
                            onClick={clearFilter}
                            onKeyDown={clearFilter}
                            {...getItemProps({ index, item })}
                        >
                            <Text size='sm' weight={value === item.value ? 'bold' : 'normal'}>
                                {item.text}
                            </Text>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Dropdown;
