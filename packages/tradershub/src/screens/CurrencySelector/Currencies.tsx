import React, { useMemo } from 'react';
import clsx from 'clsx';
import { InlineMessage, Text } from '@deriv-com/ui';
import { CURRENCY_TYPES, getCurrencyConfig } from '../../helpers/currencyConfig';
import CurrencyCard from './CurrencyCard';

type TCurrencies = {
    type: keyof typeof CURRENCY_TYPES;
};

/**
 * @name Currencies
 * @description The Currencies component is used to display the currencies in the currency selector screen.
 * @param {string} type - The type of the currency.
 * @returns {React.ReactNode}
 * @example <Currencies type={type} />
 * @example <Currencies type={CURRENCY_TYPES.FIAT} />
 */
const Currencies = ({ type }: TCurrencies) => {
    const currencies = useMemo(() => getCurrencyConfig(type), [type]);

    return (
        <div className='text-center'>
            <Text align='center' as='p' className='mb-6' weight='bold'>
                {type === CURRENCY_TYPES.CRYPTO ? 'Cryptocurrencies' : 'Fiat Currencies'}
            </Text>
            {type === CURRENCY_TYPES.FIAT && (
                <InlineMessage className='my-16 lg:w-[261px]' variant='info'>
                    Please note that you can only have 1 fiat account.
                </InlineMessage>
            )}
            <div
                className={clsx('flex flex-wrap justify-start', {
                    'lg:justify-center': currencies.length < 4,
                })}
            >
                {currencies.map(currency => (
                    <CurrencyCard {...currency} key={currency.id} />
                ))}
            </div>
        </div>
    );
};

export default Currencies;
