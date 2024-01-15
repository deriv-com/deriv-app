import React from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import Wallet from '../../../../../public/ic-payment-methods-wallet.svg';
import './payment-methods-empty.scss';

type TPaymentMethodsEmptyProps = {
    onAddPaymentMethod: () => void;
};

const PaymentMethodsEmpty = ({ onAddPaymentMethod }: TPaymentMethodsEmptyProps) => {
    return (
        <div className='p2p-v2-payment-method-empty'>
            <Wallet />
            {/* TODO: Remember to localise the text below */}
            <Text weight='bold'>You haven’t added any payment methods yet</Text>
            <Text>Hit the button below to add payment methods.</Text>
            <div>
                {/* <button className='p2p-v2-payment-method-empty__button' onClick={onAddPaymentMethod}>
                    Add payment methods
                </button> */}
                <Button className='p2p-v2-payment-method-empty__button' onClick={onAddPaymentMethod}>
                    Add payment methods
                </Button>
            </div>
        </div>
    );
};
export default PaymentMethodsEmpty;
