import React from 'react';
import './mt5-mobile-download-option.scss';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getPlatformMt5DownloadLink } from '../Helpers/constants';
import { CFD_PLATFORMS, getCFDPlatformLabel, getPlatformSettings, getUrlBase } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const MT5MobileDownloadOption = ({ account_title, mt5_trade_account }: any) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <>
            <div className='cfd-trade-modal__download-center-app'>
                <div className='cfd-trade-modal__download-center-app--option'>
                    <Icon icon='IcRebrandingMt5Logo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 web')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={mt5_trade_account.webtrader_url}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold' color='prominent'>
                            {localize('Open')}
                        </Text>
                    </a>
                </div>

                <div className='cfd-trade-modal__download-center-app--option cfd-trade-modal__download-center-app--option-hide'>
                    <Icon icon='IcWindowsLogo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 Windows app')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={mt5_trade_account?.white_label?.download_links?.windows}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold' color='prominent'>
                            {localize('Download')}
                        </Text>
                    </a>
                </div>

                <div className='cfd-trade-modal__download-center-app--option cfd-trade-modal__download-center-app--option-hide'>
                    <Icon icon='IcMacosLogo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 MacOS app')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={getPlatformMt5DownloadLink('macos')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold' color='prominent'>
                            {localize('Download')}
                        </Text>
                    </a>
                </div>
                <div className='cfd-trade-modal__download-center-app--option cfd-trade-modal__download-center-app--option-hide'>
                    <Icon icon='IcLinuxLogo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 Linux app')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={getPlatformMt5DownloadLink('linux')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold' color='prominent'>
                            {localize('Learn more')}
                        </Text>
                    </a>
                </div>
            </div>
            <Text
                align='center'
                as='div'
                className='cfd-trade-modal__download-center-text'
                size={is_mobile ? 'xxxs' : 'xxs'}
                weight='bold'
            >
                {localize(
                    'Download {{ platform }} on your phone to trade with the {{ platform }} {{ account }} account',
                    {
                        platform: getCFDPlatformLabel(CFD_PLATFORMS.MT5),
                        account: account_title,
                    }
                )}
            </Text>
            <div className='cfd-trade-modal__download-center-options'>
                <div className='cfd-trade-modal__download-center-options--mobile-links'>
                    <a
                        href={mt5_trade_account?.white_label?.download_links?.ios}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationApple' width={135} height={40} />
                    </a>
                    <a
                        href={mt5_trade_account?.white_label?.download_links?.android}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationGoogle' width={135} height={40} />
                    </a>
                    <a href={getPlatformMt5DownloadLink('huawei')} target='_blank' rel='noopener noreferrer'>
                        <Icon icon='IcInstallationHuawei' width={135} height={40} />
                    </a>
                </div>

                <div className='cfd-trade-modal__download-center-options--qrcode cfd-trade-modal__download-center-options--qrcode-hide'>
                    <img src={getUrlBase('/public/images/common/mt5_download.png')} width={80} height={80} />
                    <Text align='center' size='xxs'>
                        {localize('Scan the QR code to download {{ platform }}.', {
                            platform: getPlatformSettings('mt5').name,
                        })}
                    </Text>
                </div>
            </div>
        </>
    );
};

export default observer(MT5MobileDownloadOption);
