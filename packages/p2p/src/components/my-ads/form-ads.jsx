import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import { Formik, Field, Form }        from 'formik';
import {
    Autocomplete,
    Dropdown,
    Loading,
    Icon,
    Input,
    Button,
    ThemedScrollbars }                from '@deriv/components';
import ObjectUtils                    from '@deriv/shared/utils/object';
import CurrencyUtils                  from '@deriv/shared/utils/currency';
import Dp2pContext                    from 'Components/context/dp2p-context';
import FooterActions                  from 'Components/footer-actions/footer-actions.jsx';
import { localize }                   from 'Components/i18next';
import PageReturn                     from 'Components/page-return/page-return.jsx';
import { countDecimalPlaces }         from 'Utils/string';
import { requestWS }                  from 'Utils/websocket';

class FormAds extends Component {
    state = {
        country      : '',
        error_message: '',
        is_loading   : true,
    };

    async componentDidMount() {
        const residence_response = await requestWS({ residence_list: 1 });
        const current_residence = residence_response.residence_list.find(
            (residence) => residence.value === this.context.residence
        );
        const display_residence = ObjectUtils.getPropertyValue(current_residence, 'text') || '';

        // TODO: [p2p-fix-api] call get offer detail api and populate state
        // this is pending offer edit enabled in the API
        if (this.props.ad_id) {
            // call the api, get the file based on id
            // populate the state from the respnose
            this.setState({
                country: display_residence,
            });
        } else {
            this.setState({ is_loading: false, country: display_residence });
        }
    }

    handleSubmit = (values, { setSubmitting }) => {
        this.setState({ error_message: '' });

        requestWS({
            p2p_offer_create : 1,
            type             : values.type,
            amount           : values.offer_amount,
            local_currency   : values.transaction_currency,
            max_amount       : values.max_transaction,
            method           : values.payment_method,
            min_amount       : values.min_transaction,
            offer_description: values.advertiser_notes,
            rate             : values.price_rate,
        }).then((response) => {
            // If we get an error we should let the user submit the form again else we just go back to the list of ads
            if (response.error) {
                this.setState({ error_message: response.error.message });
                setSubmitting(false);
            } else {
                this.props.handleShowForm(false);
            }
        });
    };

