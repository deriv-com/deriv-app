import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import ArrowLeftBold from '../../../../../public/ic-arrow-left-bold.svg';
import './PaymentMethodsHeader.scss';

type TPaymentMethodsHeaderProps = {
    onGoBack?: () => void;
    title?: string;
};

/**
 * @component This component is used to display the header of the PaymentMethods screen
 * @param onGoBack - The function to be called when the back button is clicked
 * @param title - The title of the header
 * @returns {JSX.Element}
 * @example <PaymentMethodsHeader onGoBack={onGoBack} title={title} />
 * **/
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
