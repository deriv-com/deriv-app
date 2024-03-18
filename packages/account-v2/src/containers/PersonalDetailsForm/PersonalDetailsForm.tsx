import React from 'react';
import { Form, Formik } from 'formik';
import {
    useActiveTradingAccount,
    useGetAccountStatus,
    useIsEuRegion,
    useResidenceList,
    useSettings,
    useStatesList,
} from '@deriv/api-v2';
import { Checkbox, Text } from '@deriv-com/ui';
import { FormSubHeader } from '../../components/FormSubHeader';
import { useCurrentLandingCompany } from '../../hooks/useCurrentLandingCompany';
import { AddressFields } from '../../modules/AddressFields';
import { PersonalDetails } from './PersonalDetails';
import { SupportProfessionalClient } from './SupportProfessionalClient';
import { TaxInformation } from './TaxInformation';
import { getPersonalDetailsInitialValues, getPersonalDetailsValidationSchema } from './validation';

export const PersonalDetailsForm = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: accountSettings } = useSettings();
    const { data: accountStatus } = useGetAccountStatus();
    const { data: currentLandingCompany } = useCurrentLandingCompany();
    const { data: residenceList } = useResidenceList();
    const { data: statesLists } = useStatesList(accountSettings?.country_code ?? '');
    const { data: isEu } = useIsEuRegion();

    const isSocialSignup = accountStatus?.status?.includes('social_signup');

    const isVirtual = activeAccount?.is_virtual;

    const isSupportProfessionalClient =
        currentLandingCompany &&
        typeof currentLandingCompany === 'object' &&
        'support_professional_client' in currentLandingCompany &&
        !!currentLandingCompany?.support_professional_client;

    const initialValues = getPersonalDetailsInitialValues(accountSettings, residenceList, statesLists, isSocialSignup);

    const validationSchema = getPersonalDetailsValidationSchema(isEu);
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            /*eslint-disable @typescript-eslint/no-empty-function */
            onSubmit={() => {}}
            validationSchema={validationSchema}
        >
            {() => (
                <Form>
                    <FormSubHeader>Details</FormSubHeader>
                    <PersonalDetails />
                    <FormSubHeader>Tax information</FormSubHeader>
                    <TaxInformation />
                    {!isVirtual && (
                        <React.Fragment>
                            <FormSubHeader>Address</FormSubHeader>
                            <div className='lg:max-w-[400px]'>
                                <AddressFields />
                            </div>
                        </React.Fragment>
                    )}
                    {isSupportProfessionalClient && (
                        <React.Fragment>
                            <FormSubHeader>Professional Client</FormSubHeader>
                            <SupportProfessionalClient />
                        </React.Fragment>
                    )}
                    <FormSubHeader>Email preference</FormSubHeader>
                    <Checkbox
                        disabled={!isVirtual}
                        label={
                            <Text as='p' size='sm'>
                                Get updates about Deriv products, services and events.
                            </Text>
                        }
                        name='emailConsent'
                        /*eslint-disable @typescript-eslint/no-empty-function */
                        onChange={() => {}}
                    />
                </Form>
            )}
        </Formik>
    );
};
