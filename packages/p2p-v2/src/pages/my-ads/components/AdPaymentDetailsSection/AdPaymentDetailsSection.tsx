import React, { MouseEventHandler, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BUY_SELL } from '@/constants';
import { AdFormController } from '../AdFormController';
import { AdPaymentSelection } from '../AdPaymentSelection';
import { AdSummary } from '../AdSummary';
import { OrderTimeSelection } from '../OrderTimeSelection';

type TAdPaymentDetailsSection = {
    currency: string;
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: MouseEventHandler<HTMLButtonElement>;
    localCurrency?: string;
    rateType: string;
};

const AdPaymentDetailsSection = ({ currency, localCurrency, rateType, ...props }: TAdPaymentDetailsSection) => {
    const {
        formState: { errors, isValid },
        getValues,
    } = useFormContext();

    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<(number | string)[]>([]);
    const isSellAdvert = getValues('ad-type') === BUY_SELL.SELL;

    const onSelectPaymentMethod = (paymentMethod: number | string) => {
        if (selectedPaymentMethods.includes(paymentMethod)) {
            setSelectedPaymentMethods(selectedPaymentMethods.filter(method => method !== paymentMethod));
        } else {
            setSelectedPaymentMethods([...selectedPaymentMethods, paymentMethod]);
        }
    };

    return (
        <div className='p-[1.6rem] w-full'>
            <AdSummary
                currency={currency}
                localCurrency={localCurrency}
                offerAmount={errors.amount ? '' : getValues('amount')}
                priceRate={getValues('rate-value')}
                rateType={rateType}
                type={getValues('ad-type')}
            />
            <OrderTimeSelection />
            <AdPaymentSelection
                isSellAdvert={isSellAdvert}
                onSelectPaymentMethod={onSelectPaymentMethod}
                selectedPaymentMethods={selectedPaymentMethods}
            />
            <AdFormController {...props} isNextButtonDisabled={selectedPaymentMethods?.length === 0 || !isValid} />
        </div>
    );
};

export default AdPaymentDetailsSection;
