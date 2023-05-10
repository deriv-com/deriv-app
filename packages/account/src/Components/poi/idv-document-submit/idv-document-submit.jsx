import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import {
    WS,
    IDV_NOT_APPLICABLE_OPTION,
    toMoment,
    validLength,
    validName,
    filterObjProperties,
    isDesktop,
} from '@deriv/shared';
import { documentAdditionalError, getRegex, validate } from 'Helpers/utils';
import FormFooter from 'Components/form-footer';
import BackButtonIcon from 'Assets/ic-poi-back-btn.svg';
import IDVForm from 'Components/forms/idv-form';
import PersonalDetailsForm from 'Components/forms/personal-details-form';
import FormSubHeader from 'Components/form-sub-header';

const IdvDocumentSubmit = ({
    handleBack,
    handleViewComplete,
    selected_country,
    is_from_external,
    account_settings,
    getChangeableFields,
}) => {
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

    const getExampleFormat = example_format => {
        return example_format ? localize('Example: ') + example_format : '';
    };

    const shouldHideHelperImage = document_id => document_id === IDV_NOT_APPLICABLE_OPTION.id;

    const validateFields = values => {
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

    const makeSettingsRequest = settings => {
        const request = filterObjProperties(settings, changeable_fields);

        if (request.first_name) {
            request.first_name = request.first_name.trim();
        }
        if (request.last_name) {
            request.last_name = request.last_name.trim();
        }
        if (request.date_of_birth) {
            request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
        }

        return request;
    };

    const submitHandler = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true);

        const request = makeSettingsRequest(values);

        const data = await WS.setSettings(request);

        if (data.error) {
            setErrors({ error_message: data.error.message });
            setSubmitting(false);
            return;
        }
        const get_settings = WS.authorized.storage.getSettings();
        if (get_settings.error) {
            setErrors({ error_message: data.error.message });
            setSubmitting(false);
            return;
        }
        const submit_data = {
            identity_verification_document_add: 1,
            document_number: values.document_number,
            document_additional: values.document_additional || '',
            document_type: values.document_type.id,
            issuing_country: selected_country.value,
        };

        if (submit_data.document_type === IDV_NOT_APPLICABLE_OPTION.id) {
            return;
        }
        WS.send(submit_data).then(response => {
            setSubmitting(false);
            if (response.error) {
                setErrors({ error_message: response.error.message });
                return;
            }
            handleViewComplete();
        });
    };

    return (
        <Formik initialValues={{ ...initial_values }} validate={validateFields} onSubmit={submitHandler}>
            {({
                dirty,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                setFieldTouched,
                touched,
                values,
            }) => (
                <div className='proof-of-identity__container proof-of-identity__container--reset'>
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
                                    selected_country={selected_country}
                                    is_from_external={is_from_external}
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

                    <FormFooter className='proof-of-identity__footer'>
                        {isDesktop() && (
                            <Button className='back-btn' onClick={handleBack} type='button' has_effect large secondary>
                                <BackButtonIcon className='back-btn-icon' /> {localize('Go Back')}
                            </Button>
                        )}
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={handleSubmit}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Verify')}
                            large
                            primary
                        />
                    </FormFooter>
                </div>
            )}
        </Formik>
    );
};

IdvDocumentSubmit.propTypes = {
    handleBack: PropTypes.func,
    handleViewComplete: PropTypes.func,
    is_from_external: PropTypes.bool,
    selected_country: PropTypes.object,
};

export default IdvDocumentSubmit;
