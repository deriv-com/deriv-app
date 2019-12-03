import React, { Component, Fragment } from 'react';
import PropTypes                 from 'prop-types';
import { localize }              from 'deriv-translations';
import { Formik, Field, Form }   from 'formik';
import { Autocomplete, Loading, Input, Button, ThemedScrollbars } from 'deriv-components';
import { WS }                    from '../../utils/websocket';
import IconBack                  from '../../assets/icon-back.jsx';

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
            payment_method : '',
            advertiser_note: '',
        },
        residence_list: [],
        is_loading    : true,
    }

    componentDidMount() {
        WS().send({ 'residence_list': 1 }).then((response) => {
            this.setState({ residence_list: response.residence_list });

            if (this.props.ad_id) {
                // call the api, get the file based on id
                // populate the state from the respnose
            } else {
                this.setState({ is_loading: false });
            }
    
        });
    }
    handleSubmit(formik_vars) {
        console.log(formik_vars);
    }

    render() {
        return <Fragment>
            <div className='my-ads__heading--wrapper'>
                <div onClick={() => this.props.handleShowForm(false)} className='my-ads__heading--btn'>
                    <IconBack />
                </div>
                <h2>Create new ad</h2>
            </div>
            {this.state.is_loading ? <Loading is_fullscreen={false} /> : (
                <Formik initialValues={{...this.state.initial_values}} onSubmit={this.handleSubmit}>
                    {({
                    // errors,
                    // status,
                    // touched,
                    // handleChange,
                    // handleBlur,
                    // handleSubmit,
                    // isSubmitting,
                    setFieldValue,
                    }) => (
                        <div className='my-ads__form'>
                            <Form>
                                <ThemedScrollbars
                                    autoHide
                                    style={{ height: 'calc(460px - 40px)' }} // height of container minus height of modal footer container
                                >
                                    <div className='my-ads__form--container'>
                                        <Field name='country'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    data-lpignore='true'
                                                    autoComplete='new-password'
                                                    type='text'
                                                    className='my-ads__form--field'
                                                    label={localize('Country')}
                                                    required
                                                    list_items={this.state.residence_list}
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
                                                    data-lpignore='true'
                                                    autoComplete='off'
                                                    type='text'
                                                    className='my-ads__form--field'
                                                    label={localize('Currency')}
                                                    required
                                                    list_items={this.state.residence_list}
                                                    onItemSelection={
                                                        ({ value, text }) => setFieldValue('currency', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='my-ads__form--container'>
                                        <Field name='type'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    data-lpignore='true'
                                                    autoComplete='off'
                                                    type='text'
                                                    className='my-ads__form--field'
                                                    label={localize('Type')}
                                                    required
                                                    list_items={this.state.residence_list}
                                                    onItemSelection={
                                                        ({ value, text }) => setFieldValue('type', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <Field name='asset'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    data-lpignore='true'
                                                    autoComplete='off'
                                                    type='text'
                                                    className='my-ads__form--field'
                                                    label={localize('Asset')}
                                                    required
                                                    list_items={this.state.residence_list}
                                                    onItemSelection={
                                                        ({ value, text }) => setFieldValue('asset', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='my-ads__form--container'>
                                        <Field name='fixed_price'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    label={localize('Fixed price')}
                                                    className='my-ads__form--field'
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
                                                    label={localize('Amount')}
                                                    className='my-ads__form--field'
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <Field name='min_transaction'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                type='number'
                                                label={localize('Min. transaction')}
                                                className='my-ads__form--field my-ads__form--field-single'
                                                required
                                            />
                                        )}
                                    </Field>
                                    <Field name='payment_method'>
                                        {({ field }) => (
                                            <Autocomplete
                                                {...field}
                                                data-lpignore='true'
                                                autoComplete='off'
                                                type='text'
                                                className='my-ads__form--field my-ads__form--field-single'
                                                label={localize('Payment method')}
                                                required
                                                list_items={this.state.residence_list}
                                                onItemSelection={
                                                    ({ value, text }) => setFieldValue('payment_method', value ? text : '', true)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <Field name='advertiser_note'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                type='textarea'
                                                label={localize('Advertiser notes')}
                                                className='my-ads__form--field my-ads__form--field-textarea'
                                                required
                                            />
                                        )}
                                    </Field>
                                </ThemedScrollbars>
                                <div className='my-ads__form--footer'>
                                    <Button secondary large>{localize('Cancel')}</Button>
                                    <Button primary large>{localize('Post ad')}</Button>
                                </div>
                            </Form>
                        </div>
                    )}

                </Formik>
            )}
        </Fragment>;
    }
}

FormAds.propTypes = {
    ad_id         : PropTypes.string,
    handleShowForm: PropTypes.func
};
 
export default FormAds;
