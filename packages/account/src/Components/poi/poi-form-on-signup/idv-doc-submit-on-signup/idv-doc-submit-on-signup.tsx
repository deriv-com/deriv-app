import React from 'react';
import { Formik, Field, FormikValues, FormikHelpers, FormikErrors } from 'formik';
import { localize, Localize } from '@deriv/translations';
import classNames from 'classnames';
import {
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    FormSubmitButton,
    Input,
    MobileWrapper,
    Modal,
    SelectNative,
    Text,
    ThemedScrollbars,
    Button,
} from '@deriv/components';
import {
    isDesktop,
    formatInput,
    isMobile,
    filterObjProperties,
    toMoment,
    validLength,
    validName,
    IDV_NOT_APPLICABLE_OPTION,
} from '@deriv/shared';
import DocumentSubmitLogo from 'Assets/ic-document-submit-icon.svg';
import {
    generatePlaceholderText,
    getDocumentData,
    documentAdditionalError,
    preventEmptyClipboardPaste,
    getRegex,
    validate,
} from 'Helpers/utils';
import FormSubHeader from 'Components/form-sub-header';
import IDVForm from 'Components/forms/idv-form';
import PersonalDetailsForm from 'Components/forms/personal-details-form';
import FormFooter from 'Components/form-footer';
import { GetSettings } from '@deriv/api-types';
import FormBody from 'Components/form-body';

type TIdvDocSubmitOnSignup = {
    citizen_data: FormikValues;
    has_previous: boolean;
    onPrevious: (values: FormikValues) => void;
    onNext: (
        values: FormikValues,
        action: FormikHelpers<{ document_type: FormikValues; document_number: FormikValues }>
    ) => void;
    value: FormikValues;
    has_idv_error?: boolean;
    account_settings: GetSettings;
    getChangeableFields: () => string[];
};

export const IdvDocSubmitOnSignup = ({
    citizen_data,
    has_previous,
    onPrevious,
    onNext,
    value,
    has_idv_error,
    account_settings,
    getChangeableFields,
}: TIdvDocSubmitOnSignup) => {
    const shouldHideHelperImage = (document_id: string) => document_id === IDV_NOT_APPLICABLE_OPTION.id;

    const validateFields = (values: FormikValues) => {
        const errors = {};
        const { document_type, document_number, document_additional } = values;
        const needs_additional_document = !!document_type.additional;
        const is_document_number_invalid = document_number === document_type.example_format;

        if (!document_type || !document_type.text) {
            errors.document_type = localize('Please select a document type.');
        }
        if (!shouldHideHelperImage(document_type?.id)) {
            if (needs_additional_document) {
                const error_message = documentAdditionalError(document_additional, document_type.additional?.format);
                if (error_message)
                    errors.document_additional =
                        localize(error_message) + getExampleFormat(document_type.additional?.example_format);
            }
            if (!document_number) {
                errors.document_number =
                    localize('Please enter your document number. ') + getExampleFormat(document_type.example_format);
            } else if (is_document_number_invalid) {
                errors.document_number = localize('Please enter a valid ID number.');
            } else {
                const format_regex = getRegex(document_type.value);
                if (!format_regex.test(document_number)) {
                    errors.document_number =
                        localize('Please enter the correct format. ') + getExampleFormat(document_type.example_format);
                }
            }
        }
        const required_fields = ['first_name', 'last_name', 'date_of_birth'];
        const validateValues = validate(errors, values);
        validateValues(val => val, required_fields, localize('This field is required'));
        const min_name = 2;
        const max_name = 50;
        const validateName = (name, field) => {
            if (name) {
                if (!validLength(name.trim(), { min: min_name, max: max_name })) {
                    errors[field] = localize('You should enter 2-50 characters.');
                } else if (!validName(name)) {
                    errors[field] = localize('Letters, spaces, periods, hyphens, apostrophes only.');
                }
            }
        };
        validateName(values.first_name, 'first_name');
        validateName(values.last_name, 'last_name');

        return errors;
    };

    const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
    const form_initial_values = filterObjProperties(account_settings, visible_settings) || {};

    if (form_initial_values.date_of_birth) {
        form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format('YYYY-MM-DD');
    }

    const changeable_fields = [...getChangeableFields()];

    const initial_values = {
        document_type: {
            id: '',
            text: '',
            value: '',
            example_format: '',
            sample_image: '',
        },
        document_number: '',
        ...form_initial_values,
    };

    const getExampleFormat = (example_format: string) => (example_format ? localize('Example: ') + example_format : '');

    return (
        <Formik
            initialValues={initial_values}
            validate={validateFields}
            onSubmit={(values, actions) => {
                onNext(values, actions);
            }}
            validateOnMount
            validateOnChange
            validateOnBlur
        >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                setFieldTouched,
                touched,
                dirty,
                values,
            }) => (
                <div className='proof-of-identity__container proof-of-identity__container--reset mt5-layout'>
                    <section className='mt5-layout__container'>
                        <FormSubHeader title={localize('Identity verification')} />
                        <Field>
                            {({ field }) => {
                                return (
                                    <IDVForm
                                        errors={errors}
                                        touched={touched}
                                        values={values}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        setFieldValue={setFieldValue}
                                        hide_hint={false}
                                        selected_country={citizen_data}
                                        is_from_external
                                        class_name='idv-layout'
                                        {...field}
                                    />
                                );
                            }}
                        </Field>
                        <FormSubHeader title={localize('Identity verification')} />
                        <Field>
                            {({ field }) => (
                                <div
                                    className={classNames({
                                        'account-form__poi-confirm-example_container': !shouldHideHelperImage(
                                            values?.document_type?.id
                                        ),
                                    })}
                                >
                                    <PersonalDetailsForm
                                        errors={errors}
                                        touched={touched}
                                        values={values}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        is_qualified_for_idv={true}
                                        is_appstore
                                        should_hide_helper_image={shouldHideHelperImage(values?.document_type?.id)}
                                        editable_fields={changeable_fields}
                                        {...field}
                                    />
                                </div>
                            )}
                        </Field>
                    </section>
                    <FormFooter className='proof-of-identity__footer'>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={handleSubmit}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </div>
            )}
        </Formik>
    );
};
