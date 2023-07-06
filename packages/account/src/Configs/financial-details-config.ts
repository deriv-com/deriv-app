import { localize } from '@deriv/translations';
import { TSchema, generateValidationFunction, getDefaultFields } from '@deriv/shared';
import { GetFinancialAssessment } from '@deriv/api-types';

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
            account_turnover_enum: account_turnover_enum(),
            binary_options_trading_experience_enum: binary_options_trading_experience_enum(),
            binary_options_trading_frequency_enum: binary_options_trading_frequency_enum(),
            cfd_trading_experience_enum: cfd_trading_experience_enum(),
            cfd_trading_frequency_enum: cfd_trading_frequency_enum(),
            education_level_enum: education_level_enum(),
            employment_industry_enum: employment_industry_enum(),
            employment_status_enum: employment_status_enum(),
            forex_trading_experience_enum: forex_trading_experience_enum(),
            forex_trading_frequency_enum: forex_trading_frequency_enum(),
            estimated_worth_enum: estimated_worth_enum(),
            income_source_enum: income_source_enum(),
            net_income_enum: net_income_enum(),
            occupation_enum: occupation_enum(),
            other_instruments_trading_experience_enum: other_instruments_trading_experience_enum(),
            other_instruments_trading_frequency_enum: other_instruments_trading_frequency_enum(),
            source_of_wealth_enum: source_of_wealth_enum(),
        },
        passthrough: ['residence_list', 'is_fully_authenticated'],
    };
};
const account_turnover_enum = () => [
    {
        value: 'Less than $25,000',
        text: localize('Less than $25,000'),
    },
    {
        value: '$25,000 - $50,000',
        text: localize('$25,000 - $50,000'),
    },
    {
        value: '$50,001 - $100,000',
        text: localize('$50,001 - $100,000'),
    },
    {
        value: '$100,001 - $500,000',
        text: localize('$100,001 - $500,000'),
    },
    {
        value: 'Over $500,000',
        text: localize('Over $500,000'),
    },
];
const binary_options_trading_experience_enum = () => [
    {
        value: '0-1 year',
        text: localize('0-1 year'),
    },
    {
        value: '1-2 years',
        text: localize('1-2 years'),
    },
    {
        value: 'Over 3 years',
        text: localize('Over 3 years'),
    },
];
const binary_options_trading_frequency_enum = () => [
    {
        value: '0-5 transactions in the past 12 months',
        text: localize('0-5 transactions in the past 12 months'),
    },
    {
        value: '6-10 transactions in the past 12 months',
        text: localize('6-10 transactions in the past 12 months'),
    },
    {
        value: '11-39 transactions in the past 12 months',
        text: localize('11-39 transactions in the past 12 months'),
    },
    {
        value: '40 transactions or more in the past 12 months',
        text: localize('40 transactions or more in the past 12 months'),
    },
];
const cfd_trading_experience_enum = binary_options_trading_experience_enum; // Keeping alias to have a uniform readability
const cfd_trading_frequency_enum = binary_options_trading_frequency_enum;
const education_level_enum = () => [
    {
        value: 'Primary',
        text: localize('Primary'),
    },
    {
        value: 'Secondary',
        text: localize('Secondary'),
    },
    {
        value: 'Tertiary',
        text: localize('Tertiary'),
    },
];
const employment_industry_enum = () => [
    {
        value: 'Construction',
        text: localize('Construction'),
    },
    {
        value: 'Education',
        text: localize('Education'),
    },
    {
        value: 'Finance',
        text: localize('Finance'),
    },
    {
        value: 'Health',
        text: localize('Health'),
    },
    {
        value: 'Tourism',
        text: localize('Tourism'),
    },
    {
        value: 'Information & Communications Technology',
        text: localize('Information & Communications Technology'),
    },
    {
        value: 'Science & Engineering',
        text: localize('Science & Engineering'),
    },
    {
        value: 'Legal',
        text: localize('Legal'),
    },
    {
        value: 'Social & Cultural',
        text: localize('Social & Cultural'),
    },
    {
        value: 'Agriculture',
        text: localize('Agriculture'),
    },
    {
        value: 'Real Estate',
        text: localize('Real Estate'),
    },
    {
        value: 'Food Services',
        text: localize('Food Services'),
    },
    {
        value: 'Manufacturing',
        text: localize('Manufacturing'),
    },
    {
        value: 'Unemployed',
        text: localize('Unemployed'),
    },
];
const employment_status_enum = () => [
    {
        value: 'Employed',
        text: localize('Employed'),
    },
    {
        value: 'Pensioner',
        text: localize('Pensioner'),
    },
    {
        value: 'Self-Employed',
        text: localize('Self-Employed'),
    },
    {
        value: 'Student',
        text: localize('Student'),
    },
    {
        value: 'Unemployed',
        text: localize('Unemployed'),
    },
];
const estimated_worth_enum = () => [
    {
        value: 'Less than $100,000',
        text: localize('Less than $100,000'),
    },
    {
        value: '$100,000 - $250,000',
        text: localize('$100,000 - $250,000'),
    },
    {
        value: '$250,001 - $500,000',
        text: localize('$250,001 - $500,000'),
    },
    {
        value: '$500,001 - $1,000,000',
        text: localize('$500,001 - $1,000,000'),
    },
    {
        value: 'Over $1,000,000',
        text: localize('Over $1,000,000'),
    },
];
const forex_trading_experience_enum = binary_options_trading_experience_enum; // Keeping alias to have a uniform readability
const forex_trading_frequency_enum = binary_options_trading_frequency_enum;
const income_source_enum = () => [
    {
        value: 'Salaried Employee',
        text: localize('Salaried Employee'),
    },
    {
        value: 'Self-Employed',
        text: localize('Self-Employed'),
    },
    {
        value: 'Investments & Dividends',
        text: localize('Investments & Dividends'),
    },
    {
        value: 'Pension',
        text: localize('Pension'),
    },
    {
        value: 'State Benefits',
        text: localize('State Benefits'),
    },
    {
        value: 'Savings & Inheritance',
        text: localize('Savings & Inheritance'),
    },
];
const net_income_enum = account_turnover_enum;
const occupation_enum = () => [
    {
        value: 'Chief Executives, Senior Officials and Legislators',
        text: localize('Chief Executives, Senior Officials and Legislators'),
    },
    {
        value: 'Managers',
        text: localize('Managers'),
    },
    {
        value: 'Professionals',
        text: localize('Professionals'),
    },
    {
        value: 'Clerks',
        text: localize('Clerks'),
    },
    {
        value: 'Personal Care, Sales and Service Workers',
        text: localize('Personal Care, Sales and Service Workers'),
    },
    {
        value: 'Agricultural, Forestry and Fishery Workers',
        text: localize('Agricultural, Forestry and Fishery Workers'),
    },
    {
        value: 'Craft, Metal, Electrical and Electronics Workers',
        text: localize('Craft, Metal, Electrical and Electronics Workers'),
    },
    {
        value: 'Plant and Machine Operators and Assemblers',
        text: localize('Plant and Machine Operators and Assemblers'),
    },
    {
        value: 'Cleaners and Helpers',
        text: localize('Cleaners and Helpers'),
    },
    {
        value: 'Mining, Construction, Manufacturing and Transport Workers',
        text: localize('Mining, Construction, Manufacturing and Transport Workers'),
    },
    {
        value: 'Armed Forces',
        text: localize('Armed Forces'),
    },
    {
        value: 'Government Officers',
        text: localize('Students'),
    },
    {
        value: 'Unemployed',
        text: localize('Unemployed'),
    },
];
const other_instruments_trading_experience_enum = binary_options_trading_experience_enum; // Keeping alias to have a uniform readability
const other_instruments_trading_frequency_enum = binary_options_trading_frequency_enum;
const source_of_wealth_enum = () => [
    {
        value: 'Accumulation of Income/Savings',
        text: localize('Accumulation of Income/Savings'),
    },
    {
        value: 'Cash Business',
        text: localize('Cash Business'),
    },
    {
        value: 'Company Ownership',
        text: localize('Company Ownership'),
    },
    {
        value: 'Divorce Settlement',
        text: localize('Divorce Settlement'),
    },
    {
        value: 'Inheritance',
        text: localize('Inheritance'),
    },
    {
        value: 'Investment Income',
        text: localize('Investment Income'),
    },
    {
        value: 'Sale of Property',
        text: localize('Sale of Property'),
    },
];

export default financialDetailsConfig;
