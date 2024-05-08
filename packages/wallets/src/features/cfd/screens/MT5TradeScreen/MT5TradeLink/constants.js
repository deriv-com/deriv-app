import { DESKTOP_PLATFORMS, MOBILE_PLATFORMS } from '../../../constants';
import { mobileOSDetectAsync, OSDetect } from './mobileOsDetect';
import { whiteLabelLinks } from './urlConfig';

export const getPlatformMt5DownloadLink = platform => {
    switch (platform || OSDetect()) {
        case DESKTOP_PLATFORMS.LINUX:
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case DESKTOP_PLATFORMS.MACOS:
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case MOBILE_PLATFORMS.HAUWEI:
            return 'https://appgallery.huawei.com/#/app/C102015329';
        default:
            return '';
    }
};

export const getMobileAppInstallerURL = async ({ mt5TradeAccount }) => {
    const os = await mobileOSDetectAsync();

    if (os === 'iOS') {
        return mt5TradeAccount?.white_label_links?.ios;
    } else if (os === 'huawei') {
        return getPlatformMt5DownloadLink('huawei');
    }
    return mt5TradeAccount?.white_label_links?.android;
};

export const getDesktopDownloadOptions = ({ mt5TradeAccount }) => {
    const downloadOptions = [
        {
            button_text: 'Open',
            href: getWebtraderUrl({ mt5TradeAccount }),
            icon: 'IcRebrandingMt5Logo',
            text: 'MetaTrader 5 web',
        },
        {
            button_text: 'Download',
            href: mt5TradeAccount?.white_label_links?.windows,
            icon: 'IcWindowsLogo',
            text: 'MetaTrader 5 Windows app',
        },
        {
            button_text: 'Download',
            href: getPlatformMt5DownloadLink('macos'),
            icon: 'IcMacosLogo',
            text: 'MetaTrader 5 MacOS app',
        },
        {
            button_text: 'Learn more',
            href: getPlatformMt5DownloadLink('linux'),
            icon: 'IcLinuxLogo',
            text: 'MetaTrader 5 Linux app',
        },
    ];

    return downloadOptions;
};

export const getMobileDownloadOptions = ({ mt5TradeAccount }) => [
    {
        href: mt5TradeAccount?.white_label_links?.ios,
        icon: 'IcInstallationApple',
    },
    {
        href: mt5TradeAccount?.white_label_links?.android,
        icon: 'IcInstallationGoogle',
    },
    {
        href: getPlatformMt5DownloadLink('huawei'),
        icon: 'IcInstallationHuawei',
    },
];

export const getWebtraderUrl = ({ mt5TradeAccount }) => {
    return `${mt5TradeAccount?.white_label_links?.webtrader_url}?login=${mt5TradeAccount?.display_login}&server=${mt5TradeAccount?.server_info?.environment}`;
};

export const getDeeplinkUrl = ({ mt5TradeAccount }) => {
    return `metatrader5://account?login=${mt5TradeAccount?.display_login}&server=${mt5TradeAccount?.server_info?.environment}`;
};

export const getMobileAppInstallerUrl = async ({ mt5TradeAccount }) => {
    const os = await mobileOSDetectAsync();
    if (os === 'iOS') {
        return mt5TradeAccount?.white_label_links?.ios;
    } else if (os === 'huawei') {
        return whiteLabelLinks?.huawei;
    }
    return mt5TradeAccount?.white_label_links?.android;
};
