import React, { FC, PropsWithChildren } from 'react';
import QRCode from 'qrcode.react';
import { WalletText } from '../../../../components/Base';
import { ModalStepWrapper } from '../../../../components/Base/ModalStepWrapper';
import useDevice from '../../../../hooks/useDevice';
import InstallationAppleIcon from '../../../../public/images/ic-installation-apple.svg';
import InstallationGoogleIcon from '../../../../public/images/ic-installation-google.svg';
import InstallationHuaweiIcon from '../../../../public/images/ic-installation-huawei.svg';
import { TPlatforms } from '../../../../types';
import { PlatformDetails } from '../../constants';
import './ModalTradeWrapper.scss';

type TAppLinks = {
    android: string;
    huawei?: string;
    ios: string;
};

const LinksMapper: Record<TPlatforms.All, TAppLinks> = {
    ctrader: {
        android: 'https://play.google.com/store/apps/details?id=com.deriv.ct',
        ios: 'https://apps.apple.com/cy/app/ctrader/id767428811',
    },
    dxtrade: {
        android: 'https://play.google.com/store/apps/details?id=com.deriv.dx',
        huawei: 'https://appgallery.huawei.com/app/C104633219',
        ios: 'https://apps.apple.com/us/app/deriv-x/id1563337503',
    },
    mt5: {
        android: 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
        huawei: 'https://appgallery.huawei.com/#/app/C102015329',
        ios: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
    },
};

const AppToIconMapper: Record<string, React.ComponentType<React.SVGAttributes<SVGElement>>> = {
    android: InstallationGoogleIcon,
    huawei: InstallationHuaweiIcon,
    ios: InstallationAppleIcon,
};

type TModalTradeWrapper = {
    platform: TPlatforms.MT5 | TPlatforms.OtherAccounts;
};

const ModalTradeWrapper: FC<PropsWithChildren<TModalTradeWrapper>> = ({ children, platform }) => {
    const { isDesktop } = useDevice();
    const appOrder = ['ios', 'android', 'huawei'];

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <div className='wallets-modal-trade-wrapper__footer'>
                        <WalletText align='center' size='sm' weight='bold'>
                            Download {PlatformDetails[platform].title} on your phone to trade with the{' '}
                            {PlatformDetails[platform].title} account
                        </WalletText>
                        <div className='wallets-modal-trade-wrapper__footer-installations'>
                            <div className='wallets-modal-trade-wrapper__footer-installations-icons'>
                                {appOrder.map(app => {
                                    const AppsLinkMapper = LinksMapper[platform][app as keyof TAppLinks];
                                    if (AppsLinkMapper) {
                                        const AppIcon = AppToIconMapper[app];
                                        const appLink = AppsLinkMapper;
                                        return <AppIcon key={app} onClick={() => window.open(appLink)} />;
                                    }
                                    return null;
                                })}
                            </div>
                            {isDesktop && (
                                <div className='wallets-modal-trade-wrapper__footer-installations-qr'>
                                    <QRCode size={80} value={PlatformDetails[platform].link} />
                                    <WalletText align='center' size='xs'>
                                        Scan the QR code to download {PlatformDetails[platform].title}
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
