import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getMT5WebTerminalLink, getPlatformMt5DownloadLink } from '../Helpers/constants';

const MT5DashboardContainer = () => (
    <div className='mt5-dashboard__download-center'>
        <h1 className='mt5-dashboard__download-center--heading'>
            <Localize i18n_default_text='Run MT5 from your browser or download the MT5 app for your devices' />
        </h1>

        <div className='mt5-dashboard__download-center-options'>
            <div className='mt5-dashboard__download-center-options--desktop'>
                <div className='mt5-dashboard__download-center-options--desktop-devices'>
                    <Icon icon='IcMt5DeviceDesktop' width={118} height={85} />
                    <Icon icon='IcMt5DeviceLaptop' width={75} height={51} />
                    <a href={getMT5WebTerminalLink({ category: 'demo' })} target='_blank' rel='noopener noreferrer'>
                        <Icon icon='IcInstallationWebDemo' width={138} height={40} />
                    </a>
                </div>
                <div className='mt5-dashboard__download-center-options--desktop-links'>
                    <a
                        className='mt5-dashboard__download-center-options--desktop-link'
                        href={getPlatformMt5DownloadLink('windows')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationWindows' width={138} height={40} />
                    </a>
                    <a
                        className='mt5-dashboard__download-center-options--desktop-link'
                        href={getPlatformMt5DownloadLink('linux')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationLinux' width={138} height={40} />
                    </a>
                    <a
                        className='mt5-dashboard__download-center-options--desktop-link--top'
                        href={getMT5WebTerminalLink({ category: 'real' })}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationWebReal' width={138} height={40} />
                    </a>
                </div>
                <p className='mt5-dashboard__download-center--hint'>
                    <Localize i18n_default_text='The MT5 desktop app is not supported by macOS, Windows XP, Windows 2003, and Windows Vista.' />
                </p>
            </div>
            <div className='mt5-dashboard__download-center-options--mobile'>
                <div className='mt5-dashboard__download-center-options--mobile-devices'>
                    <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                    <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                </div>
                <div className='mt5-dashboard__download-center-options--mobile-links'>
                    <a
                        className='mt5-dashboard__download-center-options--mobile-link'
                        href={getPlatformMt5DownloadLink('android')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationGoogle' width={135} height={40} />
                    </a>
                    <a
                        className='mt5-dashboard__download-center-options--mobile-link'
                        href={getPlatformMt5DownloadLink('ios')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationApple' width={120} height={40} />
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default MT5DashboardContainer;
