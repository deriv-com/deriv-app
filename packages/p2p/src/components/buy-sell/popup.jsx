import React, { Fragment, Component }      from 'react';
import PropTypes                           from 'prop-types';
import { Formik, Field, Form }             from 'formik';
import { Input, Button, ThemedScrollbars } from 'deriv-components';
import { localize, Localize }              from 'deriv-translations';
import IconBack                            from '../../assets/icon-back.jsx';
import IconClose                           from '../../assets/icon-close.jsx';

class Popup extends Component {

    handleSubmit = (formik_vars, { setSubmitting }) => {
        // TODO: p2p API call to create ad
        // eslint-disable-next-line no-console
        console.log(this.state);
        // eslint-disable-next-line no-console
        console.log(formik_vars);
        setSubmitting(false)
    }

    render() { 
        const { ad, onCancel } = this.props;
        const is_buy = ad.type === 'buy';
        const amount_currency = ad.min_transaction;
        const amount_asset = ad.min_transaction / ad.fix_price;
        const initial_send = is_buy ? amount_currency : amount_asset;
        const initial_receive = is_buy ? amount_asset : amount_currency;
        const send_currency = is_buy ? ad.currency : ad.asset;
        const receive_currency = is_buy ? ad.asset : ad.currency;
        return (
            <Fragment>
                <div className='buy-sell__popup'>
                    <div className='buy-sell__popup-header'>
                        <div className="buy-sell__popup-header_wrapper">
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
                            touched,
                            errors,
                            isSubmitting,
                            setFieldValue,
                            handleChange
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
                                                    placeholder='Send amount'
                                                    trailing_icon={<span className='buy-sell__popup-field--trailing'>{send_currency}</span>}
                                                    onChange={(e) => {
                                                        const send = isNaN(e.target.value) ? 0 : e.target.value;
                                                        const receive_amount = is_buy ? send / ad.fix_price : send * ad.fix_price;

                                                        setFieldValue('receive', receive_amount)
                                                        handleChange(e)
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
                                                    placeholder='Receive amount'
                                                    trailing_icon={<span className='buy-sell__popup-field--trailing'>{receive_currency}</span>}
                                                    onChange={(e) => {
                                                        const receive = isNaN(e.target.value) ? 0 : e.target.value;
                                                        const send_amount = is_buy ? receive * ad.fix_price : receive / ad.fix_price;

                                                        setFieldValue('send', send_amount)
                                                        handleChange(e)
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
        const amount_currency = ad.min_transaction;
        const amount_asset = ad.min_transaction / ad.fix_price;
        const send_validation = is_buy ? amount_currency : amount_asset;
        const receive_validation = is_buy ? amount_asset : amount_currency;

        const validations = {
            send: [
                v => !!v,
                v => v >= send_validation,
            ],
            receive: [
                v => !!v,
                v => v >= receive_validation,
            ],
        };

        const mappedKey = {
            send    : localize('Send'),
            receive : localize('Receive'),
        };

        // TODO: [translation] text wont pass in the translation script

        const common_messages  = [
            '{{field_name}} is required',
            '{{field_name}} below minimum value',
        ];

        const errors    = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));

                if (error_index !== -1) {
                    switch (key) {
                        default:
                            errors[key] = errors[key] = <Localize
                                i18n_default_text={common_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                            />;
                    }
                }
            });

        return errors;
    };
}

Popup.propTypes = {
    ad: PropTypes.object,
    onCancel: PropTypes.func,
};
 
export default Popup;
