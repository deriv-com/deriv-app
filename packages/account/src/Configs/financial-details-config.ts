import React from 'react';
import { GetFinancialAssessment } from '@deriv/api-types';
import {
    generateValidationFunction,
    getDefaultFields,
    TSchema,
    EMPLOYMENT_VALUES,
    TEmploymentStatus,
} from '@deriv/shared';
import { localize } from '@deriv-com/translations';

type TFinancialDetailsConfig = {
    real_account_signup_target: string;
    financial_assessment: GetFinancialAssessment;
};

const financial_details_config: (props: { financial_assessment: GetFinancialAssessment }) => TSchema = ({
    financial_assessment,
}) => {
    return {
        account_turnover: {
            supported_in: ['maltainvest'],
            default_value: financial_assessment?.account_turnover ?? '',
            rules: [['req', localize('Please select an option')]],
        },
        education_level: {
            supported_in: ['maltainvest'],
            default_value: financial_assessment?.education_level ?? '',
            rules: [['req', localize('Please select an option')]],
        },
        employment_industry: {
            default_value: financial_assessment?.employment_industry ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Please select an option')]],
        },
        estimated_worth: {
            default_value: financial_assessment?.estimated_worth ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Please select an option')]],
        },
        income_source: {
            default_value: financial_assessment?.income_source ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Please select an option')]],
        },
        net_income: {
            default_value: financial_assessment?.net_income ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Please select an option')]],
        },
        occupation: {
            default_value: financial_assessment?.occupation ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Please select an option')]],
        },
        source_of_wealth: {
            default_value: financial_assessment?.source_of_wealth ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Please select an option')]],
        },
    };
};

const financialDetailsConfig = (
    { real_account_signup_target, financial_assessment }: TFinancialDetailsConfig,
    FinancialDetails: React.Component
) => {
    const config = financial_details_config({ financial_assessment });

    return {
        header: {
            active_title: localize('Complete your financial assessment'),
            title: localize('Financial assessment'),
        },
        body: FinancialDetails,
        form_value: getDefaultFields(real_account_signup_target, config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, config),
        },
        passthrough: ['residence_list', 'is_fully_authenticated'],
    };
};

export const getAccountTurnoverList = () => [
    {
        text: localize('Less than $25,000'),
        value: 'Less than $25,000',
    },
    {
        text: localize('$25,000 - $50,000'),
        value: '$25,000 - $50,000',
    },
    {
        text: localize('$50,001 - $100,000'),
        value: '$50,001 - $100,000',
    },
    {
        text: localize('$100,001 - $500,000'),
        value: '$100,001 - $500,000',
    },
    {
        text: localize('Over $500,000'),
        value: 'Over $500,000',
    },
];

export const getEmploymentIndustryList = () => [
    {
        text: localize('Construction'),
        value: 'Construction',
    },
    {
        text: localize('Education'),
        value: 'Education',
    },
    {
        text: localize('Finance'),
        value: 'Finance',
    },
    {
        text: localize('Health'),
        value: 'Health',
    },
    {
        text: localize('Tourism'),
        value: 'Tourism',
    },
    {
        text: localize('Information & Communications Technology'),
        value: 'Information & Communications Technology',
    },
    {
        text: localize('Science & Engineering'),
        value: 'Science & Engineering',
    },
    {
        text: localize('Legal'),
        value: 'Legal',
    },
    {
        text: localize('Social & Cultural'),
        value: 'Social & Cultural',
    },
    {
        text: localize('Agriculture'),
        value: 'Agriculture',
    },
    {
        text: localize('Real Estate'),
        value: 'Real Estate',
    },
    {
        text: localize('Food Services'),
        value: 'Food Services',
    },
    {
        text: localize('Manufacturing'),
        value: 'Manufacturing',
    },
    {
        text: localize('Unemployed'),
        value: 'Unemployed',
    },
];

