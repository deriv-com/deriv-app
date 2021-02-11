import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Text } from '@deriv/components';
import { getRoundedNumber, getFormattedText, isDesktop, isMobile, useIsMounted } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';

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

const BuySellForm = observer(props => {
    const isMounted = useIsMounted();
    const { buy_sell_store } = useStores();

    buy_sell_store.setFormProps(props);

    const { setPageFooterParent } = props;
    const {
        advertiser_details,
        description,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        price,
    } = buy_sell_store?.advert || {};

    React.useEffect(
        () => {
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

            buy_sell_store.setInitialReceiveAmount();

            if (buy_sell_store.is_sell_advert) {
                buy_sell_store.getAdvertiserInfo();
            }

            return () => {
                disposeReceiveAmountReaction();
            };
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

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
            initialErrors={
                buy_sell_store.is_sell_advert && !buy_sell_store.has_payment_info
                    ? { contact_info: true, payment_info: true }
                    : {}
            }
            onSubmit={(...args) => {
                buy_sell_store.handleSubmit(() => isMounted(), ...args);
            }}
        >
            {({ errors, isSubmitting, isValid, setFieldValue, submitForm, touched, values }) => {
                buy_sell_store.form_props.setIsSubmitDisabled(!isValid || isSubmitting);
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
                                <div className='buy-sell__modal-field-wrapper'>
                                    <div className='buy-sell__modal-field'>
                                        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                                            {buy_sell_store.is_buy_advert ? (
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
                                            <BuySellFormReceiveAmount
                                                is_sell_advert={buy_sell_store.is_sell_advert}
                                                local_currency={local_currency}
                                                receive_amount={buy_sell_store.receive_amount}
                                            />
                                        </div>
                                    )}
                                </div>
                                {buy_sell_store.is_sell_advert && (
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
                                                        initial_character_count={buy_sell_store.payment_info.length}
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
});

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

export default BuySellForm;
