import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Icon, MobileWrapper, SelectNative, Tabs } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import FAQContent from './faq-content';
import GuideContent from './guide-content';
import { faq_content, guide_content, user_guide_content } from './tutorial-content';

type TFilteredList = {
    content?: string;
    id: number;
    src?: string;
    subtype?: string;
    type: string;
    url?: string;
    imageclass?: string;
};

type TSelectedTab = {
    label: string;
    content: string | React.ReactNode;
};

const initialSelectedTab: TSelectedTab = {
    label: '',
    content: '',
};

const Sidebar = observer(() => {
    const { dashboard } = useDBotStore();
    const { active_tab_tutorials, active_tab, faq_search_value, setActiveTabTutorial, setFAQSearchValue } = dashboard;
    const guide_tab_content = [...user_guide_content, ...guide_content];
    const [search_filtered_list, setsearchFilteredList] = React.useState<TFilteredList[]>([...guide_tab_content]);
    const [search_faq_list, setsearchFAQList] = React.useState([...faq_content]);
    const [selected_tab, setSelectedTab] = React.useState<TSelectedTab>(initialSelectedTab);
    const menu_items = [
        {
            label: localize('Guide'),
            content: <GuideContent guide_list={[...search_filtered_list]} />,
        },
        {
            label: localize('FAQ'),
            content: <FAQContent faq_list={[...search_faq_list]} hide_header={isMobile()} />,
        },
    ];

    React.useEffect(() => {
        setFAQSearchValue('');
        setSelectedTab(menu_items?.[active_tab_tutorials] || {});
        setsearchFilteredList([...guide_tab_content]);
        setsearchFAQList([...faq_content]);
    }, [active_tab_tutorials, active_tab]);

    React.useEffect(() => {
        const is_faq = active_tab_tutorials === 1;
        const search = faq_search_value?.toLowerCase();

        if (is_faq) {
            const filtered_list = faq_content?.filter(({ title, description = [] }) => {
                const match = description?.map(item => (item.type === 'text' ? item.content : '')).join(' ');
                const title_has_match = title
                    ?.replace(/<[^>]*>/g, '')
                    ?.toLowerCase()
                    ?.includes(search);
                const description_has_match = match
                    ?.replace(/<[^>]*>/g, '')
                    ?.toLowerCase()
                    ?.includes(search);
                return title_has_match || description_has_match;
            });
            setsearchFAQList(filtered_list);
        } else {
            const filtered_list = guide_tab_content?.filter(({ content = '' }) =>
                content?.toLowerCase()?.includes(search)
            );
            setsearchFilteredList(filtered_list);
        }
    }, [faq_search_value, active_tab_tutorials]);

    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFAQSearchValue(event.target.value);
    };

    const onChangeHandle = React.useCallback(
        ({ target }: React.ChangeEvent<HTMLInputElement>) => {
            setActiveTabTutorial(menu_items.findIndex(i => i.label === target.value));
        },
        [active_tab_tutorials]
    );

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
                            value={faq_search_value}
                        />
                    </div>
                    <Tabs
                        className='tutorials'
                        active_index={active_tab_tutorials}
                        onTabItemClick={setActiveTabTutorial}
                        top
                    >
                        {menu_items.map(({ label, content }) => (
                            <div label={label} key={label}>
                                {content}
                            </div>
                        ))}
                    </Tabs>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='tutorials-mobile'>
                    <div className='tutorials-mobile__select'>
                        <SelectNative
                            data-testid='id-test-search'
                            list_items={menu_items.map(({ label }, idx) => ({ id: idx, value: label, text: label }))}
                            value={selected_tab.label}
                            label={''}
                            should_show_empty_option={false}
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className={classNames({ 'tutorials-mobile__guide': active_tab_tutorials === 0 })}>
                        {selected_tab.content}
                    </div>
                </div>
            </MobileWrapper>
        </>
    );
});

export default Sidebar;
