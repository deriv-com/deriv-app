import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TGenericSizes } from '../../../../../../../../hooks/types';
import reactNodeToString from '../../../../../../../../utils/react-node-to-string';
import './TransferDropdown.scss';
import styles from './TransferDropdown.module.scss';

type TProps = {
    icon?: React.ReactNode;
    isRequired?: boolean;
    list: {
        listItem?: React.ReactNode;
        text?: React.ReactNode;
        value?: string;
    }[];
    listHeader?: React.ReactNode;
    listHeight?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    onChange?: (inputValue: string) => void;
    onSelect: (value: string) => void;
    showListHeader?: boolean;
    typeVariant?: 'listcard' | 'normal';
    variant?: 'comboBox' | 'prompt';
};

const TransferDropdown: React.FC = ({
    content,
    disabled,
    label,
    list,
    listHeader,
    listHeight = 'md',
    onChange,
    onSelect,
    showListHeader = false,
    typeVariant = 'normal',
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
            {/* <div
                className={`wallets-dropdown__content ${
                    typeVariant === 'listcard' ? 'wallets-dropdown__content--listcard' : ''
                }`}
            >
                <Input
                    disabled={disabled}
                    error={hasSelected && !value && isRequired}
                    hideMessage={hideMessage}
                    isFullWidth={isFullWidth}
                    label={label}
                    message={hasSelected && !value && message}
                    name={name}
                    onClickCapture={handleInputClick}
                    onFocus={() => setHasSelected(true)}
                    onKeyUp={() => setShouldFilterList(true)}
                    placeholder={reactNodeToString(label) ?? 'Hi'}
                    readOnly={variant !== 'comboBox'}
                    renderLeftIcon={icon ? () => icon : undefined}
                    renderRightIcon={() => (
                        <button
                            className={classNames('wallets-dropdown__button', {
                                'wallets-dropdown__button--active': isOpen,
                            })}
                        >
                            <LabelPairedChevronDownMdRegularIcon />
                        </button>
                    )}
                    type='text'
                    typeVariant={typeVariant}
                    value={value}
                    {...getInputProps()}
                />
            </div> */}
            <div
                className={styles['selection-container']}
                onClickCapture={handleInputClick}
                onFocus={() => setHasSelected(true)}
                onKeyUp={() => setShouldFilterList(true)}
                {...getInputProps()}
            >
                <div className={styles.label}>
                    <Text size='xs'>{label}</Text>
                </div>
                <div className={styles.content}>
                    {/* <TransferAccountTile /> */}
                    {content}
                    <LabelPairedChevronDownMdRegularIcon />
                </div>
                <Text>Helper</Text>
            </div>
            <ul
                className={`wallets-dropdown__items wallets-dropdown__items--${listHeight} ${
                    typeVariant === 'listcard' ? 'wallets-dropdown__items--listcard' : ''
                }`}
                {...getMenuProps()}
            >
                {isOpen && showListHeader && <div className='wallets-dropdown__list-header'>{listHeader}</div>}
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={classNames(
                                `wallets-dropdown__item ${
                                    typeVariant === 'listcard' ? 'wallets-dropdown__item--listcard' : ''
                                }`,
                                {
                                    'wallets-dropdown__item--active': value === item.value,
                                }
                            )}
                            key={item.value}
                            onClick={() => clearFilter()}
                            {...getItemProps({ index, item })}
                        >
                            {item?.listItem ? (
                                item?.listItem
                            ) : (
                                <Text size='sm' weight={value === item.value ? 'bold' : 'normal'}>
                                    {item.text}
                                </Text>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default TransferDropdown;
