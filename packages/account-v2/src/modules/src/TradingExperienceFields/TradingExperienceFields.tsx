import React from 'react';
import { FormDropDownField } from '../../../components/FormFields';
import { tradingExperienceConfig } from './tradingExperienceConfig';

export const TradingExperienceFields = () => (
    <div className='grid pt-8 space-y-6 grid-col-1'>
        {tradingExperienceConfig.map(({ label, list, name, validationSchema }) => (
            <FormDropDownField key={name} label={label} list={list} name={name} validationSchema={validationSchema} />
        ))}
    </div>
);
