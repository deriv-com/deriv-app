import React from 'react';
import { FormDropDownField } from '../../components/FormFields';
import {
    binaryOptionsTradingExperienceList,
    binaryOptionsTradingFrequencyList,
    cfdTradingExperienceList,
    cfdTradingFrequencyList,
    forexTradingExperienceList,
    forexTradingFrequencyList,
    otherInstrumentsTradingExperienceList,
    otherInstrumentsTradingFrequencyList,
} from './tradingInformationList';
import { tradingExperienceValidations } from './validations';

export const TradingExperienceFields = () => {
    const {
        binaryOptionsTradingExperience: binaryOptionsTradingExperienceSchema,
        binaryOptionsTradingFrequency: binaryOptionsTradingFrequencySchema,
        cfdTradingExperience: cfdTradingExperienceSchema,
        cfdTradingFrequency: cfdTradingFrequencySchema,
        forexTradingExperience: forexTradingExperienceSchema,
        forexTradingFrequency: forexTradingFrequencySchema,
        otherTradingInstrumentsExperience: otherTradingInstrumentsExperienceSchema,
        otherTradingInstrumentsFrequency: otherTradingInstrumentsFrequencySchema,
    } = tradingExperienceValidations;

    return (
        <div className='grid pt-8 grid-col-1'>
            <FormDropDownField
                label='Forex trading experience'
                list={forexTradingExperienceList}
                name='forexTradingExperience'
                validationSchema={forexTradingExperienceSchema}
            />
            <FormDropDownField
                label='Forex trading frequency'
                list={forexTradingFrequencyList}
                name='forexTradingFrequency'
                validationSchema={forexTradingFrequencySchema}
            />
            <FormDropDownField
                label='Binary options trading experience'
                list={binaryOptionsTradingExperienceList}
                name='binaryOptionsTradingExperience'
                validationSchema={binaryOptionsTradingExperienceSchema}
            />
            <FormDropDownField
                label='Binary options trading frequency'
                list={binaryOptionsTradingFrequencyList}
                name='binaryOptionsTradingFrequency'
                validationSchema={binaryOptionsTradingFrequencySchema}
            />
            <FormDropDownField
                label='CFD trading experience'
                list={cfdTradingExperienceList}
                name='cfdTradingExperience'
                validationSchema={cfdTradingExperienceSchema}
            />
            <FormDropDownField
                label='CFD trading frequency'
                list={cfdTradingFrequencyList}
                name='cfdTradingFrequency'
                validationSchema={cfdTradingFrequencySchema}
            />
            <FormDropDownField
                label='Other trading instruments experience'
                list={otherInstrumentsTradingExperienceList}
                name='otherInstrumentsTradingExperience'
                validationSchema={otherTradingInstrumentsExperienceSchema}
            />
            <FormDropDownField
                label='Other trading instruments frequency'
                list={otherInstrumentsTradingFrequencyList}
                name='otherInstrumentsTradingFrequency'
                validationSchema={otherTradingInstrumentsFrequencySchema}
            />
        </div>
    );
};
