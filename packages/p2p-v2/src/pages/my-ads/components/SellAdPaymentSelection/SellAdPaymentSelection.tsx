import React from 'react';
import { PaymentMethodCard } from '@/components';
import { p2p } from '@deriv/api-v2';
import { LabelPairedPlusLgBoldIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import './SellAdPaymentSelection.scss';

type TSellAdPaymentSelectionProps = {
    onSelectPaymentMethod: (paymentMethod: number) => void;
    selectedPaymentMethodIds: number[];
};
const SellAdPaymentSelection = ({ onSelectPaymentMethod, selectedPaymentMethodIds }: TSellAdPaymentSelectionProps) => {
    const { data: advertiserPaymentMethods } = p2p.advertiserPaymentMethods.useGet();

    return (
        <div className='p2p-v2-sell-ad-payment-selection__card'>
            {advertiserPaymentMethods?.map(paymentMethod => {
                const isDisabled =
                    selectedPaymentMethodIds.length >= 3 &&
                    !selectedPaymentMethodIds.includes(Number(paymentMethod.id));
                return (
                    <PaymentMethodCard
                        isDisabled={isDisabled} //TODO: add logic to disable if selectedPaymentMethodIds.length >= 3
                        key={paymentMethod.id}
                        medium
                        onSelectPaymentMethodCard={onSelectPaymentMethod}
                        paymentMethod={paymentMethod}
                        selectedPaymentMethodIds={selectedPaymentMethodIds}
                    />
                );
            })}
            <div className='p2p-v2-sell-ad-payment-selection__button'>
                <Button
                    className='flex items-center justify-center w-[3.2rem] h-[3.2rem] mb-[0.8rem] rounded-full bg-[#ff444f]'
                    onClick={() => undefined} //TODO: show add payment method modal
                >
                    <LabelPairedPlusLgBoldIcon fill='white' />
                </Button>
                <Text size='sm'>Payment method</Text>
            </div>
        </div>
    );
};

export default SellAdPaymentSelection;
