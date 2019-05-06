import React from 'react';
import { Fieldset, FormRow } from '../../_common/components/forms.jsx';

const Experience = () => (
    <React.Fragment>
        <option value=''>{it.L('Please select')}</option>
        <option value='0-1 year'>{it.L('0-1 year')}</option>
        <option value='1-2 years'>{it.L('1-2 years')}</option>
        <option value='Over 3 years'>{it.L('Over 3 years')}</option>
    </React.Fragment>
);

const Frequency = () => (
    <React.Fragment>
        <option value=''>{it.L('Please select')}</option>
        <option value='0-5 transactions in the past 12 months'>{it.L('0-5 transactions in the past 12 months')}</option>
        <option value='6-10 transactions in the past 12 months'>{it.L('6-10 transactions in the past 12 months')}</option>
        <option value='11-39 transactions in the past 12 months'>{it.L('11-39 transactions in the past 12 months')}</option>
        <option value='40 transactions or more in the past 12 months'>{it.L('40 transactions or more in the past 12 months')}</option>
    </React.Fragment>
);

const SelectRow = ({ id, label, con }) => (
    <FormRow id={id} label={label} type='select'>{con()}</FormRow>
);

const Values = () => (
    <React.Fragment>
        <option value=''>{it.L('Please select')}</option>
        <option value='Less than $25,000'>{it.L('Less than $25,000')}</option>
        <option value='$25,000 - $50,000'>{it.L('$25,000 - $50,000')}</option>
        <option value='$50,001 - $100,000'>{it.L('$50,001 - $100,000')}</option>
        <option value='$100,001 - $500,000'>{it.L('$100,001 - $500,000')}</option>
        <option value='Over $500,000'>{it.L('Over $500,000')}</option>
    </React.Fragment>
);

const TradingExperienceForm = () => (
    <Fieldset id='trading_experience_form' legend={it.L('Trading experience')}>
        <SelectRow con={Experience} id='forex_trading_experience' label={it.L('Forex trading experience')} />
        <SelectRow con={Frequency}  id='forex_trading_frequency'  label={it.L('Forex trading frequency')} />

        <SelectRow con={Experience} id='binary_options_trading_experience' label={it.L('Binary options trading experience')} />
        <SelectRow con={Frequency}  id='binary_options_trading_frequency'  label={it.L('Binary options trading frequency')} />

        <SelectRow con={Experience} id='cfd_trading_experience' label={it.L('CFD trading experience')} />
        <SelectRow con={Frequency}  id='cfd_trading_frequency'  label={it.L('CFD trading frequency')} />

        <SelectRow con={Experience} id='other_instruments_trading_experience' label={it.L('Experience with trading other financial instruments')} />
        <SelectRow con={Frequency}  id='other_instruments_trading_frequency'  label={it.L('Frequency of trading other financial instruments')} />
    </Fieldset>
);

