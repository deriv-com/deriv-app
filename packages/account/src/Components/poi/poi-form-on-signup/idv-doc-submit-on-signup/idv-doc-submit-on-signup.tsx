import React from 'react';
import { Formik, FormikValues, FormikHelpers, FormikErrors, Form } from 'formik';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import { Button } from '@deriv/components';
import {
    filterObjProperties,
    toMoment,
    removeEmptyPropertiesFromObject,
    getIDVNotApplicableOption,
} from '@deriv/shared';
import {
    validate,
    validateName,
    isDocumentTypeValid,
    isAdditionalDocumentValid,
    isDocumentNumberValid,
    shouldHideHelperImage,
} from 'Helpers/utils';
import FormSubHeader from 'Components/form-sub-header';
import IDVForm from 'Components/forms/idv-form';
import PersonalDetailsForm from 'Components/forms/personal-details-form';
import FormFooter from 'Components/form-footer';
import { GetSettings } from '@deriv/api-types';

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
    handleIdvSkipping: (is_idv_skipping: boolean) => void;
};

export const IdvDocSubmitOnSignup = ({
    citizen_data,
    onNext,
    account_settings,
    getChangeableFields,
    handleIdvSkipping,
}: TIdvDocSubmitOnSignup) => {
    const [is_idv_skipping, setIsIdvSkipping] = React.useState(false);

    const IDV_NOT_APPLICABLE_OPTION = React.useMemo(() => getIDVNotApplicableOption(), []);

    const validateFields = (values: FormikValues) => {
        const errors: FormikErrors<FormikValues> = {};
        const { document_type, document_number, document_additional } = values;

        if (document_type.id === IDV_NOT_APPLICABLE_OPTION.id) {
            setIsIdvSkipping(true);
            return errors;
        }
        setIsIdvSkipping(false);

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
                is_idv_skipping ? handleIdvSkipping(true) : onNext(values, actions);
            }}
            validateOnMount
            validateOnChange
            validateOnBlur
        >
            {({
                errors,
                handleBlur,
                handleChange,
                isSubmitting,
                isValid,
                setFieldValue,
                setFieldTouched,
                touched,
                dirty,
                values,
            }) => (
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
                        {!is_idv_skipping && (
                            <React.Fragment>
                                <FormSubHeader title={localize('Identity verification')} />
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
                            </React.Fragment>
                        )}
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
