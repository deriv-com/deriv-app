import classNames from 'classnames';
import React from 'react';
import { Formik, Field, Form } from 'formik';
import { reaction } from 'mobx';
import { HintBox, Icon, Input, Text } from '@deriv/components';
import { getDecimalPlaces, isDesktop, isMobile, useIsMounted } from '@deriv/shared';
import { observer, Observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import BuySellFormReceiveAmount from 'Components/buy-sell/buy-sell-form/buy-sell-form-receive-amount';
import PaymentMethodCard from 'Components/my-profile/payment-methods/payment-method-card/payment-method-card.jsx';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { generateEffectiveRate, setDecimalPlaces, roundOffDecimal, removeTrailingZeros } from 'Utils/format-value';
import { countDecimalPlaces } from 'Utils/string';
import { floatingPointValidator } from 'Utils/validations';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const BuySellForm = props => {
    const isMounted = useIsMounted();
    const { advertiser_page_store, buy_sell_store, floating_rate_store, general_store, my_profile_store } = useStores();
    const { setFormErrorMessage } = advertiser_page_store;
    const {
        account_currency,
        advert,
        form_props,
        handleSubmit,
        is_buy_advert,
        is_sell_advert,
        local_currency,
        payment_method_ids,
        receive_amount,
        setFormProps,
        setHasPaymentMethods,
        setInitialReceiveAmount,
        setPaymentMethodIds,
        setReceiveAmount,
        validatePopup,
    } = buy_sell_store;
    const { exchange_rate, is_market_rate_changed } = floating_rate_store;
    const { advertiser_buy_limit, advertiser_sell_limit, balance, contact_info, payment_info } = general_store;
    const {
        advertiser_payment_methods_list,
        advertiser_has_payment_methods,
        getPaymentMethodsList,
        setSelectedPaymentMethod,
        setSelectedPaymentMethodDisplayName,
        setShouldShowAddPaymentMethodForm,
    } = my_profile_store;
    const { showModal } = useModalManagerContext();
    const { setPageFooterParent } = props;
    const {
        advertiser_details,
        description,
        effective_rate: market_rate,
        local_currency: advert_local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        payment_method_names,
        price,
        rate,
        rate_type,
    } = advert || {};
    const [input_amount, setInputAmount] = React.useState(min_order_amount_limit);
    const should_disable_field =
        !is_buy_advert && (parseFloat(balance) === 0 || parseFloat(balance) < min_order_amount_limit);
    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
        cursor: should_disable_field ? 'not-allowed' : 'pointer',
    };
    const { effective_rate, display_effective_rate } = generateEffectiveRate({
        price,
        rate_type,
        rate,
        advert_local_currency,
        exchange_rate,
        market_rate,
    });
    const calculated_rate = removeTrailingZeros(roundOffDecimal(effective_rate, setDecimalPlaces(effective_rate, 6)));
    const [selected_methods, setSelectedMethods] = React.useState([]);

    setFormProps(props);

    React.useEffect(
        () => {
            setShouldShowAddPaymentMethodForm(false);
            setSelectedPaymentMethod('');
            setSelectedPaymentMethodDisplayName('');
            setHasPaymentMethods(!!payment_method_names);

            const disposeReceiveAmountReaction = reaction(
                () => receive_amount,
                () => {
                    if (isMobile() && typeof setPageFooterParent === 'function') {
                        setPageFooterParent(<BuySellFormReceiveAmount />);
                    }
                }
            );

            if (!advertiser_has_payment_methods) {
                getPaymentMethodsList();
            }

            setFormErrorMessage('');
            const disposeRateChangeModal = reaction(
                () => is_market_rate_changed,
                () => {
                    if (is_market_rate_changed && rate_type === ad_type.FLOAT) {
                        showModal({
                            key: 'RateChangeModal',
                            props: {
                                currency: local_currency,
                            },
                        });
                    }
                }
            );
            setInitialReceiveAmount(calculated_rate);

            return () => {
                setPaymentMethodIds([]);
                disposeReceiveAmountReaction();
                disposeRateChangeModal();
            };
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    React.useEffect(() => {
        const updated_receive_amount = input_amount * calculated_rate;
        setReceiveAmount(updated_receive_amount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input_amount, effective_rate]);

    const onClickPaymentMethodCard = payment_method => {
        if (!should_disable_field) {
            if (!payment_method_ids.includes(payment_method.ID)) {
                if (payment_method_ids.length < 3) {
                    payment_method_ids.push(payment_method.ID);
                    setSelectedMethods([...selected_methods, payment_method.ID]);
                }
            } else {
                setPaymentMethodIds(
                    payment_method_ids.filter(payment_method_id => payment_method_id !== payment_method.ID)
                );
                setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
            }
        }
    };

    const getAdvertiserMaxLimit = () => {
        if (is_buy_advert) {
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
                validate={validatePopup}
                validateOnMount={!should_disable_field}
                initialValues={{
                    amount: min_order_amount_limit,
                    contact_info,
                    payment_info,
                    rate: rate_type === ad_type.FLOAT ? effective_rate : null,
                }}
                initialErrors={is_sell_advert ? { contact_info: true } : {}}
                onSubmit={(...args) => handleSubmit(() => isMounted(), ...args)}
            >
                {({ errors, isSubmitting, isValid, setFieldValue, submitForm, touched }) => {
                    form_props.setIsSubmitDisabled(
                        !isValid ||
                            isSubmitting ||
                            (is_sell_advert && payment_method_names && selected_methods.length < 1)
                    );
                    form_props.setSubmitForm(submitForm);

                    return (
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
                                            {advertiser_details.name}
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
                                            {display_effective_rate} {advert_local_currency}
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
                                            {is_buy_advert ? (
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
                                {is_sell_advert && payment_method_names && (
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
                                                {advertiser_has_payment_methods ? (
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
                                            transaction_type: is_buy_advert ? 'buy' : 'sell',
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
                                                        ad_type: is_buy_advert ? 'Buy amount' : 'Sell amount',
                                                    })}
                                                    hint={
                                                        <Localize
                                                            i18n_default_text='Limit: {{min}}–{{max}} {{currency}}'
                                                            values={{
                                                                min: min_order_amount_limit_display,
                                                                max: getAdvertiserMaxLimit(),
                                                                currency: account_currency,
                                                            }}
                                                        />
                                                    }
                                                    is_relative_hint
                                                    className='buy-sell__modal-field'
                                                    trailing_icon={
                                                        <Text color='less-prominent' line-height='m' size='xs'>
                                                            {account_currency}
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
                                                            getDecimalPlaces(account_currency)
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
                                {is_sell_advert && (
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
                                                            initial_character_count={payment_info.length}
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
                                                        initial_character_count={contact_info.length}
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

export default observer(BuySellForm);
