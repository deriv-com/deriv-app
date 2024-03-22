import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import BuyAdPaymentSelection from '../BuyAdPaymentSelection/BuyAdPaymentSelection';
import { SellAdPaymentSelection } from '../SellAdPaymentSelection';

type TAdPaymentSectionProps = {
    isSellAdvert: boolean;
    onSelectPaymentMethod: (paymentMethod: number | string, action?: string) => void;
    selectedPaymentMethods: (number | string)[];
};
const AdPaymentSelection = ({
    isSellAdvert,
    onSelectPaymentMethod,
    selectedPaymentMethods,
}: TAdPaymentSectionProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    return (
        <>
            <div className='mb-[2.4rem]'>
                <Text as='div' color='prominent' size={textSize}>
                    Payment methods
                </Text>
                <Text as='div' color='less-prominent' size={textSize}>
                    {isSellAdvert ? 'You may tap and choose up to 3.' : 'You may choose up to 3.'}
                </Text>
            </div>

            {isSellAdvert ? (
                <SellAdPaymentSelection
                    onSelectPaymentMethod={onSelectPaymentMethod}
                    selectedPaymentMethodIds={selectedPaymentMethods as number[]}
                />
            ) : (
                <BuyAdPaymentSelection
                    onSelectPaymentMethod={onSelectPaymentMethod}
                    selectedPaymentMethods={selectedPaymentMethods as string[]}
                />
            )}
        </>
    );
};

export default AdPaymentSelection;
