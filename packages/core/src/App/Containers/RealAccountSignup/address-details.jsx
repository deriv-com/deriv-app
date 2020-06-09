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

class AddressDetails extends React.Component {
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
                                            <InputField
                                                name='address_line_1'
                                                required
                                                label={localize('First line of address*')}
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
                                                label={localize('Town/City*')}
                                                placeholder={localize('Town/City')}
                                            />
                                            {this.should_render_address_state && (
                                                <Field name='address_state'>
                                                    {({ field }) => (
                                                        <>
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
                                                        </>
                                                    )}
                                                </Field>
                                            )}
                                            <InputField
                                                name='address_postcode'
                                                label={localize('Postal/ZIP code')}
                                                placeholder={localize('Postal/ZIP code')}
                                            />
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
    fetchStatesList: client.fetchStatesList,
    states_list: client.states_list,
}))(AddressDetails);
