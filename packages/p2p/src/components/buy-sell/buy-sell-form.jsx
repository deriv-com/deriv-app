import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { HintBox, Icon, Input, Text } from '@deriv/components';
import { getDecimalPlaces, isDesktop, isMobile, useIsMounted } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer, Observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import BuySellFormReceiveAmount from './buy-sell-form-receive-amount.jsx';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card/payment-method-card.jsx';
import { floatingPointValidator } from 'Utils/validations';
import { countDecimalPlaces } from 'Utils/string';
import { generateEffectiveRate, setDecimalPlaces, roundOffDecimal, removeTrailingZeros } from 'Utils/format-value';

const BuySellForm = props => {
    const isMounted = useIsMounted();
    const { advertiser_page_store, buy_sell_store, floating_rate_store, general_store, my_profile_store } = useStores();
    const [selected_methods, setSelectedMethods] = React.useState([]);
    buy_sell_store.setFormProps(props);

    const { setPageFooterParent } = props;
    const {
        advertiser_details,
        description,
        effective_rate: market_rate,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        payment_method_names,
        price,
        rate,
        rate_type,
    } = buy_sell_store?.advert || {};
    const [input_amount, setInputAmount] = React.useState(min_order_amount_limit);

    const { advertiser_buy_limit, advertiser_sell_limit, balance } = general_store;

    const should_disable_field =
        !buy_sell_store.is_buy_advert && (parseFloat(balance) === 0 || parseFloat(balance) < min_order_amount_limit);

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
        cursor: should_disable_field ? 'not-allowed' : 'pointer',
    };

    const { effective_rate, display_effective_rate } = generateEffectiveRate({
        price,
        rate_type,
        rate,
        local_currency,
        exchange_rate: floating_rate_store.exchange_rate,
        market_rate,
    });

    const calculated_rate = removeTrailingZeros(roundOffDecimal(effective_rate, setDecimalPlaces(effective_rate, 6)));

    React.useEffect(
        () => {
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
            my_profile_store.setSelectedPaymentMethod('');
            my_profile_store.setSelectedPaymentMethodDisplayName('');
            buy_sell_store.setHasPaymentMethods(!!payment_method_names);

            const disposeReceiveAmountReaction = reaction(
                () => buy_sell_store.receive_amount,
                () => {
                    if (isMobile() && typeof setPageFooterParent === 'function') {
                        setPageFooterParent(<BuySellFormReceiveAmount />);
                    }
                }
            );

            if (!my_profile_store.advertiser_has_payment_methods) {
                my_profile_store.getPaymentMethodsList();
            }

            advertiser_page_store.setFormErrorMessage('');
            buy_sell_store.setShowRateChangePopup(rate_type === ad_type.FLOAT);
            buy_sell_store.setInitialReceiveAmount(calculated_rate);

            return () => {
                buy_sell_store.payment_method_ids = [];
                disposeReceiveAmountReaction();
            };
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    React.useEffect(() => {
        const receive_amount = input_amount * calculated_rate;
        buy_sell_store.setReceiveAmount(receive_amount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input_amount, effective_rate]);

    const onClickPaymentMethodCard = payment_method => {
        if (!should_disable_field) {
            if (!buy_sell_store.payment_method_ids.includes(payment_method.ID)) {
                if (buy_sell_store.payment_method_ids.length < 3) {
                    buy_sell_store.payment_method_ids.push(payment_method.ID);
                    setSelectedMethods([...selected_methods, payment_method.ID]);
                }
            } else {
                buy_sell_store.payment_method_ids = buy_sell_store.payment_method_ids.filter(
                    payment_method_id => payment_method_id !== payment_method.ID
                );
                setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
            }
        }
    };

    const getAdvertiserMaxLimit = () => {
        if (buy_sell_store.is_buy_advert) {
            if (advertiser_buy_limit < max_order_amount_limit_display) return roundOffDecimal(advertiser_buy_limit);
        } else if (advertiser_sell_limit < max_order_amount_limit_display)
            return roundOffDecimal(advertiser_sell_limit);
        return max_order_amount_limit_display;
    };

    return (
        <React.Fragment>
            {rate_type === ad_type.FLOAT && !should_disable_field && (
                <div className='buy-sell__modal-hintbox'>
                    <HintBox
                        icon='IcAlertInfo'
                        message={
                            <Text as='p' size='xxxs' color='prominent' line_height='xs'>
                                <Localize i18n_default_text="If the market rate changes from the rate shown here, we won't be able to process your order." />
                            </Text>
                        }
                        is_info
                    />
                </div>
            )}
            <Formik
                enableReinitialize
                validate={buy_sell_store.validatePopup}
                validateOnMount={!should_disable_field}
                initialValues={{
                    amount: min_order_amount_limit,
                    contact_info: buy_sell_store.contact_info,
                    payment_info: buy_sell_store.payment_info,
                    rate: rate_type === ad_type.FLOAT ? effective_rate : null,
                }}
                initialErrors={buy_sell_store.is_sell_advert ? { contact_info: true } : {}}
                onSubmit={(...args) => buy_sell_store.handleSubmit(() => isMounted(), ...args)}
            >
                {({ errors, isSubmitting, isValid, setFieldValue, submitForm, touched }) => {
                    buy_sell_store.form_props.setIsSubmitDisabled(
                        !isValid ||
                            isSubmitting ||
                            (buy_sell_store.is_sell_advert && payment_method_names && selected_methods.length < 1)
                    );
                    buy_sell_store.form_props.setSubmitForm(submitForm);

                    return (
                        <Form noValidate>
                            <div className='buy-sell__modal-content'>
                                <div className='buy-sell__modal-field-wrapper'>
                                    <div className='buy-sell__modal-field'>
                                        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                                            {buy_sell_store.is_buy_advert ? (
                                                <Localize i18n_default_text='Seller' />
                                            ) : (
                                                <Localize i18n_default_text='Buyer' />
                                            )}
                                        </Text>
                                        <Text as='p' color='general' line_height='m' size='xs'>
                                            {advertiser_details.name}
                                        </Text>
                                    </div>
                                    <div className='buy-sell__modal-field'>
                                        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                                            <Localize
                                                i18n_default_text='Rate (1 {{ currency }})'
                                                values={{ currency: buy_sell_store.account_currency }}
                                            />
                                        </Text>
                                        <Text as='p' color='general' line_height='m' size='xs'>
                                            {display_effective_rate} {local_currency}
                                        </Text>
                                    </div>
                                </div>
                                <div className='buy-sell__modal-payment-method--container'>
                                    {payment_method_names && (
                                        <Text
                                            as='p'
                                            className='buy-sell__modal-payment-method--title'
                                            color='less-prominent'
                                            line_height='m'
                                            size='xxs'
                                        >
                                            <Localize i18n_default_text='Payment methods' />
                                        </Text>
                                    )}
                                    {payment_method_names &&
                                        payment_method_names.map((payment_method, key) => {
                                            const method = payment_method.replace(/\s|-/gm, '');

                                            if (method === 'BankTransfer' || method === 'Other') {
                                                return (
                                                    <div className='buy-sell__modal-payment-method--row' key={key}>
                                                        <Icon
                                                            className='buy-sell__modal-payment-method--icon'
                                                            icon={`IcCashier${method}`}
                                                            size={16}
                                                        />
                                                        <Text as='p' color='general' line_height='m' size='xs'>
                                                            {payment_method}
                                                        </Text>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className='buy-sell__modal-payment-method--row' key={key}>
                                                    <Icon
                                                        className='buy-sell__modal-payment-method--icon'
                                                        icon='IcCashierEwallet'
                                                        size={16}
                                                    />
                                                    <Text as='p' color='general' line_height='m' size='xs'>
                                                        {payment_method}
                                                    </Text>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className='buy-sell__modal-field-wrapper'>
                                    <div className='buy-sell__modal-field'>
                                        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                                            {buy_sell_store.is_buy_advert ? (
                                                <Localize i18n_default_text="Seller's instructions" />
                                            ) : (
                                                <Localize i18n_default_text="Buyer's instructions" />
                                            )}
                                        </Text>
                                        {description
                                            .trim()
                                            .replace(/([\r\n]){2,}/g, '\n\n')
                                            .split('\n')
                                            .map((text, idx) => (
                                                <Text key={idx} as='p' color='general' line_height='m' size='xs'>
                                                    {text || '-'}
                                                </Text>
                                            ))}
                                    </div>
                                </div>
                                <div className='buy-sell__modal-line' />
                                {buy_sell_store.is_sell_advert && payment_method_names && (
                                    <React.Fragment>
                                        <div className='buy-sell__modal-payment-method'>
                                            <Text
                                                as='p'
                                                className='buy-sell__modal-payment-method--title'
                                                color='less-prominent'
                                                line_height='m'
                                                size='xxs'
                                            >
                                                <Localize i18n_default_text='Receive payment to' />
                                            </Text>
                                            <Text as='p' color='prominent' line_height='m' size='xxs'>
                                                {my_profile_store.advertiser_has_payment_methods ? (
                                                    <Localize i18n_default_text='You may choose up to 3.' />
                                                ) : (
                                                    <Localize i18n_default_text='To place an order, add one of the advertiser’s preferred payment methods:' />
                                                )}
                                            </Text>
                                            <Observer>
                                                {() => (
                                                    <div
                                                        className={classNames('buy-sell__modal--sell-payment-methods', {
                                                            'buy-sell__modal--sell-payment-methods--disable':
                                                                should_disable_field,
                                                        })}
                                                    >
                                                        {payment_method_names
                                                            ?.map((add_payment_method, key) => {
                                                                const {
                                                                    advertiser_payment_methods_list,
                                                                    setSelectedPaymentMethodDisplayName,
                                                                    setShouldShowAddPaymentMethodForm,
                                                                } = my_profile_store;
                                                                const matching_payment_methods =
                                                                    advertiser_payment_methods_list.filter(
                                                                        advertiser_payment_method =>
                                                                            advertiser_payment_method.display_name ===
                                                                            add_payment_method
                                                                    );
                                                                return matching_payment_methods.length > 0 ? (
                                                                    matching_payment_methods.map(payment_method => (
                                                                        <PaymentMethodCard
                                                                            is_vertical_ellipsis_visible={false}
                                                                            key={key}
                                                                            medium
                                                                            onClick={() =>
                                                                                onClickPaymentMethodCard(payment_method)
                                                                            }
                                                                            payment_method={payment_method}
                                                                            style={
                                                                                selected_methods.includes(
                                                                                    payment_method.ID
                                                                                )
                                                                                    ? style
                                                                                    : {}
                                                                            }
                                                                            disabled={should_disable_field}
                                                                        />
                                                                    ))
                                                                ) : (
                                                                    <PaymentMethodCard
                                                                        add_payment_method={add_payment_method}
                                                                        is_add
                                                                        key={key}
                                                                        medium
                                                                        onClickAdd={() => {
                                                                            if (!should_disable_field) {
                                                                                setSelectedPaymentMethodDisplayName(
                                                                                    add_payment_method
                                                                                );
                                                                                setShouldShowAddPaymentMethodForm(true);
                                                                            }
                                                                        }}
                                                                        disabled={should_disable_field}
                                                                        style={{
                                                                            cursor: should_disable_field
                                                                                ? 'not-allowed'
                                                                                : 'pointer',
                                                                        }}
                                                                    />
                                                                );
                                                            })
                                                            .sort(payment_method_card_node =>
                                                                Array.isArray(payment_method_card_node) &&
                                                                !payment_method_card_node[0].props?.is_add
                                                                    ? -1
                                                                    : 1
                                                            )}
                                                    </div>
                                                )}
                                            </Observer>
                                        </div>
                                        <div className='buy-sell__modal-line' />
                                    </React.Fragment>
                                )}
                                <div className='buy-sell__modal--input'>
                                    <Text color='less-prominent' size='xxs'>
                                        {localize('Enter {{transaction_type}} amount', {
                                            transaction_type: buy_sell_store.is_buy_advert ? 'buy' : 'sell',
                                        })}
                                    </Text>
                                    <section className='buy-sell__modal--input-field'>
                                        <Field name='amount'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    error={errors.amount}
                                                    label={localize('{{ad_type}}', {
                                                        ad_type: buy_sell_store.is_buy_advert
                                                            ? 'Buy amount'
                                                            : 'Sell amount',
                                                    })}
                                                    hint={
                                                        <Localize
                                                            i18n_default_text='Limit: {{min}}–{{max}} {{currency}}'
                                                            values={{
                                                                min: min_order_amount_limit_display,
                                                                max: getAdvertiserMaxLimit(),
                                                                currency: buy_sell_store.account_currency,
                                                            }}
                                                        />
                                                    }
                                                    is_relative_hint
                                                    className='buy-sell__modal-field'
                                                    trailing_icon={
                                                        <Text color='less-prominent' line-height='m' size='xs'>
                                                            {buy_sell_store.account_currency}
                                                        </Text>
                                                    }
                                                    onKeyDown={event => {
                                                        if (!floatingPointValidator(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    onChange={event => {
                                                        const { value } = event.target;

                                                        if (
                                                            countDecimalPlaces(value) >
                                                            getDecimalPlaces(buy_sell_store.account_currency)
                                                        ) {
                                                            setFieldValue('amount', parseFloat(input_amount));
                                                        } else {
                                                            setFieldValue('amount', parseFloat(value));
                                                            setInputAmount(value);
                                                        }
                                                    }}
                                                    required
                                                    value={input_amount}
                                                    disabled={should_disable_field}
                                                />
                                            )}
                                        </Field>
                                        {isDesktop() && (
                                            <div
                                                className={classNames('buy-sell__modal-field', {
                                                    'buy-sell__modal-field--disable': should_disable_field,
                                                })}
                                            >
                                                <BuySellFormReceiveAmount />
                                            </div>
                                        )}
                                    </section>
                                </div>
                                {buy_sell_store.is_sell_advert && (
                                    <React.Fragment>
                                        {!payment_method_names && (
                                            <div className='buy-sell__modal-field--textarea'>
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
                                                            is_relative_hint
                                                            label={localize('Your bank details')}
                                                            required
                                                            has_character_counter
                                                            initial_character_count={buy_sell_store.payment_info.length}
                                                            max_characters={300}
                                                            disabled={should_disable_field}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        )}
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
                                                        initial_character_count={buy_sell_store.contact_info.length}
                                                        max_characters={300}
                                                        disabled={should_disable_field}
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
        </React.Fragment>
    );
};

BuySellForm.propTypes = {
    advert: PropTypes.object,
    contact_info: PropTypes.string,
    form_props: PropTypes.object,
    getAdvertiserInfo: PropTypes.func,
    setIsSubmitDisabled: PropTypes.func,
    setSubmitForm: PropTypes.func,
    setPageFooterParent: PropTypes.func,
    has_payment_info: PropTypes.bool,
    is_buy_advert: PropTypes.bool,
    is_sell_advert: PropTypes.bool,
    payment_info: PropTypes.string,
    receive_amount: PropTypes.number,
    setFormProps: PropTypes.func,
    setInitialReceiveAmount: PropTypes.func,
    setReceiveAmount: PropTypes.func,
    validatePopup: PropTypes.func,
};

export default observer(BuySellForm);
