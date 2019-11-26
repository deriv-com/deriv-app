import { Field, Formik }      from 'formik';
import PropTypes              from 'prop-types';
import React, { Component }   from 'react';
import { connect }            from 'Stores/connect';
import { localize, Localize } from 'deriv-translations';
import {
    RadioButtonGroup,
    RadioButton,
    reorderFiatCurrencies,
} from './currency-selector.jsx';
import FormSubmitButton       from './form-submit-button.jsx';

class ChangeAccountCurrency extends Component {
    state = {
        selectable_currencies: [],
    };

    static getDerivedStateFromProps(props) {
        return {
            selectable_currencies: reorderFiatCurrencies(props.legal_allowed_currencies.filter(currency => currency.type === 'fiat')),
        };
    }

    render() {
        return (
            <Formik
                initialValues={{
                    fiat: this.props.value.fiat,
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
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    >
                        <h1>
                            <Localize i18n_default_text='Change your currency' />
                        </h1>
                        <h3>
                            <Localize i18n_default_text='Choose the currency you would like to trade with.' />
                        </h3>
                        <RadioButtonGroup
                            id='fiat'
                            label={localize('Cryptocurrencies')}
                            value={values.fiat}
                            error={errors.fiat}
                            touched={touched.fiat}
                            is_title_enabled={false}
                        >
                            {this.state.selectable_currencies.map(currency => (
                                <Field
                                    key={currency.value}
                                    component={RadioButton}
                                    name='fiat'
                                    id={currency.value}
                                    label={currency.name}
                                    selected={currency.value === this.props.currency}
                                />
                            ))}
                        </RadioButtonGroup>
                        <FormSubmitButton
                            is_disabled={isSubmitting || !values.fiat}
                            label={ localize('Change currency') }
                            is_absolute={false}
                            is_center
                            form_error={this.props.form_error}
                        />
                    </form>
                )}
            />
        );
    }
}

ChangeAccountCurrency.propTypes = {
    currencies              : PropTypes.object,
    form_error              : PropTypes.string,
    legal_allowed_currencies: PropTypes.array,
    selectable_currencies   : PropTypes.array,
};
export default connect(({ client }) => ({
    currencies              : client.currencies_list,
    legal_allowed_currencies: client.upgradeable_currencies,
    selectable_currencies   : client.selectable_currencies,
    currency                : client.currency,
}))(ChangeAccountCurrency);
