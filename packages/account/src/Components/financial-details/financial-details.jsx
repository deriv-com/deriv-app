import { Formik } from 'formik';
import React from 'react';
import { AutoHeightWrapper, Div100vhContainer, FormSubmitButton, Modal, ThemedScrollbars } from '@deriv/components';

import { localize } from '@deriv/translations';
import { isDesktop, isMobile } from '@deriv/shared';
import {
    AccountTurnover,
    BinaryOptionsTradingExperience,
    BinaryOptionsTradingFrequency,
    CFDTradingExperience,
    CFDTradingFrequency,
    EducationLevel,
    EmploymentIndustry,
    EmploymentStatus,
    EstimatedWorth,
    ForexTradingExperience,
    ForexTradingFrequency,
    IncomeSource,
    NetIncome,
    Occupation,
    OtherInstrumentsTradingExperience,
    OtherInstrumentsTradingFrequency,
    SourceOfWealth,
} from './financial-details-partials';
import FormSubHeader from '../form-sub-header';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';

const FinancialInformation = ({
    shared_props,
    income_source_enum,
    employment_status_enum,
    employment_industry_enum,
    occupation_enum,
    source_of_wealth_enum,
    education_level_enum,
    net_income_enum,
    estimated_worth_enum,
    account_turnover_enum,
}) => (
    <React.Fragment>
        <FormSubHeader
            title={localize('Financial information')}
            subtitle={localize('(All fields are required)')}
            description={localize("We're legally obliged to ask for your financial information.")}
        />
        <IncomeSource {...shared_props} income_source_enum={income_source_enum} />
        <EmploymentStatus {...shared_props} employment_status_enum={employment_status_enum} />
        <EmploymentIndustry {...shared_props} employment_industry_enum={employment_industry_enum} />
        <Occupation {...shared_props} occupation_enum={occupation_enum} />
        <SourceOfWealth {...shared_props} source_of_wealth_enum={source_of_wealth_enum} />
        <EducationLevel {...shared_props} education_level_enum={education_level_enum} />
        <NetIncome {...shared_props} net_income_enum={net_income_enum} />
        <EstimatedWorth {...shared_props} estimated_worth_enum={estimated_worth_enum} />
        <AccountTurnover {...shared_props} account_turnover_enum={account_turnover_enum} />
    </React.Fragment>
);

const TradingExperience = ({
    shared_props,
    forex_trading_experience_enum,
    forex_trading_frequency_enum,
    binary_options_trading_experience_enum,
    binary_options_trading_frequency_enum,
    cfd_trading_experience_enum,
    cfd_trading_frequency_enum,
    other_instruments_trading_experience_enum,
    other_instruments_trading_frequency_enum,
}) => (
    <React.Fragment>
        <FormSubHeader
            title={localize('Trading experience')}
            subtitle={localize('(All fields are required)')}
            description={localize('Tell us about your trading experience.')}
        />
        <ForexTradingExperience {...shared_props} forex_trading_experience_enum={forex_trading_experience_enum} />
        <ForexTradingFrequency {...shared_props} forex_trading_frequency_enum={forex_trading_frequency_enum} />
        <BinaryOptionsTradingExperience
            {...shared_props}
            binary_options_trading_experience_enum={binary_options_trading_experience_enum}
        />
        <BinaryOptionsTradingFrequency
            {...shared_props}
            binary_options_trading_frequency_enum={binary_options_trading_frequency_enum}
        />
        <CFDTradingExperience {...shared_props} cfd_trading_experience_enum={cfd_trading_experience_enum} />
        <CFDTradingFrequency {...shared_props} cfd_trading_frequency_enum={cfd_trading_frequency_enum} />
        <OtherInstrumentsTradingExperience
            {...shared_props}
            other_instruments_trading_experience_enum={other_instruments_trading_experience_enum}
        />
        <OtherInstrumentsTradingFrequency
            {...shared_props}
            other_instruments_trading_frequency_enum={other_instruments_trading_frequency_enum}
        />
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
                                    className='details-form'
                                    height_offset='110px'
                                    is_disabled={isDesktop()}
                                >
                                    <ThemedScrollbars autoHide={!(window.innerHeight < 890)} height={height - 77}>
                                        <div className='details-form__elements  details-form__elements--wide'>
                                            <FinancialInformation
                                                shared_props={shared_props}
                                                income_source_enum={props.income_source_enum}
                                                employment_status_enum={props.employment_status_enum}
                                                employment_industry_enum={props.employment_industry_enum}
                                                occupation_enum={props.occupation_enum}
                                                source_of_wealth_enum={props.source_of_wealth_enum}
                                                education_level_enum={props.education_level_enum}
                                                net_income_enum={props.net_income_enum}
                                                estimated_worth_enum={props.estimated_worth_enum}
                                                account_turnover_enum={props.account_turnover_enum}
                                            />
                                            <TradingExperience
                                                shared_props={shared_props}
                                                forex_trading_experience_enum={props.forex_trading_experience_enum}
                                                forex_trading_frequency_enum={props.forex_trading_frequency_enum}
                                                binary_options_trading_experience_enum={
                                                    props.binary_options_trading_experience_enum
                                                }
                                                binary_options_trading_frequency_enum={
                                                    props.binary_options_trading_frequency_enum
                                                }
                                                cfd_trading_experience_enum={props.cfd_trading_experience_enum}
                                                cfd_trading_frequency_enum={props.cfd_trading_frequency_enum}
                                                other_instruments_trading_experience_enum={
                                                    props.other_instruments_trading_experience_enum
                                                }
                                                other_instruments_trading_frequency_enum={
                                                    props.other_instruments_trading_frequency_enum
                                                }
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
