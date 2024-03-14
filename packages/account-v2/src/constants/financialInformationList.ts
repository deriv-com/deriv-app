export const EMPLOYMENT_VALUES = Object.freeze({
    employed: 'Employed',
    selfEmployed: 'Self-Employed',
    unemployed: 'Unemployed',
});

const incomeSourceCategories = [
    'Salaried Employee',
    EMPLOYMENT_VALUES.selfEmployed,
    'Investments & Dividends',
    'Pension',
    'State Benefits',
    'Savings & Inheritance',
];

const employmentCategories = [
    EMPLOYMENT_VALUES.employed,
    'Pensioner',
    EMPLOYMENT_VALUES.selfEmployed,
    'Student',
    EMPLOYMENT_VALUES.unemployed,
];

const employmentIndustryCategories = [
    'Construction',
    'Education',
    'Finance',
    'Health',
    'Tourism',
    'Information & Communications Technology',
    'Science & Engineering',
    'Legal',
    'Social & Cultural',
    'Agriculture',
    'Real Estate',
    'Food Services',
    'Manufacturing',
    'Unemployed',
];

const occupationCategories = [
    'Chief Executives, Senior Officials and Legislators',
    'Managers',
    'Professionals',
    'Clerks',
    'Personal Care, Sales and Service Workers',
    'Agricultural, Forestry and Fishery Workers',
    'Craft, Metal, Electrical and Electronics Workers',
    'Plant and Machine Operators and Assemblers',
    'Cleaners and Helpers',
    'Mining, Construction, Manufacturing and Transport Workers',
    'Armed Forces',
    'Government Officers',
    'Students',
    'Unemployed',
];

const sourceOfWealthCategories = [
    'Accumulation of Income/Savings',
    'Cash Business',
    'Company Ownership',
    'Divorce Settlement',
    'Inheritance',
    'Investment Income',
    'Sale of Property',
];

const educationLevels = ['Primary', 'Secondary', 'Tertiary'];

const incomeRanges = [
    'Less than $25,000',
    '$25,000 - $50,000',
    '$50,001 - $100,000',
    '$100,001 - $500,000',
    'Over $500,000',
];

const estimatedWorthLevels = [
    'Less than $100,000',
    '$100,000 - $250,000',
    '$250,001 - $500,000',
    '$500,001 - $1,000,000',
    'Over $1,000,000',
];

const generateList = (ranges: string[]) =>
    ranges.map(range => ({
        text: range,
        value: range,
    }));

export const incomeSourceList = generateList(incomeSourceCategories);

export const employmentStatusList = generateList(employmentCategories);

export const employmentIndustryList = generateList(employmentIndustryCategories);

export const occupationList = generateList(occupationCategories);

export const sourceOfWealthList = generateList(sourceOfWealthCategories);

export const educationLevelList = generateList(educationLevels);

export const netIncomeList = generateList(incomeRanges);

export const estimatedWorthList = generateList(estimatedWorthLevels);

export const accountTurnoverList = [...netIncomeList];
