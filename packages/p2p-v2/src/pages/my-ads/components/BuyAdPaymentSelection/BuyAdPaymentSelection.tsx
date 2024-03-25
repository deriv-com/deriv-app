import React from 'react';
import { PaymentMethodWithIcon } from '@/components';
import { getPaymentMethodObjects } from '@/utils';
import { p2p } from '@deriv/api-v2';
import { LabelPairedTrashCaptionBoldIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import { BuyPaymentMethodsList } from '../BuyPaymentMethodsList';
import './BuyAdPaymentSelection.scss';

type TBuyAdPaymentSelectionProps = {
    onSelectPaymentMethod: (paymentMethod: string, action?: string) => void;
    selectedPaymentMethods: string[];
};

const BuyAdPaymentSelection = ({ onSelectPaymentMethod, selectedPaymentMethods }: TBuyAdPaymentSelectionProps) => {
    const { data: paymentMethodList } = p2p.paymentMethods.useGet();
    const list = (
        paymentMethodList?.map(paymentMethod => ({
            text: paymentMethod.display_name,
            value: paymentMethod.id,
        })) ?? []
    ).filter(paymentMethod => !selectedPaymentMethods.includes(paymentMethod.value));

    const paymentMethodObjects = getPaymentMethodObjects(paymentMethodList, 'id');
    return (
        <>
            {selectedPaymentMethods?.length > 0 &&
                selectedPaymentMethods.map(method => {
                    const { display_name: name, type } = paymentMethodObjects[method] ?? {};
                    return (
                        <div className='p2p-v2-buy-ad-payment-selection' key={method}>
                            <PaymentMethodWithIcon name={name} type={type} />
                            <Button
                                className='p2p-v2-buy-ad-payment-selection__button'
                                color='white'
                                onClick={() => onSelectPaymentMethod(method, 'delete')}
                                variant='contained'
                            >
                                <LabelPairedTrashCaptionBoldIcon data-testid='dt_p2p_v2_payment_delete_icon' />
                            </Button>
                        </div>
                    );
                })}
            {selectedPaymentMethods?.length < 3 && (
                <BuyPaymentMethodsList list={list} onSelectPaymentMethod={onSelectPaymentMethod} />
            )}
        </>
    );
};

export default BuyAdPaymentSelection;
