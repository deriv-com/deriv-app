import React from 'react';
import { useFormikContext } from 'formik';
import { TPaymentMethod, TPaymentMethodInfo } from 'src/types';
import { PaymentMethodInstructions } from './PaymentMethodInstructions';

type TPaymentMethodFieldProps = {
    paymentMethodDetail: TPaymentMethodInfo;
};

export const PaymentMethodField = ({ paymentMethodDetail }: TPaymentMethodFieldProps) => {
    const formik = useFormikContext();

    if (!formik) {
        throw new Error('PaymentMethodField must be used within a Formik component');
    }

    const { errors, setFieldValue, values } = formik;

    const paymentMethod = paymentMethodDetail.paymentMethod.toLowerCase();

    return (
        <div>
            <PaymentMethodInstructions paymentMethod={paymentMethod as TPaymentMethod} />
            <fieldset>
                {paymentMethodDetail.items &&
                    paymentMethodDetail.items.map(item => {
                        const controlsToShow = [...Array(item.documents_required).keys()];
                        const paymentID = item.id as number;
                        return (
                            <div key={`${item.payment_method}-${item.id}`}>
                                {controlsToShow.map(control => {
                                    return <div key={`${item?.id}-${control}`}>Field to show</div>;
                                })}
                            </div>
                        );
                    })}
            </fieldset>
        </div>
    );
};
