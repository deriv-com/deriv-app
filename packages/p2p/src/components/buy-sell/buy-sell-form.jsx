import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Icon, Input, Text } from '@deriv/components';
import { getRoundedNumber, getFormattedText, isDesktop, isMobile, useIsMounted } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import BuySellFormReceiveAmount from './buy-sell-form-receive-amount.jsx';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card/payment-method-card.jsx';

const BuySellForm = props => {
    const isMounted = useIsMounted();
    const { advertiser_page_store, buy_sell_store, my_profile_store } = useStores();

    const [selected_methods, setSelectedMethods] = React.useState([]);
    buy_sell_store.setFormProps(props);

    const { setPageFooterParent } = props;
    const {
        advertiser_details,
        description,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        payment_method_names,
        price,
    } = buy_sell_store?.advert || {};

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

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
                        setPageFooterParent(
                            <BuySellFormReceiveAmount
                                is_sell_advert={buy_sell_store.is_sell_advert}
                                local_currency={local_currency}
                                receive_amount={buy_sell_store.receive_amount}
                            />
                        );
                    }
                }
            );

            if (!my_profile_store.advertiser_has_payment_methods) {
                my_profile_store.getPaymentMethodsList();
            }

            advertiser_page_store.setFormErrorMessage('');
            buy_sell_store.setInitialReceiveAmount();

            return () => {
                buy_sell_store.payment_method_ids = [];
                disposeReceiveAmountReaction();
            };
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const onClickPaymentMethodCard = payment_method => {
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
    };

    return (
        <Formik
            enableReinitialize
            validate={buy_sell_store.validatePopup}
            validateOnMount
            initialValues={{
                amount: min_order_amount_limit,
                contact_info: buy_sell_store.contact_info,
                payment_info: buy_sell_store.payment_info,
            }}
            initialErrors={buy_sell_store.is_sell_advert ? { contact_info: true } : {}}
            onSubmit={(...args) => {
                buy_sell_store.handleSubmit(() => isMounted(), ...args);
            }}
        >
            {({ errors, isSubmitting, isValid, setFieldValue, submitForm, touched, values }) => {
                buy_sell_store.form_props.setIsSubmitDisabled(
                    !isValid ||
                        isSubmitting ||
                        (buy_sell_store.is_sell_advert && payment_method_names && selected_methods.length < 1)
                );
                buy_sell_store.form_props.setSubmitForm(submitForm);

                return (
                    <React.Fragment>
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
                                            {getFormattedText(price, local_currency)}
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
                                    <div>
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
                                        <div className='buy-sell__modal--sell-payment-methods'>
                                            {payment_method_names?.map((add_payment_method, key) => {
                                                const matching_payment_methods =
                                                    my_profile_store.advertiser_payment_methods_list.filter(
                                                        pm => pm.display_name === add_payment_method
                                                    );
                                                return matching_payment_methods.length > 0 ? (
                                                    matching_payment_methods.map(payment_method => (
                                                        <PaymentMethodCard
                                                            is_vertical_ellipsis_visible={false}
                                                            key={key}
                                                            medium
                                                            onClick={() => onClickPaymentMethodCard(payment_method)}
                                                            payment_method={payment_method}
                                                            style={
                                                                selected_methods.includes(payment_method.ID)
                                                                    ? style
                                                                    : {}
                                                            }
                                                        />
                                                    ))
                                                ) : (
                                                    <PaymentMethodCard
                                                        add_payment_method={add_payment_method}
                                                        is_add={true}
                                                        key={key}
                                                        medium
                                                        onClickAdd={() => {
                                                            my_profile_store.setSelectedPaymentMethodDisplayName(
                                                                add_payment_method
                                                            );
                                                            my_profile_store.setShouldShowAddPaymentMethodForm(true);
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className='buy-sell__modal-field-wrapper'>
                                    <Field name='amount'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                type='number'
                                                error={errors.amount}
                                                label={
                                                    buy_sell_store.is_buy_advert
                                                        ? localize('Buy amount')
                                                        : localize('Sell amount')
                                                }
                                                hint={
                                                    <Localize
                                                        i18n_default_text='Limits: {{min}}–{{max}} {{currency}}'
                                                        values={{
                                                            min: min_order_amount_limit_display,
                                                            max: max_order_amount_limit_display,
                                                            currency: buy_sell_store.account_currency,
                                                        }}
                                                    />
                                                }
                                                is_relative_hint
                                                className='buy-sell__modal-field'
                                                trailing_icon={
                                                    <Text color='less-prominet' line-height='m' size='xs'>
                                                        {buy_sell_store.account_currency}
                                                    </Text>
                                                }
                                                onChange={event => {
                                                    if (event.target.value === '') {
                                                        setFieldValue('amount', '');
                                                        buy_sell_store.setReceiveAmount(0);
                                                    } else {
                                                        const input_amount = getRoundedNumber(
                                                            event.target.value,
                                                            buy_sell_store.account_currency
                                                        );

                                                        setFieldValue('amount', getRoundedNumber(input_amount));
                                                        buy_sell_store.setReceiveAmount(
                                                            getRoundedNumber(
                                                                input_amount * price,
                                                                buy_sell_store.account_currency
                                                            )
                                                        );
                                                    }
                                                }}
                                                required
                                                value={values.amount}
                                            />
                                        )}
                                    </Field>
                                    {isDesktop() && (
                                        <div className='buy-sell__modal-field'>
                                            <BuySellFormReceiveAmount />
                                        </div>
                                    )}
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
