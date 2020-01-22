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
        advertiser_notes: '',
        country         : '',
        currency        : '',
        max_transaction : '',
        min_transaction : '',
        offer_amount    : '',
        offer_currency  : '',
        payment_method  : 'bank_transfer',
        price_rate      : '',
        type            : 'buy',
        error_message   : '',
        is_loading      : true,
    };

    async componentDidMount() {
        const residence_response = await requestWS({ residence_list: 1 });
        const current_residence = residence_response.residence_list.find(
            (residence) => residence.value === this.context.residence
        );
        const display_residence = ObjectUtils.getPropertyValue(current_residence, 'text') || '';

        const { data } = this.props;

        // user is editing an existing ad, we should populate its data
        if (this.isUpdatingAd()) {
            this.setState({
                is_loading      : false,
                advertiser_notes: data.advertiser_notes,
                country         : display_residence,
                currency        : data.transaction_currency,
                max_transaction : data.max_transaction,
                min_transaction : data.min_transaction,
                offer_amount    : data.offer_amount,
                offer_currency  : data.offer_currency,
                payment_method  : data.payment_method,
                price_rate      : data.price_rate,
                type            : data.type,
            });
        } else {
            this.setState({
                is_loading    : false,
                country       : display_residence,
                currency      : this.context.local_currency_config.currency,
                offer_currency: this.context.currency,
            });
        }
    }

    isUpdatingAd = () => !ObjectUtils.isEmptyObject(this.props.data);

    handleSubmit = (values, { setSubmitting }) => {
        this.setState({ error_message: '' });

        const msg_type = this.isUpdatingAd() ? 'p2p_offer_update' : 'p2p_offer_create';

        requestWS({
            [msg_type]       : 1,
            amount           : values.offer_amount,
            local_currency   : values.transaction_currency,
            max_amount       : values.max_transaction,
            min_amount       : values.min_transaction,
            offer_description: values.advertiser_notes,
            ...(this.isUpdatingAd() ?
                { offer_id: this.props.data.offer_id }
                :
                { // these fields are not allowed to be updated after creation
                    method: values.payment_method,
                    rate  : values.price_rate,
                    type  : values.type,
                }
            ),
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
                    page_title={ this.isUpdatingAd() ? localize('Edit ad') : localize('Create new ad') }
                />
                {this.state.is_loading ? <Loading is_fullscreen={false} /> : (
                    <Formik
                        initialValues={{
                            advertiser_notes: this.state.advertiser_notes,
                            country         : this.state.country,
                            currency        : this.state.currency,
                            max_transaction : this.state.max_transaction,
                            min_transaction : this.state.min_transaction,
                            offer_amount    : this.state.offer_amount,
                            offer_currency  : this.state.offer_currency,
                            payment_method  : this.state.payment_method,
                            price_rate      : this.state.price_rate,
                            type            : this.state.type,
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
                                        style={{ position: 'absolute', height: 'calc(100% - 2.4rem - 72px - 92px)', width: 'calc(100% - 4.8rem)' }}
                                        autoHide
                                        autoHeightMax={440}
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
                                                        label={localize('Local currency')}
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
                                                        disabled={this.isUpdatingAd()}
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
                                                        hint={values.type === 'buy' ? localize('Currency client is buying') : localize('Currency client is selling')}
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
                                                        disabled={this.isUpdatingAd()}
                                                        error={touched.price_rate && errors.price_rate}
                                                        label={localize('Fixed price')}
                                                        hint={localize('Price per 1 {{currency}}', { currency: values.offer_currency })}
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
                                                        hint={localize('Total asset offered')}
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
                                                        error={
                                                            touched.min_transaction
                                                            && touched.max_transaction
                                                            && errors.min_transaction
                                                        }
                                                        label={localize('Min limit')}
                                                        hint={localize('Minimum order from client')}
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
                                                        error={
                                                            touched.max_transaction
                                                            && touched.min_transaction
                                                            && errors.max_transaction
                                                        }
                                                        label={localize('Max limit')}
                                                        hint={localize('Maximum order from client')}
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
                                                    disabled={this.isUpdatingAd()}
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
                                        <Button className='p2p-my-ads__form-button' primary large is_disabled={isSubmitting || !isValid}>
                                            {this.isUpdatingAd() ? localize('Save changes') : localize('Post ad')}
                                        </Button>
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
        // TODO: uncomment this when we have available_price
        // const available_price = ;
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
                // TODO: uncomment this when we have available_price
                // v => v > available_price,
                // TODO: remove v > 0 check when we have available_price
                v => v > 0 && countDecimalPlaces(v) <= CurrencyUtils.getDecimalPlaces(values.offer_currency),
            ],
            price_rate: [
                v => !!v,
                v => v > 0 && countDecimalPlaces(v) <= this.context.local_currency_config.decimal_places,
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
            // TODO: uncomment this when we have available_price
            // localize('Min is {{value}}', { value: available_price }),
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
    data          : PropTypes.object,
    handleShowForm: PropTypes.func,
};

FormAds.contextType = Dp2pContext;

export default FormAds;
