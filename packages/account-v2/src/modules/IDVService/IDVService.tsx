import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { useKycAuthStatus } from '@deriv/api-v2';
import { Button, Divider, Text } from '@deriv-com/ui';
import { PersonalDetailsFormWithExample } from '../../containers';
import { DOCUMENT_LIST } from '../../mocks/idv-form.mock';
import { getIDVFormValidationSchema } from '../../utils/idvFormUtils';
import { getNameDOBValidationSchema } from '../../utils/personal-details-utils';
import { IDVForm } from '../IDVForm';

type TIDVServiceProps = {
    supportedDocuments: Exclude<
        Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
        undefined
    >['idv'];
};

export const IDVService = ({ supportedDocuments }: TIDVServiceProps) => {
    const validationSchema = getIDVFormValidationSchema(DOCUMENT_LIST).concat(getNameDOBValidationSchema());

    return (
        <Formik
            initialValues={validationSchema.getDefault()}
            onSubmit={() => console.log('Form submitted')}
            validateOnMount
            validationSchema={validationSchema}
        >
            <Fragment>
                <div>
                    <IDVForm allowDefaultValue supportedDocuments={supportedDocuments} />
                    <section>
                        <div className='flex items-center gap-8 mb-16'>
                            <Text as='p' size='md' weight='bold'>
                                Details
                            </Text>
                            <Divider className='block w-full' />
                        </div>
                        <PersonalDetailsFormWithExample
                            onConfirm={() => {
                                console.log('Personal details updated');
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
