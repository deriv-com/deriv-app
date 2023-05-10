import React from 'react';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import { GetSettings } from '@deriv/api-types';
import { Checkbox, Loading, Text } from '@deriv/components';
import { filterObjProperties, isMobile, toMoment, validLength, validName, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import LoadErrorMessage from 'Components/load-error-message';
import PersonalDetailsForm from 'Components/forms/personal-details-form';
import { validate } from 'Helpers/utils';

type TValues = { [p: string]: string };

type TRestState = {
    api_error: string;
    show_form: boolean;
    errors?: boolean;
    form_initial_values: TValues;
    changeable_fields: string[];
};

type TPoiConfirmWithExampleFormContainer = {
    account_settings: GetSettings;
    getChangeableFields: () => string[];
    onFormConfirm?: () => void;
};

const PoiConfirmWithExampleFormContainer = ({
    account_settings,
    getChangeableFields,
    onFormConfirm,
}: TPoiConfirmWithExampleFormContainer) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [checked, setChecked] = React.useState(false);
    const [rest_state, setRestState] = React.useState<TRestState>({
        show_form: true,
        form_initial_values: { first_name: '', last_name: '', date_of_birth: '' },
        changeable_fields: [],
        api_error: '',
    });

    React.useEffect(() => {
        initializeFormValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account_settings]);

    const makeSettingsRequest = (settings: TValues) => {
        const request = filterObjProperties(settings, [...rest_state?.changeable_fields]);

        if (request.first_name) {
            request.first_name = request.first_name.trim();
        }
        if (request.last_name) {
            request.last_name = request.last_name.trim();
        }
        if (request.date_of_birth) {
            request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
        }

        return request;
    };

    const onSubmit = async (values: TValues, { setStatus, setSubmitting }: FormikHelpers<TValues>) => {
        if (checked) return;
        setStatus({ msg: '' });
        const request = makeSettingsRequest(values);
        const data = await WS.setSettings(request);

        if (data.error) {
            setStatus({ msg: data.error.message });
            setSubmitting(false);
        } else {
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                setRestState({ ...rest_state, api_error: response.error.message });
                return;
            }
            setRestState({ ...rest_state, ...response.get_settings });
            setChecked(true);
            setIsLoading(false);
            onFormConfirm?.();
        }
    };

    const validateFields = (values: TValues) => {
        const errors: TValues = {};
        const validateValues = validate(errors, values);

        const required_fields = ['first_name', 'last_name', 'date_of_birth'];

        validateValues(val => val, required_fields, localize('This field is required'));

        const min_name = 2;
        const max_name = 50;
        const validateName = (name: string, field: string) => {
            if (name) {
                if (!validLength(name.trim(), { min: min_name, max: max_name })) {
                    errors[field] = localize('You should enter 2-50 characters.');
                } else if (!validName(name)) {
                    errors[field] = localize('Letters, spaces, periods, hyphens, apostrophes only.');
                }
            }
        };
        validateName(values.first_name, 'first_name');
        validateName(values.last_name, 'last_name');

        setRestState({ ...rest_state, errors: Object.keys(errors).length > 0 });
        return errors;
    };

    const initializeFormValues = () => {
        WS.wait('get_settings').then(() => {
            const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
            const form_initial_values = filterObjProperties(account_settings, visible_settings);
            if (form_initial_values.date_of_birth) {
                form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format('YYYY-MM-DD');
            }
            setRestState({
                ...rest_state,
                changeable_fields: getChangeableFields(),
                form_initial_values,
            });
            setIsLoading(false);
        });
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
        <Formik initialValues={form_initial_values} enableReinitialize onSubmit={onSubmit} validate={validateFields}>
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
                                'account-form__poi-confirm-example--button__disabled': checked,
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
                                disabled={isSubmitting}
                            />
                        </button>
                    </FormBody>
                </Form>
            )}
        </Formik>
    );
};

export default PoiConfirmWithExampleFormContainer;
