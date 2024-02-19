import React from 'react';
import { clsx } from 'clsx';
import { useFormikContext } from 'formik';
import { StandaloneCircleInfoRegularIcon as CircleInfoIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { getCurrencyConfig } from '../../helpers/currencyConfig';

type TCurrencyCard = ReturnType<typeof getCurrencyConfig>[number];

// write docs for the component
/**
 * @name CurrencyCard
 * @description The CurrencyCard component is used to display the currency card in the currency selector screen.
 * @param {React.ReactNode} icon - The icon of the currency.
 * @param {string} id - The id of the currency.
 * @param {boolean} info - The info of the currency.
 * @param {string} title - The title of the currency.
 * @returns {React.ReactNode}
 * @example <CurrencyCard icon={Icon} id={id} info={info} title={title} />
 */
const CurrencyCard = ({ icon: Icon, id, info, title }: TCurrencyCard) => {
    const { setFieldValue, values } = useFormikContext<{ currency: string }>();
    const isSelected = values.currency === id;
    return (
        <div className='relative flex justify-center w-1/2 my-8 lg:w-1/4'>
            <button
                className={clsx(
                    `w-10/12 rounded-default items-center py-22 hover:cursor-pointer ${
                        isSelected
                            ? 'outline outline-2 outline-status-light-success'
                            : 'hover:outline outline-1 hover:outline-system-light-less-prominent'
                    }`
                )}
                onClick={() => setFieldValue('currency', isSelected ? '' : id)}
                type='button'
            >
                <Icon />
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
