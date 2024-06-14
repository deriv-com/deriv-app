import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { useOnClickOutside } from 'usehooks-ts';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../../../types';
import { TransferAccountTile, TransferDropdownList } from './components';
import styles from './TransferDropdown.module.scss';

type TProps = {
    accounts: TTransferableAccounts;
    label: string;
    message?: string;
    onSelect: (account: TTransferableAccounts[number]) => void;
    value: TTransferFormikContext['fromAccount'];
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
        onSelect(account);
    };

    const dropdownAccounts = {
        'Deriv MT5 accounts': accounts.filter(account => account.account_type === 'mt5'),
        // eslint-disable-next-line sort-keys
        'Deriv cTrader accounts': accounts.filter(account => account.account_type === 'ctrader'),
        'Deriv X accounts': accounts.filter(account => account.account_type === 'dxtrade'),
        // eslint-disable-next-line sort-keys
        'Deriv accounts': accounts.filter(account => account.account_type === 'binary'),
    };

    return (
        <div className={styles.container} ref={clickOutsideRef}>
            <div className={styles['selection-container']}>
                <div className={styles['selection-label']}>
                    <Text size='2xs'>{label}</Text>
                </div>
                <button
                    className={styles['selection-content']}
                    data-testid='dt_transfer_dropdown_selection_toggle'
                    onClick={toggleMenu}
                >
                    {value && <TransferAccountTile account={value} iconSize='xs' />}
                    <LabelPairedChevronDownMdRegularIcon
                        className={clsx(styles.arrow, {
                            [styles['arrow--flip']]: isOpen,
                        })}
                    />
                </button>
                <Text className={styles['helper-message']} color='less-prominent' size='xs'>
                    {message}
                </Text>
            </div>
            {isOpen && <TransferDropdownList accounts={dropdownAccounts} onSelect={onSelectItem} value={value} />}
        </div>
    );
};

export default TransferDropdown;
