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

    const { tutorials_combined_content, faq_search_value } = dashboard;
    const [guide_tab_content, setGuideContent] = React.useState([]);
    const [faq_tab_content, setFaqContent] = React.useState([]);
    const [filtered_tab_list, setCombinedList] = React.useState([]);
    const removeHTMLTagsFromString = (param = '') => param.replace(/<.*?>/g, '');
    const filterContentBySearch = (content, search) => removeHTMLTagsFromString(content).toLowerCase().includes(search);
    const search = faq_search_value.toLowerCase().trim();

    const unified_filtered_list = React.useMemo(() => {
        return tutorials_combined_content.filter(({ title, description = [], content }) => {
            const descriptionMatch = description
                .filter(item => item.type === 'text')
                .map(item => item.content)
                .join(' ')
                .toLowerCase();
            const titleMatch = removeHTMLTagsFromString(title).toLowerCase().includes(search);
            const contentMatch = filterContentBySearch(content, search);
            const descriptionMatchFiltered = filterContentBySearch(descriptionMatch, search);
            return descriptionMatchFiltered || titleMatch || contentMatch;
        });
    }, [search, tutorials_combined_content]);

    React.useEffect(() => {
        const filtered_guide_list = unified_filtered_list?.filter(item => item.tab_id === 0);
        const filtered_faq_list = unified_filtered_list?.filter(item => item.tab_id === 2);
        setGuideContent(filtered_guide_list);
        setFaqContent(filtered_faq_list);
        setCombinedList([...filtered_guide_list, ...filtered_faq_list]);
    }, [search]);

    const tutorial_tabs = generateTutorialTabs(
        {
            guide_tab_content,
            faq_tab_content,
            filtered_tab_list,
        },
        is_mobile,
        search
    );

    return is_mobile ? (
        <TutorialsTabMobile tutorial_tabs={tutorial_tabs} />
    ) : (
        <TutorialsTabDesktop tutorial_tabs={tutorial_tabs} />
    );
});

export default TutorialsTab;
