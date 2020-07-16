import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { hasCorrectDecimalPlaces, getDecimalPlaces } from '@deriv/shared';
import { Button, Input } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MaxTurnoverForm = ({ submitMaxTurnover }) => {
    const initial_values = {
        max_30day_turnover: '',
    };

    validateFields = values => {
        const { currency } = this.props;
        const is_number = /^\d+(\.\d+)?$/;
        const max_number = 9999999999999;

        const required_message = localize('Please enter a max 30 days turnover.');
        const valid_number_message = localize('Should be a valid number');
        const max_number_message = localize('Reached maximum number of digits');
        const max_decimal_message = (
            <Localize
                i18n_default_text='Reached maximum number of decimals: {{decimal}}'
                values={{ decimal: getDecimalPlaces(currency) }}
            />
        );

        if (values.max_30day_turnover) {
        }
    };

    return (
        <div className='max-turnover'>
            <Formik initialValues={initial_values} onSubmit={this.handleSubmit} validate={this.validateFields}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                    <Field name='max_30day_turnover'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                type='text'
                                className='api-token__input'
                                label={localize('Token name')}
                                value={values.token_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                hint={localize('Length of token name must be between 2 and 32 characters.')}
                                required
                                error={touched.token_name && errors.token_name}
                            />
                        )}
                    </Field>
                )}
            </Formik>
            <h2 className='funds-protection__title'>{localize('Set limits')}</h2>
            <p className='funds-protection__desc'>
                {localize('Please set 30 days maximum total stake limits before deposit')}
            </p>

            <Button primary large onClick={submitFundsProtection}>
                {localize('Set limit')}
            </Button>
        </div>
    );
};

MaxTurnoverForm.propTypes = {
    submitFundsProtection: PropTypes.func,
};

export default connect(({ modules }) => ({
    submitFundsProtection: modules.cashier.submitFundsProtection,
}))(MaxTurnoverForm);
