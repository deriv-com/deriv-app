import React from 'react';
import { useFormikContext } from 'formik';
import { useAuthorize } from '@deriv/api-v2';
import { FormDropDownField } from '../../components/FormFields';
import { LANDING_COMPANY } from '../../constants/constants';
import type { TFinancialAssessmentFormValues } from '../types';
import {
    accountTurnoverList,
    educationLevelList,
    EMPLOYMENT_VALUES,
    employmentIndustryList,
    employmentStatusList,
    estimatedWorthList,
    incomeSourceList,
    netIncomeList,
    occupationList,
    sourceOfWealthList,
} from './financialInformationList';
import { financialAssessmentValidations } from './validations';

export const FinancialAssessmentFields = () => {
    const { data: activeAccount } = useAuthorize();

    const { landing_company_name: landingCompanyShortcode } = activeAccount;

    const isMF = landingCompanyShortcode === LANDING_COMPANY.MALTAINVEST;

    const formik = useFormikContext<TFinancialAssessmentFormValues>();

    if (!formik) {
        throw new Error('FinancialAssessmentFields must be used within a Formik component');
    }

    const hideOccupation = [EMPLOYMENT_VALUES.SelfEmployed, EMPLOYMENT_VALUES.Unemployed].some(
        val => val === formik.values.employmentStatus
    );

    const {
        accountTurnover: accountTurnoverSchema,
        educationLevel: educationLevelSchema,
        employmentIndustry: employmentIndustrySchema,
        employmentStatus: employmentStatusSchema,
        estimatedWorth: estimatedWorthSchema,
        incomeSource: incomeSourceSchema,
        netIncome: netIncomeSchema,
        occupation: occupationSchema,
        sourceOfWealth: sourceOfWealthSchema,
    } = financialAssessmentValidations;

    return (
        <div className='grid pt-8 grid-col-1'>
            <FormDropDownField
                label='Source of income'
                list={incomeSourceList}
                name='incomeSource'
                validationSchema={incomeSourceSchema}
            />
            {!isMF && (
                <FormDropDownField
                    label='Employment status'
                    list={employmentStatusList}
                    name='employmentStatus'
                    validationSchema={employmentStatusSchema}
                />
            )}
            <FormDropDownField
                label='Industry of employment'
                list={employmentIndustryList}
                name='employmentIndustry'
                validationSchema={employmentIndustrySchema}
            />
            {!hideOccupation && (
                <FormDropDownField
                    label='Occupation'
                    list={occupationList}
                    name='occupation'
                    validationSchema={occupationSchema}
                />
            )}
            <FormDropDownField
                label='Source of wealth'
                list={sourceOfWealthList}
                name='sourceOfWealth'
                validationSchema={sourceOfWealthSchema}
            />
            <FormDropDownField
                label='Level of education'
                list={educationLevelList}
                name='educationLevel'
                validationSchema={educationLevelSchema}
            />
            <FormDropDownField
                label='Net annual income'
                list={netIncomeList}
                name='netIncome'
                validationSchema={netIncomeSchema}
            />
            <FormDropDownField
                label='Estimated net worth'
                list={estimatedWorthList}
                name='estimatedWorth'
                validationSchema={estimatedWorthSchema}
            />
            <FormDropDownField
                label='Anticipated account turnover'
                list={accountTurnoverList}
                name='accountTurnover'
                validationSchema={accountTurnoverSchema}
            />
        </div>
    );
};
