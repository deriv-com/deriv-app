import React from 'react';
import { TFormState } from '@/reducers/types';
import { Button } from '@deriv-com/ui';
import './PaymentMethodsFormFooter.scss';

type TPaymentMethodsFormFooterProps = {
    actionType: TFormState['actionType'];
    handleGoBack: () => void;
    isDirty: boolean;
    isSubmitting: boolean;
    isValid: boolean;
};

/**
 * @component This component is used to display the footer of the PaymentMethodForm
 * @param actionType - The type of action to be performed (ADD or EDIT)
 * @param handleGoBack - The function to be called when the back / cancel button is clicked
 * @param isDirty - The state of the form (whether it has been modified or not)
 * @param isSubmitting - The state of the form (whether it is being submitted or not)
 * @param isValid - The state of the form (whether it is valid or not)
 * @returns {JSX.Element}
 * @example <PaymentMethodsFormFooter actionType={actionType} handleGoBack={handleGoBack} isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} />
 * **/

const PaymentMethodsFormFooter = ({
    actionType,
    handleGoBack,
    isDirty,
    isSubmitting,
    isValid,
}: TPaymentMethodsFormFooterProps) => (
    <div className='p2p-v2-payment-method-form__buttons' role='payment-methods-form-footer'>
        <Button
            className='p2p-v2-payment-method-form__buttons--cancel'
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                handleGoBack();
            }}
            size='lg'
            variant='outlined'
        >
            Cancel
        </Button>
        {/* TODO: Remember to translate these */}
        <Button disabled={isSubmitting || !isValid || !isDirty} size='lg'>
            {actionType === 'ADD' ? 'Add' : 'Save changes'}
        </Button>
    </div>
);

export default PaymentMethodsFormFooter;
