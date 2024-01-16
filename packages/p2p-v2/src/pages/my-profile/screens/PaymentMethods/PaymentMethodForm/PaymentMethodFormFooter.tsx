import React from 'react';
import { TPaymentMethodFormConfig } from 'types';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { FullPageMobileWrapper } from '../../../../../components';
import { useDevice } from '../../../../../hooks';

type TPaymentMethodFormFooter = {
    isValid: boolean;
    onGoBack?: () => void;
    paymentMethod: TPaymentMethodFormConfig['paymentMethod'];
    type: TPaymentMethodFormConfig['type'];
};

const FooterButtons = ({ isValid, onGoBack, paymentMethod, type }: TPaymentMethodFormFooter) => {
    return !paymentMethod ? null : (
        <div className='p2p-v2-payment-method-form__buttons'>
            {/* TODO: Remember to wire up the modal */}
            <Button
                className='p2p-v2-payment-method-form__button p2p-v2-payment-method-form__button--cancle'
                color='secondary'
                onClick={onGoBack}
                size='lg'
                variant='outlined'
            >
                Cancel
            </Button>
            {/* TODO: Remember to translate these */}
            <Button
                className='p2p-v2-payment-method-form__button p2p-v2-payment-method-form__button--save'
                disabled={!isValid}
                size='lg'
            >
                {type === 'ADD' ? 'Add' : 'Save changes'}
            </Button>
        </div>
    );
};

const PaymentMethodFormFooter = ({ isValid, onGoBack, paymentMethod, type }: TPaymentMethodFormFooter) => {
    const { isMobile } = useDevice();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderFooter={() => (
                    <FooterButtons isValid={isValid} onGoBack={onGoBack} paymentMethod={paymentMethod} type={type} />
                )}
            />
        );
    }

    return <FooterButtons isValid={isValid} onGoBack={onGoBack} paymentMethod={paymentMethod} type={type} />;
};

export default PaymentMethodFormFooter;
