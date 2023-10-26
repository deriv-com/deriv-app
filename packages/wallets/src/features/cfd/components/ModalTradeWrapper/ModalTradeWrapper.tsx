import React, { FC, PropsWithChildren } from 'react';
import { ModalStepWrapper } from '../../../../components/Base/ModalStepWrapper';
import InstallationAppleIcon from '../../../../public/images/ic-installation-apple.svg';
import InstallationGoogleIcon from '../../../../public/images/ic-installation-google.svg';
import InstallationHuaweiIcon from '../../../../public/images/ic-installation-huawei.svg';
import './ModalTradeWrapper.scss';
import { WalletText } from '../../../../components/Base';
import QRCode from 'qrcode.react';
import useDevice from '../../../../hooks/useDevice';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { PlatformToTitleMapper } from '../../constants';

const AppToLinkMapper = {
    ios: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
    android: 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
    huawei: 'https://appgallery.huawei.com/#/app/C102015329',
};

const PlatformToLinkMapper = {
    derivez: 'https://onelink.to/bkdwkd',
    dxtrade: 'https://onelink.to/grmtyx',
    ctrader: 'https://onelink.to/hyqpv7',
    mt5: 'https://onelink.to/grmtyx',
};

type TModalTradeWrapper = {
    marketType: TMarketTypes.All;
    platform: TPlatforms.MT5 | TPlatforms.OtherAccounts;
};

const ModalTradeWrapper: FC<PropsWithChildren<TModalTradeWrapper>> = ({ children, marketType, platform }) => {
    const { isDesktop } = useDevice();

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <div className='wallets-modal-trade-wrapper__footer'>
                        <WalletText align='center' size='sm' weight='bold'>
                            Download Deriv MT5 on your phone to trade with the Deriv MT5 account
                        </WalletText>
                        <div className='wallets-modal-trade-wrapper__footer-installations'>
                            <div className='wallets-modal-trade-wrapper__footer-installations-icons'>
                                <InstallationAppleIcon onClick={() => window.open(AppToLinkMapper.ios)} />
                                <InstallationGoogleIcon onClick={() => window.open(AppToLinkMapper.android)} />
                                <InstallationHuaweiIcon onClick={() => window.open(AppToLinkMapper.huawei)} />
                            </div>
                            {isDesktop && (
                                <div className='wallets-modal-trade-wrapper__footer-installations-qr'>
                                    <QRCode size={80} value={PlatformToLinkMapper[platform]} />
                                    <WalletText align='center' size='xs'>
                                        Scan the QR code to download Deriv {PlatformToTitleMapper[platform]}
                                    </WalletText>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }}
            shouldFixedFooter={isDesktop}
            title='Trade'
        >
            {children}
        </ModalStepWrapper>
    );
};

export default ModalTradeWrapper;
