import React, { Fragment } from 'react';
import { Field, FieldProps } from 'formik';
import { Input, Text } from '@deriv-com/ui';
import { WalletDatePicker } from '../../components/base/WalletDatePicker';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { useManualForm } from '../../hooks';
import { getFieldsConfig, getTitleForFormInputs } from '../../utils/manualFormUtils';

type TManualFormInputsProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormInputs = ({ selectedDocument }: TManualFormInputsProps) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);
    const { isExpiryDateRequired } = useManualForm();

    return (
        <Fragment>
            <Text>{getTitleForFormInputs(selectedDocument)}</Text>
            <div className='gap-1200 flex flex-col lg:grid lg:grid-cols-2'>
                <Field name='document_number'>
                    {({ field, meta }: FieldProps) => {
                        const hasError = meta.touched && !!meta.error;
                        const fieldLabel = `${fieldsConfig.documentNumber.label}*`;
                        return (
                            <Input
                                {...field}
                                aria-label={fieldLabel}
                                autoComplete='off'
                                className='w-full'
                                error={hasError}
                                label={fieldLabel}
                                message={hasError ? meta.error : ''}
                                wrapperClassName='w-full'
                            />
                        );
                    }}
                </Field>
                {isExpiryDateRequired && (
                    <Field name='document_expiry'>
                        {({ field, form, meta }: FieldProps) => (
                            <WalletDatePicker
                                {...field}
                                errorMessage={meta.error}
                                isInvalid={(meta.touched && !!meta.error) || !!form.errors.document_expiry}
                                label={`${fieldsConfig.documentExpiry.label}*`}
                                onDateChange={(date: string | null) => {
                                    form.setFieldValue('document_expiry', date);
                                }}
                            />
                        )}
                    </Field>
                )}
            </div>
        </Fragment>
    );
};
