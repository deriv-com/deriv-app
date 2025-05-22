/**
 * This file contains the URLs for different platforms and environments.
 * urlConfig will be sent as a proposal to the backend.
 */

/**
 * URLs for the cTrader platform.
 */
export const ctraderLinks = {
    android: 'https://play.google.com/store/apps/details?id=com.deriv.ct',
    ios: 'https://apps.apple.com/us/app/deriv-ctrader/id6466996509',
    live: 'https://ct.deriv.com',
    mac: 'https://getctradermac.com/deriv/ctrader-deriv-setup.dmg',
    staging: 'https://ct-uat.deriv.com',
    windows: 'https://getctrader.com/deriv/ctrader-deriv-setup.exe',
};

/**
 * URLs for the dxTrade platform.
 */
export const dxtradeLinks = {
    android: 'https://play.google.com/store/apps/details?id=com.deriv.dx',
    demo: 'https://dx-demo.deriv.com',
    huawei: 'https://appgallery.huawei.com/app/C104633219',
    ios: 'https://apps.apple.com/us/app/deriv-x/id1563337503',
    live: 'https://dx.deriv.com',
};

/**
 * Static URLs for the mt5 platforms, which are unavailable from the mt5_login_list endpoint
 */
export const whiteLabelLinks = {
    huawei: 'https://appgallery.huawei.com/#/app/C102015329',
    linux: 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux',
    macos: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg',
};
