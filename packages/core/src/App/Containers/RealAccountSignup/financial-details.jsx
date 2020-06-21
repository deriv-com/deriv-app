import {
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    MobileWrapper,
    Dropdown,
    ThemedScrollbars,
    SelectNative,
} from '@deriv/components';
import { Formik, Field } from 'formik';
import React from 'react';
import { FormSubHeader } from '@deriv/account';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import { connect } from 'Stores/connect';

class FinancialDetails extends React.Component {
    form = React.createRef();
    async componentDidMount() {
        await this.form.current.getFormikActions().validateForm();
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    render() {
        const padding_bottom = window.innerHeight < 930 ? '10rem' : '12rem';
        return (
            <Formik
                initialValues={{ ...this.props.value }}
                validate={this.props.validate}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                ref={this.form}
            >
                {({ handleSubmit, isSubmitting, errors, values, setFieldValue, handleChange, handleBlur, touched }) => (
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef, height }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <Div100vhContainer
                                    className='details-form'
                                    height_offset='199px'
                                    is_disabled={isDesktop()}
                                >
                                    <p className='details-form__description'>
                                        <Localize i18n_default_text="We're legally obliged to ask for your financial information." />
                                    </p>
                                    <ThemedScrollbars
                                        is_native={isMobile()}
                                        autoHide={!(window.innerHeight < 890)}
                                        height={height}
                                    >
                                        <div
                                            className='details-form__elements'
                                            style={{ paddingBottom: isDesktop() ? padding_bottom : null }}
                                        >
                                            <FormSubHeader title={localize('Financial information')} />
                                            <Field name='income_source'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Source of income')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.income_source_enum}
                                                                value={values.income_source}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={touched.income_source && errors.income_source}
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Source of income')}
                                                                list_items={this.props.income_source_enum}
                                                                value={values.income_source}
                                                                use_text={true}
                                                                error={touched.income_source && errors.income_source}
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'income_source',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='employment_status'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Employment Status')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.employment_status_enum}
                                                                value={values.employment_status}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.employment_status &&
                                                                    errors.employment_status
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Employment Status')}
                                                                list_items={this.props.employment_status_enum}
                                                                value={values.employment_status}
                                                                use_text={true}
                                                                error={
                                                                    touched.employment_status &&
                                                                    errors.employment_status
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'employment_status',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='employment_industry'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Industry of employment')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.employment_industry_enum}
                                                                value={values.employment_industry}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.employment_industry &&
                                                                    errors.employment_industry
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Industry of employment')}
                                                                list_items={this.props.employment_industry_enum}
                                                                value={values.employment_industry}
                                                                use_text={true}
                                                                error={
                                                                    touched.employment_industry &&
                                                                    errors.employment_industry
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'employment_industry',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='occupation'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Occupation')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.occupation_enum}
                                                                value={values.occupation}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={touched.occupation && errors.occupation}
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Occupation')}
                                                                list_items={this.props.occupation_enum}
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
                                            <Field name='source_of_wealth'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Source of wealth')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.source_of_wealth_enum}
                                                                value={values.source_of_wealth}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.source_of_wealth && errors.source_of_wealth
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Source of wealth')}
                                                                list_items={this.props.source_of_wealth_enum}
                                                                value={values.source_of_wealth}
                                                                use_text={true}
                                                                error={
                                                                    touched.source_of_wealth && errors.source_of_wealth
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'source_of_wealth',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='education_level'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Level of education')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.education_level_enum}
                                                                value={values.education_level}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.education_level && errors.education_level
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Level of education')}
                                                                list_items={this.props.education_level_enum}
                                                                value={values.education_level}
                                                                use_text={true}
                                                                error={
                                                                    touched.education_level && errors.education_level
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'education_level',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='net_income'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Net annual income')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.net_income_enum}
                                                                value={values.net_income}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={touched.net_income && errors.net_income}
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Net annual income')}
                                                                list_items={this.props.net_income_enum}
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
                                            <Field name='estimated_worth'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Estimated net worth')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.estimated_worth_enum}
                                                                value={values.estimated_worth}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.estimated_worth && errors.estimated_worth
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Estimated net worth')}
                                                                list_items={this.props.estimated_worth_enum}
                                                                value={values.estimated_worth}
                                                                use_text={true}
                                                                error={
                                                                    touched.estimated_worth && errors.estimated_worth
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'estimated_worth',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='account_turnover'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Anticipated annual turnover')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.account_turnover_enum}
                                                                value={values.account_turnover}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.account_turnover && errors.account_turnover
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Anticipated annual turnover')}
                                                                list_items={this.props.account_turnover_enum}
                                                                value={values.account_turnover}
                                                                use_text={true}
                                                                error={
                                                                    touched.account_turnover && errors.account_turnover
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'account_turnover',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <FormSubHeader title={localize('Trading experience')} />
                                            <Field name='forex_trading_experience'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Forex trading experience')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.forex_trading_experience_enum}
                                                                value={values.forex_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.forex_trading_experience &&
                                                                    errors.forex_trading_experience
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Forex trading experience')}
                                                                list_items={this.props.forex_trading_experience_enum}
                                                                value={values.forex_trading_experience}
                                                                use_text={true}
                                                                error={
                                                                    touched.forex_trading_experience &&
                                                                    errors.forex_trading_experience
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'forex_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='forex_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Forex trading frequency')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.forex_trading_frequency_enum}
                                                                value={values.forex_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.forex_trading_frequency &&
                                                                    errors.forex_trading_frequency
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Forex trading frequency')}
                                                                list_items={this.props.forex_trading_frequency_enum}
                                                                value={values.forex_trading_frequency}
                                                                use_text={true}
                                                                error={
                                                                    touched.forex_trading_frequency &&
                                                                    errors.forex_trading_frequency
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'forex_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='binary_options_trading_experience'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Binary options trading experience'
                                                                )}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.binary_options_trading_experience_enum}
                                                                value={values.binary_options_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.binary_options_trading_experience &&
                                                                    errors.binary_options_trading_experience
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Binary options trading experience')}
                                                                list_items={
                                                                    this.props.binary_options_trading_experience_enum
                                                                }
                                                                value={values.binary_options_trading_experience}
                                                                use_text={true}
                                                                error={
                                                                    touched.binary_options_trading_experience &&
                                                                    errors.binary_options_trading_experience
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'binary_options_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='binary_options_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Binary options trading frequency'
                                                                )}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.binary_options_trading_frequency_enum}
                                                                value={values.binary_options_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.binary_options_trading_frequency &&
                                                                    errors.binary_options_trading_frequency
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Binary options trading frequency')}
                                                                list_items={
                                                                    this.props.binary_options_trading_frequency_enum
                                                                }
                                                                value={values.binary_options_trading_frequency}
                                                                use_text={true}
                                                                error={
                                                                    touched.binary_options_trading_frequency &&
                                                                    errors.binary_options_trading_frequency
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'binary_options_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='cfd_trading_experience'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('CFDs trading experience')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.cfd_trading_experience_enum}
                                                                value={values.cfd_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.cfd_trading_experience &&
                                                                    errors.cfd_trading_experience
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('CFDs trading experience')}
                                                                list_items={this.props.cfd_trading_experience_enum}
                                                                value={values.cfd_trading_experience}
                                                                use_text={true}
                                                                error={
                                                                    touched.cfd_trading_experience &&
                                                                    errors.cfd_trading_experience
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'cfd_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='cfd_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('CFDs trading frequency')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={this.props.cfd_trading_frequency_enum}
                                                                value={values.cfd_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.cfd_trading_frequency &&
                                                                    errors.cfd_trading_frequency
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('CFDs trading frequency')}
                                                                list_items={this.props.cfd_trading_frequency_enum}
                                                                value={values.cfd_trading_frequency}
                                                                use_text={true}
                                                                error={
                                                                    touched.cfd_trading_frequency &&
                                                                    errors.cfd_trading_frequency
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'cfd_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='other_instruments_trading_experience'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Other instruments trading experience'
                                                                )}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={
                                                                    this.props.other_instruments_trading_experience_enum
                                                                }
                                                                value={values.other_instruments_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.other_instruments_trading_experience &&
                                                                    errors.other_instruments_trading_experience
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Other instruments trading experience')}
                                                                list_items={
                                                                    this.props.other_instruments_trading_experience_enum
                                                                }
                                                                value={values.other_instruments_trading_experience}
                                                                use_text={true}
                                                                error={
                                                                    touched.other_instruments_trading_experience &&
                                                                    errors.other_instruments_trading_experience
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'other_instruments_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='other_instruments_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Other instruments trading frequency'
                                                                )}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={
                                                                    this.props.other_instruments_trading_frequency_enum
                                                                }
                                                                value={values.other_instruments_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.other_instruments_trading_frequency &&
                                                                    errors.other_instruments_trading_frequency
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Other instruments trading frequency')}
                                                                list_items={
                                                                    this.props.other_instruments_trading_frequency_enum
                                                                }
                                                                value={values.other_instruments_trading_frequency}
                                                                use_text={true}
                                                                error={
                                                                    touched.other_instruments_trading_frequency &&
                                                                    errors.other_instruments_trading_frequency
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'other_instruments_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                        </div>
                                    </ThemedScrollbars>
                                    <FormSubmitButton
                                        is_absolute
                                        is_disabled={
                                            // eslint-disable-next-line no-unused-vars
                                            isSubmitting || Object.keys(errors).length > 0
                                        }
                                        label={localize('Next')}
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        onCancel={this.handleCancel.bind(this, values)}
                                    />
                                </Div100vhContainer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
}

export default connect(({ client }) => ({
    is_gb_residence: client.residence === 'gb',
    fetchStatesList: client.fetchStatesList,
    states_list: client.states_list,
}))(FinancialDetails);
