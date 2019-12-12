import React, {
    Fragment,
    Component }        from 'react';
import PropTypes       from 'prop-types';
import {
    Formik,
    Field,
    Form }             from 'formik';
import {
    Input,
    Button,
    ThemedScrollbars } from 'deriv-components';
import IconBack        from 'Assets/icon-back.jsx';
import IconClose       from 'Assets/icon-close.jsx';
import { localize }    from 'Components/i18next';
import { WS }          from 'Utils/websocket';
import FormError       from '../form/error.jsx';

class Popup extends Component {
    handleSubmit = async (values, { setStatus, setSubmitting }) => {
        const { ad } = this.props;
        setStatus({ error_message: '' });

        const order = await WS({ p2p_order_create: 1, amount: values.send, offer_id: ad.offer_id });

        if (!order.error) {
            const order_info = await WS({ p2p_order_info: 1, order_id: order.order_id });
            this.props.handleConfirm(order_info);
            setSubmitting(false);
            this.props.handleClose();
        } else {
            setSubmitting(false);
            setStatus({ error_message: order.error.message });
        }

    };

    getInitialValues = (is_buy) => {
        const { ad } = this.props;

        const amount_asset = +((ad.min_transaction / ad.price_rate).toFixed(ad.transaction_currency_decimals));

        const buy_initial_values = {
            initial_receive : amount_asset,
            initial_send    : ad.min_transaction,
            receive_currency: ad.offer_currency,
            receive_decimals: ad.offer_currency_decimals,
            send_currency   : ad.transaction_currency,
            send_decimals   : ad.transaction_currency_decimals,
        };
        const sell_initial_values = {
            initial_receive : ad.min_transaction,
            initial_send    : amount_asset,
            receive_currency: ad.transaction_currency,
            receive_decimals: ad.transaction_currency_decimals,
            send_currency   : ad.offer_currency,
            send_decimals   : ad.offer_currency_decimals,
        };

        return is_buy ? buy_initial_values : sell_initial_values;
    }

    calculateReceiveAmount = (send_amount, is_buy) => {
        const { ad } = this.props;
        return is_buy ?
            +((send_amount / ad.price_rate).toFixed(ad.transaction_currency_decimals))
            :
            +((send_amount * ad.price_rate).toFixed(ad.transaction_currency_decimals));
    };

    calculateSendAmount = (receive_amount, is_buy) => {
        const { ad } = this.props;
        return is_buy ?
            +((receive_amount * ad.price_rate).toFixed(ad.transaction_currency_decimals))
            :
            +((receive_amount / ad.price_rate).toFixed(ad.transaction_currency_decimals));
    };

    render() {
        const { ad, handleClose } = this.props;
        const is_buy = ad.type === 'buy';
        const {
            initial_send,
            initial_receive,
            send_currency,
            receive_currency,
        } = this.getInitialValues(is_buy);

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
                        initialValues={{ send: initial_send, receive: initial_receive }}
                        onSubmit={this.handleSubmit}
                    >
                        {({
                            errors,
                            isSubmitting,
                            setFieldValue,
                            handleChange,
                            status,
                        }) => (
                            <Form noValidate>
                                <ThemedScrollbars
                                    autoHide
                                    style={{ height: '307px' }}
                                >
                                    <div className='buy-sell__popup-content'>
                                        <div className='buy-sell__popup-field_wrapper'>
                                            <Field name='send'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='number'
                                                        error={errors.send}
                                                        label={localize('Send')}
                                                        className='buy-sell__popup-field'
                                                        placeholder={localize('Send amount')}
                                                        trailing_icon={<span className='buy-sell__popup-field--trailing'>{send_currency}</span>}
                                                        onChange={(e) => {
                                                            const send = isNaN(e.target.value) ? 0 : e.target.value;
                                                            const receive_amount =
                                                                this.calculateReceiveAmount(send, is_buy);

                                                            setFieldValue('receive', receive_amount);
                                                            handleChange(e);
                                                        }}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <IconBack className='buy-sell__popup-field--icon' />
                                            <Field name='receive'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='number'
                                                        error={errors.receive}
                                                        label={localize('Receive')}
                                                        className='buy-sell__popup-field'
                                                        placeholder={localize('Receive amount')}
                                                        trailing_icon={<span className='buy-sell__popup-field--trailing'>{receive_currency}</span>}
                                                        onChange={(e) => {
                                                            const receive =
                                                                isNaN(e.target.value) ? 0 : e.target.value;
                                                            const send_amount =
                                                                this.calculateSendAmount(receive, is_buy);

                                                            setFieldValue('send', send_amount);
                                                            handleChange(e);
                                                        }}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='buy-sell__popup-info'>
                                            <span className='buy-sell__popup-info--title'>{ad.type === 'buy' ? localize('Seller') : localize('Buyer')}</span>
                                            <p className='buy-sell__popup-info--text'>{ad.advertiser}</p>
                                        </div>
                                        <div className='buy-sell__popup-info'>
                                            <span className='buy-sell__popup-info--title'>{localize('Advertiser notes')}</span>
                                            <p className='buy-sell__popup-info--text'>{ad.advertiser_note}</p>
                                        </div>

                                    </div>
                                </ThemedScrollbars>
                                <div className='buy-sell__popup-footer'>
                                    {status && status.error_message && <FormError message={status.error_message} />}
                                    <Button secondary type='button' onClick={handleClose}>{localize('Cancel')}</Button>
                                    <Button is_disabled={isSubmitting} primary>{localize('Confirm')}</Button>
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
        const is_buy = ad.type === 'buy';
        const {
            initial_send,
            initial_receive,
            receive_decimals,
            send_decimals,
        } = this.getInitialValues(is_buy);

        const validations = {
            send: [
                v => !!v,
                v => v >= initial_send,
                v => (((v.toString().split('.') || [])[1]) || []).length <= send_decimals,
            ],
            receive: [
                v => !!v,
                v => v >= initial_receive,
                v => (((v.toString().split('.') || [])[1]) || []).length <= receive_decimals,
            ],
        };

        const mappedKey = {
            send   : localize('Send'),
            receive: localize('Receive'),
        };

        const common_messages  = (field_name, decimals) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('{{field_name}} below minimum value', { field_name }),
            localize('{{field_name}} is above {{decimals}} decimals', { field_name, decimals }),
        ]);

        const errors    = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => {
                    return !v(values[key]);
                });

                if (error_index !== -1) {
                    switch (key) {
                        default: {
                            const decimals = key === 'send' ? send_decimals : receive_decimals;
                            errors[key] = common_messages(mappedKey[key], decimals)[error_index];
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
