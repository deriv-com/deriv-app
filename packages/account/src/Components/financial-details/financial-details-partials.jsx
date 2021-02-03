import { Field } from 'formik';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Dropdown, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';

export const EmploymentStatus = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    employment_status_enum,
}) => (
    <Field name='employment_status'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Employment Status')}
                        is_align_text_left
                        name={field.name}
                        list={employment_status_enum}
                        value={values.employment_status}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.employment_status && errors.employment_status}
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
                        value={values.employment_status}
                        use_text={true}
                        error={touched.employment_status && errors.employment_status}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('employment_status', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const IncomeSource = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    income_source_enum,
}) => (
    <Field name='income_source'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Source of income')}
                        is_align_text_left
                        name={field.name}
                        list={income_source_enum}
                        value={values.income_source}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.income_source && errors.income_source}
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
                        value={values.income_source}
                        use_text={true}
                        error={touched.income_source && errors.income_source}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('income_source', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const EmploymentIndustry = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    employment_industry_enum,
}) => (
    <Field name='employment_industry'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Industry of employment')}
                        is_align_text_left
                        name={field.name}
                        list={employment_industry_enum}
                        value={values.employment_industry}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.employment_industry && errors.employment_industry}
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
                        value={values.employment_industry}
                        use_text={true}
                        error={touched.employment_industry && errors.employment_industry}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('employment_industry', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);
