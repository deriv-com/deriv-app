import React from 'react';
import { useFormikContext } from 'formik';
import { twMerge } from 'tailwind-merge';
import { IconComponent } from '@/components';
import { StandaloneCircleInfoRegularIcon as CircleInfoIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

type TCurrencyCard = {
    className?: string;
    id: string;
    info?: boolean;
    isDisabled?: boolean;
    title: string;
    wrapperClassName?: string;
};

/**
 * @name CurrencyCard
 * @description The CurrencyCard component is used to display the currency card in the currency selector screen.
 * @param {string} id - The id of the currency.
 * @param {boolean} info - The flag to display an info for a specific currency.
 * @param {string} title - The title of the currency.
 * @param {string} wrapperClassName - The class name for the wrapper.
 * @param {string} className - The class name for the currency card.
 * @returns {React.ReactNode}
 * @example <CurrencyCard id={id} info={info} title={title} />
 */
const CurrencyCard = ({ id, info, title, wrapperClassName = '', className = '', isDisabled }: TCurrencyCard) => {
    const { setFieldValue, values } = useFormikContext<{ currency: string }>();
    const isSelected = values.currency === id;
    return (
        <div className={twMerge(`relative flex justify-center w-1/2 my-8 lg:w-1/4 ${wrapperClassName}`)}>
            <button
                className={twMerge(
                    `w-10/12 rounded-default items-center py-22 hover:cursor-pointer ${
                        isSelected
                            ? 'outline outline-2 outline-status-light-success'
                            : 'hover:outline outline-1 hover:outline-system-light-less-prominent'
                    } ${className} ${isDisabled && 'opacity-25 pointer-events-none'}`
                )}
                onClick={!isDisabled ? () => setFieldValue('currency', isSelected ? '' : id) : undefined}
                type='button'
            >
                <IconComponent icon={id} />
                {info && <CircleInfoIcon className='absolute top-0 opacity-50' />}
                <div className='flex flex-col items-center gap-4 pt-4'>
                    <Text as='p' className='my-4' size='sm' weight={isSelected ? 'bold' : 'normal'}>
                        {title}
                    </Text>
                    <Text as='p' size='sm' weight={isSelected ? 'bold' : 'normal'}>
                        ({id})
                    </Text>
                </div>
            </button>
        </div>
    );
};

export default CurrencyCard;
