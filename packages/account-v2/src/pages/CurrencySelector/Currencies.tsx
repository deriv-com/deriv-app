import React, { useMemo } from 'react';
import { Heading, qtMerge } from '@deriv/quill-design';
import { CURRENCY_TYPES, getCurrencyConfig } from '../../constants/currencyConfig';
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
            <Heading.H5 className='mb-300'>
                {type === CURRENCY_TYPES.CRYPTO ? 'Cryptocurrencies' : 'Fiat Currencies'}
            </Heading.H5>
            <div className={qtMerge(`flex flex-wrap ${currencies.length < 4 ? 'justify-center' : ''}`)}>
                {currencies.map(currency => (
                    <CurrencyCard {...currency} key={currency.id} />
                ))}
            </div>
        </div>
    );
};

export default Currencies;
