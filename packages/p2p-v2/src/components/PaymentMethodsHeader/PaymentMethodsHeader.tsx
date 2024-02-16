import React from 'react';
import { LabelPairedArrowLeftLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
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
const PaymentMethodsHeader = ({ onGoBack, title }: TPaymentMethodsHeaderProps) => (
    <div className='p2p-v2-payment-method-form__header'>
        <div className='p2p-v2-payment-method-form__back-button'>
            {onGoBack && (
                <LabelPairedArrowLeftLgBoldIcon
                    data-testid='dt_p2p_v2_payment_methods_header_left_arrow_icon'
                    onClick={onGoBack}
                />
            )}
        </div>
        {/* TODO: Remember to translate this */}
        <Text size='sm' weight='bold'>
            {title}
        </Text>
    </div>
);

export default PaymentMethodsHeader;
