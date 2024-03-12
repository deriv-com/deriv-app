// [TODO]: Remove this eslint disable rule once form submission is implemented
import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { useKycAuthStatus } from '@deriv/api-v2';
import { Button, Divider, Text } from '@deriv-com/ui';
import { PersonalDetailsFormWithExample } from '../../containers';
import { getIDVFormValidationSchema } from '../../utils/idvFormUtils';
import { getNameDOBValidationSchema } from '../../utils/personal-details-utils';
import { IDVForm } from '../IDVForm';

type TIDVServiceProps = {
    countryCode: string;
    supportedDocuments: Exclude<
        Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
        undefined
    >['idv'];
};

export const IDVService = ({ countryCode, supportedDocuments }: TIDVServiceProps) => {
    const validationSchema = getIDVFormValidationSchema(countryCode, supportedDocuments, {});

    const initialValues = { ...validationSchema.getDefault(), ...getNameDOBValidationSchema().getDefault() };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={() => {
                // [TODO]: Implement submit
            }}
            validateOnMount
        >
            <Fragment>
                <div>
                    <IDVForm allowDefaultValue countryCode={countryCode} supportedDocuments={supportedDocuments} />
                    <section>
                        <div className='flex items-center gap-8 mb-16'>
                            <Text as='p' size='md' weight='bold'>
                                Details
                            </Text>
                            <Divider className='block w-full' />
                        </div>
                        <PersonalDetailsFormWithExample
                            onConfirm={() => {
                                // [TODO]: Implement onConfirm
                            }}
                        />
                    </section>
                </div>
                <div>
                    <Divider />
                    <Button onClick={() => 'Clicked Back'} type='button'>
                        Back
                    </Button>
                    <Button type='submit'>Verify</Button>
                </div>
            </Fragment>
        </Formik>
    );
};
