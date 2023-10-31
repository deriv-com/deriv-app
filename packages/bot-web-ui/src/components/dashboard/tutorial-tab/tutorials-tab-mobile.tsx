import React from 'react';
import classNames from 'classnames';
import { Icon, SelectNative } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { useFilterTutorialsTab } from './hook/useFilterForTutorials';
import { generateTutorialTabs } from './common/common-tabs';

const TutorialsTabMobile = observer(() => {
    const { dashboard } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue, active_tab } = dashboard;

    const search = faq_search_value?.toLowerCase();
    const initialSelectedTab = { label: '', content: '' };
    const [selectedTab, setSelectedTab] = React.useState(initialSelectedTab);
    const [showSearchBar, setShowSearchBar] = React.useState(false);

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

    React.useEffect(() => {
        if (!search) {
            setSelectedTab(tutorial_tabs[active_tab_tutorials] || {});
        } else {
            setShowSearchBar(true);
        }
        setSelectedTab(tutorial_tabs[active_tab_tutorials] || {});
    }, [active_tab_tutorials, active_tab, faq_search_value]);

    const onSearch = event => setFAQSearchValue(event.target.value);
    const onFocusSearch = () => setActiveTabTutorial(2);

    const onChangeHandle = React.useCallback(
        ({ target }) => setActiveTabTutorial(tutorial_tabs.findIndex(i => i.label === target.value)),
        [active_tab_tutorials]
    );

    const onHandleChangeMobile = () => {
        setShowSearchBar(!showSearchBar);
        onFocusSearch();
        if (showSearchBar) setActiveTabTutorial(0);
    };

    const onCloseHandleSearch = () => {
        setFAQSearchValue('');
        setActiveTabTutorial(2);
        onFocusSearch();
    };

    return (
        <>
            <div className='tutorials-mobile'>
                <div
                    className={classNames('tutorials-mobile__select', {
                        'tutorials-mobile__select--show-search': showSearchBar,
                        'tutorials-mobile__select--hide-search': !showSearchBar,
                    })}
                >
                    <>
                        <Icon onClick={onHandleChangeMobile} className='arrow-left-bold' icon='IcArrowLeftBold' />
                        <input
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
                    </>
                    <>
                        <SelectNative
                            className='dc-tabs__wrapper__group__search-input--active'
                            list_items={tutorial_tabs.map(({ label }, idx) => ({
                                id: idx,
                                value: label,
                                text: label,
                            }))}
                            value={selectedTab.label}
                            label=''
                            should_show_empty_option={false}
                            onChange={onChangeHandle}
                        />
                        <Icon onClick={onHandleChangeMobile} className='search-icon' icon='IcSearch' />
                    </>
                </div>
                <div
                    className={classNames({
                        'tutorials-mobile__guide': active_tab_tutorials === 0,
                        'tutorials-mobile__faq': active_tab_tutorials === 1,
                        'tutorials-mobile__search': active_tab_tutorials === 2,
                    })}
                >
                    {selectedTab.content}
                </div>
            </div>
        </>
    );
});

export default TutorialsTabMobile;
