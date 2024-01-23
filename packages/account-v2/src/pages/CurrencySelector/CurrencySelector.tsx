import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Heading } from '@deriv/quill-design';
import Actions from '../../components/SignupWizard/Actions';
import WizardScreenWrapper from '../../components/SignupWizard/WizardScreenWrapper';
import { CURRENCY_TYPES } from '../../constants/currencyConfig';
import { ACTION_TYPES, useSignupWizardContext } from '../../context/SignupWizardContext';
import Currencies from './Currencies';

/**
 * @name CurrencySelector
 * @description The CurrencySelector component is used to display the currency selector screen.
 * @returns {React.ReactNode}
 */
const CurrencySelector = () => {
    const { dispatch } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { currency: values.currency }, type: ACTION_TYPES.SET_CURRENCY });
    };
    return (
        <WizardScreenWrapper>
            <Heading.H5 className='mb-1200 pt-2400 pl-800'>Select your preferred currency</Heading.H5>
            <Formik
                initialValues={{
                    currency: '',
                }}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, values }) => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='overflow-y-auto p-1200'>
                            <Currencies type={CURRENCY_TYPES.FIAT} />
                            <hr className='opacity-100 my-1200' />
                            <Currencies type={CURRENCY_TYPES.CRYPTO} />
                        </div>
                        <Actions canGoNext={!!values.currency} onSubmit={handleSubmit} />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default CurrencySelector;
