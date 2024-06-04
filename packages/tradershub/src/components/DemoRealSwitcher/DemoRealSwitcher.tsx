import React, { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useOnClickOutside } from 'usehooks-ts';
import { DemoRealSwitcherLoader } from '@/components';
import { useAccountSwitcher, useRegulationFlags } from '@/hooks';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

const DemoRealSwitcher = () => {
    const { selectedAccount, setSelectedAccount, accountTypes } = useAccountSwitcher();
    const { isSuccess } = useRegulationFlags();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { label, value } = selectedAccount ?? {};

    const ref = useRef(null);
    useOnClickOutside(ref, () => setIsDropdownOpen(false));

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [selectedAccount]);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prevState => !prevState);
    }, []);

    if (!isSuccess) return <DemoRealSwitcherLoader />;

    return (
        <div className='relative inline-block w-auto ' ref={ref}>
            <button
                className={twMerge(
                    'cursor-pointer w-auto py-2 px-6 border-1 border-solid rounded-xs',
                    value === 'demo' ? 'border-status-light-information' : 'border-status-light-success '
                )}
                onClick={toggleDropdown}
            >
                <div className='flex items-center'>
                    <Text
                        className={twMerge(
                            value === 'demo' ? 'text-status-light-information' : 'text-status-light-success'
                        )}
                        size='xs'
                        weight='bold'
                    >
                        {label}
                    </Text>
                    <LabelPairedChevronDownSmRegularIcon
                        className={twMerge(
                            'transform transition duration-200 ease-in-out ml-8',
                            value === 'demo' ? 'fill-status-light-information' : 'fill-status-light-success',
                            isDropdownOpen && '-rotate-180'
                        )}
                    />
                </div>
            </button>
            {isDropdownOpen && (
                <div className='absolute z-10 flex flex-col items-center w-full top-28 rounded-xs bg-system-light-primary-background shadow-10'>
                    {accountTypes.map(account => (
                        <button
                            className={twMerge(
                                'cursor-pointer hover:bg-system-light-hover-background rounded-xs w-full',
                                account.value === value && 'bg-system-light-active-background'
                            )}
                            key={account.value}
                            onClick={() => setSelectedAccount(account)}
                        >
                            <Text
                                align='center'
                                as='p'
                                className='py-6'
                                size='sm'
                                weight={account.value === value ? 'bold' : 'normal'}
                            >
                                {account.label}
                            </Text>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DemoRealSwitcher;
