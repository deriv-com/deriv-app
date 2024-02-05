import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Text } from '@deriv-com/ui';
import Actions from '../../flows/RealAccountSIgnup/SignupWizard/Actions';
import WizardScreenWrapper from '../../flows/RealAccountSIgnup/SignupWizard/WizardScreenWrapper';
import { ACTION_TYPES, useSignupWizardContext } from '../../providers/SignupWizardProvider/SignupWizardContext';
import FatcaDeclaration from './TermsOfUseSections/FatcaDeclaration';
import PEPs from './TermsOfUseSections/PEPs';

// Temporary till we have this in deriv-com/ui
const Divider = () => {
    return (
        <div className='flex border-solid border-system-light-active-background bg-system-light-primary-background border-75' />
    );
};

/**
 * @name TermsOfUse
 * @description The TermsOfUse component is used to display the terms and conditions before creating an account.
 * @example <TermsOfUse />
 * @returns {React.ReactNode}
 */
const TermsOfUse = () => {
    const { dispatch } = useSignupWizardContext();

    // Temporary function to handle form submission till we have the validations in place
    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { firstName: values.firstName }, type: ACTION_TYPES.SET_PERSONAL_DETAILS });
    };
    return (
        <WizardScreenWrapper heading='Terms of Use'>
            <Formik
                // Temporary initial values
                initialValues={{
                    firstName: '',
                }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 overflow-y-auto p-1200'>
                            <div className='flex flex-col gap-800'>
                                <Text size='sm' weight='bold'>
                                    Jurisdiction and choice of law
                                </Text>
                                <Text size='sm'>
                                    Your account will be opened with Deriv (SVG) Ltd., and will be subject to the laws
                                    of Saint Vincent and the Grenadines.
                                </Text>
                                <Divider />
                                <Text size='sm' weight='bold'>
                                    Risk warning
                                </Text>
                                <Text size='sm'>
                                    The financial trading services offered on this site are only suitable for customers
                                    who accept the possibility of losing all the money they invest and who understand
                                    and have experience of the risk involved in the purchase of financial contracts.
                                    Transactions in financial contracts carry a high degree of risk. If the contracts
                                    you purchased expire as worthless, you will lose all your investment, which includes
                                    the contract premium.
                                </Text>
                                <Divider />
                                <FatcaDeclaration />
                                <Divider />
                                <PEPs />
                            </div>
                        </div>
                        <Actions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default TermsOfUse;
