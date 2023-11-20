import React from 'react';
import { localize } from '@deriv/translations';
import FAQContent from '../../faq-content';
import GuideContent from '../../guide-content';
import NoSearchResult from '../no-search-result-found';

export const GuideTab = ({ guideList }) => <GuideContent guide_list={guideList} />;

export const FAQTab = ({ faqList }) => <FAQContent faq_list={faqList} />;

export const SearchTab = ({ filteredList, guideList, faqList }) =>
    filteredList.length > 0 ? (
        <>
            {guideList.length > 0 && <GuideTab guideList={guideList} />}
            {faqList.length > 0 && <FAQTab faqList={faqList} />}
        </>
    ) : (
        <NoSearchResult />
    );

export const generateTutorialTabs = (sidebar_content, is_mobile, search) => {
    const { guide_tab_content, faq_tab_content, filtered_tab_list } = sidebar_content;

    const tutorial_tabs = [
        { label: localize('Guide'), content: <GuideTab guideList={guide_tab_content} /> },
        {
            label: localize('FAQ'),
            content: <FAQTab faqList={faq_tab_content} isMobile={is_mobile} />,
        },
        {
            label: localize('Search'),
            content: (
                <SearchTab
                    filteredList={filtered_tab_list}
                    guideList={guide_tab_content}
                    faqList={faq_tab_content}
                    isMobile={is_mobile}
                    search={search}
                />
            ),
        },
    ];

    return tutorial_tabs;
};
