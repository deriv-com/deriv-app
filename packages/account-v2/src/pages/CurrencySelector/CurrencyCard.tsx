import React from 'react';
import { useFormikContext } from 'formik';
import { qtMerge, Text } from '@deriv/quill-design';
import { StandaloneCircleInfoRegularIcon as CircleInfoIcon } from '@deriv/quill-icons';
import { getCurrencyConfig } from '../../constants/currencyConfig';

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
    return (
        <div className='relative flex justify-center w-1/4 my-400'>
            <div
                className={qtMerge(
                    `w-10/12 rounded-400 py-1100 hover:cursor-pointer hover:outline outline-1 ${
                        values.currency === id ? 'outline outline-2' : ''
                    }`
                )}
                onClick={() => setFieldValue('currency', id)}
            >
                <Icon />
                {info && <CircleInfoIcon className='absolute top-50 opacity-300' />}
                <Text className='my-200' size='sm'>
                    {title}
                </Text>
                <Text size='sm'>({id})</Text>
            </div>
        </div>
    );
};

export default CurrencyCard;
