import React, { Fragment, Component } from 'react';
import PropTypes                      from 'prop-types';
import { Formik, Field, Form }        from 'formik';
import { Input, Button }              from 'deriv-components';
import { localize, Localize }         from 'deriv-translations';
import IconBack                       from '../../assets/icon-back.jsx';
import IconClose                      from '../../assets/icon-close.jsx';

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
                        initialValues={{ send: ad.min_transaction, receive: ad.min_transaction / ad.fix_price }}
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
                                <div className='buy-sell__popup-content'>
                                    <div className='buy-sell__popup-field_wrapper'>
                                        <Field name='send'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='number'
                                                    error={touched.send && errors.send}
                                                    label={localize('Send')}
                                                    className='buy-sell__popup-field'
                                                    placeholder='Send amount'
                                                    trailing_icon={<span className='buy-sell__popup-field--trailing'>{ad.currency}</span>}
                                                    onChange={(e) => {
                                                        const send = isNaN(e.target.value) ? 0 : e.target.value;
                                                        setFieldValue('receive', send / ad.fix_price)
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
                                                    error={touched.receive && errors.receive}
                                                    label={localize('Receive')}
                                                    className='buy-sell__popup-field'
                                                    placeholder='Receive amount'
                                                    trailing_icon={<span className='buy-sell__popup-field--trailing'>{ad.asset}</span>}
                                                    onChange={(e) => {
                                                        const receive = isNaN(e.target.value) ? 0 : e.target.value;
                                                        setFieldValue('send', receive * ad.fix_price)
                                                        handleChange(e)
                                                    }}
                                                    required
                                                />
                                                )}
                                        </Field>
                                    </div>
                                    <div className='buy-sell__popup-info'>
                                        <span className='buy-sell__popup-info--title'>{localize('Seller')}</span>
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
        const validations = {
            send: [
                v => !!v,
                v => v >= this.props.ad.min_transaction,
            ],
            receive: [
                v => !!v,
                
            ],
        };

        const mappedKey = {
            send    : localize('Send amount'),
            receive : localize('Receive amount'),
        };

        // TODO: [translation] text wont pass in the translation script

        const common_messages  = [
            '{{field_name}} is required',
        ];

        const send_messages = [
            '{{field_name}} is required',
            '{{field_name}} should be above min. transaction',
        ];

        const errors    = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));

                if (error_index !== -1) {
                    switch (key) {
                        case 'send':
                            errors[key] = errors[key] = <Localize
                                i18n_default_text={send_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                            />;
                            break;
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
