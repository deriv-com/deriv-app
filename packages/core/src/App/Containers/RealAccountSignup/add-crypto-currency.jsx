import { Field, Formik }      from 'formik';
import PropTypes              from 'prop-types';
import React, { Component }   from 'react';
import { connect }            from 'Stores/connect';
import { localize, Localize } from 'deriv-translations';
import {
    Hr,
    RadioButtonGroup,
    RadioButton,
}                             from './currency-selector.jsx';
import FormSubmitButton       from './form-submit-button.jsx';

const messages = [
    'Choose your preferred cryptocurrency',
    'You can open an account for each cryptocurrency.',
    'Add a real account',
    'Choose a currency you would like to trade with.',
];

const Headers = ({ heading, subheading }) => (
    <React.Fragment>
        <h1>
            <Localize i18n_default_text={heading} />
        </h1>
        <h3>
            <Localize i18n_default_text={subheading} />
        </h3>
    </React.Fragment>
);

class AddCryptoCurrency extends Component {
    state = {
        available_fiat_currencies: [],
    }

    static getDerivedStateFromProps(props) {
        const fiat   = props.legal_allowed_currencies.filter(currency => currency.type === 'fiat');
        return {
            available_fiat_currencies: fiat,
        };
    }

    get can_add_fiat () {
        return !this.props.has_fiat;
    }

    get crypto_currencies () {
        return this.props.legal_allowed_currencies.filter(currency => currency.type === 'crypto');
    }

    canAddCrypto = (currency) => {
        // check if the cryptocurrency has not been created
        return this.props.available_crypto_currencies.map((e) => e.value).indexOf(currency.value) === -1;
    }

    render() {

        return (
            <Formik
                initialValues={{
                    currency: this.props.value.currency,
                }}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(false, values, actions.setSubmitting);
                }}
                render={({
                    handleSubmit,
                    // setFieldValue,
                    // setFieldTouched,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        {!this.can_add_fiat &&
                        <Headers heading={messages[0]} subheading={messages[1]} />
                        }
                        {this.can_add_fiat &&
                        <Headers heading={messages[2]} subheading={messages[3]} />
                        }
                        {this.props.available_crypto_currencies.length !== 0 ?
                            <RadioButtonGroup
                                id='crypto_currency'
                                className='currency-selector__radio-group'
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
                            :
                            <RadioButtonGroup
                                id='crypto_currency'
                                className='currency-selector__radio-group'
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
                        }
                        {this.can_add_fiat &&
                        <React.Fragment>
                            <Hr />
                            <RadioButtonGroup
                                id='fiat_currency'
                                className='currency-selector__radio-group'
                                label={localize('Fiat currencies')}
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
                        }
                        <FormSubmitButton
                            is_disabled={isSubmitting || !values.currency}
                            label={ localize('Add account') }
                            is_center={true}
                            form_error={this.props.form_error}
                        />
                    </form>
                )}
            />
        );
    }
}

AddCryptoCurrency.propTypes = {
    accounts                   : PropTypes.object,
    available_crypto_currencies: PropTypes.array,
    currencies                 : PropTypes.object,
    legal_allowed_currencies   : PropTypes.array,
    selectable_currencies      : PropTypes.array,
};
export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    accounts                   : client.accounts,
    currencies                 : client.currencies_list,
    legal_allowed_currencies   : client.upgradeable_currencies,
    has_fiat                   : client.has_fiat,
}))(AddCryptoCurrency);
