import React from 'react';
import { Formik, FormikValues, FormikHelpers, FormikErrors, Form } from 'formik';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { Button } from '@deriv/components';
import { filterObjProperties, toMoment, removeEmptyPropertiesFromObject } from '@deriv/shared';
import {
    validate,
    validateName,
    isDocumentTypeValid,
    isAdditionalDocumentValid,
    isDocumentNumberValid,
    shouldHideHelperImage,
} from '../../../../Helpers/utils';
import FormSubHeader from '../../../form-sub-header';
import IDVForm from '../../../forms/idv-form';
import PersonalDetailsForm from '../../../forms/personal-details-form.jsx';
import FormFooter from '../../../form-footer';

type TIdvDocSubmitOnSignup = {
    citizen_data: FormikValues;
    onPrevious: (values: FormikValues) => void;
    onNext: (
        values: FormikValues,
        action: FormikHelpers<{ document_type: FormikValues; document_number: FormikValues }>
    ) => void;
    value: FormikValues;
    has_idv_error?: boolean;
    account_settings: GetSettings;
    getChangeableFields: () => string[];
    residence_list: ResidenceList;
};

export const IdvDocSubmitOnSignup = ({
    citizen_data,
    onNext,
    account_settings,
    getChangeableFields,
    residence_list,
}: TIdvDocSubmitOnSignup) => {
    const validateFields = (values: FormikValues) => {
        const errors: FormikErrors<FormikValues> = {};
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
            {({ errors, handleBlur, handleChange, isSubmitting, isValid, setFieldValue, touched, dirty, values }) => (
                <Form className='proof-of-identity__container proof-of-identity__container--reset mt5-layout'>
                    <section className='mt5-layout__container'>
                        <FormSubHeader title={localize('Identity verification')} />
                        <IDVForm
                            errors={errors}
                            touched={touched}
                            values={values}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            hide_hint={false}
                            selected_country={citizen_data}
                            class_name='idv-layout'
                        />
                        <FormSubHeader title={localize('Identity verification')} />
                        <PersonalDetailsForm
                            class_name={classNames({
                                'account-form__poi-confirm-example_container': !shouldHideHelperImage(
                                    values?.document_type?.id
                                ),
                            })}
                            is_qualified_for_idv
                            is_appstore
                            should_hide_helper_image={shouldHideHelperImage(values?.document_type?.id)}
                            editable_fields={changeable_fields}
                            residence_list={residence_list}
                        />
                    </section>
                    <FormFooter className='proof-of-identity__footer'>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </Form>
            )}
        </Formik>
    );
};
