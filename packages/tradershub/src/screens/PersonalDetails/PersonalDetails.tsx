import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { ScrollToFieldError } from '@/helpers';
import { personalDetails } from '@/utils';
import { Text } from '@deriv-com/ui';
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
        firstName: state.firstName ?? '',
        lastName: state.lastName ?? '',
        dateOfBirth: state.dateOfBirth ?? '',
        confirmation: false,
        phoneNumber: state.phoneNumber ?? '',
        placeOfBirth: state.placeOfBirth ?? '',
        taxResidence: state.taxResidence ?? '',
        taxIdentificationNumber: state.taxIdentificationNumber ?? '',
        accountOpeningReason: state.accountOpeningReason ?? '',
        taxInfoConfirmation: false,
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
                        <ScrollToFieldError fieldOrder={Object.keys(initialValues)} />
                        <div className='flex-1 p-16 overflow-y-auto lg:p-24'>
                            <Text className='text-sm lg:text-default'>
                                Any information you provide is confidential and will be used for verification purposes
                                only.
                            </Text>
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
