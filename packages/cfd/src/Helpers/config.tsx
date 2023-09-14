import React from 'react';
import { QRCode } from 'react-qrcode';
import { TCFDsPlatformType } from 'Components/props.types';
import { getDXTradeWebTerminalLink, platformsText, platformsIcons } from './constants';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile, routes } from '@deriv/shared';
import { TCFDDashboardContainer } from 'Containers/props.types';
import { useHistory } from 'react-router-dom';

export const getPlatformQRCode = (acc_type: TCFDsPlatformType) => {
    const qr_code_width = isMobile() ? '100%' : '80%';

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
    is_demo: string;
};

export const PlatformsDesktopDownload = ({ platform, dxtrade_tokens, is_demo }: TPlatformsDesktopDownload) => {
    const history = useHistory();

    const getIconAndText = () => (
        <React.Fragment>
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
        </React.Fragment>
    );

    const derivxWebTerminal = () => (
        <a
            className='cfd-trade-modal__web-terminal-button'
            href={getDXTradeWebTerminalLink(
                is_demo ? 'demo' : 'real',
                dxtrade_tokens && dxtrade_tokens[is_demo ? 'demo' : 'real']
            )}
            target='_blank'
            rel='noopener noreferrer'
        >
            {getIconAndText()}
        </a>
    );

    const derivezWebTerminal = () => (
        <div className='cfd-trade-modal__web-terminal-button' onClick={() => history.push(routes.derivez)}>
            {getIconAndText()}
        </div>
    );

    switch (platform) {
        case 'dxtrade':
            return derivxWebTerminal();
        default:
            return derivezWebTerminal();
    }
};
