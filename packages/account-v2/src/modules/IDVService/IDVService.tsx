import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { twMerge } from 'tailwind-merge';
import { InferType } from 'yup';
import { useIdentityDocumentVerificationAdd, useKycAuthStatus, useSettings } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { Button, Divider, InlineMessage, Loader, Text } from '@deriv-com/ui';
import { POI_SERVICE } from '../../constants';
import { PersonalDetailsFormWithExample } from '../../containers';
import {
    checkIDVErrorStatus,
    generateIDVPayloadData,
    generateNameDOBFormData,
    generateNameDOBPayloadData,
    getButtonText,
    getIDVFormValidationSchema,
    getNameDOBValidationSchema,
    setErrorMessage,
    translateErrorCode,
} from '../../utils';
import { IDVForm } from '../IDVForm';

type TIDVServiceProps = {
    countryCode?: string;
    handleComplete: () => void;
    onCancel: () => void;
};

type TErrorData = TSocketError<'identity_verification_document_add' | 'set_settings'>;

export const IDVService = ({ countryCode, handleComplete, onCancel }: TIDVServiceProps) => {
    const {
        data: personalInfo,
        isLoading,
        mutation: { mutateAsync: updateAsync },
    } = useSettings();
    const { mutateAsync: submitIDVDocumentsAsync } = useIdentityDocumentVerificationAdd();

    const payload = countryCode ? { country: countryCode } : undefined;

    const { isLoading: isLoadingKycAuthStatus, kyc_auth_status: kycAuthStatus } = useKycAuthStatus(payload);

    if (isLoading || isLoadingKycAuthStatus) {
        return <Loader />;
    }

    const supportedDocuments = kycAuthStatus?.identity?.supported_documents?.idv;
    const errorStatus = checkIDVErrorStatus({ errors: kycAuthStatus?.identity?.last_rejected?.rejected_reasons });

    const personalDetailsValidationSchema = getNameDOBValidationSchema();

    let initialValues = {};
    let idvServiceSchema;

    if (countryCode) {
        const idvValidationSchema = getIDVFormValidationSchema(countryCode, supportedDocuments, {});
        idvServiceSchema = personalDetailsValidationSchema.concat(idvValidationSchema);
        initialValues = {
            ...idvServiceSchema.getDefault(),
            ...generateNameDOBFormData(personalInfo, errorStatus),
        };
    } else {
        idvServiceSchema = personalDetailsValidationSchema;
        initialValues = { ...generateNameDOBFormData(personalInfo, errorStatus) };
    }

    type TIDVServiceValues = InferType<ReturnType<typeof getIDVFormValidationSchema>> &
        InferType<ReturnType<typeof getNameDOBValidationSchema>>;

    const handleSubmit = async (
        values: TIDVServiceValues,
        { setStatus, setSubmitting }: FormikHelpers<TIDVServiceValues>
    ) => {
        setStatus({ error: '' });
        setSubmitting(true);
        const personalDetailsPayload = generateNameDOBPayloadData(values, errorStatus);

        try {
            await updateAsync({ payload: personalDetailsPayload });
            if (countryCode) {
                const idvPayloadData = {
                    ...generateIDVPayloadData(values),
                    issuing_country: countryCode,
                };
                await submitIDVDocumentsAsync({ payload: idvPayloadData });
            }
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
            initialStatus={{ error: translateErrorCode(errorStatus, POI_SERVICE.idv) }}
            initialValues={initialValues as TIDVServiceValues}
            onSubmit={handleSubmit}
            validateOnMount
        >
            {({ isSubmitting, isValid, status }) => (
                <Form className={twMerge('grid h-full', !countryCode && 'grid-rows-[auto_1fr_auto]')}>
                    {status?.error && (
                        <div className='flex flex-col gap-16 mb-16'>
                            <Text as='h4' size='sm' weight='bold'>
                                Your identity verification failed because:
                            </Text>
                            <InlineMessage variant='error'>
                                <Text size='sm'>{status.error}</Text>
                            </InlineMessage>
                        </div>
                    )}
                    {countryCode && (
                        <div className='grid items-center gap-8 mb-16 grid-cols-[auto_1fr]'>
                            <Text as='h4' size='md' weight='bold'>
                                Identity verification
                            </Text>
                            <Divider className='block w-full' />
                        </div>
                    )}
                    <section className='flex gap-24 flex-col'>
                        {countryCode && (
                            <IDVForm
                                allowDefaultValue
                                countryCode={countryCode}
                                supportedDocuments={supportedDocuments}
                            />
                        )}
                        <section>
                            <div className='flex items-center gap-8 mb-16'>
                                <Text as='h4' size='md' weight='bold'>
                                    Details
                                </Text>
                                <Divider className='block w-full' />
                            </div>
                            <PersonalDetailsFormWithExample errorStatus={errorStatus} />
                        </section>
                    </section>
                    <section className='flex gap-8 flex-col justify-end'>
                        <Divider />
                        <div className='flex gap-8 justify-end'>
                            {!errorStatus && (
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
                            )}
                            <Button disabled={!isValid || isSubmitting} rounded='sm' size='lg' type='submit'>
                                {getButtonText(errorStatus)}
                            </Button>
                        </div>
                    </section>
                </Form>
            )}
        </Formik>
    );
};
