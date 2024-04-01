import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Text, useOnClickOutside } from '@deriv-com/ui';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../../../types';
import { TransferAccountTile, TransferDropdownList } from './components';
import styles from './TransferDropdown.module.scss';

type TProps = {
    accounts?: TTransferableAccounts;
    label?: string;
    message?: string;
    onChange?: (inputValue: string) => void;
    onSelect: (account: TTransferableAccounts[number]) => void;
    value: TTransferableAccounts[number] | TTransferFormikContext['fromAccount'] | TTransferFormikContext['toAccount'];
};

const TransferDropdown: React.FC<TProps> = ({ accounts, label, message, onSelect, value }) => {
    const clickOutsideRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(currentValue => !currentValue);

    useOnClickOutside(clickOutsideRef, () => {
        setIsOpen(false);
    });

    const onSelectItem = (account: TTransferableAccounts[number]) => {
        setIsOpen(false);
        return onSelect(account);
    };

    if (!accounts) return null;

    return (
        <div className={styles.container} ref={clickOutsideRef}>
            <button className={styles['selection-container']} onClick={toggleMenu}>
                <div className={styles['selection-label']}>
                    <Text size='xs'>{label}</Text>
                </div>
                <div className={styles['selection-content']}>
                    {value && <TransferAccountTile account={value} />}
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
                    {accounts.find(account => account.account_type === 'mt5') && (
                        <TransferDropdownList
                            accounts={accounts.filter(account => account.account_type === 'mt5')}
                            header='Deriv MT5 accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                    {accounts.find(account => account.account_type === 'ctrader') && (
                        <TransferDropdownList
                            accounts={accounts.filter(account => account.account_type === 'ctrader')}
                            header='Deriv cTrader accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                    {accounts.find(account => account.account_type === 'dxtrade') && (
                        <TransferDropdownList
                            accounts={accounts.filter(account => account.account_type === 'dxtrade')}
                            header='Deriv X accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                    {accounts.find(account => account.account_type === 'binary') && (
                        <TransferDropdownList
                            accounts={accounts.filter(account => account.account_type === 'binary')}
                            header='Deriv accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                </ul>
            )}
        </div>
    );
};

export default TransferDropdown;
