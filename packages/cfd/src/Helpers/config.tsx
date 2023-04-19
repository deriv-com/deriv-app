import React from 'react';
import { QRCode } from 'react-qrcode';
import { TCFDsPlatformType } from 'Components/props.types';
import {
    getPlatformDXTradeDownloadLink,
    getPlatformCTraderDownloadLink,
    getPlatformDerivEZDownloadLink,
    getDXTradeWebTerminalLink,
    platformsText,
    DERIVEZ_URL,
    CTRADER_URL,
} from './constants';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile, OSDetect, isDesktopOs, CFD_PLATFORMS } from '@deriv/shared';
import { TCFDDashboardContainer } from 'Containers/props.types';

export const mobileDownloadLink = (platform: TCFDsPlatformType, type: 'ios' | 'android' | 'huawei') => {
    switch (platform) {
        case 'dxtrade':
            return getPlatformDXTradeDownloadLink(type);
        case 'ctrader':
            return getPlatformCTraderDownloadLink(type);
        case 'derivez':
            return getPlatformDerivEZDownloadLink(type);
        default:
            return getPlatformDXTradeDownloadLink(type);
    }
};

export const getPlatformQRCode = (acc_type: TCFDsPlatformType) => {
    const qr_code_mobile = isMobile() ? '100%' : '80%';
    const os = OSDetect();
    const checkForDesktop = isDesktopOs() ? (os === 'mac' ? 'ios' : 'android') : os;

    return (
        <React.Fragment>
            <QRCode
                value={mobileDownloadLink(acc_type, checkForDesktop)}
                size={5}
                style={{ height: 'auto', maxWidth: '100%', width: qr_code_mobile }}
            />
            <Text align='center' size='xxs'>
                <Localize
                    i18n_default_text='Scan the QR code to download {{deriv}} {{ platform }}.'
                    values={{
                        platform: platformsText(acc_type),
                        deriv: acc_type !== CFD_PLATFORMS.CTRADER ? 'Deriv' : '',
                    }}
                />
            </Text>
        </React.Fragment>
    );
};

type TPlatformsDesktopDownload = {
    platform: TCFDsPlatformType;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    is_demo: string;
};

export const PlatformsDesktopDownload = ({ platform, dxtrade_tokens, is_demo }: TPlatformsDesktopDownload) => {
    const PlatformsDesktopDownloadLinks = () => {
        switch (platform) {
            case 'ctrader':
                return CTRADER_URL;
            case 'derivez':
                return DERIVEZ_URL;
            case 'dxtrade':
                return getDXTradeWebTerminalLink(
                    is_demo ? 'demo' : 'real',
                    dxtrade_tokens && dxtrade_tokens[is_demo ? 'demo' : 'real']
                );
            default:
                return '';
        }
    };

    const platforms_icons = () => {
        switch (platform) {
            case 'ctrader':
                return 'Ctrader';
            case 'derivez':
                return 'DerivEz';
            case 'dxtrade':
                return 'Dxtrade';
            default:
                return '';
        }
    };

    return (
        <React.Fragment>
            <a
                className='cfd-trade-modal__dxtrade-button'
                href={PlatformsDesktopDownloadLinks()}
                target='_blank'
                rel='noopener noreferrer'
            >
                {platform === 'ctrader' ? (
                    <Icon
                        className='cfd-trade-modal__dxtrade-button-icon'
                        icon={`IcBrandCtraderWordmark`}
                        width={57}
                        height={11}
                    />
                ) : (
                    <Icon
                        className='cfd-trade-modal__dxtrade-button-icon'
                        icon={`IcBrand${platforms_icons()}Wordmark`}
                        width={42}
                        height={11}
                    />
                )}
                <div className='cfd-trade-modal__dxtrade-button-text'>
                    <Text color='colored-background' size='xxs' weight='bold'>
                        <Localize i18n_default_text='Web terminal' />
                    </Text>
                </div>
            </a>
        </React.Fragment>
    );
};
