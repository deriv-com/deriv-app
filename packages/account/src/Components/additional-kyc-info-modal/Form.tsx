import React from 'react';
import { ResidenceList } from '@deriv/api-types';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Modal, SelectNative } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Field, FieldProps, Form, Formik } from 'formik';
import { FormInputField } from '../forms/form-fields';
import { getInputs } from './form-config';

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
                <Form>
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
                    <FormInputField name='tax_identification_number' {...fields.tax_identification_number} />
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
                    <Modal.Footer has_separator>
                        <Button primary type='submit' disabled={!dirty || !isValid || isSubmitting}>
                            <Localize i18n_default_text='Submit' />
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Formik>
    );
});

AdditionalKycInfoForm.displayName = 'AdditionalKycInfoForm';
