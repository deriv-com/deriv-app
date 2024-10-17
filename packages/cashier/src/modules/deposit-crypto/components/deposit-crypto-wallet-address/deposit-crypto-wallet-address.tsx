import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { Button, Clipboard, InlineMessage, Loading, Text } from '@deriv/components';
import { useDepositCryptoAddress } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { setPerformanceValue } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import QRCode from 'qrcode.react';
import { DepositCryptoDisclaimers } from '../deposit-crypto-disclaimers';
import './deposit-crypto-wallet-address.scss';

const DepositCryptoWalletAddress: React.FC = observer(() => {
    const { client } = useStore();
    const { currency, loginid } = client;
    const { isMobile } = useDevice();
    const { data: deposit_crypto_address, isLoading, error, resend } = useDepositCryptoAddress();

    if (isLoading) return <Loading is_fullscreen={false} />;

    setPerformanceValue('load_crypto_deposit_cashier_time');

    const onClickHandler = () => {
        Analytics.trackEvent('ce_cashier_deposit_onboarding_form', {
            action: 'click_copy_crypto_address',
            form_name: 'ce_cashier_deposit_onboarding_form',
            currency,
            login_id: loginid,
        });
    };

    if (error) {
        return (
            <div className='deposit-crypto-wallet-address__error'>
                <InlineMessage
                    type='warning'
                    message={localize(
                        "Unfortunately, we couldn't get the address since our server was down. Please click Refresh to reload the address or try again later."
                    )}
                />
                <Button text={localize('Refresh')} onClick={() => resend()} secondary small />
            </div>
        );
    }

    return (
        <>
            <QRCode
                value={deposit_crypto_address || ''}
                size={isMobile ? 128 : 160}
                className='deposit-crypto-wallet-address__qrcode-container'
            />
            <div className='deposit-crypto-wallet-address__address-container'>
                <div className='deposit-crypto-wallet-address__hash-container'>
                    <Text size={isMobile ? 'xxs' : 'xs'} weight='bold'>
                        {deposit_crypto_address}
                    </Text>
                </div>
                <div className='deposit-crypto-wallet-address__action-container'>
                    <Clipboard
                        text_copy={deposit_crypto_address || ''}
                        info_message={isMobile ? undefined : localize('copy')}
                        success_message={localize('copied!')}
                        onClickHandler={onClickHandler}
                        popoverAlignment={isMobile ? 'left' : 'bottom'}
                    />
                </div>
            </div>
            <DepositCryptoDisclaimers />
        </>
    );
});

export default DepositCryptoWalletAddress;
