import React, { useMemo } from 'react';
import { Heading, qtMerge, Text } from '@deriv/quill-design';
import { CURRENCY_TYPES, getCurrencyConfig } from '../../constants/currencyConfig';

type TCurrencies = {
    type: keyof typeof CURRENCY_TYPES;
};

const Currencies = ({ type }: TCurrencies) => {
    const currencies = useMemo(() => getCurrencyConfig(type), [type]);
    return (
        <div className='text-center'>
            <Heading.H5 className='mb-300'>
                {type === CURRENCY_TYPES.CRYPTO ? 'Cryptocurrencies' : 'Fiat Currencies'}
            </Heading.H5>
            <div className={qtMerge(`flex flex-wrap ${currencies.length < 4 ? 'justify-center' : ''}`)}>
                {currencies.map(({ icon: Icon, key, title }) => (
                    <div className='w-1/4 box-border my-1000 cursor-pointer' key={key}>
                        <Icon />
                        <Text className='my-200' size='sm'>
                            {title}
                        </Text>
                        <Text size='sm'>({key})</Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Currencies;
