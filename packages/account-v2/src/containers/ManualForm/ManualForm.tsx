import React, { useMemo } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { InferType } from 'yup';
import { Button } from '@deriv-com/ui';
import { MANUAL_DOCUMENT_SELFIE, TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getManualFormValidationSchema } from '../../utils/manualFormUtils';
import { ManualFormDocumentUpload } from './ManualFormDocumentUpload';
import { ManualFormFooter } from './ManualFormFooter';
import { ManualFormInputs } from './ManualFormInputs';

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
        const defaultValues = validationSchema.getDefault();
        const formValues = { ...defaultValues, ...formData };
        // Removing Selfie data from formValues as it is not part of this section of manual form
        if (MANUAL_DOCUMENT_SELFIE in formValues) {
            delete formValues[MANUAL_DOCUMENT_SELFIE];
        }
        return formValues;
    }, [formData, validationSchema]);

    return (
        <Formik
            initialValues={initialValues as TmanualDocumentFormValues}
            onSubmit={onSubmit}
            validateOnMount
            validationSchema={validationSchema}
        >
            {({ dirty, isSubmitting, isValid }) => (
                <Form>
                    <div className='flex flex-col min-h-screen w-full'>
                        <div className='flex flex-col gap-24'>
                            <ManualFormInputs
                                isExpiryDateRequired={isExpiryDateRequired}
                                selectedDocument={selectedDocument}
                            />
                            <ManualFormDocumentUpload selectedDocument={selectedDocument} />
                            <ManualFormFooter />
                        </div>
                        <div className='sticky bottom-0 flex justify-end gap-16 px-8 py-16 border-t-solid-grey-2 bg-solid-slate-0 border-solid border-t-2'>
                            <Button
                                disabled={isSubmitting}
                                onClick={onCancel}
                                size='lg'
                                type='button'
                                variant='outlined'
                            >
                                Back
                            </Button>
                            <Button disabled={!isValid || isSubmitting || !dirty} size='lg' type='submit'>
                                Next
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
