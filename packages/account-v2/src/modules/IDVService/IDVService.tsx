import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { InferType } from 'yup';
import { useIdentityDocumentVerificationAdd, useKycAuthStatus, useSettings } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { Button, Divider, InlineMessage, Loader, Text } from '@deriv-com/ui';
import { API_ERROR_CODES, ERROR_MESSAGE } from '../../constants';
import { PersonalDetailsFormWithExample } from '../../containers';
import { TSupportedDocuments } from '../../types';
import {
    generateIDVPayloadData,
    generateNameDOBFormData,
    generateNameDOBPayloadData,
    getIDVFormValidationSchema,
    getNameDOBValidationSchema,
} from '../../utils';
import { IDVForm } from '../IDVForm';

type TIDVServiceProps = {
    countryCode: string;
    handleComplete: () => void;
    onCancel: () => void;
    supportedDocuments: TSupportedDocuments;
};

type TErrorData = TSocketError<'identity_verification_document_add' | 'set_settings'>;

export const IDVService = ({ countryCode, handleComplete, onCancel, supportedDocuments }: TIDVServiceProps) => {
    const { data: personalInfo, isLoading, updateAsync } = useSettings();
    const { submitIDVDocumentsAsync } = useIdentityDocumentVerificationAdd();

    const idvValidationSchema = getIDVFormValidationSchema(countryCode, supportedDocuments, {});
    const personalDetailsValidationSchema = getNameDOBValidationSchema(true);
    const idvServiceSchema = personalDetailsValidationSchema.concat(idvValidationSchema);

    if (isLoading) {
        return <Loader />;
    }

    const initialValues = {
        ...idvServiceSchema.getDefault(),
        ...generateNameDOBFormData(personalInfo),
    };

    type TIDVServiceValues = InferType<typeof idvServiceSchema>;

    const setErrorMessage = (error: TErrorData['error']) => {
        const { code, message } = error ?? {};
        switch (code) {
            case API_ERROR_CODES.DUPLICATE_ACCOUNT:
                return ERROR_MESSAGE.DUPLICATE_ACCOUNT;
            case API_ERROR_CODES.CLAIMED_DOCUMENT:
                return ERROR_MESSAGE.CLAIMED_DOCUMENT;
            default:
                return message ?? ERROR_MESSAGE.GENERIC;
        }
    };

    const handleSubmit = async (
        values: TIDVServiceValues,
        { setStatus, setSubmitting }: FormikHelpers<TIDVServiceValues>
    ) => {
        setSubmitting(true);
        const personalDetailsPayload = generateNameDOBPayloadData(values);

        try {
            await updateAsync(personalDetailsPayload);
            const idvPayloadData = { ...generateIDVPayloadData(values), issuing_country: countryCode };
            await submitIDVDocumentsAsync(idvPayloadData);
            setSubmitting(false);
            handleComplete();
        } catch (error) {
            const responseError = setErrorMessage((error as TErrorData)?.error);
            setStatus({ error: responseError });
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialStatus={{ error: '' }}
            initialValues={initialValues as TIDVServiceValues}
            onSubmit={handleSubmit}
            validateOnMount
        >
            {({ isSubmitting, isValid, status }) => (
                <Form className='grid h-full'>
                    {status?.error && <InlineMessage variant='error'>{status.error}</InlineMessage>}
                    <div className='grid items-center gap-8 mb-16 grid-cols-[auto_1fr]'>
                        <Text as='h4' size='md' weight='bold'>
                            Identity verification
                        </Text>
                        <Divider className='block w-full' />
                    </div>
                    <section className='flex gap-24 flex-col'>
                        <IDVForm allowDefaultValue countryCode={countryCode} supportedDocuments={supportedDocuments} />
                        <section>
                            <div className='flex items-center gap-8 mb-16'>
                                <Text as='h4' size='md' weight='bold'>
                                    Details
                                </Text>
                                <Divider className='block w-full' />
                            </div>
                            <PersonalDetailsFormWithExample skipConfirmation />
                        </section>
                    </section>
                    <section className='flex gap-8 flex-col justify-end'>
                        <Divider />
                        <div className='flex gap-8 justify-end'>
                            <Button
                                color='black'
                                onClick={onCancel}
                                rounded='sm'
                                size='lg'
                                type='button'
                                variant='outlined'
                            >
                                Back
                            </Button>
                            <Button disabled={!isValid || isSubmitting} rounded='sm' size='lg' type='submit'>
                                {isSubmitting ? <Loader /> : 'Verify'}
                            </Button>
                        </div>
                    </section>
                </Form>
            )}
        </Formik>
    );
};
