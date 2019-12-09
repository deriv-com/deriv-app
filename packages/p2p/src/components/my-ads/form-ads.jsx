import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import { localize }                   from 'deriv-translations';
import { Formik, Field, Form }        from 'formik';
import {
    Autocomplete,
    Dropdown,
    Loading,
    Input,
    Button,
    ThemedScrollbars }                from 'deriv-components';
import PageReturn                     from 'Components/page-return/page-return.jsx';
import FooterActions                  from 'Components/footer-actions/footer-actions.jsx';
import { WS }                         from 'Utils/websocket';

class FormAds extends Component {
    state = {
        initial_values: {
            country        : '',
            currency       : '',
            type           : '',
            asset          : '',
            fix_price      : '',
            amount         : '',
            min_transaction: '',
            max_transaction: '',
            advertiser_note: '',
        },
        is_loading: true,
    };

    componentDidMount() {
        // TODO: [p2p-fix-api] call get offer detail api and populate state
        WS().send({ 'residence_list': 1 }).then(() => { // this is just to mock the api delay response
            const new_initial_values = {
                country        : 'Indonesia',
                currency       : 'IDR',
                type           : 'buy',
                asset          : 'USD',
                fix_price      : 10000,
                amount         : 50,
                min_transaction: 1000,
            };
            this.setState({
                initial_values: new_initial_values,
            });

            if (this.props.ad_id) {
                // call the api, get the file based on id
                // populate the state from the respnose
            } else {
                this.setState({ is_loading: false });
            }

        });
    }

    handleSubmit(formik_vars, { setSubmitting }) {
        // TODO: [p2p-fix-api] call offer create api
        // eslint-disable-next-line no-console
        console.log(this.state);
        // eslint-disable-next-line no-console
        console.log(formik_vars);
        setSubmitting(false);
    }

    render() {
        return <Fragment>
            <PageReturn
                onClick={ () => this.props.handleShowForm(false) }
                page_title={ localize('Create new ad') }
            />
            {this.state.is_loading ? <Loading is_fullscreen={false} /> : (
                <Formik
                    initialValues={{ ...this.state.initial_values }}
                    onSubmit={this.handleSubmit}
                    validate={this.validateFormAds}
                >
                    {({
                        isSubmitting,
                        errors,
                        touched,
                        isValid,
                        setFieldValue,
                        values,
                    }) => (
                        <div className='p2p-my-ads__form'>
                            <Form noValidate>
                                <ThemedScrollbars
                                    autoHide
                                    style={{ height: 'calc(520px - 70px)' }} // height of container minus height of modal footer container
                                >
                                    <div className='p2p-my-ads__form-container'>
                                        <Field name='country'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    type='text'
                                                    className='p2p-my-ads__form-field'
                                                    label={localize('Country')}
                                                    list_items={[]}
                                                    disabled
                                                    onItemSelection={
                                                        ({ value, text }) => setFieldValue('country', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <Field name='currency'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    type='text'
                                                    className='p2p-my-ads__form-field'
                                                    label={localize('Currency')}
                                                    list_items={[]}
                                                    disabled
                                                    onItemSelection={
                                                        ({ value, text }) => setFieldValue('currency', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='p2p-my-ads__form-container'>
                                        <Field name='type'>
                                            {({ field }) => (
                                                <Dropdown
                                                    {...field}
                                                    placeholder={localize('Type')}
                                                    is_align_text_left
                                                    className='p2p-my-ads__form-field'
                                                    list={[{ text: 'Buy', value: 'buy' }, { text: 'Sell', value: 'sell' }]}
                                                    error={touched.type && errors.type}
                                                />
                                            )}
                                        </Field>
                                        <Field name='asset'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    type='text'
                                                    className='p2p-my-ads__form-field'
                                                    disabled
                                                    label={localize('Asset')}
                                                    list_items={[]}
                                                    required
                                                    onItemSelection={
                                                        ({ value, text }) => setFieldValue('asset', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='p2p-my-ads__form-container'>
                                        <Field name='fix_price'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    error={touched.fix_price && errors.fix_price}
                                                    label={localize('Fixed price')}
                                                    className='p2p-my-ads__form-field'
                                                    trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{`${values.currency}/${values.asset}`}</span>}
                                                    required
                                                />
                                            )}
                                        </Field>
                                        <Field name='amount'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    error={touched.amount && errors.amount}
                                                    label={localize('Amount')}
                                                    className='p2p-my-ads__form-field'
                                                    trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{values.asset}</span>}
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className="p2p-my-ads__form--container">
                                        <Field name='min_transaction'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    error={touched.min_transaction && errors.min_transaction}
                                                    label={localize('Min. transaction')}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--single'
                                                    trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{values.currency}</span>}
                                                    required
                                                />
                                            )}
                                        </Field>
                                        <Field name='max_transaction'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    error={touched.max_transaction && errors.max_transaction}
                                                    label={localize('Max. transaction')}
                                                    disabled
                                                    value={(values.amount * values.fix_price)}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--single'
                                                    trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{values.currency}</span>}
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <Field name='advertiser_note'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                type='textarea'
                                                error={touched.advertiser_note && errors.advertiser_note}
                                                label={localize('Advertiser notes')}
                                                className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                placeholder='Your contact and payment info'
                                                required
                                            />
                                        )}
                                    </Field>
                                </ThemedScrollbars>
                                <FooterActions has_border>
                                    <Button className='p2p-my-ads__form-button' secondary large type='reset'>{localize('Cancel')}</Button>
                                    <Button className='p2p-my-ads__form-button' primary large is_disabled={isSubmitting || !isValid}>{localize('Post ad')}</Button>
                                </FooterActions>
                            </Form>
                        </div>
                    )}

                </Formik>
            )}
        </Fragment>;
    }

    validateFormAds = (values) => {
        const available_price = 0.8; // later get available amount from the api
        const validations = {
            fix_price: [
                v => !!v,
            ],
            amount: [
                v => !!v,
                v => v > available_price,
            ],
            min_transaction: [
                v => !!v,
            ],
            advertiser_note: [
                v => !!v,
                v => v.length < 400,
            ],
        };

        const mappedKey = {
            fix_price      : localize('Fixed price'),
            amount         : localize('Amount'),
            min_transaction: localize('Min. transaction'),
            advertiser_note: localize('Advertiser note'),
        };

        const common_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
        ]);

        const amount_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('{{field_name}} is too low', { field_name }),
        ]);

        const note_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('{{field_name}} has exceed maximum length', { field_name }),
        ]);

        const errors    = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));

                if (error_index !== -1) {
                    switch (key) {
                        case 'amount':
                            errors[key] = amount_messages(mappedKey[key])[error_index];
                            break;
                        case 'advertiser_note':
                            errors[key] = note_messages(mappedKey[key])[error_index];
                            break;
                        default:
                            errors[key] = common_messages(mappedKey[key])[error_index];
                    }
                }
            });

        return errors;
    };
}

FormAds.propTypes = {
    ad_id         : PropTypes.string,
    handleShowForm: PropTypes.func,
};

export default FormAds;
