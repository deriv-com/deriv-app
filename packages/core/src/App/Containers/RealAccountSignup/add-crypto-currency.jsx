import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormSubmitButton } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile, reorderCurrencies } from '@deriv/shared';
import { RadioButtonGroup, RadioButton } from './currency-selector.jsx';

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

class AddCryptoCurrency extends React.Component {
    state = {
        available_fiat_currencies: [],
    };

    static getDerivedStateFromProps(props) {
        const fiat = props.legal_allowed_currencies.filter(currency => currency.type === 'fiat');
        return {
            available_fiat_currencies: reorderCurrencies(fiat),
        };
    }

    get can_add_fiat() {
        return !this.props.has_fiat && !this.props.should_show_crypto_only;
    }

    get crypto_currencies() {
        return reorderCurrencies(
            this.props.legal_allowed_currencies.filter(currency => currency.type === 'crypto'),
            'crypto'
        );
    }

    canAddCrypto = currency => {
        // check if the cryptocurrency has not been created
        return this.props.available_crypto_currencies.map(e => e.value).indexOf(currency.value) === -1;
    };

    render() {
        return (
            <Formik
                initialValues={{
                    currency: this.props.value.currency,
                }}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(false, values, actions.setSubmitting);
                }}
            >
                {({
                    handleSubmit,
                    // setFieldValue,
                    // setFieldTouched,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        {!this.can_add_fiat && <Headers heading={messages()[0]} subheading={messages()[1]} />}
                        {this.can_add_fiat && <Headers heading={messages()[2]} subheading={messages()[3]} />}
                        {this.can_add_fiat && (
                            <React.Fragment>
                                <RadioButtonGroup
                                    id='fiat_currency'
                                    is_fiat
                                    className='currency-selector__radio-group'
                                    value={values.currency}
                                    error={errors.currency}
                                    touched={touched.currency}
                                    is_title_enabled={this.can_add_fiat}
                                >
                                    {this.state.available_fiat_currencies.map(currency => (
                                        <Field
                                            key={currency.value}
                                            component={RadioButton}
                                            name='currency'
                                            id={currency.value}
                                            label={currency.name}
                                        />
                                    ))}
                                </RadioButtonGroup>
                            </React.Fragment>
                        )}
                        {this.can_add_fiat && (
                            <p className='currency-selector__deposit-warn'>
                                <Localize i18n_default_text='You’ll be not able to change currency once you have made a deposit.' />
                            </p>
                        )}
                        {!this.props.should_show_fiat_only &&
                            (this.props.available_crypto_currencies.length !== 0 ? (
                                <RadioButtonGroup
                                    id='crypto_currency'
                                    className='currency-selector__radio-group with-margin'
                                    label={localize('Cryptocurrencies')}
                                    value={values.currency}
                                    error={errors.currency}
                                    touched={touched.currency}
                                    is_title_enabled={this.can_add_fiat}
                                >
                                    {this.crypto_currencies.map(currency => (
                                        <Field
                                            key={currency.value}
                                            component={RadioButton}
                                            name='currency'
                                            id={currency.value}
                                            label={currency.name}
                                            selected={this.canAddCrypto(currency)}
                                        />
                                    ))}
                                </RadioButtonGroup>
                            ) : (
                                <RadioButtonGroup
                                    id='crypto_currency'
                                    className='currency-selector__radio-group with-margin'
                                    label={localize('Cryptocurrencies')}
                                    is_title_enabled={this.can_add_fiat}
                                >
                                    {this.crypto_currencies.map(currency => (
                                        <Field
                                            key={currency.value}
                                            component={RadioButton}
                                            name='currency'
                                            id={currency.value}
                                            label={currency.name}
                                            selected
                                        />
                                    ))}
                                </RadioButtonGroup>
                            ))}
                        <FormSubmitButton
                            className='currency-selector__button'
                            is_disabled={isSubmitting || !values.currency}
                            label={localize('Add account')}
                            is_absolute={!isMobile()}
                            form_error={this.props.form_error}
                        />
                    </form>
                )}
            </Formik>
        );
    }
}

AddCryptoCurrency.propTypes = {
    accounts: PropTypes.object,
    available_crypto_currencies: PropTypes.array,
    currencies: PropTypes.object,
    legal_allowed_currencies: PropTypes.array,
    selectable_currencies: PropTypes.array,
};
export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    accounts: client.accounts,
    currencies: client.currencies_list,
    legal_allowed_currencies: client.upgradeable_currencies,
    has_fiat: client.has_fiat,
}))(AddCryptoCurrency);
