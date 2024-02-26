import React from 'react';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { WizardScreenActions, WizardScreenWrapper } from '@/flows';
import { ScrollToFieldError } from '@/helpers';
import { useNewCRRealAccount } from '@/hooks';
import { termsOfUse } from '@/utils';
import { Divider, Text } from '@deriv-com/ui';
import FatcaDeclaration from './TermsOfUseSections/FatcaDeclaration';
import PEPs from './TermsOfUseSections/PEPs';

/**
 * @name TermsOfUse
 * @description The TermsOfUse component is used to display the terms and conditions before creating an account.
 * @example <TermsOfUse />
 * @returns {React.ReactNode}
 */
const TermsOfUse = () => {
    const { mutate, isLoading } = useNewCRRealAccount();

    const initialValues = {
        fatcaDeclaration: '',
        pepConfirmation: false,
        termsAndCondition: false,
    };

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<typeof initialValues>) => {
        actions.setSubmitting(true);
        mutate();
        actions.setSubmitting(false);
    };

    return (
        <WizardScreenWrapper heading='Terms of Use'>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={termsOfUse}>
                {({ isValid, values }) => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <ScrollToFieldError />
                        <div className='flex-1 p-16 overflow-y-auto lg:p-24'>
                            <div className='flex flex-col gap-16'>
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
                        <WizardScreenActions
                            isSubmitBtnLoading={isLoading}
                            submitDisabled={
                                !values.pepConfirmation ||
                                !values.termsAndCondition ||
                                !values.fatcaDeclaration ||
                                !isValid
                            }
                        />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default TermsOfUse;
