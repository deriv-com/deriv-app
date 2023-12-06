import React, { MouseEventHandler, useCallback, useEffect } from 'react';
import { useMutation } from '@deriv/api';
import { WalletButton, WalletText } from '../../../../../../components';
import './FiatOnRampDisclaimer.scss';

type TFiatOnRampDisclaimer = {
    handleDisclaimer: MouseEventHandler<HTMLButtonElement>;
};

const FiatOnRampDisclaimer: React.FC<TFiatOnRampDisclaimer> = ({ handleDisclaimer }) => {
    const { data: provider, isLoading, mutate } = useMutation('service_token');

    const redirectToBanxa = useCallback(() => {
        const banxaUrl = provider?.service_token?.banxa?.url ?? '';
        if (banxaUrl) {
            const link = document.createElement('a');
            link.href = banxaUrl;
            link.target = '_blank';
            link.click();
        }
    }, [provider?.service_token?.banxa?.url]);

    useEffect(() => {
        mutate({ payload: { referrer: window.location.href, service: 'banxa' } });
    }, [mutate]);

    return (
        <div className='wallets-fiat-onramp-disclaimer'>
            <WalletText color='prominent' size='xs' weight='bold'>
                Disclaimer
            </WalletText>
            <WalletText size='xs'>
                By clicking <strong>Continue</strong>, you&apos;ll be redirected to Banxa, a third-party payment service
                provider. Please note that Deriv is not responsible for the content or services provided by Banxa. If
                you encounter any issues related to Banxa services, you should contact Banxa directly.
            </WalletText>
            <div className='wallets-fiat-onramp-disclaimer__buttons'>
                <WalletButton color='white' onClick={handleDisclaimer} size='md' variant='outlined'>
                    Back
                </WalletButton>
                <WalletButton isLoading={isLoading} onClick={() => redirectToBanxa()} size='md'>
                    Continue
                </WalletButton>
            </div>
        </div>
    );
};

export default FiatOnRampDisclaimer;
