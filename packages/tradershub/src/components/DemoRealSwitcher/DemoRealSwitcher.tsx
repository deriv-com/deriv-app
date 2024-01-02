// TODO: Create a Generic component for this once the designed is finalized.
import React, { useState } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';
import { Listbox, Transition } from '@headlessui/react';

const accountTypes = [
    { label: 'Demo', value: 'demo' },
    { label: 'Real', value: 'real' },
];

const DemoRealSwitcher = () => {
    const [selected, setSelected] = useState(accountTypes[0]);
    const { label, value } = selected;

    return (
        <div className='w-auto'>
            <Listbox as='div' onChange={setSelected} value={selected}>
                {({ open }) => (
                    <div className='relative mt-1'>
                        <Listbox.Button
                            as='button'
                            className={`cursor-pointer relative w-full py-[3px] px-400 border-75 rounded-200 flex gap-x-400 items-center ${
                                value === 'demo' ? 'border-status-light-information' : 'border-status-light-success'
                            }`}
                        >
                            <Text
                                bold
                                className={
                                    value === 'demo' ? 'text-status-light-information' : 'text-status-light-success'
                                }
                                size='sm'
                            >
                                {label}
                            </Text>
                            <LabelPairedChevronDownSmRegularIcon
                                className={qtMerge(
                                    value === 'demo' ? 'fill-status-light-information' : 'fill-status-light-success',
                                    open
                                        ? 'transform -rotate-180 transition duration-200 ease-in-out'
                                        : 'transition duration-200 ease-in-out'
                                )}
                            />
                        </Listbox.Button>
                        <Transition leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                            <Listbox.Options
                                as='div'
                                className='absolute mt-200 max-h-3000 w-full rounded-200 bg-system-light-primary-background shadow-210'
                            >
                                {accountTypes?.map(account => (
                                    <Listbox.Option
                                        as='div'
                                        className='cursor-pointer bg-system-light-primary-background hover:bg-system-light-hover-background'
                                        key={account.label}
                                        value={account}
                                    >
                                        {({ selected }) => (
                                            <Text
                                                bold={selected}
                                                className={`px-800 py-300 text-center ${
                                                    selected && 'bg-system-light-active-background'
                                                }`}
                                                size='sm'
                                            >
                                                {account.label}
                                            </Text>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                )}
            </Listbox>
        </div>
    );
};

export default DemoRealSwitcher;
