import React, {
    Fragment,
    Component }               from 'react';
import PropTypes              from 'prop-types';
import {
    Formik,
    Field,
    Form }                    from 'formik';
import {
    Input,
    Button,
    ThemedScrollbars }        from '@deriv/components';
import CurrencyUtils          from '@deriv/shared/utils/currency';
import IconClose              from 'Assets/icon-close.jsx';
import {
    localize,
    Localize }                from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS }          from 'Utils/websocket';
import FormError              from '../form/error.jsx';

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

        const order = await requestWS({
            p2p_order_create: 1,
            amount          : values.amount,
            offer_id        : ad.offer_id,
        });

        if (!order.error) {
            const order_info = await requestWS({ p2p_order_info: 1, order_id: order.p2p_order_create.order_id });
            this.props.handleConfirm(order_info);
            setSubmitting(false);
            this.props.handleClose();
        } else {
            setSubmitting(false);
            setStatus({ error_message: order.error.message });
        }

    };

    setTotalAmount = (amount) => {
        const { ad } = this.props;
        const total_amount = CurrencyUtils.formatMoney(
            ad.transaction_currency,
            +amount * ad.price_rate,
            true,
            ad.transaction_currency_decimals,
        );
        this.setState({ total_amount });
    };

    render() {
        const { ad, handleClose } = this.props;

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
                        initialValues={{ amount: ad.min_available }}
                        onSubmit={this.handleSubmit}
                    >
                        {({
                            errors,
                            isSubmitting,
                            handleChange,
                            status,
                        }) => (
                            <Form noValidate>
                                <ThemedScrollbars
                                    autoHide
                                    style={{ height: '307px' }}
                                >
                                    <div className='buy-sell__popup-content'>
                                        <div className='buy-sell__popup-info'>
                                            <span className='buy-sell__popup-info--title'>{localize('Price')}</span>
                                            <p className='buy-sell__popup-info--text'>{ad.display_price_rate}{' '}{ad.transaction_currency}</p>
                                        </div>
                                        <div className='buy-sell__popup-field_wrapper'>
                                            <div className='buy-sell__popup-field'>
                                                <span className='buy-sell__popup-info--title'>{ad.type === 'buy' ? localize('Seller') : localize('Buyer')}</span>
                                                <p className='buy-sell__popup-info--text'>{ad.advertiser_name}</p>
                                            </div>
                                            <div className='buy-sell__popup-field'>
                                                <span className='buy-sell__popup-info--title'>{localize('Payment method')}</span>
                                                <p className='buy-sell__popup-info--text'>{ad.display_payment_method}</p>
                                            </div>
                                        </div>
                                        <div className='buy-sell__popup-info buy-sell__popup-info_notes'>
                                            <span className='buy-sell__popup-info--title'>{localize('Advertiser notes')}</span>
                                            {
                                                ad.advertiser_notes.split('\n').map((text, idx) => (
                                                    <p className='buy-sell__popup-info--text' key={idx}>{text}</p>
                                                ))
                                            }
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
                                                                    min     : ad.min_available,
                                                                    max     : ad.max_available,
                                                                    currency: ad.offer_currency,
                                                                }}
                                                            />
                                                        }
                                                        className='buy-sell__popup-field'
                                                        trailing_icon={<span className='buy-sell__popup-field--trailing'>{ad.offer_currency}</span>}
                                                        onChange={(e) => {
                                                            // typing more than 15 characters will break the layout
                                                            // max doesn't disable typing, so we will use this to restrict length
                                                            if (e.target.value.length > 15) {
                                                                e.target.value = e.target.value.slice(0, 15);
                                                                return;
                                                            }
                                                            const amount = isNaN(e.target.value) ? 0 : e.target.value;
                                                            this.setTotalAmount(amount);
                                                            handleChange(e);
                                                        }}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <div className='buy-sell__popup-field'>
                                                <span className='buy-sell__popup-info--title'>{ad.type === 'buy' ? localize('You send') : localize('You receive')}</span>
                                                <p className='buy-sell__popup-info--text buy-sell__popup-info--strong'>{this.state.total_amount}{' '}{ad.transaction_currency}</p>
                                            </div>
                                        </div>
                                    </div>
                                </ThemedScrollbars>
                                <div className='buy-sell__popup-footer'>
                                    {status && status.error_message && <FormError message={status.error_message} />}
                                    <Button secondary type='button' onClick={handleClose}>{localize('Cancel')}</Button>
                                    <Button is_disabled={!!(isSubmitting || errors.amount)} primary>{localize('Confirm')}</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Fragment>
        );
    }

    validatePopup = (values) => {
        const { ad } = this.props;

        const validations = {
            amount: [
                v => !!v,
                v => v >= ad.min_available,
                v => v <= ad.max_available,
                v => countDecimalPlaces(v) <= ad.offer_currency_decimals,
            ],
        };

        const display_initial_amount =
            CurrencyUtils.formatMoney(ad.offer_currency, ad.min_available, true, ad.offer_currency_decimals);

        const display_max_amount =
            CurrencyUtils.formatMoney(ad.offer_currency, ad.max_transaction, true, ad.offer_currency_decimals);

        const common_messages = [
            localize('Enter a valid amount'),
            localize('Minimum is {{value}} {{currency}}', { currency: ad.offer_currency, value: display_initial_amount }),
            localize('Maximum is {{value}} {{currency}}', { currency: ad.offer_currency, value: display_max_amount }),
            localize('Enter a valid amount'),
        ];

        const errors = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => {
                    return !v(values[key]);
                });

                if (error_index !== -1) {
                    switch (key) {
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
    ad           : PropTypes.object,
    handleClose  : PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default Popup;
