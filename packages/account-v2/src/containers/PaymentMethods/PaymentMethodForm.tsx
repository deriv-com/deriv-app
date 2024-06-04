import React from 'react';
import { TPaymentMethod, TPaymentMethodIdentifier, TPaymentMethodInfo } from 'src/types';
import { PaymentMethodField } from './PaymentMethodField';
import { PaymentMethodInstructions } from './PaymentMethodInstructions';

type TPaymentMethodFormProps = {
    paymentMethodDetail: TPaymentMethodInfo;
};

export const PaymentMethodForm = ({ paymentMethodDetail }: TPaymentMethodFormProps) => {
    const paymentMethod = paymentMethodDetail.paymentMethod.toLowerCase() as TPaymentMethod;

    return (
        <div className='flex flex-col gap-24'>
            <PaymentMethodInstructions paymentMethod={paymentMethod} />
            <fieldset className='flex flex-col gap-24'>
                {paymentMethodDetail?.items?.map(item => (
                    <PaymentMethodField
                        identifier={paymentMethodDetail.identifier as TPaymentMethodIdentifier}
                        inputLabel={paymentMethodDetail.inputLabel as string}
                        key={`${paymentMethod}-${item.id}`}
                        paymentMethod={paymentMethod}
                        paymentMethodDetailItem={item}
                    />
                ))}
            </fieldset>
        </div>
    );
};
