import React from 'react';
import { faq_content, guide_content, user_guide_content } from '../config';

export const useFilterTutorialsTab = (search, active_tab, active_tab_tutorials) => {
    const [guide_tab_content, setGuideContent] = React.useState([...user_guide_content, ...guide_content]);
    const [faq_tab_content, setFAQContent] = React.useState([...faq_content]);
    const [tutorial_content, setTutorialContent] = React.useState([...guide_tab_content, ...faq_tab_content]);
    const [filtered_tab_list, setFilteredList] = React.useState([]);

    const removeHTMLTagsFromString = (param = '') => param.replace(/<.*?>/g, '');
    const filterContentBySearch = (content, search) => removeHTMLTagsFromString(content).toLowerCase().includes(search);

    React.useEffect(() => {
        const unified_filtered_list = tutorial_content?.filter(({ title, description = [], content }) => {
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
        setGuideContent(filtered_guide_list);
        setFAQContent(filtered_faq_list);
        setFilteredList(unified_filtered_list);

        if (!search) {
            setGuideContent([...user_guide_content, ...guide_content]);
            setFAQContent([...faq_content]);
            setTutorialContent(tutorial_content);
        }
    }, [search, active_tab, active_tab_tutorials]);

    return {
        guide_tab_content,
        faq_tab_content,
        filtered_tab_list,
        tutorial_content,
        setGuideContent,
        setFAQContent,
        setTutorialContent,
        setFilteredList,
    };
};