export const Occupation = ({ values, handleChange, handleBlur, touched, errors, setFieldValue, occupation_enum }) => (
    <Field name='occupation'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Occupation')}
                        is_align_text_left
                        name={field.name}
                        list={occupation_enum}
                        value={values.occupation}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.occupation && errors.occupation}
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
                        value={values.occupation}
                        use_text={true}
                        error={touched.occupation && errors.occupation}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('occupation', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const SourceOfWealth = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    source_of_wealth_enum,
}) => (
    <Field name='source_of_wealth'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Source of wealth')}
                        is_align_text_left
                        name={field.name}
                        list={source_of_wealth_enum}
                        value={values.source_of_wealth}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.source_of_wealth && errors.source_of_wealth}
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
                        value={values.source_of_wealth}
                        use_text={true}
                        error={touched.source_of_wealth && errors.source_of_wealth}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('source_of_wealth', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const EducationLevel = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    education_level_enum,
}) => (
    <Field name='education_level'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Level of education')}
                        is_align_text_left
                        name={field.name}
                        list={education_level_enum}
                        value={values.education_level}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.education_level && errors.education_level}
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
                        value={values.education_level}
                        use_text={true}
                        error={touched.education_level && errors.education_level}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('education_level', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const NetIncome = ({ values, handleChange, handleBlur, touched, errors, setFieldValue, net_income_enum }) => (
    <Field name='net_income'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Net annual income')}
                        is_align_text_left
                        name={field.name}
                        list={net_income_enum}
                        value={values.net_income}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.net_income && errors.net_income}
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
                        value={values.net_income}
                        use_text={true}
                        error={touched.net_income && errors.net_income}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('net_income', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const EstimatedWorth = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    estimated_worth_enum,
}) => (
    <Field name='estimated_worth'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Estimated net worth')}
                        is_align_text_left
                        name={field.name}
                        list={estimated_worth_enum}
                        value={values.estimated_worth}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.estimated_worth && errors.estimated_worth}
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
                        value={values.estimated_worth}
                        use_text={true}
                        error={touched.estimated_worth && errors.estimated_worth}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('estimated_worth', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const AccountTurnover = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    account_turnover_enum,
}) => (
    <Field name='account_turnover'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Anticipated annual turnover')}
                        is_align_text_left
                        name={field.name}
                        list={account_turnover_enum}
                        value={values.account_turnover}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.account_turnover && errors.account_turnover}
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
                        value={values.account_turnover}
                        use_text={true}
                        error={touched.account_turnover && errors.account_turnover}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('account_turnover', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const ForexTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    forex_trading_experience_enum,
}) => (
    <Field name='forex_trading_experience'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Forex trading experience')}
                        is_align_text_left
                        name={field.name}
                        list={forex_trading_experience_enum}
                        value={values.forex_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.forex_trading_experience && errors.forex_trading_experience}
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
                        value={values.forex_trading_experience}
                        use_text={true}
                        error={touched.forex_trading_experience && errors.forex_trading_experience}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('forex_trading_experience', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const ForexTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    forex_trading_frequency_enum,
}) => (
    <Field name='forex_trading_frequency'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Forex trading frequency')}
                        is_align_text_left
                        name={field.name}
                        list={forex_trading_frequency_enum}
                        value={values.forex_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.forex_trading_frequency && errors.forex_trading_frequency}
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
                        value={values.forex_trading_frequency}
                        use_text={true}
                        error={touched.forex_trading_frequency && errors.forex_trading_frequency}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('forex_trading_frequency', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const BinaryOptionsTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    binary_options_trading_experience_enum,
}) => (
    <Field name='binary_options_trading_experience'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Digital options trading experience')}
                        is_align_text_left
                        name={field.name}
                        list={binary_options_trading_experience_enum}
                        value={values.binary_options_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.binary_options_trading_experience && errors.binary_options_trading_experience}
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
                        value={values.binary_options_trading_experience}
                        use_text={true}
                        error={touched.binary_options_trading_experience && errors.binary_options_trading_experience}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('binary_options_trading_experience', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const BinaryOptionsTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    binary_options_trading_frequency_enum,
}) => (
    <Field name='binary_options_trading_frequency'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Digital options trading frequency')}
                        is_align_text_left
                        name={field.name}
                        list={binary_options_trading_frequency_enum}
                        value={values.binary_options_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.binary_options_trading_frequency && errors.binary_options_trading_frequency}
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
                        value={values.binary_options_trading_frequency}
                        use_text={true}
                        error={touched.binary_options_trading_frequency && errors.binary_options_trading_frequency}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('binary_options_trading_frequency', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const CFDTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    cfd_trading_experience_enum,
}) => (
    <Field name='cfd_trading_experience'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('CFD trading experience')}
                        is_align_text_left
                        name={field.name}
                        list={cfd_trading_experience_enum}
                        value={values.cfd_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.cfd_trading_experience && errors.cfd_trading_experience}
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
                        value={values.cfd_trading_experience}
                        use_text={true}
                        error={touched.cfd_trading_experience && errors.cfd_trading_experience}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('cfd_trading_experience', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const CFDTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    cfd_trading_frequency_enum,
}) => (
    <Field name='cfd_trading_frequency'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('CFD trading frequency')}
                        is_align_text_left
                        name={field.name}
                        list={cfd_trading_frequency_enum}
                        value={values.cfd_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={touched.cfd_trading_frequency && errors.cfd_trading_frequency}
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
                        value={values.cfd_trading_frequency}
                        use_text={true}
                        error={touched.cfd_trading_frequency && errors.cfd_trading_frequency}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('cfd_trading_frequency', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const OtherInstrumentsTradingExperience = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    other_instruments_trading_experience_enum,
}) => (
    <Field name='other_instruments_trading_experience'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Experience with trading other financial instruments')}
                        is_align_text_left
                        name={field.name}
                        list={other_instruments_trading_experience_enum}
                        value={values.other_instruments_trading_experience}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={
                            touched.other_instruments_trading_experience && errors.other_instruments_trading_experience
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
                        value={values.other_instruments_trading_experience}
                        use_text={true}
                        error={
                            touched.other_instruments_trading_experience && errors.other_instruments_trading_experience
                        }
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('other_instruments_trading_experience', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

export const OtherInstrumentsTradingFrequency = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    other_instruments_trading_frequency_enum,
}) => (
    <Field name='other_instruments_trading_frequency'>
        {({ field }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={localize('Trading frequency in other financial instruments')}
                        is_align_text_left
                        name={field.name}
                        list={other_instruments_trading_frequency_enum}
                        value={values.other_instruments_trading_frequency}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={
                            touched.other_instruments_trading_frequency && errors.other_instruments_trading_frequency
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
                        value={values.other_instruments_trading_frequency}
                        use_text={true}
                        error={
                            touched.other_instruments_trading_frequency && errors.other_instruments_trading_frequency
                        }
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('other_instruments_trading_frequency', e.target.value, true);
                        }}
                        {...field}
                        required
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);
