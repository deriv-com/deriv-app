import * as Yup from 'yup';

export const tradingExperienceValidations = {
    binaryOptionsTradingExperience: Yup.string().required(),
    binaryOptionsTradingFrequency: Yup.string().required(),
    cfdTradingExperience: Yup.string().required(),
    cfdTradingFrequency: Yup.string().required(),
    forexTradingExperience: Yup.string().required(),
    forexTradingFrequency: Yup.string().required(),
    otherTradingInstrumentsExperience: Yup.string().required(),
    otherTradingInstrumentsFrequency: Yup.string().required(),
};
