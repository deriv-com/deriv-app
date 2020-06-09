import {
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Input,
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

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        autoComplete='off'
                        maxLength='30'
                        error={touched[field.name] && errors[field.name]}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

const getLocation = (location_list, value, type) => {
    const location_obj = location_list.find(
        location => location[type === 'text' ? 'value' : 'text'].toLowerCase() === value.toLowerCase()
    );

    if (location_obj) return location_obj[type];
    return '';
};

class FinancialDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { has_fetched_states_list: false, address_state_to_display: '' };
        this.form = React.createRef();
        // TODO: Find a better solution for handling no-op instead of using is_mounted flags
        this.is_mounted = false;
    }

    async componentDidMount() {
        this.is_mounted = true;
        await this.props.fetchStatesList();
        if (this.is_mounted)
            this.setState({
                has_fetched_states_list: true,
                address_state_to_display: getLocation(this.props.states_list, this.props.value.address_state, 'text'),
            });
        this.form.current.getFormikActions().validateForm();
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    get should_render_address_state() {
        return this.state.has_fetched_states_list && this.props.states_list.length > 0;
    }

    render() {
        const padding_bottom = window.innerHeight < 930 ? '10rem' : '12rem';
        return (
            <Formik
                initialValues={{ ...this.props.value }}
                validate={this.props.validate}
                onSubmit={(values, actions) => {
                    if (isDesktop() && values.address_state) {
                        values.address_state = this.props.states_list.length
                            ? this.state.address_state_to_display
                                ? getLocation(this.props.states_list, this.state.address_state_to_display, 'value')
                                : getLocation(this.props.states_list, values.address_state, 'value')
                            : values.address_state;
                    }
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
                                        <Localize i18n_default_text='Please ensure that this address is the same as in your proof of address' />
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
                                            <FormSubHeader title={localize('Address details')} />
                                            <InputField
                                                name='address_line_1'
                                                required
                                                label={localize('First line of address')}
                                                placeholder={localize('First line of address')}
                                            />
                                            <InputField
                                                name='address_line_2'
                                                label={localize('Second line of address')}
                                                placeholder={localize('Second line of address')}
                                            />
                                            <InputField
                                                name='address_city'
                                                required
                                                label={localize('Town/City')}
                                                placeholder={localize('Town/City')}
                                            />
                                            {this.should_render_address_state && (
                                                <Field name='address_state'>
                                                    {({ field }) => (
                                                        <React.Fragment>
                                                            <DesktopWrapper>
                                                                <Autocomplete
                                                                    {...field}
                                                                    {...(this.state.address_state_to_display && {
                                                                        value: this.state.address_state_to_display,
                                                                    })}
                                                                    data-lpignore='true'
                                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                                    dropdown_offset='3.2rem'
                                                                    type='text'
                                                                    label={localize('State/Province')}
                                                                    list_items={this.props.states_list}
                                                                    onItemSelection={({ value, text }) => {
                                                                        setFieldValue(
                                                                            'address_state',
                                                                            value ? text : '',
                                                                            true
                                                                        );
                                                                        this.setState({
                                                                            address_state_to_display: '',
                                                                        });
                                                                    }}
                                                                />
                                                            </DesktopWrapper>
                                                            <MobileWrapper>
                                                                <SelectNative
                                                                    placeholder={localize('Please select')}
                                                                    label={localize('State/Province')}
                                                                    value={values.address_state}
                                                                    list_items={this.props.states_list}
                                                                    use_text={true}
                                                                    onChange={e =>
                                                                        setFieldValue(
                                                                            'address_state',
                                                                            e.target.value,
                                                                            true
                                                                        )
                                                                    }
                                                                />
                                                            </MobileWrapper>
                                                        </React.Fragment>
                                                    )}
                                                </Field>
                                            )}
                                            <InputField
                                                name='address_postcode'
                                                required={this.props.is_gb_residence}
                                                label={localize('Postal/ZIP Code')}
                                                placeholder={localize('Postal/ZIP Code')}
                                            />
                                            <FormSubHeader title={localize('Trading experience')} />
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
                                            <FormSubHeader title={localize('Financial information')} />
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
