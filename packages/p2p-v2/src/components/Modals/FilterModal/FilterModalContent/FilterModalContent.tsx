import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import { FilterModalPaymentMethods } from '../FilterModalPaymentMethods';

type TFilterModalContentProps = {
    filterOptions: {
        component: JSX.Element;
        onClick?: () => void;
        subtext: string;
        text: string;
    }[];
    paymentMethods: string[];
    setPaymentMethods: (value: string[]) => void;
    showPaymentMethods: boolean;
};

const FilterModalContent = ({
    filterOptions,
    paymentMethods,
    setPaymentMethods,
    showPaymentMethods,
}: TFilterModalContentProps) => {
    return (
        <>
            {showPaymentMethods ? (
                <FilterModalPaymentMethods
                    selectedPaymentMethods={paymentMethods}
                    setSelectedPaymentMethods={setPaymentMethods}
                />
            ) : (
                <>
                    {filterOptions.map(option => (
                        <div
                            className={clsx(
                                'py-8 px-[1.6rem] flex items-center justify-between border-b-[1px] border-solid border-[#f2f3f4]',
                                {
                                    'cursor-pointer': option.onClick,
                                }
                            )}
                            key={option.text}
                            onClick={option.onClick}
                        >
                            <div className='flex flex-col'>
                                <Text size='sm'>{option.text}</Text>
                                <Text color='less-prominent' size='sm'>
                                    {option.subtext}
                                </Text>
                            </div>
                            {option.component}
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

export default FilterModalContent;
