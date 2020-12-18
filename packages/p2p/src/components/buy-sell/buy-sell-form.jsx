import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input } from '@deriv/components';
import { getRoundedNumber, getFormattedText } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const BuySellForm = observer(props => {
    const { buy_sell_store } = useStores();
    buy_sell_store.setFormProps(props);

    const {
        advertiser_details,
        description,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        price,
    } = buy_sell_store?.advert;

    React.useEffect(() => {
        buy_sell_store.setInitialReceiveAmount();

        if (buy_sell_store.is_sell_advert) {
            buy_sell_store.getAdvertiserInfo();
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            validate={buy_sell_store.validatePopup}
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
            onSubmit={buy_sell_store.handleSubmit}
        >
            {({ errors, isSubmitting, isValid, setFieldValue, submitForm, touched, values }) => {
                buy_sell_store.form_props.setIsSubmitDisabled(!isValid || isSubmitting);
                buy_sell_store.form_props.setSubmitForm(submitForm);

                return (
                    <Form noValidate>
                        <div className='buy-sell__popup-content'>
                            <div className='buy-sell__popup-field-wrapper'>
                                <div className='buy-sell__popup-field'>
                                    <span className='buy-sell__popup-info--title'>
                                        {buy_sell_store.is_buy_advert ? localize('Seller') : localize('Buyer')}
                                    </span>
                                    <div className='buy-sell__popup-info--text'>{advertiser_details.name}</div>
                                </div>
                                <div className='buy-sell__popup-field'>
                                    <span className='buy-sell__popup-info--title'>
                                        {localize('Rate (1 {{ currency }})', {
                                            currency: buy_sell_store.account_currency,
                                        })}
                                    </span>
                                    <div className='buy-sell__popup-info--text'>
                                        {getFormattedText(price, local_currency)}
                                    </div>
                                </div>
                            </div>
                            <div className='buy-sell__popup-field-wrapper'>
                                <div className='buy-sell__popup-field'>
                                    <span className='buy-sell__popup-info--title'>
                                        {buy_sell_store.is_buy_advert
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
                                                        currency: buy_sell_store.account_currency,
                                                    }}
                                                />
                                            }
                                            className='buy-sell__popup-field'
                                            trailing_icon={
                                                <span className='buy-sell__popup-field--trailing'>
                                                    {buy_sell_store.account_currency}
                                                </span>
                                            }
                                            onChange={event => {
                                                if (event.target.value === '') {
                                                    setFieldValue('amount', '');
                                                    buy_sell_store.setReceiveAmount(0);
                                                    return;
                                                }

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
                                            }}
                                            required
                                            value={values.amount}
                                        />
                                    )}
                                </Field>
                                <div className='buy-sell__popup-field buy-sell__popup-field--receive-amount'>
                                    <span className='buy-sell__popup-info--title'>
                                        {buy_sell_store.is_sell_advert
                                            ? localize('You receive')
                                            : localize("You'll send")}
                                    </span>
                                    <div className='buy-sell__popup-info--text buy-sell__popup-info--strong'>
                                        {getFormattedText(buy_sell_store.receive_amount, local_currency)}
                                    </div>
                                </div>
                            </div>
                            {buy_sell_store.is_sell_advert && (
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
                                                    initial_character_count={buy_sell_store.payment_info.length}
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
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
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
