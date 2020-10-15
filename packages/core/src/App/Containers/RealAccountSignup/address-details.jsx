import { Formik, Field } from 'formik';
import React from 'react';
import {
    Modal,
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Input,
    Loading,
    MobileWrapper,
    ThemedScrollbars,
    SelectNative,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile, getLocation } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { splitValidationResultTypes } from 'App/Containers/RealAccountSignup/helpers/utils';

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        autoComplete='off'
                        maxLength={props.maxLength || '30'}
                        error={touched[field.name] && errors[field.name]}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

class AddressDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            has_fetched_states_list: false,
            address_state_to_display: '',
        };
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

    handleValidate = values => {
        const { errors } = splitValidationResultTypes(this.props.validate(values));
        return errors;
    };

    render() {
        return (
            <Formik
                initialValues={this.props.value}
                validate={this.handleValidate}
                validateOnMount
                onSubmit={(values, actions) => {
                    if (values.address_state && this.props.states_list.length) {
                        values.address_state = this.state.address_state_to_display
                            ? getLocation(this.props.states_list, this.state.address_state_to_display, 'value')
                            : getLocation(this.props.states_list, values.address_state, 'value');
                    }
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
            >
                {({ handleSubmit, isSubmitting, errors, values, setFieldValue }) => (
                    <AutoHeightWrapper default_height={200} height_offset={isDesktop() ? 192 : null}>
                        {({ setRef, height }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <Div100vhContainer
                                    className='details-form'
                                    height_offset='179px'
                                    is_disabled={isDesktop()}
                                >
                                    <p className='details-form__description'>
                                        <strong>
                                            <Localize i18n_default_text='Only use an address for which you have proof of residence - ' />
                                        </strong>
                                        <Localize i18n_default_text='a recent utility bill (e.g. electricity, water, gas, landline, or internet), bank statement, or government-issued letter with your name and this address.' />
                                    </p>
                                    <ThemedScrollbars
                                        is_bypassed={isMobile()}
                                        height={height}
                                        className='details-form__scrollbar'
                                    >
                                        <div className='details-form__elements'>
                                            <InputField
                                                name='address_line_1'
                                                required={this.props.is_svg}
                                                label={
                                                    this.props.is_svg
                                                        ? localize('First line of address*')
                                                        : localize('First line of address')
                                                }
                                                maxLength={255}
                                                placeholder={localize('First line of address')}
                                            />
                                            <InputField
                                                name='address_line_2'
                                                label={localize('Second line of address')}
                                                maxLength={255}
                                                placeholder={localize('Second line of address')}
                                            />
                                            <InputField
                                                name='address_city'
                                                required={this.props.is_svg}
                                                label={
                                                    this.props.is_svg ? localize('Town/City*') : localize('Town/City')
                                                }
                                                placeholder={localize('Town/City')}
                                            />
                                            {!this.state.has_fetched_states_list && (
                                                <div className='details-form__loader'>
                                                    <Loading is_fullscreen={false} />
                                                </div>
                                            )}
                                            {this.props.states_list?.length > 0 ? (
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
                                                                    list_height='85px'
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
                                                                    value={
                                                                        this.state.address_state_to_display
                                                                            ? this.state.address_state_to_display
                                                                            : values.address_state
                                                                    }
                                                                    list_items={this.props.states_list}
                                                                    use_text={true}
                                                                    onChange={e => {
                                                                        setFieldValue(
                                                                            'address_state',
                                                                            e.target.value,
                                                                            true
                                                                        );
                                                                        this.setState({
                                                                            address_state_to_display: '',
                                                                        });
                                                                    }}
                                                                />
                                                            </MobileWrapper>
                                                        </>
                                                    )}
                                                </Field>
                                            ) : (
                                                // Fallback to input field when states list is empty / unavailable for country
                                                <InputField
                                                    name='address_state'
                                                    label={localize('State/Province')}
                                                    placeholder={localize('State/Province')}
                                                />
                                            )}
                                            <InputField
                                                name='address_postcode'
                                                required={this.props.is_gb_residence}
                                                label={localize('Postal/ZIP Code')}
                                                placeholder={localize('Postal/ZIP Code')}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        is_disabled={isSubmitting || Object.keys(errors).length > 0}
                                        label={localize('Next')}
                                        is_absolute={isMobile()}
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        onCancel={this.handleCancel.bind(this, values)}
                                    />
                                </Modal.Footer>
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
}))(AddressDetails);
