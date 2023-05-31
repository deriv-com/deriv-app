import React from 'react';
import { QRCode } from 'react-qrcode';
import { TCFDsPlatformType } from 'Components/props.types';
import {
    getDXTradeWebTerminalLink,
    getDerivEzWebTerminalLink,
    platformsText,
    platformsIcons,
    mobileDownloadLink,
} from './constants';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile, OSDetect, isDesktopOs } from '@deriv/shared';
import { TCFDDashboardContainer } from 'Containers/props.types';

export const getPlatformQRCode = (acc_type: TCFDsPlatformType) => {
    const qr_code_width = isMobile() ? '100%' : '80%';
    const os = OSDetect();
    const checkForDesktop = isDesktopOs() ? (os === 'mac' ? 'ios' : 'android') : os;

    return (
        <React.Fragment>
            <QRCode
                value={platformsText(acc_type) === 'EZ' ? 'https://onelink.to/bkdwkd' : 'https://onelink.to/grmtyx'}
                size={5}
                style={{ height: 'auto', maxWidth: '100%', width: qr_code_width }}
            />
            <Text align='center' size='xxs'>
                <Localize
                    i18n_default_text='Scan the QR code to download Deriv {{ platform }}.'
                    values={{ platform: platformsText(acc_type) === 'EZ' ? 'GO' : platformsText(acc_type) }}
                />
            </Text>
        </React.Fragment>
    );
};

type TPlatformsDesktopDownload = {
    platform: TCFDsPlatformType;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    derivez_tokens: TCFDDashboardContainer['derivez_tokens'];
    is_demo: string;
};

export const PlatformsDesktopDownload = ({
    platform,
    dxtrade_tokens,
    derivez_tokens,
    is_demo,
}: TPlatformsDesktopDownload) => {
    const PlatformsDesktopDownloadLinks = () => {
        switch (platform) {
            case 'derivez':
                return getDerivEzWebTerminalLink(
                    is_demo ? 'demo' : 'real',
                    derivez_tokens && derivez_tokens[is_demo ? 'demo' : 'real']
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
                className='cfd-trade-modal__dxtrade-button'
                href={PlatformsDesktopDownloadLinks()}
                target='_blank'
                rel='noopener noreferrer'
            >
                <Icon
                    className='cfd-trade-modal__dxtrade-button-icon'
                    icon={`IcBrand${platformsIcons(platform)}Wordmark`}
                    size={36}
                />
                <div className='cfd-trade-modal__dxtrade-button-text'>
                    <Text color='colored-background' size='xxs' weight='bold'>
                        <Localize i18n_default_text='Web terminal' />
                    </Text>
                </div>
            </a>
        </React.Fragment>
    );
};
