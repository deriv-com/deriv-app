import React from 'react';
import clsx from 'clsx';
import { TFormState } from '@/reducers/types';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './PaymentMethodsFormFooter.scss';

type TPaymentMethodsFormFooterProps = {
    actionType: TFormState['actionType'];
    handleGoBack: () => void;
    isDirty: boolean;
    isFloating?: boolean;
    isSubmitting: boolean;
    isValid: boolean;
};

const ButtonText = ({ text }: { text: string }) => {
    const { isMobile } = useDevice();
    return (
        <Text lineHeight='6xl' size={isMobile ? 'lg' : 'sm'} weight='bold'>
            {text}
        </Text>
    );
};

/**
 * @component This component is used to display the footer of the PaymentMethodForm
 * @param actionType - The type of action to be performed (ADD or EDIT)
 * @param handleGoBack - The function to be called when the back / cancel button is clicked
 * @param isDirty - The state of the form (whether it has been modified or not)
 * @param isFloating - Makes the footer float at the bottom of the screen
 * @param isSubmitting - The state of the form (whether it is being submitted or not)
 * @param isValid - The state of the form (whether it is valid or not)
 * @returns {JSX.Element}
 * @example <PaymentMethodsFormFooter actionType={actionType} handleGoBack={handleGoBack} isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} />
 * **/
const PaymentMethodsFormFooter = ({
    actionType,
    handleGoBack,
    isDirty,
    isFloating = false,
    isSubmitting,
    isValid,
}: TPaymentMethodsFormFooterProps) => (
    <div
        className={clsx('p2p-v2-payment-methods-form-footer', { 'absolute bottom-0': isFloating })}
        role='payment-methods-form-footer'
    >
        <Button
            className='border-2'
            color='black'
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                handleGoBack();
            }}
            size='lg'
            variant='outlined'
        >
            <ButtonText text='Cancel' />
        </Button>
        {/* TODO: Remember to translate these */}
        <Button disabled={isSubmitting || !isValid || !isDirty} size='lg'>
            <ButtonText text={actionType === 'ADD' ? 'Add' : 'Save'} />
        </Button>
    </div>
);

export default PaymentMethodsFormFooter;
