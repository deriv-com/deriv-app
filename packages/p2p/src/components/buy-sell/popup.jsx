import React, { Fragment, Component }      from 'react';
import PropTypes                           from 'prop-types';
import { Formik, Field, Form }             from 'formik';
import { Input, Button, ThemedScrollbars } from 'deriv-components';
import IconBack                            from 'Assets/icon-back.jsx';
import IconClose                           from 'Assets/icon-close.jsx';
import { localize }                        from 'Components/i18next';

class Popup extends Component {

    handleSubmit = (formik_vars, { setSubmitting }) => {
        // TODO: [p2p-fix-api] call order create api
        // eslint-disable-next-line no-console
        console.log(this.state);
        // eslint-disable-next-line no-console
        console.log(formik_vars);
        setSubmitting(false);
    }

    getInitialValues = (is_buy) => {
        const { ad } = this.props;
        const amount_currency = ad.min_transaction;
        const amount_asset = ad.min_transaction / ad.fix_price;
        const buy_initial_values = {
            initial_send    : amount_currency,
            initial_receive : amount_asset,
            send_currency   : ad.currency,
            receive_currency: ad.asset,
        };
        const sell_initial_values = {
            initial_send    : amount_asset,
            initial_receive : amount_currency,
            send_currency   : ad.asset,
            receive_currency: ad.currency,
        };

        return is_buy ? buy_initial_values : sell_initial_values;
    }

    calculateReceiveAmount = (send_amount, is_buy) => {
        const { ad } = this.props;
        return is_buy ? send_amount / ad.fix_price : send_amount * ad.fix_price;
    };

    calculateSendAmount = (receive_amount, is_buy) => {
        const { ad } = this.props;
        return is_buy ? receive_amount * ad.fix_price : receive_amount / ad.fix_price;
    };

    render() {
        const { ad, onCancel } = this.props;
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
                            <h2 className='buy-sell__popup-header--title'>{`${ad.type} ${ad.asset}`}</h2>
                            <IconClose className='buy-sell__popup-close_icon' onClick={onCancel} />
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
                                            <span className='buy-sell__popup-info--title'>{localize('Payment method')}</span>
                                            <p className='buy-sell__popup-info--text'>{ad.payment_method}</p>
                                        </div>
                                        <div className='buy-sell__popup-info'>
                                            <span className='buy-sell__popup-info--title'>{localize('Advertiser notes')}</span>
                                            <p className='buy-sell__popup-info--text'>{ad.advertiser_note}</p>
                                        </div>

                                    </div>
                                </ThemedScrollbars>
                                <div className='buy-sell__popup-footer'>
                                    <Button secondary type='button' onClick={onCancel}>{localize('Cancel')}</Button>
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
        const { initial_send, initial_receive } = this.getInitialValues(is_buy);

        const validations = {
            send: [
                v => !!v,
                v => v >= initial_send,
            ],
            receive: [
                v => !!v,
                v => v >= initial_receive,
            ],
        };

        const mappedKey = {
            send   : localize('Send'),
            receive: localize('Receive'),
        };

        const common_messages  = (field_name) => ([
            localize('{{field_name}} is required', { field_name }),
            localize('{{field_name}} below minimum value', { field_name }),
        ]);

        const errors    = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));

                if (error_index !== -1) {
                    switch (key) {
                        default:
                            errors[key] = common_messages(mappedKey[key])[error_index];
                    }
                }
            });

        return errors;
    };
}

Popup.propTypes = {
    ad      : PropTypes.object,
    onCancel: PropTypes.func,
};

export default Popup;
