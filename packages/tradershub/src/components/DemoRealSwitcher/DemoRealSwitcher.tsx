import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { Button, qtMerge, Text } from '@deriv/quill-design';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';
import { useUIContext } from '../UIProvider';

type TAccount = {
    label: string;
    value: string;
};

const accountTypes = [
    { label: 'Demo', value: 'demo' },
    { label: 'Real', value: 'real' },
];

const DemoRealSwitcher = () => {
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { switchAccount } = useAuthorize();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selected, setSelected] = useState(accountTypes[0]);
    const { label, value } = selected;
    const { setUIState } = useUIContext();

    const ref = useRef(null);
    useOnClickOutside(ref, () => setIsDropdownOpen(false));

    useEffect(() => {
        const activeAccountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';

        const activeAccount = accountTypes.find(account => account.value === activeAccountType);

        if (activeAccount) {
            setSelected(activeAccount);
            setUIState('accountType', activeAccountType);
        }
    }, [activeTradingAccount, setUIState]);

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [selected]);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prevState => !prevState);
    }, []);

    const firstRealLoginId = tradingAccountsList?.find(acc => !acc.is_virtual)?.loginid;

    const demoLoginId = tradingAccountsList?.find(acc => acc.is_virtual)?.loginid;

    const selectAccount = (account: TAccount) => {
        setSelected(account);

        const loginId = account.value === 'demo' ? demoLoginId : firstRealLoginId;
        if (loginId) {
            setUIState('accountType', account.value);
            switchAccount(loginId);
        } else {
            setUIState('accountType', account.value);
        }
    };

    return (
        <div className='relative inline-block w-auto' ref={ref}>
            <Button
                className={qtMerge(
                    'cursor-pointer w-full py-[3px] px-400 border-75 rounded-200 [&>span]:flex [&>span]:items-center [&>span]:text-[14px]',
                    value === 'demo'
                        ? 'border-status-light-information text-status-light-information'
                        : 'border-status-light-success text-status-light-success'
                )}
                colorStyle='white'
                iconPosition='end'
                onClick={toggleDropdown}
                size='sm'
                variant='secondary'
            >
                {label}
                <LabelPairedChevronDownSmRegularIcon
                    className={qtMerge(
                        'transform transition duration-200 ease-in-out ml-400',
                        value === 'demo' ? 'fill-status-light-information' : 'fill-status-light-success',
                        isDropdownOpen && '-rotate-180'
                    )}
                />
            </Button>
            {isDropdownOpen && (
                <div className='absolute z-10 w-full top-1400 rounded-200 bg-system-light-primary-background shadow-320'>
                    {accountTypes.map(account => (
                        <div
                            className={qtMerge(
                                'cursor-pointer hover:bg-system-light-hover-background rounded-200',
                                account.value === value && 'bg-system-light-active-background'
                            )}
                            key={account.value}
                            onClick={() => selectAccount(account)}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    selectAccount(account);
                                }
                            }}
                            role='button'
                        >
                            <Text bold={account.value === value} className='text-center px-800 py-300' size='sm'>
                                {account.label}
                            </Text>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DemoRealSwitcher;
