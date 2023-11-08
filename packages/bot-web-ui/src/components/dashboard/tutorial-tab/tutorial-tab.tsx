import React from 'react';
import { observer, useStore } from '@deriv/stores';
import TutorialsTabMobile from './tutorials-tab-mobile';
import TutorialsTabDesktop from './tutorials-tab-desktop';
import { useDBotStore } from 'Stores/useDBotStore';
import { generateTutorialTabs } from './common/common-tabs';

let timeoutId;

const debounce = (func, delay) => {
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const TutorialsTab = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard } = useDBotStore();
    const [prev_active_tutorials, setPrevActiveTutorialsTab] = React.useState<number | null>(0);

    const { tutorials_combined_content, faq_search_value, active_tab_tutorials } = dashboard;

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
        generateAllTabs();
    }, [active_tab_tutorials]);

    React.useEffect(() => {
        const _active_tab = [0, 1];
        if (_active_tab.includes(active_tab_tutorials)) {
            setPrevActiveTutorialsTab(active_tab_tutorials);
        }
    }, [active_tab_tutorials]);

    const generateAllTabs = () => {
        const filtered_guide_list = unified_filtered_list?.filter(item => item.tab_id === 0);
        const filtered_faq_list = unified_filtered_list?.filter(item => item.tab_id === 2);
        setGuideContent(filtered_guide_list);
        setFaqContent(filtered_faq_list);
        setCombinedList([...filtered_guide_list, ...filtered_faq_list]);
    };

    React.useEffect(() => {
        debounce(() => {
            generateAllTabs();
        }, 300)();
    }, [search, tutorials_combined_content]);

    const tutorial_tabs = generateTutorialTabs(
        {
            guide_tab_content,
            faq_tab_content,
            filtered_tab_list,
        },
        is_mobile,
        search,
        prev_active_tutorials
    );

    return is_mobile ? (
        <TutorialsTabMobile tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    ) : (
        <TutorialsTabDesktop tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    );
});

export default TutorialsTab;
