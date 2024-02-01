import React from 'react';
import { Formik } from 'formik';
import { Button } from '@deriv/ui';
import { MANUAL_FORM_INITIAL_VALUES, TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getManualFormValidationSchema } from '../../utils/manualFormUtils';
import { ManualFormDocumentUpload } from './manualFormDocumentUpload';
import { ManualFormFooter } from './manualFormFooter';
import { ManualFormInputs } from './manualFormInputs';

type TManualFormProps = {
    selectedDocument: TManualDocumentTypes;
};

const Divider = () => <div className='w-full border-t-solid-grey-5 border-solid border-t-100' />;

export const ManualForm = ({ selectedDocument }: TManualFormProps) => {
    return (
        <div className='m-400 p-800 border-100 border-solid rounded-400'>
            <Formik
                initialValues={MANUAL_FORM_INITIAL_VALUES}
                validationSchema={() => getManualFormValidationSchema(selectedDocument)}
            >
                <div className='flex flex-col gap-1200 max-w-[67rem]'>
                    <ManualFormInputs selectedDocument={selectedDocument} />
                    <Divider />
                    <ManualFormDocumentUpload selectedDocument={selectedDocument} />
                    <ManualFormFooter />
                    <div>
                        <Divider />
                        <div className='flex justify-end gap-800 bg-vp px-400 py-800'>
                            <Button color='secondary'>Back</Button>
                            <Button>Next</Button>
                        </div>
                    </div>
                </div>
            </Formik>
        </div>
    );
};
