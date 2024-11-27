import { useCallback } from 'react';
import { useTimeout } from '@deriv/hooks';
import { Button } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

type TResendCodeButton = {
    initialDelay: number;
    onResend: () => void;
    isDisabled: boolean;
};

export const ResendCodeButton = ({ initialDelay, onResend, isDisabled }: TResendCodeButton) => {
    const { isTimeout, timeRemaining } = useTimeout(initialDelay);

    const handleClick = useCallback(() => {
        if (!isTimeout) return;
        onResend();
    }, [isTimeout, onResend]);

    return (
        <Button
            className='passkeys-status__description-resend-code-button'
            variant='tertiary'
            onClick={handleClick}
            disabled={!isTimeout || isDisabled}
            type='button'
            color='black'
            label={
                isTimeout && !isDisabled ? (
                    <Localize i18n_default_text='Resend Code' />
                ) : (
                    <Localize i18n_default_text='Resend Code in {{timeRemaining}}s' values={{ timeRemaining }} />
                )
            }
        />
    );
};
