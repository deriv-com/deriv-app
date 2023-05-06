import React from 'react';
import { Button, Clipboard, Icon, Loading, Text } from '@deriv/components';
import { useDepositCryptoAddress } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import QRCode from 'qrcode.react';
import './deposit-crypto-wallet-address.scss';

const DepositCryptoWalletAddress: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { data: deposit_crypto_address, isLoading, error, refetch } = useDepositCryptoAddress();

    if (isLoading) return <Loading is_fullscreen={false} />;

    if (error) {
        return (
            <div className='deposit-crypto-wallet-address'>
                <Text as='p' align='center' size='xs' className='deposit-crypto-wallet-address__error'>
                    <Icon width={30} height={20} icon='IcAlertWarning' />
                    {localize(
                        "Unfortunately, we couldn't get the address since our server was down. Please click Refresh to reload the address or try again later."
                    )}
                </Text>
                <Button
                    className='deposit-crypto-wallet-address__refresh-button'
                    text={localize('Refresh')}
                    onClick={() => refetch()}
                    secondary
                    small
                />
            </div>
        );
    }

    return (
        <div className='deposit-crypto-wallet-address'>
            <QRCode value={deposit_crypto_address || ''} size={160} includeMargin />
            <div className='deposit-crypto-wallet-address__hash-container'>
                <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold' align='center'>
                    {deposit_crypto_address}
                </Text>
                <Clipboard
                    icon='IcCashierClipboard'
                    text_copy={deposit_crypto_address || ''}
                    info_message={is_mobile ? undefined : localize('copy')}
                    success_message={localize('copied!')}
                    popoverAlignment={is_mobile ? 'left' : 'bottom'}
                />
            </div>
        </div>
    );
});

export default DepositCryptoWalletAddress;
