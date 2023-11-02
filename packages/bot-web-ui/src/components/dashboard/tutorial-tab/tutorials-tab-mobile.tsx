import React from 'react';
import classNames from 'classnames';
import { Icon, SelectNative } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { TContent } from './config';
import throttle from 'lodash.throttle';

type TTutorialsTabMobile = {
    tutorial_tabs: TContent;
};

const TutorialsTabMobile = observer(({ tutorial_tabs }: TTutorialsTabMobile) => {
    const { dashboard } = useDBotStore();
    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue, active_tab } = dashboard;

    const search = faq_search_value?.toLowerCase();
    const initialSelectedTab = { label: '', content: '' };
    const [selectedTab, setSelectedTab] = React.useState(initialSelectedTab);
    const [showSearchBar, setShowSearchBar] = React.useState(false);

    React.useEffect(() => {
        if (!search) {
            setSelectedTab(tutorial_tabs[active_tab_tutorials] || {});
        } else {
            setShowSearchBar(true);
        }
        setSelectedTab(tutorial_tabs[active_tab_tutorials] || {});
    }, [active_tab_tutorials, active_tab, faq_search_value, selectedTab]);

    const throttledSearch = throttle(value => {
        setFAQSearchValue(value);
    }, 300);

    const onSearch = event => {
        const value = event.target.value;
        throttledSearch(value);
    };

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
        setActiveTabTutorial(0);
        setShowSearchBar(!showSearchBar);
    };

    const onCloseHandleSearch = () => {
        onFocusSearch();
        setFAQSearchValue('');
        setActiveTabTutorial(2);
    };

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

                <input
                    type='text'
                    placeholder={localize('Search')}
                    className='dc-tabs__wrapper__group__search-input'
                    data-testid='id-test-input-search'
                    onChange={onSearch}
                    onFocus={onFocusSearch}
                    value={faq_search_value}
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
