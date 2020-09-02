import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Icon, Input, Button, ThemedScrollbars } from '@deriv/components';
import { formatMoney, getDecimalPlaces, getRoundedNumber, hasCorrectDecimalPlaces } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import IconClose from 'Assets/icon-close.jsx';
import FormError from '../form/error.jsx';

const BuySellForm = ({ advert, handleClose, handleConfirm }) => {
    const {
        counterparty_type,
        description,
        type,
        local_currency,
        account_currency,
        min_order_amount_limit,
        min_order_amount_limit_display,
        max_order_amount_limit,
        max_order_amount_limit_display,
        price,
        price_display,
        contact_info,
        payment_info,
        id,
    } = advert;
    const { name: advertiser_name } = advert.advertiser_details;
    // A user creates a sell order on a buy advert. Leave
    // below line for extra context.
    // const is_buy_advert = counterparty_type === 'buy';
    const is_sell_advert = counterparty_type === 'sell';
    const is_buy_order = type === 'buy';
    const is_sell_order = type === 'sell';

    const initial_values = {
        amount: min_order_amount_limit,
        receive_amount: getRoundedNumber(min_order_amount_limit * price, local_currency),
        // For sell adverts we require extra information.
        ...(is_sell_advert && {
            contact_info,
            payment_info,
        }),
    };

    const handleSubmit = async (values, { setStatus, setSubmitting }) => {
        console.log({ values, setStatus, setSubmitting });
        setStatus({ error_message: '' });

        const order = await requestWS({
            p2p_order_create: 1,
            advert_id: id,
            amount: values.amount,
            // Validate extra information for sell adverts.
            ...(is_sell_advert && {
                contact_info: values.contact_info,
                payment_info: values.payment_info,
            }),
        });

        if (!order.error) {
            const response = await requestWS({ p2p_order_info: 1, id: order.p2p_order_create.id });
            const { p2p_order_info } = response;

            handleClose();
            handleConfirm(p2p_order_info);
        } else {
            setStatus({ error_message: order.error.message });
        }

        setSubmitting(false);
    };

    const validatePopup = values => {
        const validations = {
            amount: [
                v => !!v,
                v => v >= min_order_amount_limit,
                v => v <= max_order_amount_limit,
                v => countDecimalPlaces(v) <= getDecimalPlaces(account_currency),
            ],
            receive_amount: [v => !!v, v => countDecimalPlaces(v) <= getDecimalPlaces(local_currency)],
        };

        if (is_buy_order) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            validations.payment_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const display_min_amount = formatMoney(account_currency, min_order_amount_limit, true);
        const display_max_amount = formatMoney(account_currency, max_order_amount_limit, true);

        const common_messages = [
            localize('Enter a valid amount'),
            localize('Minimum is {{value}} {{currency}}', { currency: account_currency, value: display_min_amount }),
            localize('Maximum is {{value}} {{currency}}', { currency: account_currency, value: display_max_amount }),
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
        <React.Fragment>
            <div className='buy-sell__popup-header'>
                <div className='buy-sell__popup-header_wrapper'>
                    <h2 className='buy-sell__popup-header--title'>{`${type} ${account_currency}`}</h2>
                    <IconClose className='buy-sell__popup-close_icon' onClick={handleClose} />
                </div>
            </div>
            <Formik validate={validatePopup} initialValues={initial_values} onSubmit={handleSubmit}>
                {({ errors, isSubmitting, isValid, status, touched, setFieldValue, values }) => {
                    const handleAmountChange = async (event, field_name) => {
                        const is_amount_field = field_name === 'amount';
                        const other_field_name = is_amount_field ? 'receive_amount' : 'amount';

                        if (event.target.value === '') {
                            await setFieldValue(field_name, '');
                            await setFieldValue(other_field_name, '');
                            return;
                        }

                        if (
                            !hasCorrectDecimalPlaces(
                                is_amount_field ? account_currency : local_currency,
                                event.target.value
                            )
                        ) {
                            return;
                        }

                        if (field_name === 'amount') {
                            const input_amount = getRoundedNumber(event.target.value, account_currency);
                            const buy_or_sell_amount = getRoundedNumber(input_amount);
                            const receive_amount = getRoundedNumber(input_amount * price, account_currency);
                            await setFieldValue(field_name, buy_or_sell_amount);
                            await setFieldValue(other_field_name, receive_amount);
                        } else if (field_name === 'receive_amount') {
                            const input_amount = getRoundedNumber(event.target.value, local_currency);
                            const buy_or_sell_amount = getRoundedNumber(input_amount / price, local_currency);
                            const receive_amount = getRoundedNumber(input_amount, local_currency);
                            await setFieldValue(field_name, receive_amount);
                            await setFieldValue(other_field_name, buy_or_sell_amount);
                        }
                    };

                    // Use custom is_valid value as isValid doesn't work.
                    const is_valid = is_buy_order ? Object.keys(errors).length === 0 : isValid;
                    return (
                        <Form noValidate>
                            <ThemedScrollbars height='307px'>
                                <div className='buy-sell__popup-content'>
                                    <div className='buy-sell__popup-field_wrapper'>
                                        <div className='buy-sell__popup-field'>
                                            <span className='buy-sell__popup-info--title'>
                                                {is_buy_order ? localize('Seller') : localize('Buyer')}
                                            </span>
                                            <p className='buy-sell__popup-info--text'>{advertiser_name}</p>
                                        </div>
                                        <div className='buy-sell__popup-field'>
                                            <span className='buy-sell__popup-info--title'>
                                                {localize('Rate (1 {{ currency }})', { currency: account_currency })}
                                            </span>
                                            <p className='buy-sell__popup-info--text'>
                                                {price_display} {local_currency}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='buy-sell__popup-field_wrapper'>
                                        <div className='buy-sell__popup-field'>
                                            <span className='buy-sell__popup-info--title'>
                                                {is_buy_order
                                                    ? localize("Seller's instructions")
                                                    : localize("Buyer's instructions")}
                                            </span>
                                            {description.split('\n').map((text, idx) => (
                                                <p className='buy-sell__popup-info--text' key={idx}>
                                                    {text || '-'}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
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
                                                                min: min_order_amount_limit_display,
                                                                max: max_order_amount_limit_display,
                                                                currency: account_currency,
                                                            }}
                                                        />
                                                    }
                                                    className='buy-sell__popup-field'
                                                    trailing_icon={
                                                        <span className='buy-sell__popup-field--trailing'>
                                                            {account_currency}
                                                        </span>
                                                    }
                                                    onChange={e => handleAmountChange(e, field.name)}
                                                    required
                                                    value={values.amount}
                                                />
                                            )}
                                        </Field>
                                        <div className='buy-sell__popup-conversion-icon'>
                                            <Icon icon='IcCashierTwoWayConversion' size={16} />
                                        </div>
                                        <Field name='receive_amount'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    error={errors.receive_amount}
                                                    label={
                                                        is_buy_order ? localize('You receive') : localize("You'll send")
                                                    }
                                                    className='buy-sell__popup-field'
                                                    trailing_icon={
                                                        <span className='buy-sell__popup-field--trailing'>
                                                            {local_currency}
                                                        </span>
                                                    }
                                                    onChange={e => handleAmountChange(e, field.name)}
                                                    required
                                                    value={values.receive_amount}
                                                />
                                            )}
                                        </Field>
                                    </div>

                                    {is_sell_order && (
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
                                    <Button secondary type='button' onClick={handleClose} large>
                                        {localize('Cancel')}
                                    </Button>
                                    <Button is_disabled={isSubmitting || !is_valid} primary large type='submit'>
                                        {localize('Confirm')}
                                    </Button>
                                </Button.Group>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
};

BuySellForm.propTypes = {
    advert: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default BuySellForm;
