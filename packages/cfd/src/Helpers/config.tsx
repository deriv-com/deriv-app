import React from 'react';
import { QRCode } from 'react-qrcode';
import { TCFDsPlatformType } from 'Components/props.types';
import {
    getPlatformDXTradeDownloadLink,
    getPlatformCTraderDownloadLink,
    getPlatformDerivEZDownloadLink,
    getDXTradeWebTerminalLink,
    getDerivEzWebTerminalLink,
    getCTraderWebTerminalLink,
    platformsText,
    platformsIcons,
} from './constants';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
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
    switch (acc_type) {
        case 'derivez':
            return 'https://onelink.to/bkdwkd';
        case 'dxtrade':
            return 'https://onelink.to/grmtyx';
        case 'ctrader':
            return 'https://onelink.to/yvk2a5';
        default:
            return 'https://onelink.to/grmtyx';
    }
};

type TPlatformsDesktopDownload = {
    platform: TCFDsPlatformType;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    ctrader_tokens: TCFDDashboardContainer['ctrader_tokens'];
    derivez_tokens: TCFDDashboardContainer['derivez_tokens'];
    is_demo: string;
};

export const PlatformsDesktopDownload = ({
    platform,
    dxtrade_tokens,
    ctrader_tokens,
    derivez_tokens,
    is_demo,
}: TPlatformsDesktopDownload) => {
    const PlatformsDesktopDownloadLinks = () => {
        switch (platform) {
            case 'ctrader':
                return getCTraderWebTerminalLink(
                    is_demo ? 'demo' : 'real',
                    ctrader_tokens && ctrader_tokens[is_demo ? 'demo' : 'real']
                );

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
