import React from 'react';
import { QRCode } from 'react-qrcode';

import { Icon, Text } from '@deriv/components';
import { CFD_PLATFORMS, isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';

import { TCFDsPlatformType } from 'Components/props.types';
import { TCFDDashboardContainer } from 'Containers/props.types';

import {
    getCTraderWebTerminalLink,
    getDXTradeWebTerminalLink,
    getPlatformCTraderDownloadLink,
    getPlatformDXTradeDownloadLink,
    platformsIcons,
    platformsText,
} from './constants';

export const mobileDownloadLink = (platform: TCFDsPlatformType, type: 'ios' | 'android' | 'huawei') => {
    switch (platform) {
        case 'dxtrade':
            return getPlatformDXTradeDownloadLink(type);
        case 'ctrader':
            return getPlatformCTraderDownloadLink(type);
        default:
            return getPlatformDXTradeDownloadLink(type);
    }
};

export const getPlatformQRCode = (acc_type: TCFDsPlatformType) => {
    const qr_code_mobile = isMobile() ? '100%' : '80%';

    const QRCodeLinks = () => {
        switch (acc_type) {
            case 'dxtrade':
                return 'https://onelink.to/grmtyx';
            case 'ctrader':
                return 'https://onelink.to/hyqpv7';
            default:
                return 'https://onelink.to/grmtyx';
        }
    };

    return (
        <React.Fragment>
            <QRCode
                value={QRCodeLinks()}
                size={5}
                style={{ height: 'auto', maxWidth: '100%', width: qr_code_mobile }}
            />
            <Text align='center' size='xxs'>
                <Localize
                    i18n_default_text='Scan the QR code to download Deriv {{ platform }}.'
                    values={{ platform: platformsText(acc_type) }}
                />
            </Text>
        </React.Fragment>
    );
};

type TPlatformsDesktopDownload = {
    platform: TCFDsPlatformType;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    ctrader_tokens: TCFDDashboardContainer['ctrader_tokens'];
    is_demo: string;
};

export const PlatformsDesktopDownload = ({
    platform,
    dxtrade_tokens,
    ctrader_tokens,
    is_demo,
}: TPlatformsDesktopDownload) => {
    const PlatformsDesktopDownloadLinks = () => {
        switch (platform) {
            case 'ctrader':
                return getCTraderWebTerminalLink(
                    is_demo ? 'demo' : 'real',
                    ctrader_tokens && ctrader_tokens[is_demo ? 'demo' : 'real']
                );
            case 'dxtrade':
                return getDXTradeWebTerminalLink(
                    is_demo ? 'demo' : 'real',
                    dxtrade_tokens && dxtrade_tokens[is_demo ? 'demo' : 'real']
                );
            default:
                return '';
        }
    };

    return (
        <React.Fragment>
            <a
                className='cfd-trade-modal__platform-button'
                href={PlatformsDesktopDownloadLinks()}
                target='_blank'
                rel='noopener noreferrer'
            >
                {platform === CFD_PLATFORMS.CTRADER ? (
                    <Icon
                        className='cfd-trade-modal__platform-button-icon'
                        icon={`IcBrand${platformsIcons(platform)}Wordmark`}
                        width={60}
                        height={30}
                    />
                ) : (
                    <Icon
                        className='cfd-trade-modal__platform-button-icon'
                        icon={`IcBrand${platformsIcons(platform)}Wordmark`}
                        size={36}
                    />
                )}
                <div className='cfd-trade-modal__platform-button-text'>
                    <Text color='colored-background' size='xxs' weight='bold'>
                        <Localize i18n_default_text='Web terminal' />
                    </Text>
                </div>
            </a>
        </React.Fragment>
    );
};
