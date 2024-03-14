import React, { ComponentType, SVGAttributes } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { Text } from '@deriv-com/ui';
import IcCashierBankTransfer from '../../public/ic-cashier-bank-transfer.svg';
import IcCashierEwallet from '../../public/ic-cashier-ewallet.svg';
import IcCashierOther from '../../public/ic-cashier-other.svg';

type TPaymentMethodWithIconProps = {
    name: string;
    type: NonNullable<TAdvertiserPaymentMethods>[number]['type'];
};
const PaymentMethodWithIcon = ({ name, type }: TPaymentMethodWithIconProps) => {
    let Icon: ComponentType<SVGAttributes<SVGElement>> = IcCashierOther;
    if (type === 'bank') {
        Icon = IcCashierBankTransfer;
    } else if (type === 'ewallet') {
        Icon = IcCashierEwallet;
    }
    return (
        <div className='flex items-center gap-[0.8rem] mb-[0.8rem]'>
            <Icon data-testid='dt_p2p_v2_payment_method_card_header_icon' height={16} width={16} />
            <Text size='sm'>{name}</Text>
        </div>
    );
};

export default PaymentMethodWithIcon;
