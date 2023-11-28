import React from 'react';
import { Formik, FormikValues, FormikHelpers, FormikErrors, Form } from 'formik';
import { Localize, localize } from '@deriv/translations';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { Button } from '@deriv/components';
import { filterObjProperties, toMoment, removeEmptyPropertiesFromObject } from '@deriv/shared';
import PoiNameDobExample from '../../../../Assets/ic-poi-name-dob-example.svg';
import FormSubHeader from '../../../form-sub-header';
import IDVForm from '../../../forms/idv-form';
import PersonalDetailsForm from '../../../forms/personal-details-form.jsx';
import FormFooter from '../../../form-footer';
import {
    isAdditionalDocumentValid,
    isDocumentNumberValid,
    isDocumentTypeValid,
    shouldHideHelperImage,
    validate,
    validateName,
} from '../../../../Helpers/utils';

type TIdvDocSubmitOnSignup = {
    citizen_data: FormikValues;
    onPrevious: (values: FormikValues) => void;
    onNext: (values: FormikValues, action: FormikHelpers<FormikValues>) => void;
    value: FormikValues;
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
    const side_note_image = <PoiNameDobExample />;
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

        if (!values.confirmation_checkbox) {
            errors.confirmation_checkbox = 'error';
        }

        return removeEmptyPropertiesFromObject(errors);
    };

    const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
    const form_initial_values = filterObjProperties(account_settings, visible_settings) || {};

    if (form_initial_values.date_of_birth) {
        form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format('YYYY-MM-DD');
    }

    const changeable_fields = getChangeableFields();

    const initial_values = {
        document_type: {
            id: '',
            text: '',
            value: '',
            example_format: '',
        },
        confirmation_checkbox: false,
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
            {({ isSubmitting, isValid, dirty, values }) => (
                <Form className='proof-of-identity__container proof-of-identity__container--reset mt5-layout'>
                    <section className='mt5-layout__container'>
                        <FormSubHeader title={localize('Identity verification')} />
                        <IDVForm hide_hint={false} selected_country={citizen_data} class_name='idv-layout' />
                        <FormSubHeader title={localize('Identity verification')} />
                        <PersonalDetailsForm
                            class_name='account-form__poi-confirm-example_container'
                            is_rendered_for_idv
                            editable_fields={values.confirmation_checkbox ? [] : changeable_fields}
                            side_note={side_note_image}
                            inline_note_text={
                                <Localize
                                    i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                                    components={[<strong key={0} />]}
                                />
                            }
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
