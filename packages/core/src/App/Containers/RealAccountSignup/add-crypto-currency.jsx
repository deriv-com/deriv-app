import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormSubmitButton, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile, reorderCurrencies } from '@deriv/shared';
import { CurrencyRadioButtonGroup, CurrencyRadioButton } from '@deriv/account';
import './currency-selector.scss';

const messages = () => [
    <Localize key={0} i18n_default_text='Choose your preferred cryptocurrency' />,
    <Localize key={1} i18n_default_text='You can open an account for each cryptocurrency.' />,
    <Localize key={2} i18n_default_text='Add a real account' />,
    <Localize key={3} i18n_default_text='Choose a currency you would like to trade with.' />,
];

const Headers = ({ heading, subheading }) => (
    <React.Fragment>
        <h1 className='add-crypto-currency__title'>{heading}</h1>
        <h3 className='add-crypto-currency__sub-title'>{subheading}</h3>
    </React.Fragment>
);

const FIAT_CURRENCY_TYPE = 'fiat';
const CRYPTO_CURRENCY_TYPE = 'crypto';

const AddCryptoCurrency = ({
    available_crypto_currencies,
    form_error,
    has_fiat,
    legal_allowed_currencies,
    onSubmit,
    should_show_crypto_only,
    should_show_fiat_only,
    value,
}) => {
    const getReorderedFiatCurrencies = () =>
        reorderCurrencies(legal_allowed_currencies.filter(currency => currency.type === FIAT_CURRENCY_TYPE));
    const getReorderedCryptoCurrencies = () =>
        reorderCurrencies(
            legal_allowed_currencies.filter(currency => currency.type === CRYPTO_CURRENCY_TYPE),
            CRYPTO_CURRENCY_TYPE
        );

    const canAddFiat = () => !has_fiat && !should_show_crypto_only;
    const canAddCrypto = currency => {
        // check if the cryptocurrency has not been created
        return available_crypto_currencies.map(e => e.value).indexOf(currency.value) === -1;
    };

    return (
        <Formik
            initialValues={{
                currency: value.currency,
            }}
            onSubmit={(values, actions) => {
                onSubmit(false, values, actions.setSubmitting);
            }}
        >
            {({ handleSubmit, values, errors, touched, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    {!canAddFiat() && <Headers heading={messages()[0]} subheading={messages()[1]} />}
                    {canAddFiat() && <Headers heading={messages()[2]} subheading={messages()[3]} />}
                    {canAddFiat() && (
                        <React.Fragment>
                            <CurrencyRadioButtonGroup
                                id='fiat_currency'
                                is_fiat
                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                value={values.currency}
                                error={errors.currency}
                                touched={touched.currency}
                                is_title_enabled={canAddFiat()}
                                item_count={getReorderedFiatCurrencies().length}
                            >
                                {getReorderedFiatCurrencies().map(currency => (
                                    <Field
                                        key={currency.value}
                                        component={CurrencyRadioButton}
                                        name='currency'
                                        id={currency.value}
                                        label={currency.name}
                                    />
                                ))}
                            </CurrencyRadioButtonGroup>
                        </React.Fragment>
                    )}
                    {canAddFiat() && (
                        <Text as='p' color='prominent' size='xxs' className='currency-selector__deposit-warn'>
                            <Localize i18n_default_text='You’ll be not able to change currency once you have made a deposit.' />
                        </Text>
                    )}
                    {!should_show_fiat_only &&
                        (available_crypto_currencies.length !== 0 ? (
                            <CurrencyRadioButtonGroup
                                id='crypto_currency'
                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                label={localize('Cryptocurrencies')}
                                value={values.currency}
                                error={errors.currency}
                                touched={touched.currency}
                                is_title_enabled={canAddFiat()}
                                item_count={getReorderedCryptoCurrencies().length}
                            >
                                {getReorderedCryptoCurrencies().map(currency => (
                                    <Field
                                        key={currency.value}
                                        component={CurrencyRadioButton}
                                        name='currency'
                                        id={currency.value}
                                        label={currency.name}
                                        selected={canAddCrypto(currency)}
                                    />
                                ))}
                            </CurrencyRadioButtonGroup>
                        ) : (
                            <CurrencyRadioButtonGroup
                                id='crypto_currency'
                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                label={localize('Cryptocurrencies')}
                                is_title_enabled={canAddFiat()}
                                item_count={getReorderedCryptoCurrencies().length}
                            >
                                {getReorderedCryptoCurrencies().map(currency => (
                                    <Field
                                        key={currency.value}
                                        component={CurrencyRadioButton}
                                        name='currency'
                                        id={currency.value}
                                        label={currency.name}
                                        selected
                                    />
                                ))}
                            </CurrencyRadioButtonGroup>
                        ))}
                    <FormSubmitButton
                        className='currency-selector__button'
                        is_disabled={isSubmitting || !values.currency}
                        label={localize('Add account')}
                        is_absolute={!isMobile()}
                        form_error={form_error}
                    />
                </form>
            )}
        </Formik>
    );
};

AddCryptoCurrency.propTypes = {
    available_crypto_currencies: PropTypes.array,
    legal_allowed_currencies: PropTypes.array,
    has_fiat: PropTypes.bool,
};
export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    legal_allowed_currencies: client.upgradeable_currencies,
    has_fiat: client.has_fiat,
}))(AddCryptoCurrency);
