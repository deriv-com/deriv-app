import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import {
    WS,
    IDV_NOT_APPLICABLE_OPTION,
    toMoment,
    filterObjProperties,
    isDesktop,
    removeEmptyPropertiesFromObject,
} from '@deriv/shared';
import { documentAdditionalError, getRegex, validate, makeSettingsRequest, validateName } from 'Helpers/utils';
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

    const isDocumentTypeValid = document_type => {
        if (!document_type?.text) {
            return localize('Please select a document type.');
        }
        return undefined;
    };

    const isAdditionalDocumentValid = (document_type, document_additional) => {
        const error_message = documentAdditionalError(document_additional, document_type.additional?.format);
        if (error_message) {
            return localize(error_message) + getExampleFormat(document_type.additional?.example_format);
        }
        return undefined;
    };

    const isDocumentNumberValid = (document_number, document_type) => {
        const is_document_number_invalid = document_number === document_type.example_format;
        if (!document_number) {
            return localize('Please enter your document number. ') + getExampleFormat(document_type.example_format);
        } else if (is_document_number_invalid) {
            return localize('Please enter a valid ID number.');
        }
        const format_regex = getRegex(document_type.value);
        if (!format_regex.test(document_number)) {
            return localize('Please enter the correct format. ') + getExampleFormat(document_type.example_format);
        }
        return undefined;
    };

    const validateFields = values => {
        const errors = {};
        const { document_type, document_number, document_additional } = values;
        const needs_additional_document = !!document_type.additional;

        errors.document_type = isDocumentTypeValid(document_type);
        if (!shouldHideHelperImage(document_type?.id)) {
            if (needs_additional_document) {
                errors.document_additional = isAdditionalDocumentValid(document_type, document_additional);
            }
            errors.document_number = isDocumentNumberValid(document_number, document_type);
        }
        const required_fields = ['first_name', 'last_name', 'date_of_birth'];
        const validateValues = validate(errors, values);
        validateValues(val => val, required_fields, localize('This field is required'));

        if (values.first_name) {
            errors.first_name = validateName(values.first_name);
        }
        if (values.last_name) {
            errors.last_name = validateName(values.last_name);
        }

        return removeEmptyPropertiesFromObject(errors);
    };

    const submitHandler = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true);

        const request = makeSettingsRequest(values, changeable_fields);

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
                    <section className='form-body'>
                        <FormSubHeader title={localize('Identity verification')} />
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
                        />

                        <FormSubHeader title={localize('Details')} />
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
                            />
                        </div>
                    </section>
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
    account_settings: PropTypes.object,
    getChangeableFields: PropTypes.func,
    handleBack: PropTypes.func,
    handleViewComplete: PropTypes.func,
    is_from_external: PropTypes.bool,
    selected_country: PropTypes.object,
};

export default IdvDocumentSubmit;
