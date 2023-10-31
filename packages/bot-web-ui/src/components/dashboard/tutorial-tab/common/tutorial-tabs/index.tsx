import React from 'react';
import { localize } from '@deriv/translations';
import FAQContent from '../../faq-content';
import GuideContent from '../../guide-content';
import NoSearchResult from '../no-search-result-found';

export const generateTutorialTabs = (sidebar_content, is_mobile, search) => {
    const { guide_tab_content, faq_tab_content, filtered_list } = sidebar_content;
    const GuideTab = ({ guideList }) => <GuideContent guide_list={guideList} />;
    const FAQTab = ({ faqList, isMobile }) => <FAQContent faq_list={faqList} hide_header={isMobile} />;

    const SearchTab = ({ filteredList, guideList, faqList, isMobile }) =>
        filteredList.length > 0 ? (
            <>
                <GuideTab guideList={guideList} />
                <FAQTab faqList={faqList} isMobile={isMobile} />
            </>
        ) : (
            <NoSearchResult />
        );

    const tutorial_tabs = [
        { label: localize('Guide'), content: <GuideTab guideList={guide_tab_content} /> },
        { label: localize('FAQ'), content: <FAQTab faqList={faq_tab_content} isMobile={is_mobile} /> },
        {
            label: localize('Search'),
            content: search && (
                <SearchTab
                    filteredList={filtered_list}
                    guideList={guide_tab_content}
                    faqList={faq_tab_content}
                    isMobile={is_mobile}
                />
            ),
        },
    ];

    return {
        tutorial_tabs,
    };
};
