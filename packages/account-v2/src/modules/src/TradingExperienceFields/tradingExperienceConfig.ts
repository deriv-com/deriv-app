import {
    binaryOptionsTradingExperienceList,
    binaryOptionsTradingFrequencyList,
    cfdTradingExperienceList,
    cfdTradingFrequencyList,
    forexTradingExperienceList,
    forexTradingFrequencyList,
    otherInstrumentsTradingExperienceList,
    otherInstrumentsTradingFrequencyList,
} from '../../../constants/tradingInformationList';
import { tradingExperienceValidations } from './validations';

export const tradingExperienceConfig = [
    {
        label: 'Forex trading experience',
        list: forexTradingExperienceList,
        name: 'forexTradingExperience',
        validationSchema: tradingExperienceValidations.forexTradingExperience,
    },
    {
        label: 'Forex trading frequency',
        list: forexTradingFrequencyList,
        name: 'forexTradingFrequency',
        validationSchema: tradingExperienceValidations.forexTradingFrequency,
    },
    {
        label: 'Binary options trading experience',
        list: binaryOptionsTradingExperienceList,
        name: 'binaryOptionsTradingExperience',
        validationSchema: tradingExperienceValidations.binaryOptionsTradingExperience,
    },
    {
        label: 'Binary options trading frequency',
        list: binaryOptionsTradingFrequencyList,
        name: 'binaryOptionsTradingFrequency',
        validationSchema: tradingExperienceValidations.binaryOptionsTradingFrequency,
    },
    {
        label: 'CFD trading experience',
        list: cfdTradingExperienceList,
        name: 'cfdTradingExperience',
        validationSchema: tradingExperienceValidations.cfdTradingExperience,
    },
    {
        label: 'CFD trading frequency',
        list: cfdTradingFrequencyList,
        name: 'cfdTradingFrequency',
        validationSchema: tradingExperienceValidations.cfdTradingFrequency,
    },
    {
        label: 'Other trading instruments experience',
        list: otherInstrumentsTradingExperienceList,
        name: 'otherInstrumentsTradingExperience',
        validationSchema: tradingExperienceValidations.otherTradingInstrumentsExperience,
    },
    {
        label: 'Other trading instruments frequency',
        list: otherInstrumentsTradingFrequencyList,
        name: 'otherInstrumentsTradingFrequency',
        validationSchema: tradingExperienceValidations.otherTradingInstrumentsFrequency,
    },
];
