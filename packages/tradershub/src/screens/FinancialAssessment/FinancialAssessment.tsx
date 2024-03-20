import React from 'react';
import { Form, Formik } from 'formik';
import { WizardScreenActions, WizardScreenWrapper } from '@/flows';
import { useRealAccountCreationContext } from '@/providers';

/**
 * @name FinancialAssessment
 * @description The FinancialAssessment component is used to display the financial assessment screen.
 * @returns {React.ReactNode}
 */
const FinancialAssessment = () => {
    const { helpers } = useRealAccountCreationContext();

    const handleSubmit = () => {
        helpers.goToNextStep();
    };

    return (
        <WizardScreenWrapper heading='Financial Assessment'>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='relative flex-1 p-16 overflow-y-auto lg:p-24'>Financial assessment form</div>
                        <WizardScreenActions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default FinancialAssessment;
