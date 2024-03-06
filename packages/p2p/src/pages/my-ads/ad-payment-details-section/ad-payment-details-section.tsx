import React from 'react';
import { Field, FormikValues, useFormikContext } from 'formik';
import { Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import AdFormController from 'Pages/my-ads/ad-form-controller';
import CreateAdFormPaymentMethods from '../create-ad-form-payment-methods.jsx';
import CreateAdSummary from '../create-ad-summary.jsx';
import OrderTimeSelection from '../order-time-selection';

const AdPaymentDetailsSection = ({ ...props }) => {
    const { errors, isValid, values } = useFormikContext<FormikValues>();
    const [selected_payment_methods, setSelectedPaymentMethods] = React.useState([]);
    const [is_next_btn_disabled, setIsNextBtnDisabled] = React.useState(true);
    const is_sell_advert = values.type === buy_sell.SELL;

    React.useEffect(() => {
        setIsNextBtnDisabled(!isValid || !selected_payment_methods?.length);
    }, [selected_payment_methods]);

    return (
        <>
            <CreateAdSummary
                offer_amount={errors.offer_amount ? '' : values.offer_amount}
                price_rate={values.rate_type}
                type={values.type}
            />
            <Field name='order_completion_time'>{({ field }) => <OrderTimeSelection {...field} />}</Field>
            <div className='ad-payment-details-section__label'>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='Payment methods' />
                </Text>
                <Text color='less-prominent' size='xs'>
                    {is_sell_advert ? (
                        <Localize i18n_default_text='You may tap and choose up to 3.' />
                    ) : (
                        <Localize i18n_default_text='You may choose up to 3.' />
                    )}
                </Text>
            </div>
            <CreateAdFormPaymentMethods
                is_sell_advert={is_sell_advert}
                onSelectPaymentMethods={setSelectedPaymentMethods}
            />
            <AdFormController {...props} is_next_btn_disabled={is_next_btn_disabled} />
        </>
    );
};

export default observer(AdPaymentDetailsSection);
