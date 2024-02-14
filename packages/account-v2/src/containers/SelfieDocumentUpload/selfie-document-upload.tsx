import React from 'react';
import { Formik } from 'formik';
import { Button, Text, useDevice } from '@deriv-com/ui';
import SelfieIcon from '../../assets/manual-upload/selfie-icon.svg';
import { Dropzone } from '../../components/Dropzone';
import { MANUAL_DOCUMENT_TYPES } from '../../constants/manualFormConstants';
import { getSelfieValidationSchema } from '../../utils/manualFormUtils';

// type TSelfieDocumentUpload = {
//     validationSchema?: Yup.AnySchema;
// };

export const SelfieDocumentUpload = () => {
    const { isMobile } = useDevice();

    const validationSchema = getSelfieValidationSchema();

    return (
        <Formik
            initialValues={{ [MANUAL_DOCUMENT_TYPES.SELFIE]: '' }}
            onSubmit={() => console.log('Submission called')}
            validationSchema={validationSchema}
        >
            {({ errors, initialValues, isValid, setFieldValue, values }) => {
                console.log('Values: ', { initialValues, errors, values });
                return (
                    <div className='flex flex-col gap-800'>
                        <Text>Upload your selfie</Text>
                        <Dropzone
                            buttonText={isMobile ? 'Tap here to upload' : 'Drop file or click here to upload'}
                            description='Upload your selfie'
                            fileFormats='image/*'
                            hasFrame
                            icon={<SelfieIcon />}
                            onFileChange={(file: File) => setFieldValue(MANUAL_DOCUMENT_TYPES.SELFIE, file)}
                        />
                        <Text size={isMobile ? 'sm' : 'xs'}>
                            Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible
                            and your face is within the frame.
                        </Text>
                        <div className='flex justify-end gap-800 bg-vp px-400 py-800 border-t-solid-grey-2 border-solid border-t-100'>
                            <Button onClick={() => console.log('Back button clicked')} type='button' variant='outlined'>
                                Back
                            </Button>
                            <Button disabled={!isValid || !values[MANUAL_DOCUMENT_TYPES.SELFIE]}>
                                Confirm and upload
                            </Button>
                        </div>
                    </div>
                );
            }}
        </Formik>
    );

    // return (
    //     <Field name={name} validate={validateField(validationSchema)}>
    //         {({ form }: FieldProps<File>) => (
    //             <div className='flex flex-col gap-800'>
    //                 <Text>Upload your selfie</Text>
    //                 <Dropzone
    //                     buttonText={isMobile ? 'Tap here to upload' : 'Drop file or click here to upload'}
    //                     description='Upload your selfie'
    //                     fileFormats='image/*'
    //                     hasFrame
    //                     icon={<SelfieIcon />}
    //                     onFileChange={(file: File) => form.setFieldValue(name, file)}
    //                 />
    //                 <Text size={isMobile ? 'sm' : 'xs'}>
    //                     Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and
    //                     your face is within the frame.
    //                 </Text>
    //             </div>
    //         )}
    //     </Field>
    // );
};
