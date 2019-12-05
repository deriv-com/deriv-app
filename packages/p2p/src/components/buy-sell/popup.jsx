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
        const { ad } = this.props;
        return (
            <Fragment>
                <div className='buy-sell__popup'>
                    <div className='buy-sell__popup-header'>
                        <h2 className='buy-sell__popup-header--title'>{`${ad.type} ${ad.asset}`}</h2>
                        <IconClose />
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
                                                    className='my-ads__form-field my-ads__form-field--textarea'
                                                    placeholder='Send amount'
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
                                                    className='my-ads__form-field my-ads__form-field--textarea'
                                                    placeholder='Receive amount'
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
                                    <div>
                                        <span></span>
                                        <p>{ad.value}</p>
                                    </div>
                                    <div>
                                        <span></span>
                                        <p></p>
                                    </div>
                                    <div>
                                        <span></span>
                                        <p></p>
                                    </div>
                                    <div>
                                        <Button secondary>Cancel</Button>
                                        <Button is_disabled={isSubmitting} primary>OK</Button>
                                    </div>
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
                v => v > this.props.ad.min_transaction,
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
};
 
export default Popup;
