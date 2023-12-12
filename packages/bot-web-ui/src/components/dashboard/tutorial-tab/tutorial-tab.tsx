import React from 'react';
import { observer, useStore } from '@deriv/stores';
import TutorialsTabMobile from './tutorials-tab-mobile';
import TutorialsTabDesktop from './tutorials-tab-desktop';
import { useDBotStore } from 'Stores/useDBotStore';
import GuideContent from './guide-content';
import FAQContent from './faq-content';
import NoSearchResult from './common/no-search-result-found';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv/analytics';

const TutorialsTab = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard } = useDBotStore();
    const [prev_active_tutorials, setPrevActiveTutorialsTab] = React.useState<number | null>(0);

    const { active_tab_tutorials, video_tab_content, guide_tab_content, faq_tab_content, is_dialog_open } = dashboard;

    React.useEffect(() => {
        Analytics.trackEvent('ce_bot_tutorial_form', {
            action: 'open',
            form_source: 'bot_header_form',
        });
        return () => {
            Analytics.trackEvent('ce_bot_tutorial_form', {
                action: 'close',
                form_source: 'bot_header_form',
            });
        };
    }, []);

    React.useEffect(() => {
        const _active_tab = [0, 1];
        if (_active_tab.includes(active_tab_tutorials)) {
            setPrevActiveTutorialsTab(active_tab_tutorials);
        }
    }, [active_tab_tutorials]);

    const has_content_guide_tab =
        guide_tab_content.length > 0 || video_tab_content.length > 0 || faq_tab_content.length > 0;

    const tutorial_tabs = [
        {
            label: localize('Guide'),
            content: (
                <GuideContent
                    is_dialog_open={is_dialog_open}
                    guide_tab_content={guide_tab_content}
                    video_tab_content={video_tab_content}
                />
            ),
        },
        {
            label: localize('FAQ'),
            content: <FAQContent faq_list={faq_tab_content} />,
        },
        {
            label: localize('Search'),
            content: has_content_guide_tab ? (
                <>
                    <GuideContent
                        is_dialog_open={is_dialog_open}
                        guide_tab_content={guide_tab_content}
                        video_tab_content={video_tab_content}
                    />
                    <FAQContent faq_list={faq_tab_content} />
                </>
            ) : (
                <NoSearchResult />
            ),
        },
    ];

    return is_mobile ? (
        <TutorialsTabMobile tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    ) : (
        <TutorialsTabDesktop tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    );
});

export default TutorialsTab;
