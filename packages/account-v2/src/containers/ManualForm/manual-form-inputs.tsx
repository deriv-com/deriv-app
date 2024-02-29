import React, { Fragment } from 'react';
import { Field, FieldProps } from 'formik';
import { Input, Text } from '@deriv-com/ui';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getFieldsConfig, getTitleForFormInputs } from '../../utils/manual-form-utils';

type TManualFormInputsProps = { isExpiryDateRequired: boolean; selectedDocument: TManualDocumentTypes };

export const ManualFormInputs = ({ isExpiryDateRequired, selectedDocument }: TManualFormInputsProps) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);

    return (
        <Fragment>
            <Text>{getTitleForFormInputs(selectedDocument)}</Text>
            <div className='gap-24 flex flex-col lg:grid lg:grid-cols-2'>
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
                        {({ field, meta }: FieldProps) => {
                            const hasError = meta.touched && !!meta.error;
                            const fieldLabel = `${fieldsConfig.documentExpiry.label}*`;
                            return (
                                <Input
                                    {...field}
                                    aria-label={fieldLabel}
                                    autoComplete='off'
                                    className='w-full'
                                    error={hasError}
                                    label={fieldLabel}
                                    message={hasError ? meta.error : ''}
                                    type='date'
                                />
                            );
                        }}
                    </Field>
                )}
            </div>
        </Fragment>
    );
};
