import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { tabs_title } from 'Constants/bot-contents';
import { connect } from 'Stores/connect';

const SecurityAndPrivacy = () => (
    <Popover alignment='top' message={localize('Security and privacy')}>
        <StaticUrl className='footer__link' href='tnc/security-and-privacy.pdf' is_document>
            <Icon icon='IcSecurityAndPrivacy' />
        </StaticUrl>
    </Popover>
);

const BotFooterExtensions = ({ active_tab, populateFooterExtensions, setActiveTab }) => {
    React.useEffect(() => populateFooter());
    React.useEffect(() => () => populateFooterExtensions([]), []);

    const FooterTabs = () => (
        <div className='bot-footer-extensions'>
            {Object.keys(tabs_title).map(key => {
                const tab_title = tabs_title[key];
                return (
                    <span
                        key={key}
                        className={classNames('bot-footer-extensions__button', {
                            'bot-footer-extensions__button--active': active_tab === tab_title,
                        })}
                        onClick={() => setActiveTab(tab_title)}
                    >
                        {tab_title === tabs_title.WORKSPACE && <Localize i18n_default_text='Workspace' />}
                        {tab_title === tabs_title.CHART && <Localize i18n_default_text='Chart' />}
                    </span>
                );
            })}
        </div>
    );

    const populateFooter = () => {
        populateFooterExtensions([
            {
                position: 'left',
                Component: FooterTabs,
            },
            {
                position: 'right',
                Component: SecurityAndPrivacy,
                has_right_separator: true,
            },
        ]);
    };

    return null;
};

BotFooterExtensions.propTypes = {
    active_tab: PropTypes.string,
    populateFooterExtensions: PropTypes.func,
    setActiveTab: PropTypes.func,
};

export default connect(({ ui, main_content }) => ({
    active_tab: main_content.active_tab,
    populateFooterExtensions: ui.populateFooterExtensions,
    setActiveTab: main_content.setActiveTab,
}))(BotFooterExtensions);
