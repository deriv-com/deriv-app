import React from 'react';
import QRCode from 'qrcode.react';
import { WalletClipboard, WalletText } from '../../../../../../components/Base';
import useDevice from '../../../../../../hooks/useDevice';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import './DepositCryptoAddress.scss';

type TProps = {
    depositCryptoAddress?: string;
};

const DepositCryptoAddress: React.FC<TProps> = ({ depositCryptoAddress }) => {
    const { isMobile } = useDevice();
    const isRtl = useIsRtl();
    const mobileAlignment = isRtl ? 'right' : 'left';

    return (
        <div className='wallets-deposit-crypto-address'>
            <QRCode data-testid='dt_deposit-crypto-address-qr-code' size={128} value={depositCryptoAddress || ''} />
            <div className='wallets-deposit-crypto-address__hash'>
                <div className='wallets-deposit-crypto-address__hash-text'>
                    <WalletText size='sm' weight='bold'>
                        {depositCryptoAddress}
                    </WalletText>
                </div>
                <div className='wallets-deposit-crypto-address__hash-clipboard'>
                    <WalletClipboard
                        popoverAlignment={isMobile ? mobileAlignment : 'bottom'}
                        textCopy={depositCryptoAddress || ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default DepositCryptoAddress;
