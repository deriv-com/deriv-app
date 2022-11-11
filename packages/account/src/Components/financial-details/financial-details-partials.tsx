import { Field, FormikProps, FormikValues } from 'formik';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Dropdown, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';

type TEmploymentStatus = {
    employment_status_enum: object[];
};

export const EmploymentStatus = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    employment_status_enum,
}: Partial<FormikProps<{ employment_status: string }>> & TEmploymentStatus) => (
    <Field name='employment_status'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Employment Status')}
                        is_align_text_left
                        name={field.name}
                        list={employment_status_enum}
                        value={values?.employment_status}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.employment_status && errors?.employment_status}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Employment Status')}
                        list_items={employment_status_enum}
                        value={values?.employment_status}
                        error={touched?.employment_status && errors?.employment_status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('employment_status', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TIncomeSource = {
    income_source_enum: object[];
};

export const IncomeSource = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    income_source_enum,
}: Partial<FormikProps<{ income_source: string }>> & TIncomeSource) => (
    <Field name='income_source'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Source of income')}
                        is_align_text_left
                        name={field.name}
                        list={income_source_enum}
                        value={values?.income_source}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.income_source && errors?.income_source}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Source of income')}
                        list_items={income_source_enum}
                        value={values?.income_source}
                        error={touched?.income_source && errors?.income_source}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('income_source', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TEmploymentIndustry = {
    employment_industry_enum: object[];
};

export const EmploymentIndustry = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    employment_industry_enum,
}: Partial<FormikProps<{ employment_industry: string }>> & TEmploymentIndustry) => (
    <Field name='employment_industry'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Industry of employment')}
                        is_align_text_left
                        name={field.name}
                        list={employment_industry_enum}
                        value={values?.employment_industry}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.employment_industry && errors?.employment_industry}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Industry of employment')}
                        list_items={employment_industry_enum}
                        value={values?.employment_industry}
                        error={touched?.employment_industry && errors?.employment_industry}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('employment_industry', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TOccupation = {
    occupation_enum: object[];
};

export const Occupation = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    occupation_enum,
}: Partial<FormikProps<{ occupation: string }>> & TOccupation) => (
    <Field name='occupation'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Occupation')}
                        is_align_text_left
                        name={field.name}
                        list={occupation_enum}
                        value={values?.occupation}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.occupation && errors?.occupation}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Occupation')}
                        list_items={occupation_enum}
                        value={values?.occupation}
                        error={touched?.occupation && errors?.occupation}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('occupation', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TSourceOfWealth = {
    source_of_wealth_enum: object[];
};

export const SourceOfWealth = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    source_of_wealth_enum,
}: Partial<FormikProps<{ source_of_wealth: string }>> & TSourceOfWealth) => (
    <Field name='source_of_wealth'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Source of wealth')}
                        is_align_text_left
                        name={field.name}
                        list={source_of_wealth_enum}
                        value={values?.source_of_wealth}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.source_of_wealth && errors?.source_of_wealth}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Source of wealth')}
                        list_items={source_of_wealth_enum}
                        value={values?.source_of_wealth}
                        error={touched?.source_of_wealth && errors?.source_of_wealth}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('source_of_wealth', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TEducationLevel = {
    education_level_enum: object[];
};

export const EducationLevel = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    education_level_enum,
}: Partial<FormikProps<{ education_level: string }>> & TEducationLevel) => (
    <Field name='education_level'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Level of education')}
                        is_align_text_left
                        name={field.name}
                        list={education_level_enum}
                        value={values?.education_level}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.education_level && errors?.education_level}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Level of education')}
                        list_items={education_level_enum}
                        value={values?.education_level}
                        error={touched?.education_level && errors?.education_level}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('education_level', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TNetIncome = {
    net_income_enum: object[];
};

export const NetIncome = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    net_income_enum,
}: Partial<FormikProps<{ net_income: string }>> & TNetIncome) => (
    <Field name='net_income'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Net annual income')}
                        is_align_text_left
                        name={field.name}
                        list={net_income_enum}
                        value={values?.net_income}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.net_income && errors?.net_income}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Net annual income')}
                        list_items={net_income_enum}
                        value={values?.net_income}
                        error={touched?.net_income && errors?.net_income}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('net_income', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TEstimatedWorth = {
    estimated_worth_enum: object[];
};

export const EstimatedWorth = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    estimated_worth_enum,
}: Partial<FormikProps<{ estimated_worth: string }>> & TEstimatedWorth) => (
    <Field name='estimated_worth'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Estimated net worth')}
                        is_align_text_left
                        name={field.name}
                        list={estimated_worth_enum}
                        value={values?.estimated_worth}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.estimated_worth && errors?.estimated_worth}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Estimated net worth')}
                        list_items={estimated_worth_enum}
                        value={values?.estimated_worth}
                        error={touched?.estimated_worth && errors?.estimated_worth}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('estimated_worth', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TAccountTurnover = {
    account_turnover_enum: object[];
};

export const AccountTurnover = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    account_turnover_enum,
}: Partial<FormikProps<{ account_turnover: string }>> & TAccountTurnover) => (
    <Field name='account_turnover'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Anticipated annual turnover')}
                        is_align_text_left
                        name={field.name}
                        list={account_turnover_enum}
                        value={values?.account_turnover}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.account_turnover && errors?.account_turnover}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Anticipated annual turnover')}
                        list_items={account_turnover_enum}
                        value={values?.account_turnover}
                        error={touched?.account_turnover && errors?.account_turnover}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('account_turnover', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TForexTradingExperience = {
    forex_trading_experience_enum: object[];
};

export const ForexTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    forex_trading_experience_enum,
}: Partial<FormikProps<{ forex_trading_experience: string }>> & TForexTradingExperience) => (
    <Field name='forex_trading_experience'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Forex trading experience')}
                        is_align_text_left
                        name={field.name}
                        list={forex_trading_experience_enum}
                        value={values?.forex_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.forex_trading_experience && errors?.forex_trading_experience}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Forex trading experience')}
                        list_items={forex_trading_experience_enum}
                        value={values?.forex_trading_experience}
                        error={touched?.forex_trading_experience && errors?.forex_trading_experience}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('forex_trading_experience', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TForexTradingFrequency = {
    forex_trading_frequency_enum: object[];
};

export const ForexTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    forex_trading_frequency_enum,
}: Partial<FormikProps<{ forex_trading_frequency: string }>> & TForexTradingFrequency) => (
    <Field name='forex_trading_frequency'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Forex trading frequency')}
                        is_align_text_left
                        name={field.name}
                        list={forex_trading_frequency_enum}
                        value={values?.forex_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.forex_trading_frequency && errors?.forex_trading_frequency}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Forex trading frequency')}
                        list_items={forex_trading_frequency_enum}
                        value={values?.forex_trading_frequency}
                        error={touched?.forex_trading_frequency && errors?.forex_trading_frequency}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('forex_trading_frequency', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TBinaryOptionsTradingExperience = {
    binary_options_trading_experience_enum: object[];
};

export const BinaryOptionsTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    binary_options_trading_experience_enum,
}: Partial<FormikProps<{ binary_options_trading_experience: string }>> & TBinaryOptionsTradingExperience) => (
    <Field name='binary_options_trading_experience'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Digital options trading experience')}
                        is_align_text_left
                        name={field.name}
                        list={binary_options_trading_experience_enum}
                        value={values?.binary_options_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.binary_options_trading_experience && errors?.binary_options_trading_experience}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Digital options trading experience')}
                        list_items={binary_options_trading_experience_enum}
                        value={values?.binary_options_trading_experience}
                        error={touched?.binary_options_trading_experience && errors?.binary_options_trading_experience}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('binary_options_trading_experience', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TBinaryOptionsTradingFrequency = {
    binary_options_trading_frequency_enum: object[];
};

export const BinaryOptionsTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    binary_options_trading_frequency_enum,
}: Partial<FormikProps<{ binary_options_trading_frequency: string }>> & TBinaryOptionsTradingFrequency) => (
    <Field name='binary_options_trading_frequency'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Digital options trading frequency')}
                        is_align_text_left
                        name={field.name}
                        list={binary_options_trading_frequency_enum}
                        value={values?.binary_options_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.binary_options_trading_frequency && errors?.binary_options_trading_frequency}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Digital options trading frequency')}
                        list_items={binary_options_trading_frequency_enum}
                        value={values?.binary_options_trading_frequency}
                        error={touched?.binary_options_trading_frequency && errors?.binary_options_trading_frequency}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('binary_options_trading_frequency', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TCFDTradingExperience = {
    cfd_trading_experience_enum: object[];
};

export const CFDTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    cfd_trading_experience_enum,
}: Partial<FormikProps<{ cfd_trading_experience: string }>> & TCFDTradingExperience) => (
    <Field name='cfd_trading_experience'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('CFD trading experience')}
                        is_align_text_left
                        name={field.name}
                        list={cfd_trading_experience_enum}
                        value={values?.cfd_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.cfd_trading_experience && errors?.cfd_trading_experience}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('CFD trading experience')}
                        list_items={cfd_trading_experience_enum}
                        value={values?.cfd_trading_experience}
                        error={touched?.cfd_trading_experience && errors?.cfd_trading_experience}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('cfd_trading_experience', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TCFDTradingFrequency = {
    cfd_trading_frequency_enum: object[];
};

export const CFDTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    cfd_trading_frequency_enum,
}: Partial<FormikProps<{ cfd_trading_frequency: string }>> & TCFDTradingFrequency) => (
    <Field name='cfd_trading_frequency'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('CFD trading frequency')}
                        is_align_text_left
                        name={field.name}
                        list={cfd_trading_frequency_enum}
                        value={values?.cfd_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched?.cfd_trading_frequency && errors?.cfd_trading_frequency}
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('CFD trading frequency')}
                        list_items={cfd_trading_frequency_enum}
                        value={values?.cfd_trading_frequency}
                        error={touched?.cfd_trading_frequency && errors?.cfd_trading_frequency}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('cfd_trading_frequency', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TOtherInstrumentsTradingExperience = {
    other_instruments_trading_experience_enum: object[];
};

export const OtherInstrumentsTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    other_instruments_trading_experience_enum,
}: Partial<FormikProps<{ other_instruments_trading_experience: string }>> & TOtherInstrumentsTradingExperience) => (
    <Field name='other_instruments_trading_experience'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Experience with trading other financial instruments')}
                        is_align_text_left
                        name={field.name}
                        list={other_instruments_trading_experience_enum}
                        value={values?.other_instruments_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={
                            touched?.other_instruments_trading_experience &&
                            errors?.other_instruments_trading_experience
                        }
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Experience with trading other financial instruments')}
                        list_items={other_instruments_trading_experience_enum}
                        value={values?.other_instruments_trading_experience}
                        error={
                            touched?.other_instruments_trading_experience &&
                            errors?.other_instruments_trading_experience
                        }
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('other_instruments_trading_experience', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

type TOtherInstrumentsTradingFrequency = {
    other_instruments_trading_frequency_enum: object[];
};

export const OtherInstrumentsTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    other_instruments_trading_frequency_enum,
}: Partial<FormikProps<{ other_instruments_trading_frequency: string }>> & TOtherInstrumentsTradingFrequency) => (
    <Field name='other_instruments_trading_frequency'>
        {({ field }: FormikValues) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Trading frequency in other financial instruments')}
                        is_align_text_left
                        name={field.name}
                        list={other_instruments_trading_frequency_enum}
                        value={values?.other_instruments_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={
                            touched?.other_instruments_trading_frequency && errors?.other_instruments_trading_frequency
                        }
                        list_portal_id='modal_root'
                        {...field}
                        required
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={localize('Trading frequency in other financial instruments')}
                        list_items={other_instruments_trading_frequency_enum}
                        value={values?.other_instruments_trading_frequency}
                        error={
                            touched?.other_instruments_trading_frequency && errors?.other_instruments_trading_frequency
                        }
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (typeof handleChange === 'function') {
                                handleChange(e);
                            }
                            if (typeof setFieldValue === 'function') {
                                setFieldValue('other_instruments_trading_frequency', e.target.value, true);
                            }
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);
