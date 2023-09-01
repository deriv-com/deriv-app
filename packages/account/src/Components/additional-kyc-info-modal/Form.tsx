import React from 'react';
import { ResidenceList } from '@deriv/api-types';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Modal, SelectNative, StaticUrl } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Field, FieldProps, Form, Formik } from 'formik';
import { FormInputField } from '../forms/form-fields';
import { getInputs } from './form-config';
import './additional-kyc-info-modal.scss';
import AccountLimitsExtraInfo from '../account-limits/account-limits-extra-info';
import classNames from 'classnames';

export const AdditionalKycInfoForm = observer(() => {
    const { client } = useStore();
    const { account_settings, residence_list } = client;
    const { fields, initialValues, validate } = getInputs({
        account_settings,
        residence_list,
        required_fields: ['place_of_birth', 'tax_residence', 'tax_identification_number', 'account_opening_reason'],
    });

    return (
        // eslint-disable-next-line no-console -- Formik onSubmit only for testing
        <Formik initialValues={initialValues} onSubmit={console.log} validate={validate}>
            {({ isValid, dirty, isSubmitting, setFieldValue }) => (
                <Form className='additional-kyc-info-modal__form-layout'>
                    <section className='additional-kyc-info-modal__form-layout--fields'>
                        <fieldset className='additional-kyc-info-modal__form-field'>
                            <Field name='place_of_birth'>
                                {({ field, meta: { touched, error } }: FieldProps) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                {...field}
                                                {...fields[field.name]}
                                                data-lpignore='true'
                                                autoComplete='none' // prevent chrome autocomplete
                                                type='text'
                                                error={touched && error}
                                                onItemSelection={({ value, text }: ResidenceList[number]) =>
                                                    setFieldValue(field.name, value ? text : '', true)
                                                }
                                                data-testid={field.name}
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                {...field}
                                                {...fields[field.name]}
                                                error={touched && error}
                                                use_text
                                                list_portal_id='modal_root'
                                                should_hide_disabled_options={false}
                                                data_testid={field.name}
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
                                                {...fields[field.name]}
                                                data-lpignore='true'
                                                autoComplete='none' // prevent chrome autocomplete
                                                type='text'
                                                error={touched && error}
                                                onItemSelection={({ value, text }: ResidenceList[number]) =>
                                                    setFieldValue(field.name, value ? text : '', true)
                                                }
                                                data-testid={field.name}
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                {...field}
                                                {...fields[field.name]}
                                                error={touched && error}
                                                use_text
                                                list_portal_id='modal_root'
                                                should_hide_disabled_options={false}
                                                data_testid={field.name}
                                            />
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                            <AccountLimitsExtraInfo
                                disable_message_icon
                                message={
                                    <Localize i18n_default_text='The country in which you meet the criteria for paying taxes. Usually the country in which you physically reside.' />
                                }
                            />
                        </fieldset>
                        <fieldset className='additional-kyc-info-modal__form-field--info'>
                            <FormInputField name='tax_identification_number' {...fields.tax_identification_number} />
                            <AccountLimitsExtraInfo
                                disable_message_icon
                                message={
                                    <Localize
                                        i18n_default_text="Don't know your tax identification number? <1></1>Click <0>here</0> to learn more."
                                        components={[
                                            <StaticUrl
                                                key={0}
                                                className='link'
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
                                                {...fields[field.name]}
                                                data-lpignore='true'
                                                autoComplete='none' // prevent chrome autocomplete
                                                type='text'
                                                error={touched && error}
                                                onItemSelection={({ value }: { value?: string }) =>
                                                    setFieldValue(field.name, value ?? '', true)
                                                }
                                                data-testid={field.name}
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                {...field}
                                                {...fields[field.name]}
                                                error={touched && error}
                                                use_text
                                                list_portal_id='modal_root'
                                                should_hide_disabled_options={false}
                                                data_testid={field.name}
                                            />
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                    </section>
                    <Modal.Footer has_separator className='additional-kyc-info-modal__form-action'>
                        <Button large primary type='submit' disabled={!dirty || !isValid || isSubmitting}>
                            <Localize i18n_default_text='Submit' />
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Formik>
    );
});

AdditionalKycInfoForm.displayName = 'AdditionalKycInfoForm';
