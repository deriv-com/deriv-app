import React from 'react';
import classnames from 'classnames';
import { QRCode } from 'react-qrcode';
import { Icon, Text, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { CFD_PLATFORMS, isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import {
    getDXTradeWebTerminalLink,
    getPlatformDXTradeDownloadLink,
    getPlatformMt5DownloadLink,
} from '../Helpers/constants';
import { general_messages } from '../Constants/cfd-shared-strings';
import { TCFDDashboardContainer } from './props.types';

type TDxtradeDesktopDownloadProps = {
    active_index: TCFDDashboardContainer['active_index'];
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
};

type TMobileDownloadProps = {
    is_dark_mode_on: TCFDDashboardContainer['is_dark_mode_on'];
    platform: TCFDDashboardContainer['platform'];
};

const mobileDownloadLink = (platform: string, type: 'ios' | 'android' | 'huawei') => {
    return platform === CFD_PLATFORMS.MT5 ? getPlatformMt5DownloadLink(type) : getPlatformDXTradeDownloadLink(type);
};

const DxtradeDesktopDownload = ({ active_index, dxtrade_tokens }: TDxtradeDesktopDownloadProps) => {
    return (
        <React.Fragment>
            <h1 className='cfd-dashboard__download-container-heading'>{localize('Run Deriv X on your browser')}</h1>
            <a
                className='cfd-dashboard__download-container-dxtrade-button'
                href={getDXTradeWebTerminalLink(
                    active_index === 0 ? 'real' : 'demo',
                    dxtrade_tokens && dxtrade_tokens[active_index === 0 ? 'real' : 'demo']
                )}
                target='_blank'
                rel='noopener noreferrer'
            >
                <Icon
                    className='cfd-dashboard__download-container-dxtrade-button-icon'
                    icon='IcBrandDxtrade'
                    width={32}
                    height={32}
                />
                <div className='cfd-dashboard__download-container-dxtrade-button-text'>
                    <Text color='colored-background' size='xxs' weight='bold'>
                        <Localize i18n_default_text='Web terminal' />
                    </Text>
                </div>
            </a>
        </React.Fragment>
    );
};

const MT5DesktopDownload = () => {
    return (
        <React.Fragment>
            <div className='cfd-dashboard__download-container-links-icons'>
                <Icon icon='IcMt5DeviceDesktop' width={118} height={85} />
                <Icon icon='IcMt5DeviceLaptop' width={75} height={51} />
            </div>
            <div className='cfd-dashboard__download-container-links-download-buttons'>
                <a href={getPlatformMt5DownloadLink('windows')} target='_blank' rel='noopener noreferrer'>
                    <Icon icon='IcInstallationWindows' width={138} height={40} />
                </a>
                <a href={getPlatformMt5DownloadLink('macos')} target='_blank' rel='noopener noreferrer'>
                    <Icon icon='IcInstallationMacos' width={138} height={40} />
                </a>
                <a href={getPlatformMt5DownloadLink('linux')} target='_blank' rel='noopener noreferrer'>
                    <Icon icon='IcInstallationLinux' width={138} height={40} />
                </a>
            </div>
            <Text as='p' align='center' size='xxxs' className='cfd-dashboard__download-center--hint'>
                <Localize i18n_default_text='The MT5 desktop app is not supported by Windows XP, Windows 2003, and Windows Vista.' />
            </Text>
        </React.Fragment>
    );
};

const MobileDownload = ({ is_dark_mode_on, platform }: TMobileDownloadProps) => {
    return (
        <React.Fragment>
            {platform === CFD_PLATFORMS.DXTRADE && (
                <h1 className='cfd-dashboard__download-container-heading'>
                    {localize('Download the Deriv X mobile app')}
                </h1>
            )}
            <div
                className={classnames({
                    'cfd-dashboard__download-container-links-icons': isMobile() || platform === CFD_PLATFORMS.MT5,
                })}
            >
                {isMobile() && platform === CFD_PLATFORMS.DXTRADE && (
                    <React.Fragment>
                        <Icon
                            icon={is_dark_mode_on ? 'IcDxtradeDeviceTabletLight' : 'IcDxtradeDeviceTablet'}
                            width={133}
                            height={106}
                        />
                        <Icon
                            icon={is_dark_mode_on ? 'IcDxtradeDevicePhoneLight' : 'IcDxtradeDevicePhone'}
                            width={48}
                            height={74}
                        />
                    </React.Fragment>
                )}
                {platform === CFD_PLATFORMS.MT5 && (
                    <React.Fragment>
                        <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                        <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                    </React.Fragment>
                )}
            </div>
            <div className='cfd-dashboard__download-container-links-download-buttons'>
                <a
                    className='cfd-dashboard__download-center-options--mobile-link'
                    href={mobileDownloadLink(platform, 'android')}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon icon='IcInstallationGoogle' width={135} height={40} />
                </a>
                <a
                    className='cfd-dashboard__download-center-options--mobile-link'
                    href={mobileDownloadLink(platform, 'ios')}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon icon='IcInstallationApple' width={120} height={40} />
                </a>
                <a
                    className='cfd-dashboard__download-center-options--mobile-link'
                    href={mobileDownloadLink(platform, 'huawei')}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon icon='IcInstallationHuawei' width={120} height={40} />
                </a>
            </div>
        </React.Fragment>
    );
};

const QRCodeBox = ({ platform }: { platform: string }) => {
    return (
        <DesktopWrapper>
            <div className='cfd-dashboard__download-container-qrcode'>
                <QRCode value={mobileDownloadLink(platform, 'android')} size={160} />
                <span className='cfd-dashboard__download-container-qrcode__hint'>
                    {localize('Scan the QR code to download the Deriv X Mobile App')}
                </span>
            </div>
        </DesktopWrapper>
    );
};

const CFDDownloadContainer = ({ platform, is_dark_mode_on, active_index, dxtrade_tokens }: TCFDDashboardContainer) => {
    return (
        <React.Fragment>
            <MobileWrapper>
                <Text
                    className='cfd-dashboard__download-container-mobile-hint'
                    color='general'
                    size='xxs'
                    weight='400'
                    align='center'
                >
                    <Localize i18n_default_text='If you have the app, launch it to start trading.' />
                </Text>
            </MobileWrapper>
            <div
                className={classnames('cfd-dashboard__download-container', {
                    'cfd-dashboard__download-container--is-mt5': platform === CFD_PLATFORMS.MT5,
                })}
                data-testid='dt_cfd_dashboard_download_center_container'
            >
                {platform === CFD_PLATFORMS.MT5 && (
                    <h1 className='cfd-dashboard__download-container-heading'>
                        {isDesktop() ? general_messages.getDownloadHeader(platform) : localize('Download the MT5 app')}
                    </h1>
                )}
                <div
                    className={classnames('cfd-dashboard__download-container-links', {
                        'cfd-dashboard__download-container-links--is-mt5': platform === CFD_PLATFORMS.MT5,
                    })}
                >
                    <DesktopWrapper>
                        <div className='cfd-dashboard__download-container-links--desktop'>
                            {platform === CFD_PLATFORMS.DXTRADE && (
                                <DxtradeDesktopDownload active_index={active_index} dxtrade_tokens={dxtrade_tokens} />
                            )}
                            {platform === CFD_PLATFORMS.MT5 && <MT5DesktopDownload />}
                        </div>
                    </DesktopWrapper>

                    <div className='cfd-dashboard__download-container-links--mobile'>
                        <MobileDownload is_dark_mode_on={is_dark_mode_on} platform={platform} />
                    </div>
                </div>

                {platform === CFD_PLATFORMS.DXTRADE && <QRCodeBox platform={platform} />}
            </div>
        </React.Fragment>
    );
};

export default CFDDownloadContainer;
