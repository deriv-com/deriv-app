import { localize } from '@deriv/translations';
import FinancialDetails from 'App/Containers/RealAccountSignup/financial-details.jsx';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const financial_details_config = {
    address_line_1: {
        supported_in: ['maltainvest'],
        default_value: '',
        rules: [
            ['req', localize('Address line 1 is required')],
            ['address', localize('Address is not in a proper format')],
        ],
    },
    address_line_2: {
        supported_in: ['maltainvest'],
        default_value: '',
        rules: [['length', localize('Address line 2 is not in a proper format'), { min: 0, max: 30 }]],
    },
    address_city: {
        supported_in: ['maltainvest'],
        default_value: '',
        rules: [
            ['req', localize('City is required')],
            [
                'regular',
                localize('City field is not in a proper format'),
                {
                    regex: /^[a-zA-Z\s\W'.-]{1,35}$/,
                },
            ],
        ],
    },
    address_state: {
        supported_in: ['maltainvest'],
        default_value: '',
        rules: [
            [
                'regular',
                localize('State is not in a proper format'),
                {
                    regex: /^[\w\s\W'.-;,]{0,60}$/,
                },
            ],
        ],
    },
    address_postcode: {
        supported_in: ['maltainvest'],
        default_value: '',
        rules: [
            [
                'postcode',
                localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                    field_name: localize('postal/ZIP code'),
                    max_number: 20,
                    interpolation: { escapeValue: false },
                }),
            ],
        ],
    },
    binary_options_trading_experience: {
        supported_in: ['maltainvest'],
        default_value: '',
        rules: [['req', localize('Please select an option')]],
    },
    education_level: {
        supported_in: ['maltainvest'],
        default_value: '',
        rules: [['req', localize('Please select an option')]],
    },
    employment_industry: {
        default_value: '',
        supported_in: ['maltainvest'],
        rules: [['req']],
    },
    estimated_worth: {
        default_value: '',
        supported_in: ['maltainvest'],
        rules: [['req']],
    },
    income_source: {
        default_value: '',
        supported_in: ['maltainvest'],
        rules: [['req']],
    },
    net_income: {
        default_value: '',
        supported_in: ['maltainvest'],
        rules: [['req']],
    },
    occupation: {
        default_value: '',
        supported_in: ['maltainvest'],
        rules: [['req']],
    },
};

export const financialDetailsConfig = ({ real_account_signup_target }) => {
    return {
        header: {
            active_title: localize('Complete your financial details'),
            title: localize('Financial details'),
        },
        body: FinancialDetails,
        form_value: getDefaultFields(real_account_signup_target, financial_details_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, financial_details_config),
            occupation_enum: occupation_enum(),
            income_source_enum: income_source_enum(),
            net_income_enum: net_income_enum(),
            estimated_worth_enum: estimated_worth_enum(),
            binary_options_trading_experience_enum: binary_options_trading_experience_enum(),
            education_level_enum: education_level_enum(),
            employment_industry_enum: employment_industry_enum(),
        },
        passthrough: ['residence_list', 'is_fully_authenticated'],
    };
};

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
const net_income_enum = () => [
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
