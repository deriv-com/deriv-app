import React from "react";
import NetworkStatus from "./components/network-status.jsx";
import ServerTime from "./components/server-time.jsx";
import ToggleFullScreen from "./components/toggle-fullscreen.jsx";
import LanguageSelector from "./components/language-selector.jsx";
import config from "../../../../../app.config";

const FooterIconSeparator = () => <div className="footer-icon-separator" />;

const HelpCenter = () => (
    <a id="help-center" className="footer__link" href={config.help_center.url} target="_blank">
        <img src="image/deriv/ic-help-centre.svg" />
    </a>
);

const Footer = () => {
    return (
        <footer className="footer">
            <NetworkStatus />
            <FooterIconSeparator />
            <LanguageSelector />
            <FooterIconSeparator />
            <ServerTime />
            <FooterIconSeparator />
            <div className="footer__links">
                {config.help_center.visible && <>
                    <HelpCenter />
                    <FooterIconSeparator />
                </>}
                <ToggleFullScreen />
            </div>
        </footer>
    );
};

export default Footer;
