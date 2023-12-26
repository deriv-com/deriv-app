import React from 'react';
import { GetFinancialAssessment, GetSettings } from '@deriv/api-types';
import { generateValidationFunction, getDefaultFields } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getTradingAssessmentQuestions } from '../Constants/trading-assessment-questions';

type TTradingAssessmentConfig = {
    account_settings: GetSettings;
    financial_assessment: GetFinancialAssessment;
    real_account_signup_target: string;
    setSubSectionIndex: number;
};

const default_form_config = {
    supported_in: ['maltainvest'],
};

export const getTradingAssessmentFormConfig = (financial_assessment: GetFinancialAssessment) => {
    return {
        risk_tolerance: {
            ...default_form_config,
            default_value: financial_assessment?.risk_tolerance ?? '',
        },
        source_of_experience: {
            ...default_form_config,
            default_value: financial_assessment?.source_of_experience ?? '',
        },
        cfd_experience: {
            ...default_form_config,
            default_value: financial_assessment?.cfd_experience ?? '',
        },
        cfd_frequency: {
            ...default_form_config,
            default_value: financial_assessment?.cfd_frequency ?? '',
        },
        trading_experience_financial_instruments: {
            ...default_form_config,
            default_value: financial_assessment?.trading_experience_financial_instruments ?? '',
        },
        trading_frequency_financial_instruments: {
            ...default_form_config,
            default_value: financial_assessment?.trading_frequency_financial_instruments ?? '',
        },
        cfd_trading_definition: {
            ...default_form_config,
            default_value: financial_assessment?.cfd_trading_definition ?? '',
        },
        leverage_impact_trading: {
            ...default_form_config,
            default_value: financial_assessment?.leverage_impact_trading ?? '',
        },
        leverage_trading_high_risk_stop_loss: {
            ...default_form_config,
            default_value: financial_assessment?.leverage_trading_high_risk_stop_loss ?? '',
        },
        required_initial_margin: {
            ...default_form_config,
            default_value: financial_assessment?.required_initial_margin ?? '',
        },
    };
};

const tradingAssessmentConfig = (
    {
        real_account_signup_target,
        financial_assessment,
        account_settings,
        setSubSectionIndex,
    }: TTradingAssessmentConfig,
    TradingAssessmentNewUser: React.Component
) => {
    const trading_assessment_form_config = getTradingAssessmentFormConfig(financial_assessment);
    return {
        header: {
            active_title: localize('Complete your trading assessment'),
            title: localize('Trading assessment'),
        },
        body: TradingAssessmentNewUser,
        form_value: getDefaultFields(real_account_signup_target, trading_assessment_form_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, trading_assessment_form_config),
            disabled_items: account_settings?.immutable_fields,
            setSubSectionIndex,
        },
        sub_step_count: getTradingAssessmentQuestions().length,
    };
};

export default tradingAssessmentConfig;
