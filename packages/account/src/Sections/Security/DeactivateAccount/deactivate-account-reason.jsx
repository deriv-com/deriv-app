import React from 'react';
import { localize } from '@deriv/translations';
import { Formik, Field } from 'formik';
import { Checkbox, Input, FormSubmitButton } from '@deriv/components';

const initial_form = {
    otherFinancialPriorities: false,
    stopTrading: false,
    notIntrested: false,
    anotherTradingWebsite: false,
    notUserFriendly: false,
    isDifficult: false,
    lackFeaturesFunctionality: false,
    unsatisfactoryCs: false,
    otherReasons: false,
    otherTradingPlatforms: '',
    doToImprove: '',
};

const handleSubmitForm = (values) => {
    const selected_reasons = selectedReasons(values)
        .map((val) => val[0])
        .toString();
    const final_value = `${selected_reasons}, otherTradingPlatform ${values.otherTradingPlatforms}, doToImprove ${values.doToImprove}`;
    console.log(final_value);
};
const preparingReason = (values) => {
    const reason = '';
};
const selectedReasons = (values) =>
    Object.entries(values).filter(([key, value]) => !['otherTradingPlatforms', 'doToImprove'].includes(key) && value);
const validateFields = (values) => {
    const error = {};
    const selected_reason_count = selectedReasons(values).length;
    if (selected_reason_count === 0 && values.otherTradingPlatforms.length === 0 && values.doToImprove.length === 0) {
        error.empty_reason = 'please select at least one reason or share your opinion';
    } else {
        if (selected_reason_count > 0 && (values.otherTradingPlatforms + values.doToImprove).length === 0) {
            return error;
        } else if ((values.otherTradingPlatforms + values.doToImprove).length > 0) {
            const max_letter = 250;
            const selected_reasons = selectedReasons(values)
                .map((val) => val[0])
                .toString();
            const max_letter_can_use = max_letter - selected_reasons.length;
            const final_value = `${selected_reasons}, otherTradingPlatform ${values.otherTradingPlatforms}, doToImprove ${values.doToImprove}`;
            const regex_rule = `^[0-9A-Za-z .,'-]{42,${max_letter}}$`;
            if (!new RegExp(regex_rule).test(final_value)) {
                error.letter_limits = `please insert between 5-${max_letter_can_use} characters combine both fields.`;
            }
        }
    }
    return error;
};

const assertTotalCheckedItems = (should_check_for_limit, values) =>
    !should_check_for_limit && selectedReasons(values).length === 3;

const handleChangeCheckbox = (values, name, setFieldValue) => {
    if (assertTotalCheckedItems(values[name], values)) {
        console.log(values);
    } else {
        setFieldValue(name, !values[name]);
    }
};

const DeactivateAccountReason = (props) => {
    return (
        <div className='deactivate-account-reasons'>
            <p className='deactivate-account-reasons__title'>
                {localize('Please tell us why you’re leaving. (Select up to 3 reasons.)')}
            </p>
            <Formik initialValues={initial_form} validate={validateFields} onSubmit={handleSubmitForm}>
                {({ values, setFieldValue, errors, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name='otherFinancialPriorities'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I have other financial priorities.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='stopTrading'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I want to stop myself from trading.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='notIntrested'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I’m no longer interested in trading.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='anotherTradingWebsite'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I prefer another trading website.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='notUserFriendly'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('The platforms aren’t user-friendly.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='isDifficult'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('Making deposits and withdrawals is difficult.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='lackFeaturesFunctionality'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('The platforms lack key features or functionality.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='unsatisfactoryCs'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('Customer service was unsatisfactory.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='otherReasons'>
                            {({ field }) => (
                                <Checkbox
                                    {...field}
                                    label={localize('I’m deactivating my account for other reasons.')}
                                    onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                />
                            )}
                        </Field>
                        <Field name='otherTradingPlatforms'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    data-lpignore='true'
                                    autoComplete='off' // prevent chrome autocomplete
                                    type='text'
                                    placeholder='If you don’t mind sharing, which other trading platforms do you use?'
                                    name='otherTradingPlatforms'
                                    value={values.otherTradingPlatforms}
                                    onChange={handleChange}
                                />
                            )}
                        </Field>
                        <Field name='doToImprove'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    data-lpignore='true'
                                    autoComplete='off' // prevent chrome autocomplete
                                    type='text'
                                    placeholder='What could we do to improve?'
                                    name='doToImprove'
                                    value={values.doToImprove}
                                    onChange={handleChange}
                                />
                            )}
                        </Field>
                        {Object.keys(errors).length > 0 &&
                            Object.entries(errors).map(([key, value]) => <p key={key}>{value}</p>)}
                        <FormSubmitButton
                            is_disabled={
                                // eslint-disable-next-line no-unused-vars
                                Object.keys(errors).length > 0
                            }
                            label={localize('Continue')}
                            has_cancel
                            cancel_label={localize('Back')}
                            onCancel={() => props.onBackClick()}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
export default DeactivateAccountReason;
