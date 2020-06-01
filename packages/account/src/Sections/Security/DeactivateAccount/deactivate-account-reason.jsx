import React from 'react';
import { localize } from '@deriv/translations';
import { Formik, Field } from 'formik';
import { Checkbox } from '@deriv/components';

const initial_form = {
    other_financial_priorities: false,
    stop_trading: false,
    not_intrested: false,
    another_trading_website: false,
    not_user_friendly: false,
    is_difficult: false,
    lack_features_functionality: false,
    unsatisfactory_cs: false,
    other_reasons: false,
};
const handleSubmit = (values) => {
    console.log(values);
};
const validateFields = (values) => {
    const error = {};

    return error;
};
const assertTotalCheckedItems = (should_check_for_limit, values) =>
    !should_check_for_limit && Object.entries(values).filter(([key, value]) => value).length === 3;
const handleChange = (values, name, setFieldValue) => {
    if (assertTotalCheckedItems(values[name], values)) {
        alert('please select up to 3 reasons');
    } else {
        setFieldValue(name, !values[name]);
    }
};
const DeactivateAccountReason = () => {
    return (
        <div className='deactivate-account-reasons'>
            <p className='deactivate-account-reasons__title'>
                {localize('Please tell us why you’re leaving. (Select up to 3 reasons.)')}
            </p>
            <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields}>
                {({ values, setFieldValue, errors }) => (
                    <form>
                        <Field name='other_financial_priorities'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I have other financial priorities.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='stop_trading'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I want to stop myself from trading.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='not_intrested'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I’m no longer interested in trading.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='another_trading_website'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I prefer another trading website.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='not_user_friendly'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('The platforms aren’t user-friendly.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='is_difficult'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('Making deposits and withdrawals is difficult.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='lack_features_functionality'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('The platforms lack key features or functionality.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='unsatisfactory_cs'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('Customer service was unsatisfactory.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='other_reasons'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I’m deactivating my account for other reasons.')}
                                    onChange={() => handleChange(values, field.name, setFieldValue)}
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
