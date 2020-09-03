import React from 'react';
import { PlatformContext } from 'App/platform-context';

const PlatformConfig = ({ ...props }) => {
    const [deriv_crypto, setDerivCrypto] = React.useState(process.env.crypto || false);
    const [deriv_theme, setDerivTheme] = React.useState(process.env.crypto ? 'crypto' : 'deriv');

    const platform_store = {
        deriv_crypto,
        setDerivCrypto,
        deriv_theme,
        setTheme: theme => {
            let color_scheme = {};
            if (theme === 'crypto') {
                color_scheme = {
                    'brand-dark-grey': '#444444',
                    'brand-red-coral': '#00b3c3',
                    'brand-orange': '#7965d9',
                    'brand-secondary': '#2f96f0',
                    'purchase-main-1': '#d7669c',
                    'purchase-section-1': '#662745',
                    'purchase-main-2': '#ba673f',
                    'purchase-section-2': '#673b25',
                };
                setDerivTheme('crypto');
            } else {
                color_scheme = {
                    'brand-dark-grey': '#444444',
                    'brand-red-coral': '#a90533',
                    'brand-orange': '#f8449b',
                    'brand-secondary': '#529d07',
                    'purchase-main-1': '#93ae86',
                    'purchase-section-1': '#2eba24',
                    'purchase-main-2': '#c10f36',
                    'purchase-section-2': '#430317',
                };
                setDerivTheme('deriv');
            }
            Object.entries(color_scheme).forEach(([variable, value]) => {
                document.documentElement.style.setProperty(`--${variable}`, value);
            });
        },
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformConfig;
