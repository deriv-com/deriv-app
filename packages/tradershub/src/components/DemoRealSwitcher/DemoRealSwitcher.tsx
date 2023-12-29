import React, { useState } from 'react';
import { Text } from '@deriv/quill-design';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';
import { Listbox, Transition } from '@headlessui/react';

const currencyState = [
    { color: 'status-light-information', label: 'Demo', value: 'demo' },
    { color: 'status-light-success', label: 'Real', value: 'real' },
];

const DemoRealSwitcher = () => {
    const [selected, setSelected] = useState(currencyState[0]);
    const { color, label } = selected;

    return (
        <div className='w-auto'>
            <Listbox as='div' onChange={setSelected} value={selected}>
                <div className='relative mt-1'>
                    <Listbox.Button
                        as='button'
                        className={`relative w-full cursor-default py-[3px] px-400 border-75 rounded-200 border-${color} flex gap-x-400 items-center`}
                    >
                        <Text bold className={`text-${color}`} size='sm'>
                            {label}
                        </Text>
                        <LabelPairedChevronDownSmRegularIcon className={`fill-${color}`} />
                    </Listbox.Button>
                    <Transition leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                        <Listbox.Options
                            as='div'
                            className='absolute mt-200 max-h-3000 w-full rounded-200 bg-system-light-primary-background shadow-210'
                        >
                            {currencyState?.map(currency => (
                                <Listbox.Option
                                    as='div'
                                    className='cursor-default bg-system-light-primary-background hover:bg-system-light-hover-background'
                                    key={currency.label}
                                    value={currency.value}
                                >
                                    {({ selected }) => (
                                        <Text
                                            bold={selected}
                                            className={`px-800 py-300 text-center ${
                                                selected && 'bg-system-light-active-background'
                                            }`}
                                            size='sm'
                                        >
                                            {currency.label}
                                        </Text>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};

export default DemoRealSwitcher;
