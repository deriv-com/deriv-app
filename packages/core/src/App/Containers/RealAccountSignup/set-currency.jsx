import classNames from 'classnames';
import React from 'react';
import { localize } from '@deriv/translations';
import { currencySelectorConfig } from '@deriv/account';
import { website_name, generateValidationFunction } from '@deriv/shared';
import { Text } from '@deriv/components';
import CurrencySelector from '@deriv/account/src/Components/currency-selector';
import LoadingModal from './real-account-signup-loader.jsx';
import 'Sass/set-currency.scss';
import 'Sass/change-account.scss';
import { observer, useStore } from '@deriv/stores';

const SetCurrency = observer(({ setLoading, onSuccessSetAccountCurrency, onError, is_loading, ...props }) => {
    const { client } = useStore();
    const { available_crypto_currencies, has_fiat, landing_company_shortcode, setAccountCurrency } = client;
    const form_error = React.useState('');
    const form_value = React.useState({ currency: '' });

    const setCurrency = (obj, setSubmitting) => {
        setLoading(true);
        const { currency } = obj;
        if (currency) {
            setAccountCurrency(currency)
                .then(response => {
                    setSubmitting(false);
                    onSuccessSetAccountCurrency('', response.echo_req.set_account_currency);
                })
                .catch(error_message => {
                    onError(error_message);
                })
                .finally(() => setLoading(false));
        }
    };

    const updateValue = (index, value, setSubmitting) => {
        setCurrency(value, setSubmitting);
    };

    const noCryptoAvailable = () => {
        return available_crypto_currencies.length === 0 && has_fiat && props.currency;
    };

    if (is_loading) return <LoadingModal />;
    return (
        <div
            className={classNames('set-currency-modal', {
                'set-currency-modal--disabled': noCryptoAvailable(),
            })}
        >
            {noCryptoAvailable() && (
                <div className='set-currency-modal--disabled-message'>
                    <p>
                        {localize(
                            'You already have an account for each of the cryptocurrencies available on {{deriv}}.',
                            {
                                deriv: website_name,
                            }
                        )}
                    </p>
                </div>
            )}
            <div className='set-currency-modal__heading-container'>
                <Text
                    as='p'
                    size='xs'
                    line_height='s'
                    align='center'
                    className='set-currency-modal__heading-container__main-heading'
                >
                    {localize(
                        'You have an account that do not have currency assigned. Please choose a currency to trade with this account.'
                    )}
                </Text>
                <Text
                    as='p'
                    weight='bold'
                    align='center'
                    className='set-currency-modal__heading-container__sub-heading'
                >
                    {localize('Select your preferred currency')}
                </Text>
            </div>
            <CurrencySelector
                className='account-wizard__body'
                onSubmit={updateValue}
                value={form_value}
                form_error={form_error}
                set_currency
                validate={generateValidationFunction(landing_company_shortcode, currencySelectorConfig)}
                {...props}
            />
        </div>
    );
});

export default SetCurrency;
