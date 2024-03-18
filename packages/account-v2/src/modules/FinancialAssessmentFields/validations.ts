import * as Yup from 'yup';

const requiredError = 'This field is required';

export const financialAssessmentValidations = {
    accountTurnover: Yup.string().required(requiredError),
    educationLevel: Yup.string().required(requiredError),
    employmentIndustry: Yup.string().required(requiredError),
    employmentStatus: Yup.string().required(requiredError),
    estimatedWorth: Yup.string().required(requiredError),
    incomeSource: Yup.string().required(requiredError),
    netIncome: Yup.string().required(requiredError),
    occupation: Yup.string().required(requiredError),
    sourceOfWealth: Yup.string().required(requiredError),
};
