import * as Yup from 'yup';

export const financialAssessmentValidations = {
    accountTurnover: Yup.string().required(),
    educationLevel: Yup.string().required(),
    employmentIndustry: Yup.string().required(),
    employmentStatus: Yup.string().required(),
    estimatedWorth: Yup.string().required(),
    incomeSource: Yup.string().required(),
    netIncome: Yup.string().required(),
    occupation: Yup.string().required(),
    sourceOfWealth: Yup.string().required(),
};
