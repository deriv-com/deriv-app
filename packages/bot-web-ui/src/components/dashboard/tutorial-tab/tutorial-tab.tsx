import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Icon, MobileWrapper, SelectNative, Tabs } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import FAQContent from './faq-content';
import GuideContent from './guide-content';
import { faq_content, guide_content, quick_strategy_content, user_guide_content } from './config';
import QuickStrategyContent from './quick-strategy-content/quick-strategy-content';

type TSelectedTab = {
    label: string;
    content: string | React.ReactNode;
};

const initialSelectedTab: TSelectedTab = {
    label: '',
    content: '',
};

const TutorialsTab = observer(() => {
    const { dashboard } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue, active_tab } = dashboard;
    const [selected_tab, setSelectedTab] = React.useState<TSelectedTab>(initialSelectedTab);
    const [show_search_bar, setShowSearchBar] = React.useState(false);
    const [guide_tab_content, setGuideTabContent] = React.useState([...user_guide_content, ...guide_content]);
    const [faq_tab_content, setFAQcontent] = React.useState([...faq_content]);
    const [quick_strategy_tab_content, setQuickStrategyContent] = React.useState([...quick_strategy_content]);
    const all_tabs_content = [...guide_tab_content, ...faq_tab_content, ...quick_strategy_tab_content];

    const sidebar_tabs = [
        {
            label: localize('Guide'),
            content: <GuideContent guide_list={guide_tab_content} />,
        },
        // {
        //     label: localize('Quick strategies guides'),
        //     content: <QuickStrategyContent quick_strategy_content={quick_strategy_tab_content} />,
        // },
        {
            label: localize('FAQ'),
            content: <FAQContent faq_list={faq_tab_content} hide_header={is_mobile} />,
        },
        {
            label: localize('Search'),
            content: (faq_search_value || is_mobile) && (
                <>
                    <GuideContent guide_list={guide_tab_content} />
                    <QuickStrategyContent quick_strategy_content={quick_strategy_tab_content} />
                    <FAQContent faq_list={faq_tab_content} hide_header={is_mobile} />
                </>
            ),
        },
    ];
    const removeHTMLTagsFromString = (param = '') => {
        return param.replace(/<.*?>/g, '');
    };
    React.useEffect(() => {
        const search = faq_search_value?.toLowerCase();

        const filtered_list = all_tabs_content?.filter(({ title, description = [], content }) => {
            const description_match = description?.map(item => (item.type === 'text' ? item.content : '')).join(' ');
            const content_and_title_match = content && title;
            const title_has_match = removeHTMLTagsFromString(content_and_title_match)?.toLowerCase()?.includes(search);
            const description_has_match = removeHTMLTagsFromString(description_match)?.toLowerCase()?.includes(search);
            return description_has_match || title_has_match;
        });
        //console.log(filtered_list);
        if (faq_search_value) {
            filtered_list.forEach(data => {
                //console.log(data.tab_id)
                //    if (data.tab_id === 0) {
                //        const updatedArray = [...guide_tab_content, data];
                //        setGuideTabContent(updatedArray);
                //    } else if (data.tab_id === 1) {
                //        const updatedArray = [...quick_strategy_content, data];
                //        setQuickStrategyContent(updatedArray);
                //    } else if (data.tab_id === 2) {
                //        const updatedArray = [...faq_tab_content, data];
                //        setFAQcontent(updatedArray);
                //    }
            });
        }
    }, [faq_search_value]);

    React.useEffect(() => {
        setFAQSearchValue('');
        setSelectedTab(sidebar_tabs?.[active_tab_tutorials] || {});
    }, [active_tab_tutorials, active_tab]);

    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFAQSearchValue(event.target.value);
    };
    const onFocusSearch = () => {
        setActiveTabTutorial(3);
    };

    const onChangeHandle = React.useCallback(
        ({ target }: React.ChangeEvent<HTMLInputElement>) => {
            setActiveTabTutorial(sidebar_tabs.findIndex(i => i.label === target.value));
        },
        [active_tab_tutorials]
    );

    const onhandleChangeMobile = () => {
        setShowSearchBar(!show_search_bar);
        onFocusSearch();
    };

    return (
        <>
            <DesktopWrapper>
                <div className='dc-tabs__wrapper'>
                    <div className='dc-tabs__wrapper__group'>
                        <Icon data-testid='id-test-search' width='1.6rem' height='1.6rem' icon={'IcSearch'} />
                        <input
                            data-testid='id-test-search'
                            type='text'
                            placeholder={localize('Search')}
                            className='dc-tabs__wrapper__group__search-input'
                            onChange={onSearch}
                            onFocus={onFocusSearch}
                            value={faq_search_value}
                        />
                    </div>
                    <Tabs
                        className='tutorials'
                        active_index={active_tab_tutorials}
                        onTabItemClick={setActiveTabTutorial}
                        top
                    >
                        {sidebar_tabs.map(({ label, content }) => (
                            <div label={label} key={label}>
                                {content}
                            </div>
                        ))}
                    </Tabs>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='tutorials-mobile'>
                    <div
                        className={classNames('tutorials-mobile__select', {
                            'tutorials-mobile__select--show-search': show_search_bar,
                            'tutorials-mobile__select--hide-search': !show_search_bar,
                        })}
                    >
                        <>
                            <Icon onClick={onhandleChangeMobile} className='arrow-left-bold' icon='IcArrowLeftBold' />
                            <input
                                type='text'
                                placeholder={localize('Search')}
                                className='dc-tabs__wrapper__group__search-input'
                                onChange={onSearch}
                                onFocus={onFocusSearch}
                                value={faq_search_value}
                            />
                        </>
                        <>
                            <SelectNative
                                className='dc-tabs__wrapper__group__search-input--active'
                                list_items={sidebar_tabs.map(({ label }, idx) => ({
                                    id: idx,
                                    value: label,
                                    text: label,
                                }))}
                                value={selected_tab.label}
                                label={''}
                                should_show_empty_option={false}
                                onChange={onChangeHandle}
                            />
                            <Icon onClick={onhandleChangeMobile} className='search-icon' icon='IcSearch' />
                        </>
                    </div>
                    <div
                        className={classNames({
                            'tutorials-mobile__guide': active_tab_tutorials === 0,
                            'tutorials-mobile__quick_strategy': active_tab_tutorials === 1,
                            'tutorials-mobile__faq': active_tab_tutorials === 2,
                            'tutorials-mobile__search': active_tab_tutorials === 3,
                        })}
                    >
                        {selected_tab.content}
                    </div>
                </div>
            </MobileWrapper>
        </>
    );
});

export default TutorialsTab;
