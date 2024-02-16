import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Divider } from '@deriv-com/ui';
import Actions from '../../flows/RealAccountSIgnup/SignupWizard/Actions';
import WizardScreenWrapper from '../../flows/RealAccountSIgnup/SignupWizard/WizardScreenWrapper';
import { CURRENCY_TYPES } from '../../helpers/currencyConfig';
import { ACTION_TYPES, useSignupWizardContext } from '../../providers/SignupWizardProvider/SignupWizardContext';
import Currencies from './Currencies';

/**
 * @name CurrencySelector
 * @description The CurrencySelector component is used to display the currency selector screen.
 * @returns {React.ReactNode}
 */
const CurrencySelector = () => {
    const { dispatch, helpers, state } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { currency: values.currency }, type: ACTION_TYPES.SET_CURRENCY });
        helpers.goToNextStep();
    };
    return (
        <WizardScreenWrapper heading='Select your preferred currency'>
            <Formik
                initialValues={{
                    currency: state.currency ?? '',
                }}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 p-16 overflow-y-auto lg:p-24'>
                            <Currencies type={CURRENCY_TYPES.FIAT} />
                            <Divider className='my-24' />
                            <Currencies type={CURRENCY_TYPES.CRYPTO} />
                        </div>
                        <Actions submitDisabled={!values.currency} />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default CurrencySelector;
