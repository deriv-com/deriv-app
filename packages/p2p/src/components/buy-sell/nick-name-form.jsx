import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, ThemedScrollbars } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { localize, Localize } from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import FormError from '../form/error.jsx';

const NickNameForm = ({ ad, handleClose, handleConfirm }) => {
    const [total_amount, setTotalAmount] = React.useState(ad.min_available);

    const calculateTotalAmount = amount => {
        const total_amount_cal = CurrencyUtils.formatMoney(
            ad.transaction_currency,
            +amount * ad.price_rate,
            true,
            ad.transaction_currency_decimals
        );
        setTotalAmount(total_amount_cal);
    };

    const handleSubmit = async (values, { setStatus, setSubmitting }) => {
        setStatus({ error_message: '' });

        const order = await requestWS({
            p2p_order_create: 1,
            advert_id: ad.id,
            amount: values.amount,
        });

        if (!order.error) {
            const order_info = await requestWS({ p2p_order_info: 1, id: order.p2p_order_create.id });
            handleClose();
            handleConfirm(order_info);
            setSubmitting(false);
        } else {
            setSubmitting(false);
            setStatus({ error_message: order.error.message });
        }
    };

    const validatePopup = values => {
        const validations = {
            amount: [
                v => !!v,
                v => v >= ad.min_available,
                v => v <= ad.max_available,
                v => countDecimalPlaces(v) <= ad.offer_currency_decimals,
            ],
        };

        const display_initial_amount = CurrencyUtils.formatMoney(
            ad.offer_currency,
            ad.min_available,
            true,
            ad.offer_currency_decimals
        );

        const display_max_amount = CurrencyUtils.formatMoney(
            ad.offer_currency,
            ad.max_available,
            true,
            ad.offer_currency_decimals
        );

        const common_messages = [
            localize('Enter a valid amount'),
            localize('Minimum is {{value}} {{currency}}', {
                currency: ad.offer_currency,
                value: display_initial_amount,
            }),
            localize('Maximum is {{value}} {{currency}}', { currency: ad.offer_currency, value: display_max_amount }),
            localize('Enter a valid amount'),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
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

    return (
        <Formik validate={validatePopup} initialValues={{ amount: ad.min_available }} onSubmit={handleSubmit}>
            {({ errors, isSubmitting, handleChange, status }) => (
                <Form noValidate>
                    <ThemedScrollbars autoHide style={{ height: '307px' }}>
                        <div className='buy-sell__popup-content'>hello nickname</div>
                    </ThemedScrollbars>
                    <div className='buy-sell__popup-footer'>
                        {status && status.error_message && <FormError message={status.error_message} />}
                        <Button secondary type='button' onClick={handleClose}>
                            {localize('Cancel')}
                        </Button>
                        <Button is_disabled={!!(isSubmitting || errors.amount)} primary>
                            {localize('Confirm')}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

NickNameForm.propTypes = {
    ad: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default NickNameForm;
