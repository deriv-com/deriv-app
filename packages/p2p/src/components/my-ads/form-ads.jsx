import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Dropdown, Loading, Icon, Input, Button, ThemedScrollbars } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import Dp2pContext from 'Components/context/dp2p-context';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import AdSummary from './my-ads-summary.jsx';

class FormAds extends Component {
    state = {
        error_message: '',
        is_loading: true,
    };

    async componentDidMount() {
        this.setState({
            is_loading: false,
        });
    }

    handleSubmit = (values, { setSubmitting }) => {
        this.setState({ error_message: '' });

        requestWS({
            p2p_advert_create: 1,
            description: values.advertiser_notes,
            type: values.type,
            amount: values.offer_amount,
            max_order_amount: values.max_transaction,
            min_order_amount: values.min_transaction,
            payment_method: values.payment_method,
            rate: values.price_rate,
        }).then(response => {
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
                <PageReturn onClick={() => this.props.handleShowForm(false)} page_title={localize('Create new ad')} />
                {this.state.is_loading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    <Formik
                        initialValues={{
                            advertiser_notes: '',
                            max_transaction: undefined,
                            min_transaction: undefined,
                            offer_amount: undefined,
                            payment_method: 'bank_transfer',
                            price_rate: undefined,
                            type: 'buy',
                        }}
                        onSubmit={this.handleSubmit}
                        validate={this.validateFormAds}
                    >
                        {({ isSubmitting, errors, touched, isValid, values }) => (
                            <div className='p2p-my-ads__form'>
                                <Form noValidate>
                                    <ThemedScrollbars
                                        style={{
                                            position: 'absolute',
                                            height: 'calc(100% - 2.4rem - 72px - 92px)',
                                            width: 'calc(100% - 4.8rem)',
                                        }}
                                        autoHide
                                        autoHeightMax={440}
                                    >
                                        <p className='p2p-my-ads__form-summary'>
                                            <AdSummary
                                                offer_amount={values.offer_amount}
                                                offer_currency={this.context.currency}
                                                transaction_currency={this.context.local_currency_config.currency}
                                                price_rate={values.price_rate}
                                                type={values.type}
                                            />
                                        </p>
                                        <div className='p2p-my-ads__form-container'>
                                            <Field name='type'>
                                                {({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        placeholder={localize('Type')}
                                                        is_align_text_left
                                                        className='p2p-my-ads__form-field'
                                                        list={[
                                                            { text: 'Buy', value: 'buy' },
                                                            { text: 'Sell', value: 'sell' },
                                                        ]}
                                                        error={touched.type && errors.type}
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
                                                        label={localize('Total amount')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <span className='p2p-my-ads__form-field--trailing'>
                                                                {this.context.currency}
                                                            </span>
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <Field name='price_rate'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='number'
                                                        error={touched.price_rate && errors.price_rate}
                                                        label={localize('Fixed price')}
                                                        hint={localize('Per 1 {{currency}}', {
                                                            currency: this.context.currency,
                                                        })}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <span className='p2p-my-ads__form-field--trailing'>
                                                                {this.context.local_currency_config.currency}
                                                            </span>
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='p2p-my-ads__form-container'>
                                            <Field name='payment_method'>
                                                {({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        placeholder={localize('Payment method')}
                                                        is_align_text_left
                                                        className='p2p-my-ads__form-field'
                                                        list={[{ text: 'Bank transfer', value: 'bank_transfer' }]}
                                                        error={touched.payment_method && errors.payment_method}
                                                    />
                                                )}
                                            </Field>
                                            <Field name='min_transaction'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='number'
                                                        error={touched.min_transaction && errors.min_transaction}
                                                        label={localize('Min order')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <span className='p2p-my-ads__form-field--trailing'>
                                                                {this.context.currency}
                                                            </span>
                                                        }
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
                                                        label={localize('Max order')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <span className='p2p-my-ads__form-field--trailing'>
                                                                {this.context.currency}
                                                            </span>
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <Field name='advertiser_notes'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='textarea'
                                                    error={touched.advertiser_notes && errors.advertiser_notes}
                                                    label={localize('Advertiser notes')}
                                                    hint={'This information will be visible to everyone'}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                    placeholder='Payment and contact details'
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </ThemedScrollbars>
                                    <FooterActions has_border>
                                        {this.state.error_message && (
                                            <div className='p2p-my-ads__form-error'>
                                                <Icon icon='IcAlertDanger' />
                                                <p>{this.state.error_message}</p>
                                            </div>
                                        )}
                                        <Button
                                            className='p2p-my-ads__form-button'
                                            secondary
                                            large
                                            onClick={() => this.props.handleShowForm(false)}
                                        >
                                            {localize('Cancel')}
                                        </Button>
                                        <Button
                                            className='p2p-my-ads__form-button'
                                            primary
                                            large
                                            is_disabled={isSubmitting || !isValid}
                                        >
                                            {localize('Post ad')}
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

    validateFormAds = values => {
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
                v => v > 0 && countDecimalPlaces(v) <= CurrencyUtils.getDecimalPlaces(this.context.currency),
                v => (values.offer_amount ? v <= values.offer_amount : true),
                v => (values.min_transaction ? v >= values.min_transaction : true),
            ],
            min_transaction: [
                v => !!v,
                v => v > 0 && countDecimalPlaces(v) <= CurrencyUtils.getDecimalPlaces(this.context.currency),
                v => (values.offer_amount ? v <= values.offer_amount : true),
                v => (values.max_transaction ? v <= values.max_transaction : true),
            ],
            offer_amount: [
                v => !!v,
                // TODO: uncomment this when we have available_price
                // v => v > available_price,
                // TODO: remove v > 0 check when we have available_price
                v => v > 0 && countDecimalPlaces(v) <= CurrencyUtils.getDecimalPlaces(this.context.currency),
                v => (values.min_transaction ? v >= values.min_transaction : true),
                v => (values.max_transaction ? v >= values.max_transaction : true),
            ],
            price_rate: [
                v => !!v,
                v => v > 0 && countDecimalPlaces(v) <= this.context.local_currency_config.decimal_places,
            ],
        };

        const mapped_key = {
            advertiser_notes: localize('Advertiser notes'),
            max_transaction: localize('Max limit'),
            min_transaction: localize('Min limit'),
            offer_amount: localize('Amount'),
            price_rate: localize('Fixed price'),
        };

        const common_messages = field_name => [localize('{{field_name}} is required', { field_name })];

        const amount_messages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            // TODO: uncomment this when we have available_price
            // localize('Min is {{value}}', { value: available_price }),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not be below Min limit', { field_name }),
            localize('{{field_name}} should not be below Max limit', { field_name }),
        ];

        const max_limit_messages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not be below Min limit', { field_name }),
        ];

        const min_limit_messages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not exceed Max limit', { field_name }),
        ];

        const price_rate_messages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
        ];

        const note_messages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
            localize("{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -.,'#@():;", {
                field_name,
            }),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
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
    handleShowForm: PropTypes.func,
};

FormAds.contextType = Dp2pContext;

export default FormAds;
