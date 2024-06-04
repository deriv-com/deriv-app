import React from 'react';
import { Form, Formik } from 'formik';
import { WizardScreenActions, WizardScreenWrapper } from '@/flows';
import { useRealAccountCreationContext } from '@/providers';

/**
 * @name TradingAssessment
 * @description The TradingAssessment component is used to display the trading assessment screen.
 * @returns {React.ReactNode}
 */
const TradingAssessment = () => {
    const { helpers } = useRealAccountCreationContext();

    const handleSubmit = () => {
        helpers.goToNextStep();
    };

    return (
        <WizardScreenWrapper heading='Trading Assessment'>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='relative flex-1 p-16 overflow-y-auto lg:p-24'>Trading assessment form</div>
                        <WizardScreenActions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default TradingAssessment;
