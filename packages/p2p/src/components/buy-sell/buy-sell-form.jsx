import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input } from '@deriv/components';
import { formatMoney, getDecimalPlaces, getRoundedNumber, getFormattedText, useIsMounted } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import { buy_sell } from '../../constants/buy-sell';

const BuySellForm = ({ advert, handleClose, handleConfirm, setErrorMessage, setIsSubmitDisabled, setSubmitForm }) => {
    const isMounted = useIsMounted();

    const {
        account_currency,
        counterparty_type,
        description,
        id,
        local_currency,
        max_order_amount_limit,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        price,
    } = advert;
    const { name: advertiser_name } = advert.advertiser_details;

    const [contact_info, setContactInfo] = React.useState('');
    const [payment_info, setPaymentInfo] = React.useState('');
    const [receive_amount, setReceiveAmount] = React.useState(
        getRoundedNumber(min_order_amount_limit * price, local_currency)
    );

    // A user creates a sell order on a buy advert. Leave
    // below line for extra context.
    const is_buy_advert = counterparty_type === buy_sell.BUY;
    const is_sell_advert = counterparty_type === buy_sell.SELL;

    const initial_values = {
        amount: min_order_amount_limit,
        // For sell orders we require extra information.
        ...(is_sell_advert ? { contact_info, payment_info } : {}),
    };

    React.useEffect(() => {
        if (is_sell_advert) {
            getAdvertiserInfo();
        }
    }, []);

    const getAdvertiserInfo = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_info: 1,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { p2p_advertiser_info } = response;
                        setContactInfo(p2p_advertiser_info.contact_info);
                        setPaymentInfo(p2p_advertiser_info.payment_info);
                    } else {
                        setContactInfo('');
                        setPaymentInfo('');
                    }
                }
                resolve();
            });
        });
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        if (isMounted()) {
            setSubmitting(true);
        }

        setErrorMessage(null);

        const order = await requestWS({
            p2p_order_create: 1,
            advert_id: id,
            amount: values.amount,
            // Validate extra information for sell adverts.
            ...(is_sell_advert
                ? {
                      contact_info: values.contact_info,
                      payment_info: values.payment_info,
                  }
                : {}),
        });

        if (order.error) {
            setErrorMessage(order.error.message);
        } else {
            const response = await requestWS({ p2p_order_info: 1, id: order.p2p_order_create.id });
            handleConfirm(response.p2p_order_info);
            handleClose();
        }

        if (isMounted()) {
            setSubmitting(false);
        }
    };

    const validatePopup = values => {
        const validations = {
            amount: [
                v => !!v,
                v => v >= min_order_amount_limit,
                v => v <= max_order_amount_limit,
                v => countDecimalPlaces(v) <= getDecimalPlaces(account_currency),
            ],
        };

        if (is_sell_advert) {
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

        const getInfoMessages = field_name => [
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
                        errors[key] = getInfoMessages(mapped_key[key])[error_index];
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
        <Formik
            enableReinitialize
            validate={validatePopup}
            initialValues={initial_values}
            initialErrors={is_sell_advert ? { contact_info: true, payment_info: true } : {}}
            onSubmit={handleSubmit}
        >
            {({ errors, isSubmitting, isValid, setFieldValue, submitForm, touched, values }) => {
                setIsSubmitDisabled(!isValid || isSubmitting);
                setSubmitForm(submitForm);

                return (
                    <Form noValidate>
                        <div className='buy-sell__popup-content'>
                            <div className='buy-sell__popup-field-wrapper'>
                                <div className='buy-sell__popup-field'>
                                    <span className='buy-sell__popup-info--title'>
                                        {is_buy_advert ? localize('Seller') : localize('Buyer')}
                                    </span>
                                    <div className='buy-sell__popup-info--text'>{advertiser_name}</div>
                                </div>
                                <div className='buy-sell__popup-field'>
                                    <span className='buy-sell__popup-info--title'>
                                        {localize('Rate (1 {{ currency }})', { currency: account_currency })}
                                    </span>
                                    <div className='buy-sell__popup-info--text'>
                                        {getFormattedText(price, local_currency)}
                                    </div>
                                </div>
                            </div>
                            <div className='buy-sell__popup-field-wrapper'>
                                <div className='buy-sell__popup-field'>
                                    <span className='buy-sell__popup-info--title'>
                                        {is_buy_advert
                                            ? localize("Seller's instructions")
                                            : localize("Buyer's instructions")}
                                    </span>
                                    {description.split('\n').map((text, idx) => (
                                        <div className='buy-sell__popup-info--text' key={idx}>
                                            {text || '-'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='buy-sell__popup-field-wrapper'>
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
                                            onChange={event => {
                                                if (event.target.value === '') {
                                                    setFieldValue('amount', '');
                                                    setReceiveAmount(0);
                                                    return;
                                                }

                                                const input_amount = getRoundedNumber(
                                                    event.target.value,
                                                    account_currency
                                                );
                                                setFieldValue('amount', getRoundedNumber(input_amount));
                                                setReceiveAmount(
                                                    getRoundedNumber(input_amount * price, account_currency)
                                                );
                                            }}
                                            required
                                            value={values.amount}
                                        />
                                    )}
                                </Field>
                                <div className='buy-sell__popup-field buy-sell__popup-field--receive-amount'>
                                    <span className='buy-sell__popup-info--title'>
                                        {is_sell_advert ? localize('You receive') : localize("You'll send")}
                                    </span>
                                    <div className='buy-sell__popup-info--text buy-sell__popup-info--strong'>
                                        {getFormattedText(receive_amount, local_currency)}
                                    </div>
                                </div>
                            </div>
                            {is_sell_advert && (
                                <React.Fragment>
                                    <div className='buy-sell__popup-field--textarea'>
                                        <Field name='payment_info'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='textarea'
                                                    error={touched.payment_info && errors.payment_info}
                                                    hint={localize('Bank name, account number, beneficiary name')}
                                                    label={localize('Your bank details')}
                                                    required
                                                    has_character_counter
                                                    initial_character_count={payment_info.length}
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
                                                    initial_character_count={contact_info.length}
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

BuySellForm.propTypes = {
    advert: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default BuySellForm;
