import { useReducer, useEffect, ChangeEvent, ClipboardEvent } from 'react';
import { Field, Form, Formik, FormikErrors, FieldProps, FormikValues } from 'formik';
import { Checkbox, FormSubmitButton, Input, Text } from '@deriv/components';
import { useTranslations, Localize } from '@deriv-com/translations';
import { TClosingAccountFormValues } from '../../../Types';
import {
    CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT,
    MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT,
    SET_CHECKBOX_DISABLED,
    SET_REMAINING_CHARACTERS,
    SET_TOTAL_ACCUMULATED_CHARACTERS,
    SET_TOTAL_CHECKBOX_CHECKED,
    getCloseAccountReasonsList,
} from '../../../Constants/closing-account-config';

type TClosingAccountReasonFormProps = {
    onBackClick: () => void;
    onConfirmClick: (reason: string) => void;
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

type TFormError = FormikErrors<TClosingAccountFormValues> & {
    empty_reason?: string;
    characters_limits?: string;
};

type TCustomState = {
    is_checkbox_disabled: boolean;
    total_checkbox_checked: number;
    remaining_characters: number;
    total_accumulated_characters: number;
};
type TAction =
    | { type: 'SET_CHECKBOX_DISABLED'; payload: boolean }
    | { type: 'SET_TOTAL_CHECKBOX_CHECKED'; payload: number }
    | { type: 'SET_REMAINING_CHARACTERS'; payload: number }
    | { type: 'SET_TOTAL_ACCUMULATED_CHARACTERS'; payload: number };

const initial_state = {
    is_checkbox_disabled: false,
    total_checkbox_checked: 0,
    remaining_characters: CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT,
    total_accumulated_characters: 0,
};

const reducer = (state: TCustomState, action: TAction) => {
    switch (action.type) {
        case SET_CHECKBOX_DISABLED:
            return { ...state, is_checkbox_disabled: action.payload };
        case SET_TOTAL_CHECKBOX_CHECKED:
            return { ...state, total_checkbox_checked: action.payload };
        case SET_REMAINING_CHARACTERS:
            return { ...state, remaining_characters: action.payload };
        case SET_TOTAL_ACCUMULATED_CHARACTERS:
            return { ...state, total_accumulated_characters: action.payload };
        default:
            return state;
    }
};

const ClosingAccountReasonForm = ({ onBackClick, onConfirmClick }: TClosingAccountReasonFormProps) => {
    const [state, dispatch] = useReducer(reducer, initial_state);
    const { localize } = useTranslations();

    const { is_checkbox_disabled, total_checkbox_checked, remaining_characters, total_accumulated_characters } = state;

    useEffect(() => {
        if (total_checkbox_checked === MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT) {
            dispatch({ type: SET_CHECKBOX_DISABLED, payload: true });
        } else if (is_checkbox_disabled) dispatch({ type: SET_CHECKBOX_DISABLED, payload: false });
    }, [total_checkbox_checked, is_checkbox_disabled]);

    const validateFields = (values: TClosingAccountFormValues) => {
        const error: TFormError = {};
        const selected_reason_count = selectedReasonsForCloseAccount(values).length;
        const text_inputs_length = (values.other_trading_platforms + values.do_to_improve).length;
        let remaining_chars = CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT - text_inputs_length;

        if (selected_reason_count) {
            const final_value = formatReasonsForCloseAccount(values);
            remaining_chars = remaining_chars >= 0 ? remaining_chars : 0;

            if (!/^[a-zA-Z0-9.,'\-\s]*$/.test(final_value)) {
                error.characters_limits = localize("Must be numbers, letters, and special characters . , ' -");
            }
        } else {
            error.empty_reason = localize('Please select at least one reason');
        }

        dispatch({ type: SET_TOTAL_ACCUMULATED_CHARACTERS, payload: text_inputs_length });
        dispatch({ type: SET_REMAINING_CHARACTERS, payload: remaining_chars });

        return error;
    };

    const handleSubmitForm = (values: TClosingAccountFormValues) => {
        const final_reason = formatReasonsForCloseAccount(values);

        onConfirmClick(final_reason);
    };

    const handleChangeCheckbox = (
        values: FormikValues,
        name: string,
        setFieldValue: (name: string, values: string | boolean) => void
    ) => {
        if (!values[name]) {
            dispatch({ type: SET_TOTAL_CHECKBOX_CHECKED, payload: total_checkbox_checked + 1 });

            setFieldValue(name, !values[name]);
        } else {
            dispatch({ type: SET_TOTAL_CHECKBOX_CHECKED, payload: total_checkbox_checked - 1 });

            setFieldValue(name, !values[name]);
        }
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        old_value: string,
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    ) => {
        const value = event.target.value;
        const is_delete_action = old_value.length > value.length;

        if (
            (remaining_characters <= 0 || total_accumulated_characters >= CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT) &&
            !is_delete_action
        ) {
            event.preventDefault();
        } else {
            onChange(event);
        }
    };

    const handleInputPaste = async (e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        const clipboardData = e.clipboardData.getData('text') || (await navigator.clipboard.readText());

        if (remaining_characters <= 0 || clipboardData.length > remaining_characters) {
            e.preventDefault();
        }
    };

    const formatReasonsForCloseAccount = (values: TClosingAccountFormValues) => {
        let selected_reasons = selectedReasonsForCloseAccount(values)
            .map(val => val[0])
            .toString();
        const is_other_trading_platform__has_value = !!values.other_trading_platforms.length;
        const is_to_do_improve_has_value = !!values.do_to_improve.length;
        if (is_other_trading_platform__has_value) {
            selected_reasons = `${selected_reasons}, ${values.other_trading_platforms}`;
        }
        if (is_to_do_improve_has_value) {
            selected_reasons = `${selected_reasons}, ${values.do_to_improve}`;
        }

        return selected_reasons.replace(/(\r\n|\n|\r)/gm, ' ');
    };

    const selectedReasonsForCloseAccount = (values: TClosingAccountFormValues) =>
        Object.entries(values).filter(
            ([key, value]) => !['other_trading_platforms', 'do_to_improve'].includes(key) && value
        );

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={handleSubmitForm}>
            {({ values, setFieldValue, errors, handleChange, dirty, isValid }) => (
                <Form>
                    {getCloseAccountReasonsList().map(reason => (
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
                                        handleChangeCheckbox(values, field.name, setFieldValue);
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
                                autoComplete='off'
                                type='textarea'
                                placeholder={localize(
                                    'If you don’t mind sharing, which other trading platforms do you use?'
                                )}
                                name='other_trading_platforms'
                                value={values.other_trading_platforms}
                                max_characters={CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleInputChange(e, values.other_trading_platforms, handleChange)
                                }
                                onPaste={handleInputPaste}
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
                                max_characters={CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleInputChange(e, values.do_to_improve, handleChange)
                                }
                                onPaste={handleInputPaste}
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
                            {!isValid &&
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
                            is_disabled={!dirty || !isValid}
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
