import React from 'react';
import { Formik, Field } from 'formik';
import { Checkbox, Input, FormSubmitButton, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { PlatformContext } from '@deriv/shared';

const initial_form = {
    'I have other financial priorities': false,
    'I want to stop myself from trading': false,
    "I'm no longer interested in trading": false,
    'I prefer another trading website': false,
    "The platforms aren't user-friendly": false,
    'Making deposits and withdrawals is difficult': false,
    'The platforms lack key features or functionality': false,
    'Customer service was unsatisfactory': false,
    "I'm deactivating my account for other reasons": false,
    other_trading_platforms: '',
    do_to_improve: '',
};

const DeactivateAccountReasonFrom = ({
    validateFields,
    onSubmit,
    is_checkbox_disabled,
    onChangeCheckbox,
    character_limit_no,
    onInputChange,
    onInputPaste,
    remaining_characters,
    onBackClick,
}) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    return (
        <Formik initialValues={initial_form} validate={validateFields} onSubmit={onSubmit}>
            {({ values, setFieldValue, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Field name='I have other financial priorities'>
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('I have other financial priorities.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name='I want to stop myself from trading'>
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('I want to stop myself from trading.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name="I'm no longer interested in trading">
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('I’m no longer interested in trading.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name='I prefer another trading website'>
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('I prefer another trading website.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name="The platforms aren't user-friendly">
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('The platforms aren’t user-friendly.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name='Making deposits and withdrawals is difficult'>
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('Making deposits and withdrawals is difficult.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name='The platforms lack key features or functionality'>
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('The platforms lack key features or functionality.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name='Customer service was unsatisfactory'>
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('Customer service was unsatisfactory.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name="I'm deactivating my account for other reasons">
                        {({ field }) => (
                            <Checkbox
                                disabled={is_checkbox_disabled && !values[field.name]}
                                className='deactivate-account-reasons__checkbox'
                                {...field}
                                label={localize('I’m deactivating my account for other reasons.')}
                                onChange={() => {
                                    onChangeCheckbox(values, field.name, setFieldValue);
                                }}
                            />
                        )}
                    </Field>
                    <Field name='other_trading_platforms'>
                        {({ field }) => (
                            <Input
                                {...field}
                                className='deactivate-account-reasons__input'
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='textarea'
                                placeholder={localize(
                                    'If you don’t mind sharing, which other trading platforms do you use?'
                                )}
                                name='other_trading_platforms'
                                value={values.other_trading_platforms}
                                max_characters={character_limit_no}
                                onChange={e => onInputChange(e, values.other_trading_platforms, handleChange)}
                                onPaste={onInputPaste}
                            />
                        )}
                    </Field>
                    <Field name='do_to_improve'>
                        {({ field }) => (
                            <Input
                                {...field}
                                className='deactivate-account-reasons__input'
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='textarea'
                                placeholder={localize('What could we do to improve?')}
                                name='do_to_improve'
                                value={values.do_to_improve}
                                max_characters={character_limit_no}
                                onChange={e => onInputChange(e, values.do_to_improve, handleChange)}
                                onPaste={onInputPaste}
                            />
                        )}
                    </Field>
                    <div className='deactivate-account-reasons__footer'>
                        <div className='deactivate-account-reasons__hint-wrapper'>
                            <Text size='xxs' as='p' color='less-prominent' className='deactivate-account-reasons__hint'>
                                {localize('Remaining characters: {{remaining_characters}}', {
                                    remaining_characters,
                                })}
                            </Text>
                            {Object.keys(errors).length > 0 &&
                                Object.entries(errors).map(([key, value]) => (
                                    <Text
                                        as='p'
                                        weight='bold'
                                        size='xs'
                                        color={is_dashboard ? 'blue' : 'loss-danger'}
                                        className='deactivate-account-reasons__error'
                                        key={key}
                                    >
                                        {value}
                                    </Text>
                                ))}
                        </div>
                        <FormSubmitButton
                            is_disabled={
                                // eslint-disable-next-line no-unused-vars
                                Object.keys(errors).length > 0
                            }
                            label={localize('Continue')}
                            has_cancel
                            cancel_label={localize('Back')}
                            onCancel={onBackClick}
                        />
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default DeactivateAccountReasonFrom;