const FinancialInformationForm = () => (
    <Fieldset id='financial_info_form' legend={it.L('Financial information')}>
        <FormRow id='income_source' label={it.L('Source of income')} type='select'>
            <option value=''>{it.L('Please select')}</option>
            <option value='Salaried Employee'>{it.L('Salaried Employee')}</option>
            <option value='Self-Employed'>{it.L('Self-Employed')}</option>
            <option value='Investments &amp; Dividends'>{it.L('Investments &amp; Dividends')}</option>
            <option value='Pension'>{it.L('Pension')}</option>
            <option value='State Benefits'>{it.L('State Benefits')}</option>
            <option value='Savings &amp; Inheritance'>{it.L('Savings & Inheritance')}</option>
        </FormRow>

        <FormRow id='employment_status' label={it.L('Employment status')} type='select'>
            <option value=''>{it.L('Please select')}</option>
            <option value='Employed'>{it.L('Employed')}</option>
            <option value='Pensioner'>{it.L('Pensioner')}</option>
            <option value='Self-Employed'>{it.L('Self-Employed')}</option>
            <option value='Student'>{it.L('Student')}</option>
            <option value='Unemployed'>{it.L('Unemployed')}</option>
        </FormRow>

        <FormRow id='employment_industry' label={it.L('Industry of employment')} type='select'>
            <option value=''>{it.L('Please select')}</option>
            <option value='Construction'>{it.L('Construction')}</option>
            <option value='Education'>{it.L('Education')}</option>
            <option value='Finance'>{it.L('Finance')}</option>
            <option value='Health'>{it.L('Health')}</option>
            <option value='Tourism'>{it.L('Tourism')}</option>
            <option value='Information &amp; Communications Technology'>{it.L('Information & Communications Technology')}</option>
            <option value='Science &amp; Engineering'>{it.L('Science & Engineering')}</option>
            <option value='Legal'>{it.L('Legal')}</option>
            <option value='Social &amp; Cultural'>{it.L('Social & Cultural')}</option>
            <option value='Agriculture'>{it.L('Agriculture')}</option>
            <option value='Real Estate'>{it.L('Real Estate')}</option>
            <option value='Food Services'>{it.L('Food Services')}</option>
            <option value='Manufacturing'>{it.L('Manufacturing')}</option>
            <option value='Unemployed'>{it.L('Unemployed')}</option>
        </FormRow>

        <FormRow id='occupation' label={it.L('Occupation')} type='select'>
            <option value=''>{it.L('Please select')}</option>
            <option value='Chief Executives, Senior Officials and Legislators'>{it.L('Chief Executives, Senior Officials and Legislators')}</option>
            <option value='Managers'>{it.L('Managers')}</option>
            <option value='Professionals'>{it.L('Professionals')}</option>
            <option value='Clerks'>{it.L('Clerks')}</option>
            <option value='Personal Care, Sales and Service Workers'>{it.L('Personal Care, Sales and Service Workers')}</option>
            <option value='Agricultural, Forestry and Fishery Workers'>{it.L('Agricultural, Forestry and Fishery Workers')}</option>
            <option value='Craft, Metal, Electrical and Electronics Workers'>{it.L('Craft, Metal, Electrical and Electronics Workers')}</option>
            <option value='Plant and Machine Operators and Assemblers'>{it.L('Plant and Machine Operators and Assemblers')}</option>
            <option value='Cleaners and Helpers'>{it.L('Cleaners and Helpers')}</option>
            <option value='Mining, Construction, Manufacturing and Transport Workers'>{it.L('Mining, Construction, Manufacturing and Transport Workers')}</option>
            <option value='Armed Forces'>{it.L('Armed Forces')}</option>
            <option value='Government Officers'>{it.L('Government Officers')}</option>
            <option value='Students'>{it.L('Students')}</option>
            <option value='Unemployed'>{it.L('Unemployed')}</option>
        </FormRow>

        <FormRow id='source_of_wealth' label={it.L('Source of wealth')} type='select'>
            <option value=''>{it.L('Please select')}</option>
            <option value='Accumulation of Income/Savings'>{it.L('Accumulation of Income/Savings')}</option>
            <option value='Cash Business'>{it.L('Cash Business')}</option>
            <option value='Company Ownership'>{it.L('Company Ownership')}</option>
            <option value='Divorce Settlement'>{it.L('Divorce Settlement')}</option>
            <option value='Inheritance'>{it.L('Inheritance')}</option>
            <option value='Investment Income'>{it.L('Investment Income')}</option>
            <option value='Sale of Property'>{it.L('Sale of Property')}</option>
        </FormRow>

        <FormRow id='education_level' label={it.L('Level of education')} type='select'>
            <option value=''>{it.L('Please select')}</option>
            <option value='Primary'>{it.L('Primary')}</option>
            <option value='Secondary'>{it.L('Secondary')}</option>
            <option value='Tertiary'>{it.L('Tertiary')}</option>
        </FormRow>

        <FormRow id='net_income' label={it.L('Net annual income')} type='select'>
            <Values />
        </FormRow>

        <FormRow id='estimated_worth' label={it.L('Estimated net worth')} type='select'>
            <option value=''>{it.L('Please select')}</option>
            <option value='Less than $100,000'>{it.L('Less than $100,000')}</option>
            <option value='$100,000 - $250,000'>{it.L('$100,000 - $250,000')}</option>
            <option value='$250,001 - $500,000'>{it.L('$250,001 - $500,000')}</option>
            <option value='$500,001 - $1,000,000'>{it.L('$500,001 - $1,000,000')}</option>
            <option value='Over $1,000,000'>{it.L('Over $1,000,000')}</option>
        </FormRow>

        <FormRow id='account_turnover' label={it.L('Anticipated account turnover')} type='select'>
            <Values />
        </FormRow>
    </Fieldset>
);

const FinancialForm = () => (
    <React.Fragment>
        <TradingExperienceForm />
        <FinancialInformationForm />
    </React.Fragment>
);

export default FinancialForm;
