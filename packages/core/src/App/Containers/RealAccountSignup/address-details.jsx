import {
    Dropdown,
    Input,
    ThemedScrollbars }        from 'deriv-components';
import { Formik, Field }      from 'formik';
import React, { Component }   from 'react';
import { connect }            from 'Stores/connect';
import { localize, Localize } from 'deriv-translations';
import FormSubmitButton       from './form-submit-button.jsx';

const InputField = (props) => {
    return (
        <Field name={props.name}>
            {
                ({
                    field,
                    form: { errors, touched },
                }) => (
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
                )
            }
        </Field>
    );
};

class AddressDetails extends Component {
    constructor(props) {
        super(props);

        this.form = React.createRef();
    }

    componentDidMount() {
        this.props.fetchStatesList();
        this.form.current.getFormikActions().validateForm();
    }

    handleCancel = (values) => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    render() {
        return (
            <Formik
                initialValues={{
                    address_line_1  : this.props.value.address_line_1,
                    address_line_2  : this.props.value.address_line_2,
                    address_city    : this.props.value.address_city,
                    address_state   : this.props.value.address_state,
                    address_postcode: this.props.value.address_postcode,
                }}
                validate={this.validateAddressDetails}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                ref={this.form}
            >
                {
                    ({
                        handleSubmit,
                        isSubmitting,
                        errors,
                        values,
                        handleChange,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className='details-form'>
                                <p className='details-form__description'>
                                    <Localize
                                        i18n_default_text='Please ensure that this address is the same as in your proof of address'
                                    />
                                </p>
                                <div className='details-form__elements-container'>
                                    <ThemedScrollbars
                                        autoHide={!(window.innerHeight < 890)}
                                        style={{
                                            height: 'calc(100% - 16px)',
                                        }}
                                    >
                                        <div className='details-form__elements' style={{ paddingBottom: (window.innerHeight < 930) ? '10rem' : '12rem' }}>
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
                                            <fieldset className='address-state__fieldset'>
                                                <Dropdown
                                                    id='address_state'
                                                    className='address_state-dropdown'
                                                    is_align_text_left
                                                    list={this.props.states_list}
                                                    name='address_state'
                                                    value={values.address_state}
                                                    onChange={handleChange}
                                                    placeholder={localize('State/Province')}
                                                />
                                            </fieldset>
                                            <InputField
                                                name='address_postcode'
                                                required
                                                label={localize('Postal/ZIP Code*')}
                                                placeholder={localize('Postal/ZIP Code')}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </div>
                            </div>
                            <FormSubmitButton
                                is_absolute
                                is_disabled={
                                    // eslint-disable-next-line no-unused-vars
                                    isSubmitting ||
                                    Object.keys(errors).length > 0
                                }
                                label={localize('Next')}
                                has_cancel
                                cancel_label={localize('Previous')}
                                onCancel={this.handleCancel.bind(this, values)}
                            />
                        </form>
                    )
                }
            </Formik>
        );
    }

    validateAddressDetails = (values) => {
        const validations = {
            address_line_1: [
                v => !!v,
                v => /^[\p{L}\p{Nd}\s'.,:;()@#/-]{1,70}$/gu.exec(v) !== null,
            ],
            address_line_2: [
                v => !v || (/^[\p{L}\p{Nd}\s'.,:;()@#/-]{0,70}$/gu.exec(v) !== null),
            ],
            address_city: [
                v => !!v,
                v => /^[\p{L}\s'.-]{1,35}$/gu.exec(v) !== null,
            ],
            address_state: [
                v => /^[\p{L}\p{Nd}\s'.,-]{0,35}$/gu.exec(v) !== null,
            ],
            address_postcode: [
                v => !!v,
                v => /^[^+]{0,20}$/gu.exec(v) !== null,
            ],
        };

        const mappedKey = {
            address_line_1  : localize('First line of address'),
            address_line_2  : localize('Second line of address'),
            address_city    : `${localize('Town/City')}`,
            address_state   : `${localize('State/Province')}`,
            address_postcode: `${localize('Postal/ZIP Code')}`,
        };

        const required_messages = [
            '{{field_name}} is required',
            '{{field_name}} is not in a proper format.',
        ];

        const optional_messages = [
            '{{field_name}} is not in a proper format.',
        ];

        const errors = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));
                if (error_index !== -1) {
                    switch (key) {
                        case 'address_state':
                        case 'address_line_2':
                            errors[key] = <Localize
                                i18n_default_text={optional_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                                options={{ interpolation: { escapeValue: false } }}
                            />;
                            break;
                        default:
                            errors[key] = <Localize
                                i18n_default_text={required_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                                options={{ interpolation: { escapeValue: false } }}
                            />;
                    }
                }
            });

        return errors;
    };
}

export default connect(({ client }) => ({
    fetchStatesList: client.fetchStatesList,
    states_list    : client.states_list,
}))(AddressDetails);
