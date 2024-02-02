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
const Address = () => {
    const { dispatch } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { firstName: values.firstName }, type: ACTION_TYPES.SET_PERSONAL_DETAILS });
    };
    return (
        <WizardScreenWrapper heading='Complete your address details'>
            <Formik
                initialValues={{
                    firstName: '',
                }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 overflow-y-auto p-1200'>
                            <p className='font-bold text-50'>
                                Only use an address for which you have proof of residence -
                            </p>
                            <p className='text-50'>
                                a recent utility bill (e.g. electricity, water, gas, landline or internet), bank
                                statement, or government-issued letter with your name and this address.
                            </p>
                        </div>
                        <Actions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default Address;
