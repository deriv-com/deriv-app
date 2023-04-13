import classNames from 'classnames';
import { Formik } from 'formik';
import React from 'react';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Modal,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import {
    AccountTurnover,
    IncomeSource,
    EducationLevel,
    EmploymentIndustry,
    EstimatedWorth,
    NetIncome,
    Occupation,
    SourceOfWealth,
} from './financial-details-partials';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';

const FinancialInformation = ({
    shared_props,
    income_source_enum,
    employment_industry_enum,
    occupation_enum,
    source_of_wealth_enum,
    education_level_enum,
    net_income_enum,
    estimated_worth_enum,
    account_turnover_enum,
}) => (
    <React.Fragment>
        <IncomeSource {...shared_props} income_source_enum={income_source_enum} />
        <EmploymentIndustry {...shared_props} employment_industry_enum={employment_industry_enum} />
        <Occupation {...shared_props} occupation_enum={occupation_enum} />
        <SourceOfWealth {...shared_props} source_of_wealth_enum={source_of_wealth_enum} />
        <EducationLevel {...shared_props} education_level_enum={education_level_enum} />
        <NetIncome {...shared_props} net_income_enum={net_income_enum} />
        <EstimatedWorth {...shared_props} estimated_worth_enum={estimated_worth_enum} />
        <AccountTurnover {...shared_props} account_turnover_enum={account_turnover_enum} />
    </React.Fragment>
);

const FinancialDetails = props => {
    const handleCancel = values => {
        const current_step = props.getCurrentStep() - 1;
        props.onSave(current_step, values);
        props.onCancel(current_step, props.goToPreviousStep);
    };

    const handleValidate = values => {
        const { errors } = splitValidationResultTypes(props.validate(values));
        return errors;
    };

    return (
        <Formik
            initialValues={{ ...props.value }}
            validate={handleValidate}
            onSubmit={(values, actions) => {
                props.onSubmit(props.getCurrentStep() - 1, values, actions.setSubmitting, props.goToNextStep);
            }}
            validateOnMount
        >
            {({ handleSubmit, isSubmitting, errors, values, setFieldValue, handleChange, handleBlur, touched }) => {
                const shared_props = {
                    values,
                    handleChange,
                    handleBlur,
                    touched,
                    errors,
                    setFieldValue,
                };

                return (
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef, height }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <Div100vhContainer
                                    className={classNames('details-form', 'financial-assessment')}
                                    height_offset='110px'
                                    is_disabled={isDesktop()}
                                >
                                    <Text as='p' color='prominent' size='xxs' className='trading-assessment__side-note'>
                                        <Localize i18n_default_text='We collect information about your employment as part of our due diligence obligations, as required by anti-money laundering legislation.' />
                                    </Text>
                                    <ThemedScrollbars autoHide={!(window.innerHeight < 890)} height={height - 77}>
                                        <div
                                            className={classNames(
                                                'details-form__elements',
                                                'financial-assessment__form'
                                            )}
                                        >
                                            <FinancialInformation
                                                shared_props={shared_props}
                                                income_source_enum={props.income_source_enum}
                                                employment_industry_enum={props.employment_industry_enum}
                                                occupation_enum={props.occupation_enum}
                                                source_of_wealth_enum={props.source_of_wealth_enum}
                                                education_level_enum={props.education_level_enum}
                                                net_income_enum={props.net_income_enum}
                                                estimated_worth_enum={props.estimated_worth_enum}
                                                account_turnover_enum={props.account_turnover_enum}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        is_disabled={
                                            // eslint-disable-next-line no-unused-vars
                                            isSubmitting || Object.keys(errors).length > 0
                                        }
                                        is_absolute={isMobile()}
                                        label={localize('Next')}
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        onCancel={() => handleCancel(values)}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                );
            }}
        </Formik>
    );
};

export default FinancialDetails;
