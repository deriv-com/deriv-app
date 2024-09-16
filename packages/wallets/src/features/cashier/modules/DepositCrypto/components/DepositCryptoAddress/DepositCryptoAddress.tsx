import React from 'react';
import QRCode from 'qrcode.react';
import { Text, useDevice } from '@deriv-com/ui';
import { WalletClipboard } from '../../../../../../components/Base';
import './DepositCryptoAddress.scss';

type TProps = {
    depositCryptoAddress?: string;
};

const DepositCryptoAddress: React.FC<TProps> = ({ depositCryptoAddress }) => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-deposit-crypto-address'>
            <QRCode data-testid='dt_deposit-crypto-address-qr-code' size={128} value={depositCryptoAddress || ''} />
            <div className='wallets-deposit-crypto-address__hash'>
                <div className='wallets-deposit-crypto-address__hash-text'>
                    <Text size='sm' weight='bold'>
                        {depositCryptoAddress}
                    </Text>
                </div>
                <div className='wallets-deposit-crypto-address__hash-clipboard'>
                    <WalletClipboard
                        className='wallets-deposit-crypto-address__clipboard'
                        popoverAlignment={isDesktop ? 'bottom' : 'left'}
                        textCopy={depositCryptoAddress || ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default DepositCryptoAddress;
