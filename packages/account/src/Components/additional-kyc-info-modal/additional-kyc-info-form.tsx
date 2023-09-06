import React from 'react';
import {
    Autocomplete,
    Button,
    DesktopWrapper,
    Loading,
    MobileWrapper,
    Modal,
    SelectNative,
    Text,
} from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import { isMobile } from '@deriv/shared';
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik';
import FormFieldInfo from '../form-field-info';
import { FormInputField } from '../forms/form-fields';
import { TListItem, getFormConfig } from './form-config';
import { useSettings } from '../../../../api/src/hooks';

const FormTitle = () => (
    <Text
        as='p'
        size='s'
        line_height='xxl'
        align={isMobile() ? 'left' : 'center'}
        className='additional-kyc-info-modal__form--header'
    >
        <Localize i18n_default_text='Please take a moment to update your information now.' />
    </Text>
);

type TAdditionalKycInfoFormProps = {
    setError?: React.Dispatch<React.SetStateAction<string>>;
};

export const AdditionalKycInfoForm = observer(({ setError }: TAdditionalKycInfoFormProps) => {
    const { client, ui, notifications } = useStore();
    const { residence_list, updateAccountStatus } = client;
    const {
        update,
        mutation: { isLoading, isSuccess, error, isError },
        data,
    } = useSettings();

    const { fields, initialValues, validate } = getFormConfig({
        account_settings: data,
        residence_list,
        required_fields: ['place_of_birth', 'tax_residence', 'tax_identification_number', 'account_opening_reason'],
    });

    const onSubmit = (values: typeof initialValues) => {
        const tax_residence = residence_list.find(item => item.text === values.tax_residence)?.value;
        const place_of_birth = residence_list.find(item => item.text === values.place_of_birth)?.value;

        update({ ...values, tax_residence, place_of_birth });
    };

    React.useEffect(() => {
        if (!isLoading && isSuccess) {
            updateAccountStatus();
            notifications.refreshNotifications();
            ui.toggleAdditionalKycInfoModal();
            ui.toggleKycInformationSubmittedModal();
        }
    }, [isLoading, isSuccess, notifications, ui, updateAccountStatus]);

    React.useEffect(() => {
        if (isError && setError) {
            setError(error as string);
        }
    }, [error, isError, setError]);

    const onItemSelection =
        (
            field: string,
            setFieldValue: (
                field: string,
                value: string,
                shouldValidate?: boolean | undefined
            ) => Promise<void | FormikErrors<Record<string, unknown>>>
        ) =>
        ({ value, text }: TListItem) => {
            setFieldValue(field, value ? text : '', true);
        };

    return (
        <Formik
            validateOnMount
            validateOnBlur
            validateOnChange
            enableReinitialize
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
        >
            {({ isValid, dirty, setFieldValue }) => (
                <Form className='additional-kyc-info-modal__form-layout'>
                    {isLoading ? (
                        <Loading is_fullscreen={false} />
                    ) : (
                        <section className='additional-kyc-info-modal__form-layout--fields'>
                            <FormTitle />
                            <fieldset className='additional-kyc-info-modal__form-field'>
                                <Field name='place_of_birth'>
                                    {({ field, meta: { touched, error } }: FieldProps<typeof initialValues>) => (
                                        <React.Fragment>
                                            <DesktopWrapper>
                                                <Autocomplete
                                                    {...field}
                                                    {...fields[field.name as keyof typeof fields]}
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    error={(touched && error) as string}
                                                    onItemSelection={onItemSelection(field.name, setFieldValue)}
                                                    data-testid={`dt_${field.name}`}
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    {...field}
                                                    {...fields[field.name as keyof typeof fields]}
                                                    error={(touched && error) as string}
                                                    use_text
                                                    should_hide_disabled_options={false}
                                                    data-testid={`dt_${field.name}`}
                                                />
                                            </MobileWrapper>
                                        </React.Fragment>
                                    )}
                                </Field>
                            </fieldset>
                            <fieldset
                                className={classNames(
                                    'additional-kyc-info-modal__form-field',
                                    'additional-kyc-info-modal__form-field--info'
                                )}
                            >
                                <Field name='tax_residence'>
                                    {({ field, meta: { touched, error } }: FieldProps) => (
                                        <React.Fragment>
                                            <DesktopWrapper>
                                                <Autocomplete
                                                    {...field}
                                                    {...fields[field.name as keyof typeof fields]}
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    type='text'
                                                    error={(touched && error) as string}
                                                    onItemSelection={onItemSelection(field.name, setFieldValue)}
                                                    data-testid={`dt_${field.name}`}
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    {...field}
                                                    {...fields[field.name as keyof typeof fields]}
                                                    error={(touched && error) as string}
                                                    use_text
                                                    should_hide_disabled_options={false}
                                                    data-testid={`dt_${field.name}`}
                                                />
                                            </MobileWrapper>
                                        </React.Fragment>
                                    )}
                                </Field>
                                <FormFieldInfo
                                    message={
                                        <Localize i18n_default_text='The country in which you meet the criteria for paying taxes. Usually the country in which you physically reside.' />
                                    }
                                />
                            </fieldset>
                            <fieldset className='additional-kyc-info-modal__form-field--info'>
                                <FormInputField
                                    data-testid='dt_tax_identification_number'
                                    {...fields.tax_identification_number}
                                />
                                <FormFieldInfo
                                    message={
                                        <Localize
                                            i18n_default_text="Don't know your tax identification number? <1></1>Click <0>here</0> to learn more."
                                            components={[
                                                <a
                                                    key={0}
                                                    className='link'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    href='https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/'
                                                />,
                                                <br key={1} />,
                                            ]}
                                        />
                                    }
                                />
                            </fieldset>
                            <fieldset className='additional-kyc-info-modal__form-field'>
                                <Field name='account_opening_reason'>
                                    {({ field, meta: { touched, error } }: FieldProps) => (
                                        <React.Fragment>
                                            <DesktopWrapper>
                                                <Autocomplete
                                                    {...field}
                                                    {...fields[field.name as keyof typeof fields]}
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    type='text'
                                                    error={(touched && error) as string}
                                                    onItemSelection={({ value = '' }: TListItem) => {
                                                        setFieldValue(field.name, value, true);
                                                    }}
                                                    list_height='8rem'
                                                    data-testid={`dt_${field.name}`}
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    {...field}
                                                    {...fields[field.name as keyof typeof fields]}
                                                    error={(touched && error) as string}
                                                    use_text
                                                    should_hide_disabled_options={false}
                                                    data-testid={`dt_${field.name}`}
                                                />
                                            </MobileWrapper>
                                        </React.Fragment>
                                    )}
                                </Field>
                            </fieldset>
                        </section>
                    )}
                    <Modal.Footer has_separator className='additional-kyc-info-modal__form-action'>
                        <Button large primary type='submit' disabled={!dirty || !isValid || isLoading}>
                            <Localize i18n_default_text='Submit' />
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Formik>
    );
});

AdditionalKycInfoForm.displayName = 'AdditionalKycInfoForm';

export default AdditionalKycInfoForm;
