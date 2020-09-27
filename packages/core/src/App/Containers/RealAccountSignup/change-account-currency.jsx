import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormSubmitButton } from '@deriv/components';
import { isMobile, reorderCurrencies } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { localize, Localize } from '@deriv/translations';
import { RadioButtonGroup, RadioButton } from './currency-selector.jsx';

class ChangeAccountCurrency extends React.Component {
    state = {
        selectable_currencies: [],
    };

    static getDerivedStateFromProps(props) {
        return {
            selectable_currencies: reorderCurrencies(
                props.legal_allowed_currencies.filter(currency => currency.type === 'fiat')
            ),
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
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <h1 className='change-currency__title'>
                            <Localize i18n_default_text='Change your currency' />
                        </h1>
                        <h3 className='change-currency__sub-title'>
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
                            className='change-currency__button'
                            is_disabled={isSubmitting || !values.fiat}
                            label={localize('Change currency')}
                            is_absolute={!isMobile()}
                            form_error={this.props.form_error}
                        />
                    </form>
                )}
            </Formik>
        );
    }
}

ChangeAccountCurrency.propTypes = {
    currencies: PropTypes.object,
    form_error: PropTypes.string,
    legal_allowed_currencies: PropTypes.array,
    selectable_currencies: PropTypes.array,
};
export default connect(({ client }) => ({
    currencies: client.currencies_list,
    legal_allowed_currencies: client.upgradeable_currencies,
    selectable_currencies: client.selectable_currencies,
    currency: client.currency,
}))(ChangeAccountCurrency);
