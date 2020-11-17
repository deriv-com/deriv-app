import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Text } from '@deriv/components';
import {
    formatMoney,
    getDecimalPlaces,
    getFormattedText,
    getRoundedNumber,
    isDesktop,
    isMobile,
    useIsMounted,
} from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import { buy_sell } from '../../constants/buy-sell';

const BuySellFormReceiveAmount = ({ is_sell_advert, receive_amount, local_currency }) => (
    <React.Fragment>
        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
            {is_sell_advert ? (
                <Localize i18n_default_text='You receive' />
            ) : (
                <Localize i18n_default_text="You'll send" />
            )}
        </Text>
        <Text as='p' color='general' line_height='m' size='xs' weight='bold'>
            {getFormattedText(receive_amount, local_currency)}
        </Text>
    </React.Fragment>
);

BuySellFormReceiveAmount.propTypes = {
    is_sell_advert: PropTypes.bool.isRequired,
    receive_amount: PropTypes.number.isRequired,
    local_currency: PropTypes.string.isRequired,
};

const BuySellForm = ({
    advert,
    handleClose,
    handleConfirm,
    setErrorMessage,
    setIsSubmitDisabled,
    setSubmitForm,
    setPageFooterParent,
}) => {
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
            });
        }
    }, [is_sell_advert, isMounted]);

    React.useEffect(() => {
        if (isMobile()) {
            setPageFooterParent(
                <BuySellFormReceiveAmount
                    is_sell_advert={is_sell_advert}
                    local_currency={local_currency}
                    receive_amount={receive_amount}
                />
            );
        }
    }, [is_sell_advert, local_currency, receive_amount, setPageFooterParent]);

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
                    <React.Fragment>
                        <Form noValidate>
                            <div className='buy-sell__modal-content'>
                                <div className='buy-sell__modal-field-wrapper'>
                                    <div className='buy-sell__modal-field'>
                                        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                                            {is_buy_advert ? (
                                                <Localize i18n_default_text='Seller' />
                                            ) : (
                                                <Localize i18n_default_text='Buyer' />
                                            )}
                                        </Text>
                                        <Text as='p' color='general' line_height='m' size='xs'>
                                            {advertiser_name}
                                        </Text>
                                    </div>
                                    <div className='buy-sell__modal-field'>
                                        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                                            <Localize
                                                i18n_default_text='Rate (1 {{ currency }})'
                                                values={{ currency: account_currency }}
                                            />
                                        </Text>
                                        <Text as='p' color='general' line_height='m' size='xs'>
                                            {getFormattedText(price, local_currency)}
                                        </Text>
                                    </div>
                                </div>
                                <div className='buy-sell__modal-field-wrapper'>
                                    <div className='buy-sell__modal-field'>
                                        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                                            {is_buy_advert ? (
                                                <Localize i18n_default_text="Seller's instructions" />
                                            ) : (
                                                <Localize i18n_default_text="Buyer's instructions" />
                                            )}
                                        </Text>
                                        {description.split('\n').map((text, idx) => (
                                            <Text key={idx} as='p' color='general' line_height='m' size='xs'>
                                                {text || '-'}
                                            </Text>
                                        ))}
                                    </div>
                                </div>
                                <div
                                    className={classNames('buy-sell__modal-field-wrapper', {
                                        'buy-sell__modal-field-wrapper--no-flex': isMobile(),
                                    })}
                                >
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
                                                is_relative_hint
                                                className='buy-sell__modal-field'
                                                trailing_icon={
                                                    <Text color='less-prominet' line-height='m' size='xs'>
                                                        {account_currency}
                                                    </Text>
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
                                    {isDesktop() && (
                                        <div className='buy-sell__modal-field'>
                                            <BuySellFormReceiveAmount
                                                is_sell_advert={is_sell_advert}
                                                local_currency={local_currency}
                                                receive_amount={receive_amount}
                                            />
                                        </div>
                                    )}
                                </div>
                                {is_sell_advert && (
                                    <React.Fragment>
                                        <div className='buy-sell__modal-field--textarea'>
                                            <Field name='payment_info'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='textarea'
                                                        error={touched.payment_info && errors.payment_info}
                                                        hint={localize('Bank name, account number, beneficiary name')}
                                                        is_relative_hint
                                                        label={localize('Your bank details')}
                                                        required
                                                        has_character_counter
                                                        initial_character_count={payment_info.length}
                                                        max_characters={300}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='buy-sell__modal-field--textarea'>
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
                    </React.Fragment>
                );
            }}
        </Formik>
    );
};

BuySellForm.propTypes = {
    advert: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
    setErrorMessage: PropTypes.func,
    setIsSubmitDisabled: PropTypes.func,
    setSubmitForm: PropTypes.func,
    setPageFooterParent: PropTypes.func,
};

export default BuySellForm;
