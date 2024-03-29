import * as Yup from 'yup';

const requiredError = 'This field is required';

export const tradingExperienceValidations = {
    binaryOptionsTradingExperience: Yup.string().required(requiredError),
    binaryOptionsTradingFrequency: Yup.string().required(requiredError),
    cfdTradingExperience: Yup.string().required(requiredError),
    cfdTradingFrequency: Yup.string().required(requiredError),
    forexTradingExperience: Yup.string().required(requiredError),
    forexTradingFrequency: Yup.string().required(requiredError),
    otherTradingInstrumentsExperience: Yup.string().required(requiredError),
    otherTradingInstrumentsFrequency: Yup.string().required(requiredError),
};
