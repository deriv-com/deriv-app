import React from 'react';
import { Field, Formik, FormikErrors, FormikValues } from 'formik';
import { Checkbox, FormSubmitButton, Input, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type TFormValues = {
    'financial-priorities': boolean;
    'stop-trading': boolean;
    'not-interested': boolean;
    'another-website': boolean;
    'not-user-friendly': boolean;
    'difficult-transactions': boolean;
    'lack-of-features': boolean;
    'unsatisfactory-service': boolean;
    'other-reasons': boolean;
    other_trading_platforms: string;
    do_to_improve: string;
};
const initial_form: TFormValues = {
    'financial-priorities': false,
    'stop-trading': false,
    'not-interested': false,
    'another-website': false,
    'not-user-friendly': false,
    'difficult-transactions': false,
    'lack-of-features': false,
    'unsatisfactory-service': false,
    'other-reasons': false,
    other_trading_platforms: '',
    do_to_improve: '',
};
type TClosingAccountReasonFormProps = {
    validateFields: (values: FormikValues) => FormikErrors<FormikValues>;
    onSubmit: (values: FormikValues) => void;
    is_checkbox_disabled: boolean;
    onChangeCheckbox: (
        values: FormikValues,
        field_name: keyof TFormValues,
        setFieldValue: (name: string, values: string | boolean) => void
    ) => void;
    character_limit_no: number;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        old_value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    ) => void;
    onInputPaste: (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    remaining_characters: number;
    onBackClick: () => void;
};
const ClosingAccountReasonForm = ({
    validateFields,
    onSubmit,
    is_checkbox_disabled,
    onChangeCheckbox,
    character_limit_no,
    onInputChange,
    onInputPaste,
    remaining_characters,
    onBackClick,
}: TClosingAccountReasonFormProps) => (
    <Formik initialValues={initial_form} validate={validateFields} onSubmit={onSubmit}>
        {({ values, setFieldValue, errors, handleChange, handleSubmit, dirty }) => (
            <form onSubmit={handleSubmit}>
                <Field name='financial-priorities'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('I have other financial priorities.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='stop-trading'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('I want to stop myself from trading.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='not-interested'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('I’m no longer interested in trading.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='another-website'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('I prefer another trading website.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='not-user-friendly'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('The platforms aren’t user-friendly.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='difficult-transactions'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('Making deposits and withdrawals is difficult.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='lack-of-features'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('The platforms lack key features or functionality.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='unsatisfactory-service'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('Customer service was unsatisfactory.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='other-reasons'>
                    {({ field }: FormikValues) => (
                        <Checkbox
                            disabled={is_checkbox_disabled && !values[field.name as keyof TFormValues]}
                            className='closing-account-reasons__checkbox'
                            {...field}
                            label={localize('I’m closing my account for other reasons.')}
                            onChange={() => {
                                onChangeCheckbox(values, field.name, setFieldValue);
                            }}
                        />
                    )}
                </Field>
                <Field name='other_trading_platforms'>
                    {({ field }: FormikValues) => (
                        <Input
                            {...field}
                            className='closing-account-reasons__input'
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
                    {({ field }: FormikValues) => (
                        <Input
                            {...field}
                            className='closing-account-reasons__input'
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
                <div className='closing-account-reasons__footer'>
                    <div className='closing-account-reasons__hint-wrapper'>
                        <Text size='xxs' as='p' color='less-prominent' className='closing-account-reasons__hint'>
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
                                    color='loss-danger'
                                    className='closing-account-reasons__error'
                                    key={key}
                                >
                                    {value}
                                </Text>
                            ))}
                    </div>
                    <FormSubmitButton
                        is_disabled={!dirty || Object.keys(errors).length > 0}
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

export default ClosingAccountReasonForm;
