import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useFormikContext } from 'formik';
import { Heading, Text } from '@deriv/quill-design';
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
    const { values } = useFormikContext<{ currency: string }>();

    const isFiatCurrencySelected = currencies.find(currency => currency.id === values.currency);

    return (
        <div className='text-center'>
            <Heading.H5 className='mb-300'>
                {type === CURRENCY_TYPES.CRYPTO ? 'Cryptocurrencies' : 'Fiat Currencies'}
            </Heading.H5>
            <div
                className={clsx('flex flex-wrap', {
                    'justify-center': currencies.length < 4,
                })}
            >
                {currencies.map(currency => (
                    <CurrencyCard {...currency} key={currency.id} />
                ))}
                {isFiatCurrencySelected && type === CURRENCY_TYPES.FIAT && (
                    <Text className='mt-200' size='sm'>
                        You are limited to one fiat account. You won’t be able to change your account currency if you
                        have already made your first deposit or created a real Deriv MT5 or Deriv X account.
                    </Text>
                )}
            </div>
        </div>
    );
};

export default Currencies;
