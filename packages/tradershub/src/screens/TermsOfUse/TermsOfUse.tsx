import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import Actions from '../../flows/RealAccountSIgnup/SignupWizard/Actions';
import WizardScreenWrapper from '../../flows/RealAccountSIgnup/SignupWizard/WizardScreenWrapper';
import { ACTION_TYPES, useSignupWizardContext } from '../../providers/SignupWizardProvider/SignupWizardContext';

/**
 * @name Address
 * @description The Address component is used to display the address screen.
 * @example <Address />
 * @returns {React.ReactNode}
 */
const TermsOfUse = () => {
    const { dispatch } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { firstName: values.firstName }, type: ACTION_TYPES.SET_PERSONAL_DETAILS });
    };
    return (
        <WizardScreenWrapper heading='Terms of Use'>
            <Formik
                initialValues={{
                    firstName: '',
                }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 overflow-y-auto p-1200'>
                            <p className='font-bold text-50'>Jurisdiction and choice of law </p>
                            <p className='text-50'>
                                Your account will be opened with Deriv (SVG) Ltd., and will be subject to the laws of
                                Saint Vincent and the Grenadines.
                            </p>
                        </div>
                        <Actions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default TermsOfUse;
