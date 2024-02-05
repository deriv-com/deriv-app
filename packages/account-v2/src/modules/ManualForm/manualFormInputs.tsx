import React, { Fragment } from 'react';
import { Field, FieldProps } from 'formik';
import { WalletDatePicker } from '../../components/base/WalletDatePicker';
import { WalletText } from '../../components/base/WalletText';
import { WalletTextField } from '../../components/base/WalletTextField';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getFieldsConfig, getTitleForFormInputs } from '../../utils/manualFormUtils';
import { useManualForm } from '../../hooks';

type TManualFormInputsProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormInputs = ({ selectedDocument }: TManualFormInputsProps) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);
    const { isExpiryDateRequired } = useManualForm();

    return (
        <Fragment>
            <WalletText>{getTitleForFormInputs(selectedDocument)}</WalletText>
            <div className='grid grid-cols-2 gap-1200'>
                <Field name='document_number'>
                    {({ field, meta }: FieldProps) => (
                        <WalletTextField
                            {...field}
                            errorMessage={meta.error}
                            isInvalid={meta.touched && Boolean(meta.error)}
                            label={`${fieldsConfig.documentNumber.label}*`}
                        />
                    )}
                </Field>
                {isExpiryDateRequired && (
                    <Field name='document_expiry'>
                        {({ field, meta }: FieldProps) => (
                            <WalletDatePicker
                                {...field}
                                errorMessage={meta.error}
                                isInvalid={meta.touched && Boolean(meta.error)}
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