    render() {
        return (
            <Fragment>
                <PageReturn
                    onClick={ () => this.props.handleShowForm(false) }
                    page_title={ localize('Create new ad') }
                />
                {this.state.is_loading ? <Loading is_fullscreen={false} /> : (
                    <Formik
                        initialValues={{
                            advertiser_notes: '',
                            country         : this.state.country,
                            currency        : 'IDR', // TODO: [p2p-replace-with-api] get this local_currency from API once provided
                            max_transaction : '',
                            min_transaction : '',
                            offer_amount    : '',
                            offer_currency  : this.context.currency,
                            payment_method  : 'bank_transfer',
                            price_rate      : '',
                            type            : 'buy',
                        }}
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
                                        style={{ height: '460px' }}
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
                                            <Field name='offer_currency'>
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
                                                            ({ value, text }) => setFieldValue('offer_currency', value ? text : '', true)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='p2p-my-ads__form-container'>
                                            <Field name='price_rate'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='number'
                                                        error={touched.price_rate && errors.price_rate}
                                                        label={localize('Fixed price')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{`${values.currency}/${values.offer_currency}`}</span>}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <Field name='offer_amount'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='number'
                                                        error={touched.offer_amount && errors.offer_amount}
                                                        label={localize('Amount')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{values.offer_currency}</span>}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='p2p-my-ads__form-container'>
                                            <Field name='min_transaction'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='number'
                                                        error={touched.min_transaction && errors.min_transaction}
                                                        label={localize('Min limit')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{values.offer_currency}</span>}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <Field name='max_transaction'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type='number'
                                                        error={touched.max_transaction && errors.max_transaction}
                                                        label={localize('Max limit')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={<span className='p2p-my-ads__form-field--trailing'>{values.offer_currency}</span>}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <Field name='payment_method'>
                                            {({ field }) => (
                                                <Dropdown
                                                    {...field}
                                                    placeholder={localize('Payment method')}
                                                    is_align_text_left
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--single'
                                                    list={[{ text: 'Bank transfer', value: 'bank_transfer' }]}
                                                    error={touched.payment_method && errors.payment_method}
                                                />
                                            )}
                                        </Field>
                                        <Field name='advertiser_notes'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='textarea'
                                                    error={touched.advertiser_notes && errors.advertiser_notes}
                                                    label={localize('Advertiser notes')}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                    placeholder='Your contact and payment info'
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </ThemedScrollbars>
                                    <FooterActions has_border>
                                        {this.state.error_message &&
                                        <div className='p2p-my-ads__form-error'>
                                            <Icon icon='IcAlertDanger' />
                                            <p>{this.state.error_message}</p>
                                        </div>
                                        }
                                        <Button className='p2p-my-ads__form-button' secondary large onClick={ () => this.props.handleShowForm(false) }>{localize('Cancel')}</Button>
                                        <Button className='p2p-my-ads__form-button' primary large is_disabled={isSubmitting || !isValid}>{localize('Post ad')}</Button>
                                    </FooterActions>
                                </Form>
                            </div>
                        )}
                    </Formik>
                )}
            </Fragment>
        );
    }

    validateFormAds = (values) => {
        const available_price = 0; // later get available amount from the api
        const validations = {
            advertiser_notes: [
                v => !!v,
                v => v.length < 400,
                v => /^[\p{L}\p{Nd}\s'.,:;()@#/-]{1,500}$/u.exec(v) !== null,
            ],
            max_transaction: [
                v => !!v,
                v => v > 0 && countDecimalPlaces(v) <= CurrencyUtils.getDecimalPlaces(values.offer_currency),
                v => v <= values.offer_amount,
                v => v >= values.min_transaction,
            ],
            min_transaction: [
                v => !!v,
                v => v > 0 && countDecimalPlaces(v) <= CurrencyUtils.getDecimalPlaces(values.offer_currency),
                v => v <= values.offer_amount,
                v => v <= values.max_transaction,
            ],
            offer_amount: [
                v => !!v,
                v => v > available_price,
                v => countDecimalPlaces(v) <= CurrencyUtils.getDecimalPlaces(values.offer_currency),
            ],
            price_rate: [
                v => !!v,
                v => v > 0 && countDecimalPlaces(v) <= 2, // TODO: [p2p-calculate-decimals] - Dynamically get decimal places for transaction/local currency
            ],
        };

        const mapped_key = {
            advertiser_notes: localize('Advertiser notes'),
            max_transaction : localize('Max limit'),
            min_transaction : localize('Min limit'),
            offer_amount    : localize('Amount'),
            price_rate      : localize('Fixed price'),
        };

        const common_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
        ]);

        const amount_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('Min is {{value}}', { value: available_price }),
            localize('Enter a valid amount'),
        ]);

        const max_limit_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not be below Min limit', { field_name }),
        ]);

        const min_limit_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not exceed Max limit', { field_name }),
        ]);

        const price_rate_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
        ]);

        const note_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
            localize('{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -.,\'#@():;', { field_name }),
        ]);

        const errors = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));

                if (error_index !== -1) {
                    switch (key) {
                        case 'offer_amount':
                            errors[key] = amount_messages(mapped_key[key])[error_index];
                            break;
                        case 'max_transaction':
                            errors[key] = max_limit_messages(mapped_key[key])[error_index];
                            break;
                        case 'min_transaction':
                            errors[key] = min_limit_messages(mapped_key[key])[error_index];
                            break;
                        case 'price_rate':
                            errors[key] = price_rate_messages(mapped_key[key])[error_index];
                            break;
                        case 'advertiser_notes':
                            errors[key] = note_messages(mapped_key[key])[error_index];
                            break;
                        default:
                            errors[key] = common_messages(mapped_key[key])[error_index];
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

FormAds.contextType = Dp2pContext;

export default FormAds;
