import { Field, Formik }    from 'formik';
import PropTypes            from 'prop-types';
import React, { Component } from 'react';
import { connect }          from 'Stores/connect';
import Localize             from 'App/Components/Elements/localize.jsx';
import { localize }         from 'App/i18n';
import {
    RadioButtonGroup,
    RadioButton,
}                           from './currency-selector.jsx';
import FormSubmitButton     from './form-submit-button.jsx';

class AddCryptoCurrency extends Component {
    render() {
        if (this.props.available_crypto_currencies.length === 0) {
            return null;
        }
        return (
            <Formik
                initialValues={{
                    crypto: this.props.value.crypto,
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
                        <h1>
                            <Localize i18n_default_text='Choose your preferred cryptocurrency' />
                        </h1>
                        <h3>
                            <Localize i18n_default_text='You can open an account for each cryptocurrency.' />
                        </h3>
                        <RadioButtonGroup
                            id='crypto'
                            label={localize('Crypto currencies')}
                            value={values.crypto}
                            error={errors.crypto}
                            touched={touched.crypto}
                            is_title_enabled={false}
                        >
                            {this.props.available_crypto_currencies.map(currency => (
                                <Field
                                    key={currency.value}
                                    component={RadioButton}
                                    name='crypto'
                                    id={currency.value}
                                    label={currency.name}
                                />
                            ))}
                        </RadioButtonGroup>
                        <FormSubmitButton
                            is_disabled={isSubmitting || !values.crypto}
                            label='Next' // Localization will be handled by component
                            is_absolute={false}
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
}))(AddCryptoCurrency);
