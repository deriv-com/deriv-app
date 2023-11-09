import React from 'react';
import { Form, Formik, FormikErrors, FormikHelpers, FormikState } from 'formik';
import { Button, HintBox, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import {
    WS,
    toMoment,
    filterObjProperties,
    isDesktop,
    removeEmptyPropertiesFromObject,
    formatIDVFormValues,
    isMobile,
} from '@deriv/shared';
import {
    validate,
    makeSettingsRequest,
    validateName,
    shouldHideHelperImage,
    isDocumentTypeValid,
    isAdditionalDocumentValid,
    isDocumentNumberValid,
} from '../../../Helpers/utils';
import BackButtonIcon from '../../../Assets/ic-poi-back-btn.svg';
import PoiNameDobExample from '../../../Assets/ic-poi-name-dob-example.svg';
import IDVForm from '../../forms/idv-form';
import PersonalDetailsForm from '../../forms/personal-details-form';
import FormBody from '../../form-body';
import FormFooter from '../../form-footer';
import FormSubHeader from '../../form-sub-header';
import { observer, useStore } from '@deriv/stores';
import { ResidenceList } from '@deriv/api-types';
import {
    CLAIMED_DOCUMENT_ERROR_MESSAGE,
    DUPLICATE_ACCOUNT_ERROR_MESSAGE,
    GENERIC_ERROR_MESSAGE,
} from '../../../Configs/poi-error-config';
import { TIDVFormValues, TPersonalDetailsForm } from 'Types';
import { API_ERROR_CODES } from '../../../Constants/api-error-codes';

type TIDVDocumentSubmitProps = {
    handleBack: React.MouseEventHandler;
    handleViewComplete: () => void;
    is_from_external: boolean;
    selected_country: ResidenceList[0];
    getChangeableFields: () => Array<string>;
};

type TIdvDocumentSubmitForm = TIDVFormValues & TPersonalDetailsForm & { confirmation_checkbox: boolean };

const IdvDocumentSubmit = observer(({ handleBack, handleViewComplete, selected_country }: TIDVDocumentSubmitProps) => {
    const {
        client: { account_settings, getChangeableFields },
    } = useStore();

    const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
    const side_note_image = <PoiNameDobExample />;

    const form_initial_values = filterObjProperties(account_settings, visible_settings) as {
        [Property in keyof TPersonalDetailsForm]: string;
    };

    if (form_initial_values.date_of_birth) {
        form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format('YYYY-MM-DD');
    }

    const changeable_fields = getChangeableFields();

    const initial_values: TIdvDocumentSubmitForm = {
        document_type: {
            id: '',
            text: '',
            value: '',
            example_format: '',
        },
        document_number: '',
        confirmation_checkbox: false,
        ...form_initial_values,
    };

    const validateFields = (values: TIdvDocumentSubmitForm) => {
        const errors: FormikErrors<Record<keyof TIdvDocumentSubmitForm, string>> = {};
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

    const submitHandler = async (
        values: TIdvDocumentSubmitForm,
        {
            setSubmitting,
            setStatus,
            status,
        }: FormikHelpers<TIdvDocumentSubmitForm> & FormikState<TIdvDocumentSubmitForm>
    ) => {
        setSubmitting(true);

        const request = makeSettingsRequest(values, changeable_fields);

        const data = await WS.setSettings(request);

        if (data?.error) {
            const response_error =
                data.error?.code === API_ERROR_CODES.DUPLICATE_ACCOUNT
                    ? DUPLICATE_ACCOUNT_ERROR_MESSAGE
                    : GENERIC_ERROR_MESSAGE;
            setStatus({ ...status, error_message: response_error });
            setSubmitting(false);
            return;
        }
        const get_settings = await WS.authorized.storage.getSettings();
        if (get_settings?.error) {
            setStatus({ ...status, error_message: get_settings?.error?.message ?? GENERIC_ERROR_MESSAGE });
            setSubmitting(false);
            return;
        }

        const submit_data = {
            identity_verification_document_add: 1,
            ...formatIDVFormValues(values, selected_country.value),
        };

        const idv_update_response = await WS.send(submit_data);
        if (idv_update_response?.error) {
            const response_error =
                idv_update_response.error?.code === API_ERROR_CODES.CLAIMED_DOCUMENT
                    ? CLAIMED_DOCUMENT_ERROR_MESSAGE
                    : idv_update_response.error?.message ?? GENERIC_ERROR_MESSAGE;
            setStatus({ error_msg: response_error });
            setSubmitting(false);
            return;
        }
        setSubmitting(false);
        handleViewComplete();
    };

    return (
        <Formik initialValues={{ ...initial_values }} validate={validateFields} onSubmit={submitHandler}>
            {({ dirty, isSubmitting, isValid, values, status }) => (
                <Form className='proof-of-identity__container proof-of-identity__container--reset'>
                    {status?.error_message && (
                        <div className='account-form__poi-confirm-example--generic-error-msg'>
                            <HintBox
                                icon='IcAlertDanger'
                                message={
                                    <Text as='p' size='xxxs'>
                                        {status.error_message}
                                    </Text>
                                }
                                is_danger
                                className='hint-box-layout'
                            />
                        </div>
                    )}
                    <FormBody className='form-body' scroll_offset={isMobile() ? '180px' : '80px'}>
                        <FormSubHeader title={localize('Identity verification')} />
                        <IDVForm selected_country={selected_country} class_name='idv-layout' />

                        <FormSubHeader title={localize('Details')} />
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
                        />
                    </FormBody>
                    <FormFooter className='proof-of-identity__footer account-form__footer--reset'>
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
});

export default IdvDocumentSubmit;
