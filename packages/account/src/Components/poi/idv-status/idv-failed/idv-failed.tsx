import React from 'react';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { Button, HintBox, Loading, Text } from '@deriv/components';
import { filterObjProperties, isEmptyObject, removeEmptyPropertiesFromObject, toMoment, WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import PoiNameExample from 'Assets/ic-poi-name-example.svg';
import PoiDobExample from 'Assets/ic-poi-dob-example.svg';
import PoiNameDobExample from 'Assets/ic-poi-name-dob-example.svg';
import FormBody from 'Components/form-body';
import PersonalDetailsForm from 'Components/forms/personal-details-form';
import LoadErrorMessage from 'Components/load-error-message';
import {
    isAdditionalDocumentValid,
    isDocumentNumberValid,
    isDocumentTypeValid,
    makeSettingsRequest,
    shouldHideHelperImage,
    validate,
    validateName,
} from 'Helpers/utils';
import { connect } from 'Stores/connect';
import { TCoreStore } from 'Stores/index';
import { TIDVErrorStatus, TIDVForm, TPersonalDetailsForm } from 'Types';
import FormSubHeader from 'Components/form-sub-header';
import IDVForm from 'Components/forms/idv-form';

type TRestState = {
    api_error: string;
    errors?: boolean;
    form_initial_values: TIdvFailedForm;
    changeable_fields: string[];
};

type TIdvFailed = {
    account_settings: GetSettings;
    getChangeableFields: () => string[];
    // handleSubmit: () => void;
    mismatch_status: TIDVErrorStatus;
    residence_list: ResidenceList;
};

type TIDVFailureConfig = {
    required_fields: string[];
    side_note_image: React.ReactElement;
    failure_message: React.ReactNode;
    inline_note_text: React.ReactNode;
};

type TIdvFailedForm = Partial<TIDVForm> & Partial<TPersonalDetailsForm>;

const IdvFailed = ({
    getChangeableFields,
    residence_list,
    account_settings,
    // handleSubmit,
    mismatch_status = 'POI_NAME_DOB_MISMATCH',
}: TIdvFailed) => {
    const [idv_failure, setIdvFailure] = React.useState<TIDVFailureConfig>({
        required_fields: [],
        side_note_image: <PoiNameDobExample />,
        failure_message: null,
        inline_note_text: null,
    });
    const [is_loading, setIsLoading] = React.useState(true);
    const [rest_state, setRestState] = React.useState<TRestState>({
        api_error: '',
        errors: false,
        form_initial_values: {},
        changeable_fields: [],
    });

    const is_document_upload_required = React.useMemo(
        () => ['POI_FAILED', 'POI_EXPIRED'].includes(mismatch_status),
        [mismatch_status]
    );

    React.useEffect(() => {
        const generateIDVError = () => {
            switch (mismatch_status) {
                case 'POI_NAME_DOB_MISMATCH':
                    return {
                        required_fields: ['first_name', 'last_name', 'date_of_birth'],
                        side_note_image: <PoiNameDobExample />,
                        inline_note_text: (
                            <Localize
                                i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                                components={[<strong key={0} />]}
                            />
                        ),
                        failure_message: (
                            <Localize
                                i18n_default_text="The <0>name</0> and <0>date of birth</0> on your identity document don't match your profile."
                                components={[<strong key={0} />]}
                            />
                        ),
                    };
                case 'POI_NAME_MISMATCH':
                    return {
                        required_fields: ['first_name', 'last_name'],
                        side_note_image: <PoiNameExample />,
                        inline_note_text: (
                            <Localize
                                i18n_default_text='To avoid delays, enter your <0>name</0> exactly as it appears on your identity document.'
                                components={[<strong key={0} />]}
                            />
                        ),
                        failure_message: (
                            <Localize
                                i18n_default_text="The <0>name</0> on your identity document doesn't match your profile."
                                components={[<strong key={0} />]}
                            />
                        ),
                    };
                case 'POI_DOB_MISMATCH':
                    return {
                        required_fields: ['date_of_birth'],
                        side_note_image: <PoiDobExample />,
                        inline_note_text: (
                            <Localize
                                i18n_default_text='To avoid delays, enter your <0>date of birth</0> exactly as it appears on your identity document.'
                                components={[<strong key={0} />]}
                            />
                        ),
                        failure_message: (
                            <Localize
                                i18n_default_text="The <0>date of birth</0> on your identity document doesn't match your profile."
                                components={[<strong key={0} />]}
                            />
                        ),
                    };
                default:
                    return {
                        required_fields: ['first_name', 'last_name', 'date_of_birth'],
                        side_note_image: <PoiNameDobExample />,
                        inline_note_text: (
                            <Localize
                                i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                                components={[<strong key={0} />]}
                            />
                        ),
                        failure_message: (
                            <Localize
                                i18n_default_text='{{ banner_message }}'
                                values={{
                                    banner_message:
                                        mismatch_status === 'POI_EXPIRED'
                                            ? 'Your identity document has expired.'
                                            : 'We were unable to verify the identity document with the details provided.',
                                }}
                            />
                        ),
                    };
            }
        };

        const initializeFormValues = async (required_fields: string[]) => {
            await WS.wait('get_settings');
            const form_data = filterObjProperties(account_settings, required_fields);
            if (form_data.date_of_birth) {
                form_data.date_of_birth = toMoment(form_data).format('YYYY-MM-DD');
            }
            let initial_form_values = form_data;
            if (is_document_upload_required) {
                initial_form_values = {
                    document_type: {
                        id: '',
                        text: '',
                        value: '',
                        example_format: '',
                        sample_image: '',
                    },
                    document_number: '',
                    ...initial_form_values,
                };
            }
            setRestState({
                form_initial_values: { ...initial_form_values },
                changeable_fields: [],
                api_error: '',
            });
            setIsLoading(false);
        };

        const error_config = generateIDVError();
        setIdvFailure(error_config);
        initializeFormValues(error_config?.required_fields ?? []);
    }, [mismatch_status, account_settings, is_document_upload_required]);

    const onSubmit = async (values: TIdvFailedForm, { setStatus, setSubmitting }: FormikHelpers<TIdvFailedForm>) => {
        setStatus({ error_msg: '' });
        const request = makeSettingsRequest(
            values,
            rest_state?.changeable_fields ? [...rest_state.changeable_fields] : []
        );
        const data = await WS.setSettings(request);

        if (data.error) {
            setStatus({ error_msg: data.error.message });
            setSubmitting(false);
        } else {
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                setRestState(prev_state => ({ ...prev_state, api_error: response.error.message }));
                return;
            }
            setRestState({ ...rest_state, ...response.get_settings });
            setIsLoading(false);
            // handleSubmit();
        }
    };

    const validateFields = (values: TIdvFailedForm) => {
        const errors: Record<string, unknown> = {};
        if (is_document_upload_required) {
            const { document_type, document_number, document_additional } = values;
            const needs_additional_document = !!document_type?.additional;
            errors.document_type = isDocumentTypeValid(document_type as FormikValues);
            if (!shouldHideHelperImage(document_type?.id as string)) {
                if (needs_additional_document) {
                    errors.document_additional = isAdditionalDocumentValid(document_type, document_additional);
                }
                errors.document_number = isDocumentNumberValid(document_number ?? '', document_type as FormikValues);
            }
        }

        const validateValues = validate(errors, values);

        validateValues(val => val, idv_failure?.required_fields ?? [], localize('This field is required'));

        if (values.first_name) {
            errors.first_name = validateName(values.first_name);
        }
        if (values.last_name) {
            errors.last_name = validateName(values.last_name);
        }

        setRestState(prev_state => ({
            ...prev_state,
            errors: !isEmptyObject(removeEmptyPropertiesFromObject(errors)),
        }));
        return removeEmptyPropertiesFromObject(errors);
    };

    if (rest_state?.api_error) return <LoadErrorMessage error_message={rest_state.api_error} />;

    if (is_loading && Object.keys(rest_state?.form_initial_values ?? {}).length === 0) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    const citizen = account_settings?.citizen;
    const selected_country = residence_list.find(residence_data => residence_data.value === citizen) || {};

    return (
        <Formik
            initialValues={rest_state?.form_initial_values ?? {}}
            enableReinitialize
            onSubmit={onSubmit}
            validate={validateFields}
            className='proof-of-identity__container'
        >
            {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                <Form className='proof-of-identity__mismatch-container' onSubmit={handleSubmit}>
                    <FormBody className='form-body'>
                        <Text size='s' weight='bold' className='proof-of-identity__failed-warning' align='center'>
                            <Localize i18n_default_text='Your identity verification failed because:' />
                        </Text>
                        <HintBox
                            icon='IcCloseCircleRed'
                            icon_height={16}
                            icon_width={16}
                            message={
                                <Text as='p' size='xs'>
                                    {idv_failure?.failure_message}
                                </Text>
                            }
                            is_danger
                        />
                        {is_document_upload_required && (
                            <React.Fragment>
                                <Text size='xs' className='proof-of-identity__failed-warning' align='center'>
                                    <Localize i18n_default_text='Let’s try again. Choose another document and enter the corresponding details.' />
                                </Text>
                                <FormSubHeader title={localize('Identity verification')} />
                                <IDVForm
                                    selected_country={selected_country}
                                    hide_hint={true}
                                    class_name='idv-layout idv-resubmit'
                                />
                                <FormSubHeader title={localize('Details')} />
                            </React.Fragment>
                        )}
                        <PersonalDetailsForm
                            editable_fields={rest_state?.changeable_fields}
                            is_qualified_for_idv
                            side_note={idv_failure?.side_note_image}
                            inline_note_text={idv_failure?.inline_note_text}
                        />
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={is_document_upload_required ? localize('Verify') : localize('Update profile')}
                            large
                            primary
                        />
                    </FormBody>
                </Form>
            )}
        </Formik>
    );
};

export default connect(({ client }: TCoreStore) => ({
    account_settings: client.account_settings,
    getChangeableFields: client.getChangeableFields,
    residence_list: client.residence_list,
}))(IdvFailed);
