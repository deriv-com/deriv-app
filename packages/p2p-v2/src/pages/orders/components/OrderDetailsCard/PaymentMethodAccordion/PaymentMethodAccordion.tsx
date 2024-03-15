import React, { useState } from 'react';
import { LabelPairedChevronRightSmRegularIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import IcCashierBankTransfer from '../../../../../public/ic-cashier-bank-transfer.svg';
import IcCashierEwallet from '../../../../../public/ic-cashier-ewallet.svg';
import IcCashierOther from '../../../../../public/ic-cashier-other.svg';

const mockPaymentMethodDetails = {
    '64': {
        display_name: 'Alipay',
        fields: {
            account: {
                display_name: 'Alipay ID',
                value: '1',
            },
            instructions: {
                display_name: 'Instructions',
                value: '1',
            },
        },
        type: 'ewallet',
    },
    '67': {
        display_name: 'Bank Transfer',
        fields: {
            account: {
                display_name: 'Account Number',
                value: '1',
            },
            bank_code: {
                display_name: 'SWIFT or IFSC code',
                value: '1',
            },
            bank_name: {
                display_name: 'Bank Name',
                value: '1',
            },
            branch: {
                display_name: 'Branch',
                value: '1',
            },
            instructions: {
                display_name: 'Instructions',
                type: 'memo',
                value: '1',
            },
        },
        type: 'bank',
    },
    '68': {
        display_name: 'Other',
        fields: {
            account: {
                display_name: 'Account ID / phone number / email',
                value: '1',
            },
            instructions: {
                display_name: 'Instructions',
                value: '1',
            },
            name: {
                display_name: 'Payment method name',
                value: '1',
            },
        },
        type: 'other',
    },
};

const PaymentMethodAccordion = ({ paymentMethodDetails }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldExpandAll, setShouldExpandAll] = useState(false);

    return (
        <div className='flex flex-col p-[1.6rem] gap-2'>
            <div className='flex items-center justify-between'>
                <Text size='sm' weight='bold'>
                    Your payment details
                </Text>
                <Button
                    className='h-0 p-0'
                    onClick={() => setShouldExpandAll(prevState => !prevState)}
                    textSize='xs'
                    variant='ghost'
                >
                    Expand all
                </Button>
            </div>
            {/* <Text size='sm'>sadkj;asjdkljadashjkl</Text> */}
            {Object.keys(mockPaymentMethodDetails).map(key => {
                const paymentMethodType = mockPaymentMethodDetails[key].type;
                const paymentMethodFields = mockPaymentMethodDetails[key].fields;

                return (
                    <div className='py-2' key={key}>
                        <div
                            className='flex items-center justify-between cursor-pointer'
                            onClick={() => setIsExpanded(prevState => !prevState)}
                        >
                            <div className='flex items-center gap-6'>
                                {paymentMethodType === 'ewallet' && <IcCashierEwallet />}
                                {paymentMethodType === 'bank' && <IcCashierBankTransfer />}
                                {paymentMethodType === 'other' && <IcCashierOther height={16} width={16} />}
                                <Text size='sm'>{mockPaymentMethodDetails[key].display_name}</Text>
                            </div>
                            <LabelPairedChevronRightSmRegularIcon />
                        </div>
                        {(isExpanded || shouldExpandAll) && (
                            <div className='flex flex-col ml-[3.1rem]'>
                                {Object.keys(paymentMethodFields).map(fieldKey => {
                                    const field = paymentMethodFields[fieldKey];
                                    return (
                                        <div className='flex flex-col py-4' key={fieldKey}>
                                            <Text color='less-prominent' size='xs'>
                                                {field.display_name}
                                            </Text>
                                            <Text size='xs'>{field.value}</Text>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PaymentMethodAccordion;
