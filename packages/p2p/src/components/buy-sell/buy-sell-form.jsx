import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, ThemedScrollbars } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import IconClose from 'Assets/icon-close.jsx';
import FormError from '../form/error.jsx';
import { buy_sell } from '../../constants/buy-sell';

const BuySellForm = ({ ad, handleClose, handleConfirm }) => {
    const [total_amount, setTotalAmount] = React.useState(
        formatMoney(ad.transaction_currency, ad.min_available * ad.price_rate, true, ad.transaction_currency_decimals)
    );
    const is_buyer = ad.type === buy_sell.BUY;
    const initial_values = {
        amount: ad.min_available,
        ...(!is_buyer && {
            contact_info: ad.contact_info,
            payment_info: ad.payment_info,
        }),
    };

    const handleSubmit = async (values, { setStatus, setSubmitting }) => {
        setStatus({ error_message: '' });

        const order = await requestWS({
            p2p_order_create: 1,
            advert_id: ad.id,
            amount: values.amount,
            ...(ad.type === buy_sell.sell && {
                contact_info: values.contact_info,
                payment_info: values.payment_info,
            }),
        });

        if (!order.error) {
            const order_info = await requestWS({ p2p_order_info: 1, id: order.p2p_order_create.id });
            handleClose();
            handleConfirm(order_info);
        } else {
            setStatus({ error_message: order.error.message });
        }

        setSubmitting(false);
    };

    const validatePopup = values => {
        const validations = {
            amount: [
                v => !!v,
                v => v >= ad.min_available,
                v => v <= ad.max_available,
                v => countDecimalPlaces(v) <= ad.offer_currency_decimals,
            ],
        };
        if (ad.type === buy_sell.SELL) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            validations.payment_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const display_initial_amount = formatMoney(
            ad.offer_currency,
            ad.min_available,
            true,
            ad.offer_currency_decimals
        );

        const display_max_amount = formatMoney(ad.offer_currency, ad.max_available, true, ad.offer_currency_decimals);

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

    return (
        <>
            <div className='buy-sell__popup-header'>
                <div className='buy-sell__popup-header_wrapper'>
                    <h2 className='buy-sell__popup-header--title'>{`${ad.type} ${ad.offer_currency}`}</h2>
                    <IconClose className='buy-sell__popup-close_icon' onClick={handleClose} />
                </div>
            </div>
            <Formik validate={validatePopup} initialValues={initial_values} onSubmit={handleSubmit}>
                {({ errors, isSubmitting, isValid, handleChange, status, touched }) => {
                    // Use custom is_valid value as isValid doesn't work.
                    const is_valid = is_buyer ? Object.keys(errors).length === 0 : isValid;
                    return (
                        <Form noValidate>
                            <ThemedScrollbars height='307px'>
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
                                            <p className='buy-sell__popup-info--text'>{ad.display_payment_method}</p>
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
                                                        const amount = isNaN(e.target.value) ? 0 : e.target.value;
                                                        setTotalAmount(
                                                            formatMoney(
                                                                ad.transaction_currency,
                                                                amount * ad.price_rate,
                                                                true,
                                                                ad.transaction_currency_decimals
                                                            )
                                                        );
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
                                                {total_amount} {ad.transaction_currency}
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
                                                            has_character_counter
                                                            max_characters={300}
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
                                                            has_character_counter
                                                            max_characters={300}
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
                                <Button.Group>
                                    <Button secondary type='button' onClick={handleClose}>
                                        {localize('Cancel')}
                                    </Button>
                                    <Button is_disabled={isSubmitting || !is_valid} primary>
                                        {localize('Confirm')}
                                    </Button>
                                </Button.Group>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

BuySellForm.propTypes = {
    ad: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default BuySellForm;
