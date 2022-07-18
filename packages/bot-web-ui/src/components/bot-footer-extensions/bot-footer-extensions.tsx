import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import SecurityAndPrivacy from './security-and-privacy';
import FooterTabs from './footer-tabs';

type TPopulateFooterExtensionsProps = {
    position: string;
    Component: React.FC;
    has_right_separator: boolean;
};

type TBotFooterExtentionsProps = {
    active_tab: string;
    populateFooterExtensions: (footer_extensions: TPopulateFooterExtensionsProps[]) => void;
    setActiveTab: (tab_title: string) => void;
};

const BotFooterExtensions = ({ active_tab, populateFooterExtensions, setActiveTab }: TBotFooterExtentionsProps) => {
    React.useEffect(() => populateFooter());
    React.useEffect(() => () => populateFooterExtensions([]), [populateFooterExtensions]);

    const populateFooter = () => {
        populateFooterExtensions([
            {
                position: 'left',
                Component: () => <FooterTabs active_tab={active_tab} setActiveTab={setActiveTab} />,
                has_right_separator: false,
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

export default connect(({ ui, main_content }: RootStore) => ({
    active_tab: main_content.active_tab,
    populateFooterExtensions: ui.populateFooterExtensions,
    setActiveTab: main_content.setActiveTab,
}))(BotFooterExtensions);
