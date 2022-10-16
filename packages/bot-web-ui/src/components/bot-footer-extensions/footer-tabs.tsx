import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { tabs_title } from 'Constants/bot-contents';

type TFooterTabsProps = {
    active_tab: string;
    setActiveTab: (tab_title: string) => void;
};

const FooterTabs = ({ active_tab, setActiveTab }: TFooterTabsProps) => (
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

export default FooterTabs;
