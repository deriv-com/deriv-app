import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { personalDetails } from '@/utils';
import Actions from '../../flows/RealAccountSIgnup/SignupWizard/Actions';
import WizardScreenWrapper from '../../flows/RealAccountSIgnup/SignupWizard/WizardScreenWrapper';
import { ACTION_TYPES, useSignupWizardContext } from '../../providers/SignupWizardProvider/SignupWizardContext';
import AdditionalInformation from './Sections/AdditionalInformation';
import Details from './Sections/Details';

/**
 * @name PersonalDetails
 * @description The PersonalDetails component is used to display the personal details screen.
 * @example <PersonalDetails />
 * @returns {React.ReactNode}
 */
const PersonalDetails = () => {
    const { dispatch, helpers, state } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { ...values }, type: ACTION_TYPES.SET_PERSONAL_DETAILS });
        helpers.goToNextStep();
    };

    const initialValues = {
        accountOpeningReason: state.accountOpeningReason ?? '',
        dateOfBirth: state.dateOfBirth ?? '',
        firstName: state.firstName ?? '',
        lastName: state.lastName ?? '',
        phoneNumber: state.phoneNumber ?? '',
        placeOfBirth: state.placeOfBirth ?? '',
        taxIdentificationNumber: state.taxIdentificationNumber ?? '',
        taxResidence: state.taxResidence ?? '',
    };

    return (
        <WizardScreenWrapper heading='Complete your personal details'>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validateOnBlur
                validateOnChange
                validationSchema={personalDetails}
            >
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 overflow-y-auto p-1200'>
                            <p className='text-75'>
                                Any information you provide is confidential and will be used for verification purposes
                                only.
                            </p>
                            <Details />
                            <AdditionalInformation />
                        </div>
                        <Actions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default PersonalDetails;
