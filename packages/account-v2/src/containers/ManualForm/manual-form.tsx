import React, { useMemo } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { InferType } from 'yup';
import { Button } from '@deriv-com/ui';
import { MANUAL_DOCUMENT_SELFIE, TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getManualFormValidationSchema, setInitialValues } from '../../utils/manual-form-utils';
import { ManualFormDocumentUpload } from './manual-form-document-upload';
import { ManualFormFooter } from './manual-form-footer';
import { ManualFormInputs } from './manual-form-inputs';

type TmanualDocumentFormValues = InferType<ReturnType<typeof getManualFormValidationSchema>>;

type TManualFormProps = {
    formData: FormikValues;
    isExpiryDateRequired: boolean;
    onCancel: () => void;
    onSubmit: (values: TmanualDocumentFormValues) => void;
    selectedDocument: TManualDocumentTypes;
};

export const ManualForm = ({
    formData,
    isExpiryDateRequired,
    onCancel,
    onSubmit,
    selectedDocument,
}: TManualFormProps) => {
    const validationSchema = getManualFormValidationSchema(selectedDocument, isExpiryDateRequired);

    const initialValues = useMemo(() => {
        const defaultValues = setInitialValues(Object.keys(validationSchema.fields));
        const formValues = { ...defaultValues, ...formData };
        delete formValues[MANUAL_DOCUMENT_SELFIE];
        return formValues;
    }, [formData, validationSchema.fields]);

    return (
        <Formik
            initialValues={initialValues as TmanualDocumentFormValues}
            onSubmit={onSubmit}
            validateOnMount
            validationSchema={validationSchema}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <div className='flex flex-col min-h-screen w-full'>
                        <div className='flex flex-col gap-1200'>
                            <ManualFormInputs
                                isExpiryDateRequired={isExpiryDateRequired}
                                selectedDocument={selectedDocument}
                            />
                            <ManualFormDocumentUpload selectedDocument={selectedDocument} />
                            <ManualFormFooter />
                        </div>
                        <div className='sticky bottom-50 flex justify-end gap-800 bg-vp px-400 py-800 border-t-solid-grey-2 bg-solid-slate-50 border-solid border-t-100'>
                            <Button
                                disabled={isSubmitting}
                                onClick={onCancel}
                                size='lg'
                                type='button'
                                variant='outlined'
                            >
                                Back
                            </Button>
                            <Button disabled={!isValid || isSubmitting} size='lg'>
                                Next
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
