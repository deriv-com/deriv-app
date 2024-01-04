import React, { useCallback, useEffect, useState } from 'react';
import { Button, qtMerge, Text } from '@deriv/quill-design';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';

const accountTypes = [
    { label: 'Demo', value: 'demo' },
    { label: 'Real', value: 'real' },
];

const DemoRealSwitcher = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selected, setSelected] = useState(accountTypes[0]);
    const { label, value } = selected;

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [selected]);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prevState => !prevState);
    }, []);

    const selectAccount = useCallback(account => {
        setSelected(account);
    }, []);

    return (
        <div className='relative inline-block w-auto'>
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
                <div className='absolute top-1400 z-10 rounded-200 bg-system-light-primary-background shadow-320 w-full'>
                    {accountTypes.map(account => (
                        <div
                            className={qtMerge(
                                'cursor-pointer hover:bg-system-light-hover-background',
                                account.value === value && 'bg-system-light-active-background'
                            )}
                            key={account.value}
                            onClick={() => selectAccount(account)}
                        >
                            <Text bold={account.value === value} className='px-800 py-300 text-center' size='sm'>
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
