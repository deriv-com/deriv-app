import React from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import Wallet from '../../../../../public/ic-payment-methods-wallet.svg';
import './PaymentMethodsEmpty.scss';

type TPaymentMethodsEmptyProps = {
    onAddPaymentMethod: () => void;
};

/**
 * @component This component is used to display the empty state of the PaymentMethods screen
 * @param {Function} onAddPaymentMethod - Callback to open the form to add a new payment method
 * @returns {JSX.Element}
 * @example <PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />
 * **/
const PaymentMethodsEmpty = ({ onAddPaymentMethod }: TPaymentMethodsEmptyProps) => {
    return (
        <div className='p2p-v2-payment-methods-empty'>
            <Wallet />
            {/* TODO: Remember to localise the text below */}
            <Text className='p2p-v2-payment-methods-empty__heading' weight='bold'>
                You haven’t added any payment methods yet
            </Text>
            <Text>Hit the button below to add payment methods.</Text>
            <Button className='p2p-v2-payment-methods-empty__button' onClick={() => onAddPaymentMethod()}>
                Add payment methods
            </Button>
        </div>
    );
};
export default PaymentMethodsEmpty;
