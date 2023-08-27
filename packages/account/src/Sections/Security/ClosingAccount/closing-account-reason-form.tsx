import React from 'react';
import { Field, Form, Formik, FormikErrors, FieldProps } from 'formik';
import { Checkbox, FormSubmitButton, Input, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { TClosingAccountFormValues } from 'Types';

type TClosingAccountReasonFormProps = {
    validateFields: (values: TClosingAccountFormValues) => FormikErrors<TClosingAccountFormValues>;
    onSubmit: (values: TClosingAccountFormValues) => void;
    is_checkbox_disabled: boolean;
    onChangeCheckbox: (
        values: TClosingAccountFormValues,
        field_name: string,
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
const initial_form_values: TClosingAccountFormValues = {
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

const account_closing_reasons = [
    {
        name: 'financial-priorities',
        label: <Localize i18n_default_text='I have other financial priorities.' />,
    },
    {
        name: 'stop-trading',
        label: <Localize i18n_default_text='I want to stop myself from trading.' />,
    },
    {
        name: 'not-interested',
        label: <Localize i18n_default_text='I’m no longer interested in trading.' />,
    },
    {
        name: 'another-website',
        label: <Localize i18n_default_text='I prefer another trading website.' />,
    },
    {
        name: 'not-user-friendly',
        label: <Localize i18n_default_text='The platforms aren’t user-friendly.' />,
    },
    {
        name: 'difficult-transactions',
        label: <Localize i18n_default_text='Making deposits and withdrawals is difficult.' />,
    },
    {
        name: 'lack-of-features',
        label: <Localize i18n_default_text='The platforms lack key features or functionality.' />,
    },
    {
        name: 'unsatisfactory-service',
        label: <Localize i18n_default_text='Customer service was unsatisfactory.' />,
    },
    {
        name: 'other-reasons',
        label: <Localize i18n_default_text='I’m closing my account for other reasons.' />,
    },
];

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
}: TClosingAccountReasonFormProps) => {
    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={onSubmit}>
            {({ values, setFieldValue, errors, handleChange, dirty }) => (
                <Form>
                    {account_closing_reasons.map(reason => (
                        <Field name={reason.name} key={reason.name}>
                            {({ field }: FieldProps) => (
                                <Checkbox
                                    {...field}
                                    disabled={
                                        is_checkbox_disabled && !values[field.name as keyof TClosingAccountFormValues]
                                    }
                                    className='closing-account-reasons__checkbox'
                                    label={reason.label}
                                    onChange={() => {
                                        onChangeCheckbox(values, field.name, setFieldValue);
                                    }}
                                />
                            )}
                        </Field>
                    ))}
                    <Field name='other_trading_platforms'>
                        {({ field }: FieldProps) => (
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
                        {({ field }: FieldProps) => (
                            <Input
                                {...field}
                                className='closing-account-reasons__input'
                                data-lpignore='true'
                                autoComplete='off'
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
                                <Localize
                                    i18n_default_text='Remaining characters: {{remaining_characters}}'
                                    values={{ remaining_characters }}
                                />
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
                </Form>
            )}
        </Formik>
    );
};

export default ClosingAccountReasonForm;
