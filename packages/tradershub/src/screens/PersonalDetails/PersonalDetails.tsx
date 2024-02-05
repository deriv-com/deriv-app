import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import Actions from '../../flows/RealAccountSIgnup/SignupWizard/Actions';
import WizardScreenWrapper from '../../flows/RealAccountSIgnup/SignupWizard/WizardScreenWrapper';
import { ACTION_TYPES, useSignupWizardContext } from '../../providers/SignupWizardProvider/SignupWizardContext';

/**
 * @name PersonalDetails
 * @description The PersonalDetails component is used to display the personal details screen.
 * @example <PersonalDetails />
 * @returns {React.ReactNode}
 */
const PersonalDetails = () => {
    const { dispatch } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { firstName: values.firstName }, type: ACTION_TYPES.SET_PERSONAL_DETAILS });
    };
    return (
        <WizardScreenWrapper heading='Complete your personal details'>
            <Formik
                initialValues={{
                    firstName: '',
                }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 overflow-y-auto p-1200'>
                            <p className='text-75'>
                                Any information you provide is confidential and will be used for verification purposes
                                only.
                            </p>
                        </div>

                        <Actions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default PersonalDetails;
