import React from 'react';
import { observer, useStore } from '@deriv/stores';
import TutorialsTabMobile from './tutorials-tab-mobile';
import TutorialsTabDesktop from './tutorials-tab-desktop';
import { useDBotStore } from 'Stores/useDBotStore';
import { generateTutorialTabs } from './common/common-tabs';

const TutorialsTab = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard } = useDBotStore();
    const [prev_active_tutorials, setPrevActiveTutorialsTab] = React.useState<number | null>(0);

    const { active_tab_tutorials, guide_tab_content, faq_tab_content } = dashboard;

    React.useEffect(() => {
        const _active_tab = [0, 1];
        if (_active_tab.includes(active_tab_tutorials)) {
            setPrevActiveTutorialsTab(active_tab_tutorials);
        }
    }, [active_tab_tutorials]);

    const tutorial_tabs = generateTutorialTabs({
        guide_tab_content,
        faq_tab_content,
    });

    return is_mobile ? (
        <TutorialsTabMobile tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    ) : (
        <TutorialsTabDesktop tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    );
});

export default TutorialsTab;
