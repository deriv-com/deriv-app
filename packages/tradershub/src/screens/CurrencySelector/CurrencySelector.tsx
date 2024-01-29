import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Heading } from '@deriv/quill-design';
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
    const { dispatch, state } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { currency: values.currency }, type: ACTION_TYPES.SET_CURRENCY });
    };
    return (
        <WizardScreenWrapper>
            <Heading.H5 className='mb-1200 pt-2400 pl-800'>Select your preferred currency</Heading.H5>
            <Formik
                initialValues={{
                    currency: state.currency ?? '',
                }}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='overflow-y-auto p-1200'>
                            <Currencies type={CURRENCY_TYPES.FIAT} />
                            <hr className='opacity-100 my-1200' />
                            <Currencies type={CURRENCY_TYPES.CRYPTO} />
                        </div>
                        <Actions canGoNext={!!values.currency} />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default CurrencySelector;
