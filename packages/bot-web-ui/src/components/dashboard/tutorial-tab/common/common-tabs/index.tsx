import React from 'react';
import { localize } from '@deriv/translations';
import FAQContent from '../../faq-content';
import GuideContent from '../../guide-content';
import NoSearchResult from '../no-search-result-found';

const GuideTab = React.memo(
    ({ guideList }) => <GuideContent guide_list={guideList} />,
    (prevProps, nextProps) => {
        return prevProps.guideList === nextProps.guideList;
    }
);
GuideTab.displayName = 'GuideTab';

const FAQTab = React.memo(
    ({ faqList, isMobile }) => <FAQContent faq_list={faqList} hide_header={isMobile} />,
    (prevProps, nextProps) => {
        return prevProps.faqList === nextProps.faqList;
    }
);
FAQTab.displayName = 'FAQTab';

const SearchTab = React.memo(
    ({ filteredList, guideList, faqList, isMobile }) =>
        filteredList.length > 0 ? (
            <>
                <GuideTab guideList={guideList} />
                <FAQTab faqList={faqList} isMobile={isMobile} />
            </>
        ) : (
            <NoSearchResult />
        ),
    (prevProps, nextProps) => {
        return prevProps.filteredList === nextProps.filteredList;
    }
);
SearchTab.displayName = 'SearchTab';

export const generateTutorialTabs = (sidebar_content, is_mobile, search) => {
    const { guide_tab_content, faq_tab_content, filtered_list } = sidebar_content;

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

    return tutorial_tabs;
};
