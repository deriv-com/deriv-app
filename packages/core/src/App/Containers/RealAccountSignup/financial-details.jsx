import {
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    MobileWrapper,
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
                {({ handleSubmit, isSubmitting, errors, values, setFieldValue }) => (
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
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Source of income')}
                                                                list_items={this.props.income_source_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'income_source',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Source of income')}
                                                                {...field}
                                                                list_items={this.props.income_source_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue('income_source', e.target.value, true)
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='employment_status'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Employment Status')}
                                                                list_items={this.props.employment_status_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'employment_status',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Employment Status')}
                                                                {...field}
                                                                list_items={this.props.employment_status_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'employment_status',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='employment_industry'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Industry of employment')}
                                                                list_items={this.props.employment_industry_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'employment_industry',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Industry of employment')}
                                                                {...field}
                                                                list_items={this.props.employment_industry_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'employment_industry',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='occupation'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Occupation')}
                                                                list_items={this.props.occupation_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'occupation',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Occupation')}
                                                                {...field}
                                                                list_items={this.props.occupation_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue('occupation', e.target.value, true)
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='source_of_wealth'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Source of wealth')}
                                                                list_items={this.props.source_of_wealth_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'source_of_wealth',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Source of wealth')}
                                                                {...field}
                                                                list_items={this.props.source_of_wealth_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'source_of_wealth',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='education_level'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Level of education')}
                                                                list_items={this.props.education_level_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'education_level',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Level of education')}
                                                                {...field}
                                                                list_items={this.props.education_level_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'education_level',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='net_income'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Net annual income')}
                                                                list_items={this.props.net_income_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'net_income',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Net annual income')}
                                                                {...field}
                                                                list_items={this.props.net_income_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue('net_income', e.target.value, true)
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='estimated_worth'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Estimated net worth')}
                                                                list_items={this.props.estimated_worth_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'estimated_worth',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Estimated net worth')}
                                                                {...field}
                                                                list_items={this.props.estimated_worth_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'estimated_worth',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='account_turnover'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Anticipated account turnover')}
                                                                list_items={this.props.account_turnover_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'account_turnover',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Anticipated account turnover')}
                                                                {...field}
                                                                list_items={this.props.account_turnover_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'account_turnover',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
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
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Forex trading experience')}
                                                                list_items={this.props.forex_trading_experience_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'forex_trading_experience',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Forex trading experience')}
                                                                {...field}
                                                                list_items={this.props.forex_trading_experience_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'forex_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='forex_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Forex trading frequency')}
                                                                list_items={this.props.forex_trading_frequency_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'forex_trading_frequency',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Forex trading frequency')}
                                                                {...field}
                                                                list_items={this.props.forex_trading_frequency_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'forex_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='binary_options_trading_experience'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Binary options trading experience')}
                                                                list_items={
                                                                    this.props.binary_options_trading_experience_enum
                                                                }
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'binary_options_trading_experience',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Binary options trading experience')}
                                                                {...field}
                                                                list_items={
                                                                    this.props.binary_options_trading_experience_enum
                                                                }
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'binary_options_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='binary_options_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('Binary options trading frequency')}
                                                                list_items={
                                                                    this.props.binary_options_trading_frequency_enum
                                                                }
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'binary_options_trading_frequency',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Binary options trading frequency')}
                                                                {...field}
                                                                list_items={
                                                                    this.props.binary_options_trading_frequency_enum
                                                                }
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'binary_options_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='cfd_trading_experience'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('CFDs trading experience')}
                                                                list_items={this.props.cfd_trading_experience_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'cfd_trading_experience',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('CFDs trading experience')}
                                                                {...field}
                                                                list_items={this.props.cfd_trading_experience_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'cfd_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='cfd_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize('CFDs trading frequency')}
                                                                list_items={this.props.cfd_trading_frequency_enum}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'cfd_trading_frequency',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('CFDs trading frequency')}
                                                                {...field}
                                                                list_items={this.props.cfd_trading_frequency_enum}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'cfd_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='other_instruments_trading_experience'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize(
                                                                    'Experience with trading other financial instruments'
                                                                )}
                                                                list_items={
                                                                    this.props.other_instruments_trading_experience_enum
                                                                }
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'other_instruments_trading_experience',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize(
                                                                    'Experience with trading other financial instruments'
                                                                )}
                                                                {...field}
                                                                list_items={
                                                                    this.props.other_instruments_trading_experience_enum
                                                                }
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'other_instruments_trading_experience',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <Field name='other_instruments_trading_frequency'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                dropdown_offset='3.2rem'
                                                                type='text'
                                                                label={localize(
                                                                    'Experience with trading other financial instruments'
                                                                )}
                                                                list_items={
                                                                    this.props.other_instruments_trading_frequency_enum
                                                                }
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'other_instruments_trading_frequency',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize(
                                                                    'Experience with trading other financial instruments'
                                                                )}
                                                                {...field}
                                                                list_items={
                                                                    this.props.other_instruments_trading_frequency_enum
                                                                }
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue(
                                                                        'other_instruments_trading_frequency',
                                                                        e.target.value,
                                                                        true
                                                                    )
                                                                }
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
