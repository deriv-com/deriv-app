import React from 'react';
import classNames from 'classnames';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import { GetSettings, ResidenceList, IdentityVerificationAddDocumentResponse } from '@deriv/api-types';
import { Button, HintBox, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import {
    WS,
    toMoment,
    filterObjProperties,
    isDesktop,
    removeEmptyPropertiesFromObject,
    formatIDVFormValues,
} from '@deriv/shared';
import BackButtonIcon from 'Assets/ic-poi-back-btn.svg';
import PoiNameDobExample from 'Assets/ic-poi-name-dob-example.svg';
import FormFooter from 'Components/form-footer';
import IDVForm from 'Components/forms/idv-form';
import PersonalDetailsForm from 'Components/forms/personal-details-form';
import FormSubHeader from 'Components/form-sub-header';
import {
    validate,
    makeSettingsRequest,
    validateName,
    shouldHideHelperImage,
    isDocumentTypeValid,
    isAdditionalDocumentValid,
    isDocumentNumberValid,
} from 'Helpers/utils';
import { TIDVForm, TPersonalDetailsForm } from 'Types';

type TIDVDocumentSubmitProps = {
    handleBack: () => void;
    handleViewComplete: () => void;
    selected_country: ResidenceList[0];
    account_settings: GetSettings;
    getChangeableFields: () => Array<string>;
};

type TIdvDocumentSubmitForm = TIDVForm & TPersonalDetailsForm;

const IdvDocumentSubmit = ({
    handleBack,
    handleViewComplete,
    selected_country,
    account_settings,
    getChangeableFields,
}: TIDVDocumentSubmitProps) => {
    const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
    const side_note_image = <PoiNameDobExample />;

    const form_initial_values = filterObjProperties(account_settings, visible_settings) as {
        [Property in keyof TPersonalDetailsForm]: string;
    };

    if (form_initial_values.date_of_birth) {
        form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format('YYYY-MM-DD');
    }

    const changeable_fields = [...getChangeableFields()];

    const initial_values: TIdvDocumentSubmitForm = {
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

    const validateFields = (values: TIdvDocumentSubmitForm) => {
        const errors: FormikErrors<TIdvDocumentSubmitForm> = {};
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

    const submitHandler = async (
        values: TIdvDocumentSubmitForm,
        { setSubmitting, setStatus }: FormikHelpers<TIdvDocumentSubmitForm>
    ) => {
        setSubmitting(true);

        const request = makeSettingsRequest(values, changeable_fields);

        const data = await WS.setSettings(request);

        const generic_error_message = (
            <Localize i18n_default_text='Sorry, an internal error occurred. Click Verify to try again.' />
        );

        const duplicated_account_error_message = (
            <Localize
                i18n_default_text='An account with these details already exists. Please make sure the details you entered are corrrect as only one real account is allowed per client. If this is a mistake, contact us via <0>live chat</0>.'
                components={[
                    <span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                ]}
            />
        );

        if (data?.error) {
            const response_error =
                data.error?.code === 'DuplicateAccount' ? duplicated_account_error_message : generic_error_message;
            setStatus({ error_message: response_error });
            setSubmitting(false);
            return;
        }
        const get_settings = WS.authorized.storage.getSettings();
        if (get_settings?.error) {
            setStatus({ error_message: get_settings?.error?.message ?? generic_error_message });
            setSubmitting(false);
            return;
        }

        const submit_data = {
            identity_verification_document_add: 1,
            ...formatIDVFormValues(values, selected_country.value),
        };

        WS.send(submit_data).then(
            (response: IdentityVerificationAddDocumentResponse & { error: { message: string } }) => {
                setSubmitting(false);
                if (response.error) {
                    setStatus({ error_message: response?.error?.message ?? generic_error_message });
                    return;
                }
                handleViewComplete();
            }
        );
    };

    return (
        <Formik initialValues={{ ...initial_values }} validate={validateFields} onSubmit={submitHandler}>
            {({ dirty, isSubmitting, isValid, values, status }) => (
                <Form className='proof-of-identity__container proof-of-identity__container--reset'>
                    {status?.error_message && (
                        <div className='account-form__poi-confirm-example--generic-error-msg'>
                            <HintBox
                                icon='IcAlertDanger'
                                icon_height={16}
                                icon_width={16}
                                message={
                                    <Text as='p' size='xxxs'>
                                        {status.error_message}
                                    </Text>
                                }
                                is_danger
                            />
                        </div>
                    )}
                    <section className='form-body'>
                        <FormSubHeader title={localize('Identity verification')} />
                        <IDVForm selected_country={selected_country} class_name='idv-layout' />

                        <FormSubHeader title={localize('Details')} />
                        <PersonalDetailsForm
                            class_name={classNames({
                                'account-form__poi-confirm-example_container': !shouldHideHelperImage(
                                    values?.document_type?.id
                                ),
                            })}
                            is_for_idv
                            should_hide_helper_image={shouldHideHelperImage(values?.document_type?.id)}
                            editable_fields={changeable_fields}
                            side_note={side_note_image}
                            inline_note_text={
                                <Localize
                                    i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                                    components={[<strong key={0} />]}
                                />
                            }
                        />
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
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Verify')}
                            large
                            primary
                        />
                    </FormFooter>
                </Form>
            )}
        </Formik>
    );
};

export default IdvDocumentSubmit;
