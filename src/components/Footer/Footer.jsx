import React from 'react';
import config from '@config';
import NetworkStatus from './components/network-status.jsx';
import ServerTime from './components/server-time.jsx';
import ToggleFullScreen from './components/toggle-fullscreen.jsx';
import LanguageSelector from './components/language-selector.jsx';
import './footer.scss';

const FooterIconSeparator = () => <div className='footer__icon-separator' />;

const HelpCenter = () => (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a id='help-center' className='footer__link' href={config.help_center.url} target='_blank'>
        <img src='/public/images/ic-help-centre.svg' />
    </a>
);

const Footer = () => (
    <footer className='footer'>
        <NetworkStatus />
        <FooterIconSeparator />
        <LanguageSelector />
        <FooterIconSeparator />
        <ServerTime />
        <FooterIconSeparator />
        <div className='footer__links'>
            {config.help_center.visible && (
                <>
                    <HelpCenter />
                    <FooterIconSeparator />
                </>
            )}
            <ToggleFullScreen />
        </div>
    </footer>
);

export default Footer;
