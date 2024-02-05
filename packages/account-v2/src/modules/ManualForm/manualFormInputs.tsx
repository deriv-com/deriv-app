import { Input } from '@deriv-com/ui';
import { Field, FieldProps } from 'formik';
import React, { Fragment } from 'react';
import { WalletDatePicker } from '../../components/base/WalletDatePicker';
import { WalletText } from '../../components/base/WalletText';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { useManualForm } from '../../hooks';
import { getFieldsConfig, getTitleForFormInputs } from '../../utils/manualFormUtils';

type TManualFormInputsProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormInputs = ({ selectedDocument }: TManualFormInputsProps) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);
    const { isExpiryDateRequired } = useManualForm();

    return (
        <Fragment>
            <WalletText>{getTitleForFormInputs(selectedDocument)}</WalletText>
            <div className='grid grid-cols-2 gap-1200'>
                <Field name='document_number'>
                    {({ field, meta }: FieldProps) => {
                        const hasError = meta.touched && !!meta.error;
                        return (
                            <Input
                                {...field}
                                className='h-2100'
                                error={hasError}
                                label={`${fieldsConfig.documentNumber.label}*`}
                                message={hasError ? meta.error : ''}
                            />
                        );
                    }}
                </Field>
                {isExpiryDateRequired && (
                    <Field name='document_expiry'>
                        {({ field, meta }: FieldProps) => (
                            <WalletDatePicker
                                {...field}
                                errorMessage={meta.error}
                                isInvalid={meta.touched && !!meta.error}
                                label={`${fieldsConfig.documentExpiry.label}*`}
                                onDateChange={field.onChange}
                            />
                        )}
                    </Field>
                )}
            </div>
        </Fragment>
    );
};
