import React from 'react';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { useAccountStatus, useActiveTradingAccount, useFinancialAssessment, useIsEuRegion } from '@deriv/api-v2';
import { DerivLightIcPoaLockIcon } from '@deriv/quill-icons';
import { ActionScreen, Button, InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
import IcSuccess from '../../../assets/status-message/ic-success.svg';
import { DemoMessage } from '../../../components/DemoMessage';
import { LeaveConfirm } from '../../../components/LeaveConfirm';
import { ACCOUNT_V2_ROUTES, DERIV_GO_URL, P2P_URL } from '../../../constants/routes';
import { shouldHideOccupation } from '../../../utils/financialAssessmentUtils';
import { isNavigationFromDerivGO, isNavigationFromP2P } from '../../../utils/platform';
import { FinancialAssessmentFields } from '../FinancialAssessmentFields';

export const FinancialAssessmentForm = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: accountStatus } = useAccountStatus();
    const { isEUCountry } = useIsEuRegion();
    const { isMobile } = useDevice();
    const history = useHistory();

    const redirect = isNavigationFromDerivGO() || isNavigationFromP2P();
    const redirectPlatformName = isNavigationFromDerivGO() ? 'Deriv GO' : 'Deriv P2P';
    const redirectUrl = isNavigationFromDerivGO() ? DERIV_GO_URL : P2P_URL;

    const {
        is_authenticated: isAuthenticated,
        is_financial_information_not_complete: isFinancialInformationNotComplete,
    } = accountStatus || {};

    const {
        data: financialAssessment,
        error: fetchError,
        isLoading: isFinancialAssessmentLoading,
        mutation: {
            error: financialAssessmentUpdateError,
            isLoading: isFinancialAssessmentUpdating,
            isSuccess: isFinancialAssessmentUpdateSuccess,
        },
        update: updateFinancialAssessment,
    } = useFinancialAssessment();

    const {
        account_turnover: accountTurnover,
        education_level: educationLevel,
        employment_industry: employmentIndustry,
        employment_status: employmentStatus,
        estimated_worth: estimatedWorth,
        income_source: incomeSource,
        net_income: netIncome,
        occupation,
        source_of_wealth: sourceOfWealth,
    } = financialAssessment;

    const initialValues = {
        accountTurnover,
        educationLevel,
        employmentIndustry,
        employmentStatus,
        estimatedWorth,
        incomeSource,
        netIncome,
        occupation,
        sourceOfWealth,
    };

    type TFinancialAssessmentFormValues = typeof initialValues;

    const handleFormSubmit = async (values: TFinancialAssessmentFormValues) => {
        updateFinancialAssessment({
            account_turnover: values.accountTurnover,
            education_level: values.educationLevel,
            employment_industry: values.employmentIndustry,
            employment_status: values.employmentStatus,
            estimated_worth: values.estimatedWorth,
            income_source: values.incomeSource,
            net_income: values.netIncome,
            source_of_wealth: values.sourceOfWealth,
            ...(!shouldHideOccupation(values.employmentStatus) && { occupation: values.occupation }),
        });
    };

    const onSuccessActionButton = () => {
        history.push(redirect ? redirectUrl : ACCOUNT_V2_ROUTES.ProofOfAddress);
        if (redirect) {
            window.sessionStorage.removeItem('config.platform');
        }
    };

    if (activeAccount?.is_virtual) return <DemoMessage />;

    if (isFinancialAssessmentLoading) return <Loader />;

    if (fetchError)
        return <ActionScreen icon={<DerivLightIcPoaLockIcon width={128} />} title={fetchError.error.message} />;

    if (isMobile && !isAuthenticated && !isEUCountry && isFinancialAssessmentUpdateSuccess)
        return (
            <ActionScreen
                actionButtons={
                    <Button onClick={onSuccessActionButton}>
                        {redirect ? `Back to ${redirectPlatformName}` : 'Continue'}
                    </Button>
                }
                description={redirect ? '' : 'Let’s continue with providing proofs of address and identity.'}
                icon={<IcSuccess width={96} />}
                title='Financial assessment submitted successfully'
            />
        );

    const showInCompleteFinancialInfoMessage =
        isEUCountry && isFinancialInformationNotComplete && !isFinancialAssessmentUpdateSuccess;

    return (
        <Formik enableReinitialize initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ dirty, isSubmitting, isValid }) => (
                <Form>
                    <LeaveConfirm />
                    {showInCompleteFinancialInfoMessage && (
                        <InlineMessage type='filled' variant='warning'>
                            {isMobile
                                ? 'To enable withdrawals, please complete your financial assessment.'
                                : 'You can only make deposits at the moment. To enable withdrawals, please complete your financial assessment.'}
                        </InlineMessage>
                    )}
                    <div className='flex flex-col w-full min-h-screen space-y-16 lg:w-auto'>
                        <div className='m-0 overflow-y-auto'>
                            <div className='flex mb-12 h-24 gap-8 self-stretch lg:self-auto justify-center items-center lg:gap-[11px]'>
                                <Text weight='bold'>Financial information</Text>
                                <Text size='xs'>(All fields are required)</Text>
                                <div className='w-full h-1 flex-[1_1_0] bg-solid-grey-2 lg:flex-shrink-0' />
                            </div>
                            <FinancialAssessmentFields />
                        </div>
                        <div className='sticky bottom-0 flex justify-end flex-shrink-0 w-full px-24 py-16 border-solid bg-solid-slate-0 border-t-1 border-solid-grey-2'>
                            {financialAssessmentUpdateError && (
                                <InlineMessage type='filled' variant='error'>
                                    {financialAssessmentUpdateError.error.message}
                                </InlineMessage>
                            )}
                            {isMobile && !isEUCountry && (
                                <Text align='center' size='xs'>
                                    All fields are required
                                </Text>
                            )}
                            <Button
                                disabled={isSubmitting || !isValid || !dirty}
                                isFullWidth={isMobile}
                                isLoading={isFinancialAssessmentUpdating}
                                size='lg'
                                type='submit'
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