export const getOccupationList = () => [
    {
        text: localize('Chief Executives, Senior Officials and Legislators'),
        value: 'Chief Executives, Senior Officials and Legislators',
    },
    {
        text: localize('Managers'),
        value: 'Managers',
    },
    {
        text: localize('Professionals'),
        value: 'Professionals',
    },
    {
        text: localize('Clerks'),
        value: 'Clerks',
    },
    {
        text: localize('Personal Care, Sales and Service Workers'),
        value: 'Personal Care, Sales and Service Workers',
    },
    {
        text: localize('Agricultural, Forestry and Fishery Workers'),
        value: 'Agricultural, Forestry and Fishery Workers',
    },
    {
        text: localize('Craft, Metal, Electrical and Electronics Workers'),
        value: 'Craft, Metal, Electrical and Electronics Workers',
    },
    {
        text: localize('Plant and Machine Operators and Assemblers'),
        value: 'Plant and Machine Operators and Assemblers',
    },
    {
        text: localize('Cleaners and Helpers'),
        value: 'Cleaners and Helpers',
    },
    {
        text: localize('Mining, Construction, Manufacturing and Transport Workers'),
        value: 'Mining, Construction, Manufacturing and Transport Workers',
    },
    {
        text: localize('Armed Forces'),
        value: 'Armed Forces',
    },
    {
        text: localize('Government Officers'),
        value: 'Government Officers',
    },
    {
        text: localize('Students'),
        value: 'Students',
    },
    {
        text: localize('Unemployed'),
        value: 'Unemployed',
    },
];

export const getSourceOfWealthList = () => [
    {
        text: localize('Accumulation of Income/Savings'),
        value: 'Accumulation of Income/Savings',
    },
    {
        text: localize('Cash Business'),
        value: 'Cash Business',
    },
    {
        text: localize('Company Ownership'),
        value: 'Company Ownership',
    },
    {
        text: localize('Divorce Settlement'),
        value: 'Divorce Settlement',
    },
    {
        text: localize('Inheritance'),
        value: 'Inheritance',
    },
    {
        text: localize('Investment Income'),
        value: 'Investment Income',
    },
    {
        text: localize('Sale of Property'),
        value: 'Sale of Property',
    },
];

export const getEducationLevelList = () => [
    {
        text: localize('Primary'),
        value: 'Primary',
    },
    {
        text: localize('Secondary'),
        value: 'Secondary',
    },
    {
        text: localize('Tertiary'),
        value: 'Tertiary',
    },
];

export const getNetIncomeList = () => [...getAccountTurnoverList()];

export const getEstimatedWorthList = () => [
    {
        text: localize('Less than $100,000'),
        value: 'Less than $100,000',
    },
    {
        text: localize('$100,000 - $250,000'),
        value: '$100,000 - $250,000',
    },
    {
        text: localize('$250,001 - $500,000'),
        value: '$250,001 - $500,000',
    },
    {
        text: localize('$500,001 - $1,000,000'),
        value: '$500,001 - $1,000,000',
    },
    {
        text: localize('Over $1,000,000'),
        value: 'Over $1,000,000',
    },
];

export const getIncomeSourceList = () => [
    {
        text: localize('Salaried Employee'),
        value: 'Salaried Employee',
    },
    {
        text: localize('Self-Employed'),
        value: 'Self-Employed',
    },
    {
        text: localize('Investments & Dividends'),
        value: 'Investments & Dividends',
    },
    {
        text: localize('Pension'),
        value: 'Pension',
    },
    {
        text: localize('State Benefits'),
        value: 'State Benefits',
    },
    {
        text: localize('Savings & Inheritance'),
        value: 'Savings & Inheritance',
    },
];

export const getFormattedOccupationList = (employment_status?: TEmploymentStatus) =>
    employment_status &&
    [EMPLOYMENT_VALUES.EMPLOYED, EMPLOYMENT_VALUES.SELF_EMPLOYED].some(status => status === employment_status)
        ? getOccupationList().filter(item => item.value !== EMPLOYMENT_VALUES.UNEMPLOYED)
        : getOccupationList();

export default financialDetailsConfig;
