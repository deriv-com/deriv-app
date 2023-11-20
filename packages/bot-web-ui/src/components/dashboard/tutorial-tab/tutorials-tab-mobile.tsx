import React from 'react';
import classNames from 'classnames';
import { Icon, SelectNative } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TContent } from './config';
import SearchInput from './common/search-input';

type TTutorialsTabMobile = {
    tutorial_tabs: TContent;
};

const TutorialsTabMobile = observer(({ tutorial_tabs, prev_active_tutorials }: TTutorialsTabMobile) => {
    const { dashboard } = useDBotStore();
    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue } = dashboard;

    const search = faq_search_value?.toLowerCase();
    const initialSelectedTab = { label: '', content: '' };
    const [selectedTab, setSelectedTab] = React.useState(initialSelectedTab);
    const [showSearchBar, setShowSearchBar] = React.useState(false);

    React.useEffect(() => {
        if (search) setShowSearchBar(true);
        setSelectedTab(tutorial_tabs[active_tab_tutorials] || {});
    }, [tutorial_tabs]);

    const onFocusSearch = () => setActiveTabTutorial(2);

    const onChangeHandle = React.useCallback(
        ({ target }) => setActiveTabTutorial(tutorial_tabs.findIndex(i => i.label === target.value)),
        [active_tab_tutorials]
    );

    const onHandleChangeMobile = () => {
        setShowSearchBar(!showSearchBar);
    };

    const onClickBackButton = () => {
        setFAQSearchValue('');
        setShowSearchBar(!showSearchBar);
        setActiveTabTutorial(prev_active_tutorials);
        setSelectedTab(tutorial_tabs[prev_active_tutorials] || {});
    };

    const onCloseHandleSearch = () => {
        onFocusSearch();
        setFAQSearchValue('');
        setActiveTabTutorial(2);
    };

    React.useEffect(() => {
        const selectElement = document.getElementById('dt_components_select-native_select-tag');

        if (selectElement) {
            selectElement.removeChild(selectElement?.options[2]);
        }
    }, []);

    return (
        <div className='tutorials-mobile' data-testid='test-tutorials-mobile'>
            <div
                className={classNames('tutorials-mobile__select', {
                    'tutorials-mobile__select--show-search': showSearchBar,
                    'tutorials-mobile__select--hide-search': !showSearchBar,
                })}
                data-testid={showSearchBar ? 'id-search-visible' : 'id-search-hidden'}
            >
                <Icon
                    onClick={onClickBackButton}
                    data_testid='id-arrow-left-bold'
                    className='arrow-left-bold'
                    icon='IcArrowLeftBold'
                />
                <SearchInput
                    faq_value={faq_search_value}
                    setFaqSearchContent={setFAQSearchValue}
                    prev_active_tutorials={prev_active_tutorials}
                />
                {search && (
                    <Icon
                        data_testid='id-close-icon'
                        className='close-icon'
                        data-testid='id-test-search'
                        width='1.6rem'
                        height='1.6rem'
                        icon='IcDbotClose'
                        onClick={onCloseHandleSearch}
                    />
                )}

                <SelectNative
                    data_testid='id-tutorials-select'
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
    );
});

export default TutorialsTabMobile;
