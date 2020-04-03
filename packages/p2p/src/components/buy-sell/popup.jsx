import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, ThemedScrollbars } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import IconClose from 'Assets/icon-close.jsx';
import { localize, Localize } from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { textValidator, lengthValidator } from 'Utils/validations';
import { requestWS } from 'Utils/websocket';
import FormError from '../form/error.jsx';

class Popup extends Component {
    state = {
        total_amount: undefined,
    };

    componentDidMount() {
        this.setTotalAmount(this.props.ad.min_available);
    }

    handleSubmit = async (values, { setStatus, setSubmitting }) => {
        const { ad } = this.props;
        setStatus({ error_message: '' });

        const request_payload = {
            p2p_order_create: 1,
            advert_id: ad.id,
            amount: values.amount,
        };
        if (ad.type === 'sell') {
            request_payload.contact_info = values.contact_info;
            request_payload.payment_info = values.payment_info;
        }

        const order = await requestWS(request_payload);

        if (!order.error) {
            const order_info = await requestWS({ p2p_order_info: 1, id: order.p2p_order_create.id });
            this.props.handleClose();
            this.props.handleConfirm(order_info);
            setSubmitting(false);
        } else {
            setSubmitting(false);
            setStatus({ error_message: order.error.message });
        }
    };

    setTotalAmount = amount => {
        const { ad } = this.props;
        const total_amount = CurrencyUtils.formatMoney(
            ad.transaction_currency,
            +amount * ad.price_rate,
            true,
            ad.transaction_currency_decimals
        );
        this.setState({ total_amount });
    };

