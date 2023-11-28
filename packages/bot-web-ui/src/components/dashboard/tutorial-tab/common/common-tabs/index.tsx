import React from 'react';
import { localize } from '@deriv/translations';
import FAQContent from '../../faq-content';
import GuideContent from '../../guide-content';
import NoSearchResult from '../no-search-result-found';

export const generateTutorialTabs = sidebar_content => {
    const { guide_tab_content, faq_tab_content } = sidebar_content;

    const tutorial_tabs = [
        { label: localize('Guide'), content: <GuideContent guide_list={guide_tab_content} /> },
        {
            label: localize('FAQ'),
            content: <FAQContent faq_list={faq_tab_content} />,
        },
        {
            label: localize('Search'),
            content:
                (guide_tab_content.length > 0 || faq_tab_content.length) > 0 ? (
                    <>
                        {guide_tab_content.length > 0 && <GuideContent guide_list={guide_tab_content} />}
                        {faq_tab_content.length > 0 && <FAQContent faq_list={faq_tab_content} />}
                    </>
                ) : (
                    <NoSearchResult />
                ),
        },
    ];

    return tutorial_tabs;
};
