import React from 'react';
import './mt5-mobile-download-option.scss';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getDownloadOptions, getPlatformMt5DownloadLink } from '../Helpers/constants';
import { CFD_PLATFORMS, getCFDPlatformLabel, getPlatformSettings, getUrlBase } from '@deriv/shared';

const MT5MobileDownloadOption = ({ account_title, mt5_trade_account }: any) => {
    const desktopDownloadOptions = getDownloadOptions(mt5_trade_account).filter(option => option.device === 'desktop');

    return (
        <>
            <div className='cfd-trade-modal__download-center-app'>
                {desktopDownloadOptions.map((option, index) => (
                    <div
                        key={index}
                        className={`cfd-trade-modal__download-center-app--option ${
                            index > 0 ? 'cfd-trade-modal__download-center-app--option-hide' : ''
                        }`}
                    >
                        <Icon icon={option.icon} size={32} />
                        <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                            {option.text}
                        </Text>
                        <a
                            className='dc-btn cfd-trade-modal__download-center-app--option-link'
                            type='button'
                            href={option.href}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Text size='xxs' weight='bold' color='prominent'>
                                {option.button_text || localize('Download')}
                            </Text>
                        </a>
                    </div>
                ))}
            </div>
            <Text align='center' as='div' className='cfd-trade-modal__download-center-text' size='xxs' weight='bold'>
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

export default MT5MobileDownloadOption;
