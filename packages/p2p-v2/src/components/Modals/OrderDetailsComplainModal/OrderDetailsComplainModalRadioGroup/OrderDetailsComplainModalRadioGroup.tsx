import React from 'react';
import { RadioGroup } from '@/components';
import { useDevice } from '@deriv-com/ui';
import './OrderDetailsComplainModalRadioGroup.scss';

type TOrderDetailsComplainModalRadioGroupProps = {
    disputeReason: string;
    isBuyOrderForUser: boolean;
    onCheckboxChange: (reason: string) => void;
};

const getRadioItems = (isBuyOrderForUser: boolean) => {
    const radioItems = [
        {
            label: isBuyOrderForUser
                ? 'I’ve made full payment, but the seller hasn’t released the funds.'
                : 'I’ve not received any payment.',
            value: isBuyOrderForUser ? 'seller_not_released' : 'buyer_not_paid',
        },
        {
            label: isBuyOrderForUser
                ? 'I wasn’t able to make full payment.'
                : 'I’ve received less than the agreed amount.',
            value: 'buyer_underpaid',
        },
        {
            label: isBuyOrderForUser
                ? 'I’ve paid more than the agreed amount.'
                : 'I’ve received more than the agreed amount.',
            value: 'buyer_overpaid',
        },
        {
            hidden: isBuyOrderForUser,
            label: 'I’ve received payment from 3rd party.',
            value: 'buyer_third_party_payment_method',
        },
    ];

    return radioItems;
};
const OrderDetailsComplainModalRadioGroup = ({
    disputeReason,
    isBuyOrderForUser,
    onCheckboxChange,
}: TOrderDetailsComplainModalRadioGroupProps) => {
    const { isMobile } = useDevice();

    return (
        <RadioGroup
            className='p2p-v2-order-details-complain-modal-radio-group'
            name='reason'
            onToggle={event => onCheckboxChange(event.target.value)}
            required
            selected={disputeReason}
            textSize={isMobile ? 'md' : 'sm'}
        >
            {getRadioItems(isBuyOrderForUser).map(item => (
                <RadioGroup.Item hidden={item.hidden} key={item.label} label={item.label} value={item.value} />
            ))}
        </RadioGroup>
    );
};

export default OrderDetailsComplainModalRadioGroup;
