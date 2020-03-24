import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';

const MT5DashboardContainer = () => (
    <div className='mt5-dashboard__download-center'>
        <h1 className='mt5-dashboard__download-center--heading'>
            <Localize i18n_default_text='Download MT5 for your desktop or mobile' />
        </h1>

        <div className='mt5-dashboard__download-center-options'>
            <div className='mt5-dashboard__download-center-options--desktop'>
                <div className='mt5-dashboard__download-center-options--desktop-devices'>
                    <Icon icon='IcMt5DeviceDesktop' width={118} height={85} />
                    <Icon icon='IcMt5DeviceLaptop' width={75} height={51} />
                    <a
                        href='https://trade.mql5.com/trade?servers=Binary.com-Server&trade_server=Binary.com-Server'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationWeb' width={196} height={28} />
                    </a>
                </div>
                <div className='mt5-dashboard__download-center-options--desktop-links'>
                    <a
                        href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationWindows' width={138} height={40} />
                    </a>
                    <a
                        href='https://deriv.s3-ap-southeast-1.amazonaws.com/deriv-mt5.dmg'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationMac' width={125} height={40} />
                    </a>
                    <a
                        href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationLinux' width={138} height={40} />
                    </a>
                </div>
            </div>
            <div className='mt5-dashboard__download-center-options--mobile'>
                <div className='mt5-dashboard__download-center-options--mobile-devices'>
                    <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                    <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                </div>
                <div className='mt5-dashboard__download-center-options--mobile-links'>
                    <a
                        href='https://download.mql5.com/cdn/mobile/mt5/ios?server=Binary.com-Server'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationApple' width={135} height={40} />
                    </a>
                    <a
                        href='https://download.mql5.com/cdn/mobile/mt5/android?server=Binary.com-Server'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon icon='IcInstallationGoogle' width={135} height={40} />
                    </a>
                </div>
            </div>
        </div>
        <p className='mt5-dashboard__download-center--hint'>
            <Localize i18n_default_text='The DMT5 platform is not supported by macOS Catalina, Windows XP, Windows 2003, and Windows Vista.' />
        </p>
    </div>
);

export default MT5DashboardContainer;
