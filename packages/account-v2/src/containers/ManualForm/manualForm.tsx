import React from 'react';
import { Form, Formik } from 'formik';
import { Button } from '@deriv-com/ui';
import { MANUAL_FORM_INITIAL_VALUES, TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getManualFormValidationSchema } from '../../utils/manualFormUtils';
import { ManualFormDocumentUpload } from './manualFormDocumentUpload';
import { ManualFormFooter } from './manualFormFooter';
import { ManualFormInputs } from './manualFormInputs';

type TManualFormProps = {
    onSubmit: (values: typeof MANUAL_FORM_INITIAL_VALUES) => void;
    selectedDocument: TManualDocumentTypes;
    onCancel: () => void;
};

export const ManualForm = ({ onSubmit, selectedDocument, onCancel }: TManualFormProps) => (
    <div className='m-400 p-800 border-100 border-solid rounded-400'>
        <Formik
            initialValues={MANUAL_FORM_INITIAL_VALUES}
            onSubmit={onSubmit}
            validationSchema={() => getManualFormValidationSchema(selectedDocument)}
        >
            {({ isValid }) => (
                <Form>
                    <div className='flex flex-col gap-1200 max-w-[67rem]'>
                        <ManualFormInputs selectedDocument={selectedDocument} />
                        <ManualFormDocumentUpload selectedDocument={selectedDocument} />
                        <ManualFormFooter />
                        <div className='flex justify-end gap-800 bg-vp px-400 py-800 border-t-solid-grey-2 border-solid border-t-100'>
                            <Button type='button' variant='outlined' onClick={onCancel}>
                                Back
                            </Button>
                            <Button disabled={!isValid}>Next</Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    </div>
);
