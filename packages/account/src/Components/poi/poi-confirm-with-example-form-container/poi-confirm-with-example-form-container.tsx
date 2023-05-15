import React from 'react';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import { useFetch, useRequest } from '@deriv/api';
import { Checkbox, HintBox, Loading, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import {
    filterObjProperties,
    isEmptyObject,
    isMobile,
    removeEmptyPropertiesFromObject,
    toMoment,
    WS,
} from '@deriv/shared';
import FormBody from '../../form-body';
import LoadErrorMessage from '../../load-error-message';
import PersonalDetailsForm from '../../forms/personal-details-form.jsx';
import { makeSettingsRequest, validate, validateName } from '../../../Helpers/utils';
import { TInputFieldsValues } from 'Types';

type TRestState = {
    api_error?: string;
    show_form: boolean;
    errors?: boolean;
    form_initial_values: TInputFieldsValues;
    changeable_fields: string[];
};

type TPoiConfirmWithExampleFormContainer = {
    getChangeableFields: () => string[];
    onFormConfirm?: () => void;
};

const PoiConfirmWithExampleFormContainer = ({
    getChangeableFields,
    onFormConfirm,
}: TPoiConfirmWithExampleFormContainer) => {
    const [checked, setChecked] = React.useState(false);
    const [rest_state, setRestState] = React.useState<TRestState>({
        show_form: true,
        form_initial_values: { first_name: '', last_name: '', date_of_birth: '' },
        changeable_fields: [],
        api_error: '',
    });

    const { data: account_settings_data, error, isLoading: is_loading_init } = useFetch('get_settings');
    const { isLoading: is_loading_update, mutateAsync } = useRequest('set_settings');

    React.useEffect(() => {
        if (error?.message) {
            setRestState(prevState => ({ ...prevState, api_error: error.message }));
        }
    }, [error]);

    React.useEffect(() => {
        if (account_settings_data) {
            const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
            const form_initial_values = filterObjProperties(account_settings_data, visible_settings);
            if (form_initial_values.date_of_birth) {
                form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format('YYYY-MM-DD');
            }
            setRestState({
                ...rest_state,
                changeable_fields: getChangeableFields(),
                form_initial_values: { ...form_initial_values },
            });
        }
    }, [account_settings_data]);

    const onSubmit = async (
        values: TInputFieldsValues,
        { setStatus, setSubmitting }: FormikHelpers<TInputFieldsValues>
    ) => {
        if (checked) return;
        setStatus({ error_msg: '' });
        const request = makeSettingsRequest(
            values,
            rest_state?.changeable_fields ? [...rest_state.changeable_fields] : []
        );

        try {
            const update_data_response = await mutateAsync([{ payload: request }]);
            if (update_data_response) {
                setChecked(true);

                //TODO: remove additional getSettings request after implementation useFetch in personal-details
                const response = await WS.authorized.storage.getSettings();
                if (response.error) {
                    setRestState({ ...rest_state, api_error: response.error.message });
                    return;
                }
                setRestState({ ...rest_state, ...response.get_settings });
                setChecked(true);

                if (onFormConfirm) {
                    setTimeout(() => {
                        onFormConfirm();
                    }, 500);
                }
            }
        } catch (e) {
            setStatus({ error_msg: e?.message });
        } finally {
            setSubmitting(false);
        }
    };

    const validateFields = (values: TInputFieldsValues) => {
        const errors: TInputFieldsValues = { first_name: '', last_name: '' };
        const validateValues = validate(errors, values);
        const required_fields = ['first_name', 'last_name', 'date_of_birth'];
        validateValues(val => val, required_fields, localize('This field is required'));
        errors.first_name = validateName(values.first_name);
        errors.last_name = validateName(values.last_name);
        setRestState({ ...rest_state, errors: !isEmptyObject(removeEmptyPropertiesFromObject(errors)) });
        return removeEmptyPropertiesFromObject(errors);
    };

    if (rest_state.api_error) return <LoadErrorMessage error_message={rest_state.api_error} />;

    if (is_loading_init) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    return (
        <Formik
            initialValues={rest_state.form_initial_values}
            enableReinitialize
            onSubmit={onSubmit}
            validate={validateFields}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                setFieldTouched,
                status,
            }) => (
                <Form className='account-form__poi-confirm-example' onSubmit={handleSubmit}>
                    <FormBody>
                        <PersonalDetailsForm
                            errors={errors}
                            touched={touched}
                            values={values}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            editable_fields={rest_state.changeable_fields}
                            is_rendered_for_onfido
                        />
                        <button
                            type='submit'
                            className={classNames('account-form__poi-confirm-example--button', {
                                'account-form__poi-confirm-example--button__disabled':
                                    checked || !isEmptyObject(errors),
                            })}
                        >
                            <Checkbox
                                value={checked}
                                label={
                                    <Text size={isMobile() ? 'xxs' : 'xs'}>
                                        {localize(
                                            'I confirm that the name and date of birth above match my chosen identity document (see below)'
                                        )}
                                    </Text>
                                }
                                disabled={isSubmitting || is_loading_update}
                            />
                        </button>
                        {status?.error_msg && (
                            <div className='account-form__poi-confirm-example--status-message'>
                                <HintBox
                                    icon='IcAlertDanger'
                                    icon_height={16}
                                    icon_width={16}
                                    message={
                                        <Text as='p' size='xxxs'>
                                            <Localize i18n_default_text='Sorry, an internal error occurred. Hit the above checkbox to try again.' />
                                        </Text>
                                    }
                                    is_danger
                                />
                            </div>
                        )}
                    </FormBody>
                </Form>
            )}
        </Formik>
    );
};

export default PoiConfirmWithExampleFormContainer;
