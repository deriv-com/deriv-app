import React from 'react';
import { unix } from 'dayjs';
import { Form, Formik } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { Button, Divider, Loader, Text } from '@deriv-com/ui';
import { PersonalDetailsFormWithExample } from '../../containers';
import { TSupportedDocuments } from '../../types';
import { getIDVFormValidationSchema } from '../../utils/idvFormUtils';
import { getNameDOBValidationSchema } from '../../utils/personal-details-utils';
import { IDVForm } from '../IDVForm';

type TIDVServiceProps = {
    countryCode: string;
    onCancel: () => void;
    supportedDocuments: TSupportedDocuments;
};

export const IDVService = ({ countryCode, onCancel, supportedDocuments }: TIDVServiceProps) => {
    const { data: personalInfo, isLoading, update } = useSettings();

    const idvValidationSchema = getIDVFormValidationSchema(countryCode, supportedDocuments, {});
    const personalDetailsValidationSchema = getNameDOBValidationSchema(true);

    if (isLoading) {
        return <Loader />;
    }

    const { date_of_birth, first_name, last_name } = personalInfo;

    const castPersonalDetailValues = getNameDOBValidationSchema(true).cast({
        ...personalDetailsValidationSchema.getDefault(),
        dateOfBirth: unix(date_of_birth as number).format('YYYY-MM-DD'),
        firstName: first_name,
        lastName: last_name,
    });

    const initialValues = { ...idvValidationSchema.getDefault(), ...castPersonalDetailValues };

    type TIDVServiceValues = InferType<typeof initialValues>;

    const handleSubmit = (values: TIDVServiceValues) => {};

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={() => {
                // [TODO]: Implement submit
            }}
            validateOnMount
        >
            {({ isValid }) => (
                <Form className='grid h-full'>
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
                            <Button disabled={!isValid} rounded='sm' size='lg' type='submit'>
                                Verify
                            </Button>
                        </div>
                    </section>
                </Form>
            )}
        </Formik>
    );
};
