import React from 'react';
import { Form, Formik } from 'formik';
import { twMerge } from 'tailwind-merge';
import { TCurrencyConfig } from '@/hooks/useCurrencies';
import CurrencyCard from '@/screens/CurrencySelector/CurrencyCard';
import { Button, InlineMessage, Text, useDevice } from '@deriv-com/ui';

type TCurrenciesForm = {
    allCryptoCurrenciesAreAdded?: boolean;
    currencies: TCurrencyConfig[];
    isSubmitButtonDisabled?: boolean;
    submitButtonLabel?: string;
};

/**
 * @name CurrenciesForm
 * @description The CurrenciesForm component is used to display the currencies form.
 * @param {TCurrenciesForm} props - The props of the component.
 * @param {TCurrencyConfig[]} props.currencies - The currencies to display.
 * @param {string} props.submitButtonLabel - The label for the submit button.
 * @returns {React.ReactNode}
 */
const CurrenciesForm = ({
    currencies,
    submitButtonLabel,
    isSubmitButtonDisabled = false,
    allCryptoCurrenciesAreAdded = false,
}: TCurrenciesForm) => {
    const { isDesktop } = useDevice();

    return (
        <Formik
            initialValues={{
                currency: '',
            }}
            // will add submit handler later with the API call
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onSubmit={() => {}}
        >
            {() => (
                <Form className='flex flex-col items-center justify-between h-full min-h-0 py-16 lg:px-16 lg:p-24'>
                    <div
                        className={twMerge(
                            'overflow-y-auto flex flex-wrap justify-start w-full lg:w-[80%]',
                            currencies?.length < 4 ? 'lg:justify-center' : ''
                        )}
                    >
                        {allCryptoCurrenciesAreAdded && (
                            <InlineMessage className='mx-16 bg-opacity-16 bg-status-light-warning lg:mx-0'>
                                <Text align='center' as='p' className='w-full text-sm'>
                                    You already have an account for each of the cryptocurrencies available on Deriv.
                                </Text>
                            </InlineMessage>
                        )}
                        {currencies.map(currency => (
                            <CurrencyCard
                                className='flex flex-col justify-center'
                                id={currency?.id}
                                isDisabled={currency?.isAdded}
                                key={currency?.id}
                                title={currency?.name ?? ''}
                            />
                        ))}
                    </div>
                    <div className='flex items-center justify-end w-full px-16 pt-24 border-t border-solid border-t-system-light-secondary-background lg:px-0'>
                        <Button disabled={isSubmitButtonDisabled} isFullWidth={!isDesktop} type='submit'>
                            {submitButtonLabel ?? 'Add account'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CurrenciesForm;
