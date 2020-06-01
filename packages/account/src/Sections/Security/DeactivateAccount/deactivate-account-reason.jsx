import React from 'react';
import { localize } from '@deriv/translations';
import { Formik, Form, Field } from 'formik';
import { Checkbox } from '@deriv/components';

const initial_form = {
    other_financial_priorities: false,
};
const handleSubmit = (values) => {
    console.log(values);
};
const validateFields = (values) => {
    const error = {};

    return error;
};
const assertTotalCheckedItems = (should_check_for_limit) =>
    should_check_for_limit && Object.entries(initial_form).filter(([key, value]) => value).length === 3;
const DeactivateAccountReason = () => {
    return (
        <div className='deactivate-account-reasons'>
            <p className='deactivate-account-reasons__title'>
                {localize('Please tell us why you’re leaving. (Select up to 3 reasons.)')}
            </p>
            <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields}>
                {({ values, setFieldValue, touched, errors }) => (
                    <form>
                        <Field name='other_financial_priorities'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('Account opening reason')}
                                    error={touched.account_opening_reason && errors.account_opening_reason}
                                    description='desc'
                                    onChange={() => {
                                        const should_check_for_limit = !values.other_financial_priorities;
                                        if (assertTotalCheckedItems(should_check_for_limit)) {
                                            console.log('can not do this');
                                        } else {
                                            setFieldValue(field.name, !values.other_financial_priorities);
                                        }
                                    }}
                                />
                            )}
                        </Field>
                    </form>
                )}
            </Formik>
        </div>
    );
};
export default DeactivateAccountReason;
