import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import ArrowLeftBold from '../../../../../public/ic-arrow-left-bold.svg';
import './PaymentMethodsHeader.scss';

type TPaymentMethodsHeaderProps = {
    onGoBack?: () => void;
    title?: string;
};

const PaymentMethodsHeader = ({ onGoBack, title }: TPaymentMethodsHeaderProps) => {
    return (
        <div className='p2p-v2-payment-method-form__header'>
            <div className='p2p-v2-payment-method-form__back-button'>
                {onGoBack ? (
                    <ArrowLeftBold
                        onClick={() => {
                            onGoBack?.();
                        }}
                    />
                ) : null}
            </div>
            {/* TODO: Remember to translate this */}
            <Text size='sm' weight='bold'>
                {title}
            </Text>
        </div>
    );
};

export default PaymentMethodsHeader;
