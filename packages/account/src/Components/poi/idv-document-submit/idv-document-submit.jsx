import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import { WS } from '@deriv/shared';
import { documentAdditionalError, getRegex } from './utils';
import FormFooter from 'Components/form-footer';
import BackButtonIcon from 'Assets/ic-poi-back-btn.svg';
import DocumentSubmitLogo from 'Assets/ic-document-submit-icon.svg';
import IDVForm from 'Components/forms/idv-form';

const IdvDocumentSubmit = ({ handleBack, handleViewComplete, selected_country, is_from_external }) => {
    const initial_form_values = {
        document_type: '',
        document_number: '',
    };

    const getExampleFormat = example_format => {
        return example_format ? localize('Example: ') + example_format : '';
    };

    const validateFields = values => {
        const errors = {};
        const { document_type, document_number, document_additional } = values;
        const needs_additional_document = !!document_type.additional;
        const is_document_number_invalid = document_number === document_type.example_format;

        if (!document_type || !document_type.text || !document_type.value) {
            errors.document_type = localize('Please select a document type.');
        }

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

        return errors;
    };

    const submitHandler = (values, { setSubmitting, setErrors }) => {
        setSubmitting(true);
        const submit_data = {
            identity_verification_document_add: 1,
            document_number: values.document_number,
            document_additional: values.document_additional || '',
            document_type: values.document_type.id,
            issuing_country: selected_country.value,
        };

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
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={submitHandler}>
            {({
                dirty,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                touched,
                values,
            }) => (
                <div className='proof-of-identity__container'>
                    <DocumentSubmitLogo className='icon' />
                    <Text className='proof-of-identity btm-spacer' align='center' weight='bold'>
                        {localize('Verify your identity')}
                    </Text>
                    <Text className='proof-of-identity__text btm-spacer' size='xs'>
                        {localize('Please select the document type and enter the ID number.')}
                    </Text>
                    <Field>
                        {({ field }) => (
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
                        )}
                    </Field>

                    <FormFooter className='proof-of-identity__footer'>
                        <Button className='back-btn' onClick={handleBack} type='button' has_effect large secondary>
                            <BackButtonIcon className='back-btn-icon' /> {localize('Go Back')}
                        </Button>
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