    render() {
        const { ad, handleClose } = this.props;
        console.log({ renderAd: ad, props: this.props });

        return (
            <Fragment>
                <div className='buy-sell__popup'>
                    <div className='buy-sell__popup-header'>
                        <div className='buy-sell__popup-header_wrapper'>
                            <h2 className='buy-sell__popup-header--title'>{`${ad.type} ${ad.offer_currency}`}</h2>
                            <IconClose className='buy-sell__popup-close_icon' onClick={handleClose} />
                        </div>
                    </div>
                    <Formik
                        validate={this.validatePopup}
                        initialValues={{
                            amount: ad.min_available,
                            contact_info: ad.contact_info,
                            payment_info: ad.payment_info,
                        }}
                        onSubmit={this.handleSubmit}
                    >
                        {({ errors, isSubmitting, isValid, handleChange, status, touched }) => {
                            console.log({ errors, touched });
                            const is_buyer = ad.type === 'buy';
                            return (
                                <Form noValidate>
                                    <ThemedScrollbars autoHide style={{ height: '307px' }}>
                                        <div className='buy-sell__popup-content'>
                                            <div className='buy-sell__popup-info'>
                                                <span className='buy-sell__popup-info--title'>{localize('Price')}</span>
                                                <p className='buy-sell__popup-info--text'>
                                                    {ad.display_price_rate} {ad.transaction_currency}
                                                </p>
                                            </div>
                                            <div className='buy-sell__popup-field_wrapper'>
                                                <div className='buy-sell__popup-field'>
                                                    <span className='buy-sell__popup-info--title'>
                                                        {is_buyer ? localize('Seller') : localize('Buyer')}
                                                    </span>
                                                    <p className='buy-sell__popup-info--text'>{ad.advertiser_name}</p>
                                                </div>
                                                <div className='buy-sell__popup-field'>
                                                    <span className='buy-sell__popup-info--title'>
                                                        {localize('Payment method')}
                                                    </span>
                                                    <p className='buy-sell__popup-info--text'>
                                                        {ad.display_payment_method}
                                                    </p>
                                                </div>
                                            </div>
                                            {ad.advertiser_instructions && (
                                                <div className='buy-sell__popup-info buy-sell__popup-info_notes'>
                                                    <span className='buy-sell__popup-info--title'>
                                                        {is_buyer
                                                            ? localize('Seller instructions')
                                                            : localize('Buyer instructions')}
                                                    </span>
                                                    {ad.advertiser_instructions.split('\n').map((text, idx) => (
                                                        <p className='buy-sell__popup-info--text' key={idx}>
                                                            {text}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                            <div className='buy-sell__popup-field_wrapper'>
                                                <Field name='amount'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            type='number'
                                                            error={errors.amount}
                                                            label={localize('Amount')}
                                                            hint={
                                                                <Localize
                                                                    i18n_default_text='Limits: {{min}}–{{max}} {{currency}}'
                                                                    values={{
                                                                        min: ad.display_min_available,
                                                                        max: ad.display_max_available,
                                                                        currency: ad.offer_currency,
                                                                    }}
                                                                />
                                                            }
                                                            className='buy-sell__popup-field'
                                                            trailing_icon={
                                                                <span className='buy-sell__popup-field--trailing'>
                                                                    {ad.offer_currency}
                                                                </span>
                                                            }
                                                            onChange={e => {
                                                                // typing more than 15 characters will break the layout
                                                                // max doesn't disable typing, so we will use this to restrict length
                                                                if (e.target.value.length > 15) {
                                                                    e.target.value = e.target.value.slice(0, 15);
                                                                    return;
                                                                }
                                                                const amount = isNaN(e.target.value)
                                                                    ? 0
                                                                    : e.target.value;
                                                                this.setTotalAmount(amount);
                                                                handleChange(e);
                                                            }}
                                                            required
                                                        />
                                                    )}
                                                </Field>
                                                <div className='buy-sell__popup-field'>
                                                    <span className='buy-sell__popup-info--title'>
                                                        {is_buyer ? localize('You send') : localize('You receive')}
                                                    </span>
                                                    <p className='buy-sell__popup-info--text buy-sell__popup-info--strong'>
                                                        {this.state.total_amount} {ad.transaction_currency}
                                                    </p>
                                                </div>
                                            </div>
                                            {!is_buyer && (
                                                <React.Fragment>
                                                    <div className='buy-sell__popup-field--textarea'>
                                                        <Field name='payment_info'>
                                                            {({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    type='textarea'
                                                                    error={touched.payment_info && errors.payment_info}
                                                                    hint={localize(
                                                                        'Bank name, account number, beneficiary name'
                                                                    )}
                                                                    label={localize('Your bank details')}
                                                                    required
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>
                                                    <div className='buy-sell__popup-field--textarea'>
                                                        <Field name='contact_info'>
                                                            {({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    type='textarea'
                                                                    error={touched.contact_info && errors.contact_info}
                                                                    label={localize('Your contact details')}
                                                                    required
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </ThemedScrollbars>
                                    <div className='buy-sell__popup-footer'>
                                        {status && status.error_message && <FormError message={status.error_message} />}
                                        <Button secondary type='button' onClick={handleClose}>
                                            {localize('Cancel')}
                                        </Button>
                                        <Button is_disabled={!!(isSubmitting || !isValid)} primary>
                                            {localize('Confirm')}
                                        </Button>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </Fragment>
        );
    }

    validatePopup = values => {
        const { ad } = this.props;

        const validations = {
            amount: [
                v => !!v,
                v => v >= ad.min_available,
                v => v <= ad.max_available,
                v => countDecimalPlaces(v) <= ad.offer_currency_decimals,
            ],
        };
        if (ad.type === 'sell') {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            validations.payment_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const display_initial_amount = CurrencyUtils.formatMoney(
            ad.offer_currency,
            ad.min_available,
            true,
            ad.offer_currency_decimals
        );

        const display_max_amount = CurrencyUtils.formatMoney(
            ad.offer_currency,
            ad.max_available,
            true,
            ad.offer_currency_decimals
        );

        const common_messages = [
            localize('Enter a valid amount'),
            localize('Minimum is {{value}} {{currency}}', {
                currency: ad.offer_currency,
                value: display_initial_amount,
            }),
            localize('Maximum is {{value}} {{currency}}', { currency: ad.offer_currency, value: display_max_amount }),
            localize('Enter a valid amount'),
        ];

        const info_messages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
        ];

        const mapped_key = {
            contact_info: localize('Contact details'),
            payment_info: localize('Bank details'),
        };

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                    case 'payment_info': {
                        errors[key] = info_messages(mapped_key[key])[error_index];
                        break;
                    }
                    default: {
                        errors[key] = common_messages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    };
}

Popup.propTypes = {
    ad: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default Popup;
