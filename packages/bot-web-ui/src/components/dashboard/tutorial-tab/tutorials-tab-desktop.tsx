import React from 'react';
import { Icon, Tabs } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { generateTutorialTabs } from './common/common-tabs';
import { useFilterTutorialsTab } from './hook/useFilterForTutorials';

const TutorialsTabDesktop = observer(() => {
    const input_ref = React.useRef(null);
    const { dashboard } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue, active_tab } = dashboard;
    const search = faq_search_value?.toLowerCase();
    const { guide_tab_content, faq_tab_content, filtered_list } = useFilterTutorialsTab(
        search,
        active_tab,
        active_tab_tutorials
    );
    const tutorial_tabs = generateTutorialTabs(
        {
            guide_tab_content,
            faq_tab_content,
            filtered_list,
        },
        is_mobile,
        search
    );

    const onSearch = event => setFAQSearchValue(event.target.value);
    const onFocusSearch = () => {
        setActiveTabTutorial(2);
        input_ref?.current?.focus();
    };
    const onCloseHandleSearch = () => {
        setFAQSearchValue('');
        setActiveTabTutorial(2);
        onFocusSearch();
    };

    return (
        <>
            <div className='dc-tabs__wrapper'>
                <div className='dc-tabs__wrapper__group'>
                    <Icon
                        className='search-icon'
                        data-testid='id-test-search'
                        width='1.6rem'
                        height='1.6rem'
                        icon='IcSearch'
                    />
                    <input
                        ref={input_ref}
                        data-testid='id-test-search'
                        type='text'
                        placeholder={localize('Search')}
                        className='dc-tabs__wrapper__group__search-input'
                        onChange={onSearch}
                        onFocus={onFocusSearch}
                        value={faq_search_value}
                    />
                    <Icon
                        className='close-icon'
                        data-testid='id-test-search'
                        width='1.6rem'
                        height='1.6rem'
                        icon='IcDbotClose'
                        onClick={onCloseHandleSearch}
                    />
                </div>
                <Tabs
                    className='tutorials'
                    active_index={active_tab_tutorials}
                    onTabItemClick={setActiveTabTutorial}
                    top
                >
                    {tutorial_tabs.map(({ label, content }) => (
                        <div label={label} key={label}>
                            {content}
                        </div>
                    ))}
                </Tabs>
            </div>
        </>
    );
});

export default TutorialsTabDesktop;
