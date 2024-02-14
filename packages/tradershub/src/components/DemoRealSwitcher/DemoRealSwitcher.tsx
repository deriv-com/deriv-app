import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useUIContext } from '@/components';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { Button, qtMerge } from '@deriv/quill-design';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

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
                    'cursor-pointer w-full py-3 px-8 border-1 border-solid rounded-xs [&>span]:flex [&>span]:items-center [&>span]:text-14',
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
                        'transform transition duration-200 ease-in-out ml-8',
                        value === 'demo' ? 'fill-status-light-information' : 'fill-status-light-success',
                        isDropdownOpen && '-rotate-180'
                    )}
                />
            </Button>
            {isDropdownOpen && (
                <div className='absolute z-10 items-center w-full top-28 rounded-xs bg-system-light-primary-background shadow-10'>
                    {accountTypes.map(account => (
                        <div
                            className={qtMerge(
                                'cursor-pointer hover:bg-system-light-hover-background rounded-xs',
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
                            <Text
                                align='center'
                                as='p'
                                className='px-16 py-6 text-center'
                                size='sm'
                                weight={account.value === value ? 'bold' : 'normal'}
                            >
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
