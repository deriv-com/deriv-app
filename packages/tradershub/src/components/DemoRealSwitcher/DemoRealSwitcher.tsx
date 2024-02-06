import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useUIContext } from '@/components';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { Button, qtMerge, Text } from '@deriv/quill-design';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';

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
    const activeAccountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';
    const activeType = accountTypes.find(account => account.value === activeAccountType);
    const [selected, setSelected] = useState(activeType);
    const { label, value } = selected || {};
    const { setUIState } = useUIContext();

    const ref = useRef(null);
    useOnClickOutside(ref, () => setIsDropdownOpen(false));

    const firstRealLoginId = tradingAccountsList?.find(acc => !acc.is_virtual)?.loginid;

    const demoLoginId = tradingAccountsList?.find(acc => acc.is_virtual)?.loginid;

    useEffect(() => {
        if (activeType) {
            setSelected(activeType);
            setUIState({
                accountType: activeAccountType,
            });
        }
    }, [activeAccountType, activeType, setUIState]);

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [selected]);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prevState => !prevState);
    }, []);

    const selectAccount = (account: TAccount) => {
        setSelected(account);
        setUIState({
            accountType: account.value,
        });

        const loginId = account.value === 'demo' ? demoLoginId : firstRealLoginId;
        if (loginId) {
            switchAccount(loginId);
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
