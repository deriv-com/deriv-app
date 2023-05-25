import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { GetSettings } from '@deriv/api-types';
import { Button, HintBox, Loading, Text } from '@deriv/components';
import { filterObjProperties, isEmptyObject, removeEmptyPropertiesFromObject, toMoment, WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import PoiNameExample from 'Assets/ic-poi-name-example.svg';
import PoiDobExample from 'Assets/ic-poi-dob-example.svg';
import PoiNameDobExample from 'Assets/ic-poi-name-dob-example.svg';
import FormBody from 'Components/form-body';
import PersonalDetailsForm from 'Components/forms/personal-details-form';
import LoadErrorMessage from 'Components/load-error-message';
import { makeSettingsRequest, validate, validateName } from 'Helpers/utils';
import { connect } from 'Stores/connect';
import { TCoreStore } from 'Stores/index';
import { TInputFieldValues } from 'Types';

type TRestState = {
    api_error: string;
    show_form: boolean;
    errors?: boolean;
    form_initial_values: TInputFieldValues;
    changeable_fields: string[];
};

type TIdvFailed = {
    account_settings: GetSettings;
    getChangeableFields: () => string[];
    // handleSubmit: () => void;
    mismatch_status: 'POI_NAME_DOB_MISMATCH' | 'POI_DOB_MISMATCH' | 'POI_NAME_MISMATCH';
};

// const PoiNameExampleImage = PoiNameExample;

const IdvFailed = ({
    account_settings,
    getChangeableFields,
    // handleSubmit,
    mismatch_status = 'POI_NAME_DOB_MISMATCH',
}: TIdvFailed) => {
    let init_fields: TInputFieldValues = {};
    let required_fields: string[] = [];
    let side_note_image: React.ReactElement, failure_message: React.ReactElement;
    let inline_note_text: React.ReactNode = '';

    if (mismatch_status === 'POI_NAME_DOB_MISMATCH') {
        init_fields = { first_name: '', last_name: '', date_of_birth: '' };
        required_fields = ['first_name', 'last_name', 'date_of_birth'];
        side_note_image = <PoiNameDobExample />;
        inline_note_text = (
            <Localize
                i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                components={[<strong key={0} />]}
            />
        );
        failure_message = (
            <Text as='p' size='xs'>
                <Localize
                    i18n_default_text="The <0>name</0> and <0>date of birth</0> on your identity document don't match your profile."
                    components={[<strong key={0} />]}
                />
            </Text>
        );
    }

    if (mismatch_status === 'POI_NAME_MISMATCH') {
        init_fields = { first_name: '', last_name: '' };
        required_fields = ['first_name', 'last_name'];
        side_note_image = <PoiNameExample />;
        inline_note_text = (
            <Localize
                i18n_default_text='To avoid delays, enter your <0>name</0> exactly as it appears on your identity document.'
                components={[<strong key={0} />]}
            />
        );
        failure_message = (
            <Text as='p' size='xs'>
                <Localize
                    i18n_default_text="The <0>name</0> on your identity document doesn't match your profile."
                    components={[<strong key={0} />]}
                />
            </Text>
        );
    }

    if (mismatch_status === 'POI_DOB_MISMATCH') {
        init_fields = { date_of_birth: '' };
        required_fields = ['date_of_birth'];
        side_note_image = <PoiDobExample />;
        inline_note_text = (
            <Localize
                i18n_default_text='To avoid delays, enter your <0>date of birth</0> exactly as it appears on your identity document.'
                components={[<strong key={0} />]}
            />
        );
        failure_message = (
            <Text as='p' size='xs'>
                <Localize
                    i18n_default_text="The <0>date of birth</0> on your identity document doesn't match your profile."
                    components={[<strong key={0} />]}
                />
            </Text>
        );
    }

    const [is_loading, setIsLoading] = React.useState(true);
    const [rest_state, setRestState] = React.useState<TRestState>({
        show_form: true,
        form_initial_values: init_fields,
        changeable_fields: [],
        api_error: '',
    });

    React.useEffect(() => {
        const initializeFormValues = () => {
            WS.wait('get_settings').then(() => {
                const form_initial_values = filterObjProperties(account_settings, required_fields);
                if (form_initial_values.date_of_birth) {
                    form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format(
                        'YYYY-MM-DD'
                    );
                }
                setRestState({
                    ...rest_state,
                    changeable_fields: getChangeableFields(),
                    form_initial_values,
                });
                setIsLoading(false);
            });
        };

        initializeFormValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account_settings]);

    const onSubmit = async (
        values: TInputFieldValues,
        { setStatus, setSubmitting }: FormikHelpers<TInputFieldValues>
    ) => {
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
                setRestState({ ...rest_state, api_error: response.error.message });
                return;
            }
            setRestState({ ...rest_state, ...response.get_settings });
            setIsLoading(false);
            // handleSubmit();
        }
    };

    const validateFields = (values: TInputFieldValues) => {
        const errors: TInputFieldValues = {};
        const validateValues = validate(errors, values);

        validateValues(val => val, required_fields, localize('This field is required'));

        if (values.first_name) {
            errors.first_name = validateName(values.first_name);
        }
        if (values.last_name) {
            errors.last_name = validateName(values.last_name);
        }

        setRestState({ ...rest_state, errors: !isEmptyObject(removeEmptyPropertiesFromObject(errors)) });
        return removeEmptyPropertiesFromObject(errors);
    };

    const {
        form_initial_values: { ...form_initial_values },
        api_error,
    } = rest_state;

    if (api_error) return <LoadErrorMessage error_message={api_error} />;

    if (is_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    return (
        <Formik
            initialValues={form_initial_values}
            enableReinitialize
            onSubmit={onSubmit}
            validate={validateFields}
            className='proof-of-identity__container'
        >
            {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                <Form className='proof-of-identity__mismatch-container' onSubmit={handleSubmit}>
                    <FormBody>
                        <Text size='s' weight='bold' className='proof-of-identity__failed-warning' align='center'>
                            <Localize i18n_default_text='Your identity verification failed because:' />
                        </Text>
                        <HintBox
                            icon='IcCloseCircleRed'
                            icon_height={16}
                            icon_width={16}
                            message={failure_message}
                            is_danger
                        />

                        <PersonalDetailsForm
                            editable_fields={rest_state.changeable_fields}
                            is_qualified_for_idv
                            side_note={side_note_image}
                            inline_note_text={inline_note_text}
                        />
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Update profile')}
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
}))(IdvFailed);
