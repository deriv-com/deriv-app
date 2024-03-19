import React, { useState } from 'react';
import { ExtendedOrderDetails } from '@/hooks/useExtendedOrderDetails';
import { LabelPairedChevronRightSmRegularIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import IcCashierBankTransfer from '../../../../../../public/ic-cashier-bank-transfer.svg';
import IcCashierEwallet from '../../../../../../public/ic-cashier-ewallet.svg';
import IcCashierOther from '../../../../../../public/ic-cashier-other.svg';
import './PaymentMethodAccordion.scss';

type TPaymentMethodAccordionProps = {
    paymentDetails: string;
    paymentInfo: string;
    paymentMethodDetails: ExtendedOrderDetails['payment_method_details'];
};

const PaymentMethodAccordion = ({
    paymentDetails,
    paymentInfo,
    paymentMethodDetails,
}: TPaymentMethodAccordionProps) => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const paymentMethodKeys = paymentMethodDetails ? Object.keys(paymentMethodDetails) : [];
    const { isMobile } = useDevice();
    const bigTextSize = isMobile ? 'md' : 'sm';
    const smallTextSize = isMobile ? 'sm' : 'xs';

    return (
        <div className='flex flex-col p-[1.6rem] gap-2'>
            <div className='flex items-center justify-between'>
                <Text size={bigTextSize} weight='bold'>
                    {paymentDetails}
                </Text>
                {paymentMethodKeys.length > 0 && (
                    <Button
                        className='p2p-v2-payment-method-accordion__button'
                        onClick={() => {
                            if (expandedIds.length !== paymentMethodKeys.length) setExpandedIds(paymentMethodKeys);
                            else setExpandedIds([]);
                        }}
                        textSize={smallTextSize}
                        variant='ghost'
                    >
                        {expandedIds.length === paymentMethodKeys.length ? 'Collapse all' : 'Expand all'}
                    </Button>
                )}
            </div>
            {paymentMethodKeys.length === 0 ? (
                <Text size={bigTextSize}>{paymentInfo}</Text>
            ) : (
                <>
                    {paymentMethodKeys.map(key => {
                        if (paymentMethodDetails && paymentMethodDetails[key]) {
                            const paymentMethodType = paymentMethodDetails[key].type;
                            const paymentMethodFields = paymentMethodDetails[key].fields;

                            return (
                                <div className='py-2' key={key}>
                                    <div
                                        className='flex items-center justify-between cursor-pointer'
                                        onClick={() => {
                                            if (expandedIds.includes(key))
                                                setExpandedIds(expandedIds.filter(id => id !== key));
                                            else setExpandedIds([...expandedIds, key]);
                                        }}
                                    >
                                        <div className='flex items-center gap-6'>
                                            {paymentMethodType === 'ewallet' && <IcCashierEwallet />}
                                            {paymentMethodType === 'bank' && <IcCashierBankTransfer />}
                                            {paymentMethodType === 'other' && <IcCashierOther height={16} width={16} />}
                                            <Text size={bigTextSize}>{paymentMethodDetails[key].display_name}</Text>
                                        </div>
                                        <LabelPairedChevronRightSmRegularIcon />
                                    </div>
                                    {expandedIds.includes(key) && (
                                        <div className='flex flex-col ml-[3.1rem]'>
                                            {Object.keys(paymentMethodFields).map(fieldKey => {
                                                const field = paymentMethodFields[fieldKey];
                                                return (
                                                    <div className='flex flex-col py-4' key={fieldKey}>
                                                        <Text color='less-prominent' size={smallTextSize}>
                                                            {field.display_name}
                                                        </Text>
                                                        <Text size={smallTextSize}>{field.value || '-'}</Text>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    })}
                </>
            )}
        </div>
    );
};

export default PaymentMethodAccordion;
