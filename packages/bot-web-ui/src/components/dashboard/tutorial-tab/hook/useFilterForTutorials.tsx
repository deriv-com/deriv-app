import React from 'react';
import { faq_content, guide_content, user_guide_content } from '../config';

export const useFilterTutorialsTab = (search, active_tab, active_tab_tutorials) => {
    const [guide_tab_content, setGuideTabContent] = React.useState([...user_guide_content, ...guide_content]);
    const [faq_tab_content, setFAQTabContent] = React.useState([...faq_content]);
    const [all_tab_content, setAllTabContent] = React.useState([...guide_tab_content, ...faq_tab_content]);
    const [filtered_list, setFilteredList] = React.useState([]);

    const removeHTMLTagsFromString = (param = '') => param.replace(/<.*?>/g, '');
    const filterContentBySearch = (content, search) => removeHTMLTagsFromString(content).toLowerCase().includes(search);

    React.useEffect(() => {
        const unified_filtered_list = all_tab_content?.filter(({ title, description = [], content }) => {
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

        const filtered_guide_list = unified_filtered_list.filter(item => item.tab_id === 0);
        const filtered_faq_list = unified_filtered_list.filter(item => item.tab_id === 2);
        setGuideTabContent(filtered_guide_list);
        setFAQTabContent(filtered_faq_list);
        setFilteredList(unified_filtered_list);

        if (!search) {
            setGuideTabContent([...user_guide_content, ...guide_content]);
            setFAQTabContent([...faq_content]);
            setAllTabContent(all_tab_content);
        }
    }, [search, active_tab, active_tab_tutorials]);

    return {
        guide_tab_content,
        faq_tab_content,
        filtered_list,
        all_tab_content,
        setGuideTabContent,
        setFAQTabContent,
        setAllTabContent,
        setFilteredList,
    };
};
