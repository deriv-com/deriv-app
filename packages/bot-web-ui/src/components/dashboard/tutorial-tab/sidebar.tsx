import React from 'react';
import { Tabs, Icon } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';
import GuideContent from './guide-content';
import FAQContent from './faq-content';
import debounce from 'lodash.debounce';
import { faq_content, guide_content } from './tutorial-content';
import './sidebar.scss';

type TSidebarProps = {
    active_tab_tutorials: number;
    faq_search_value: string;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (setFAQSearchValue: string) => void;
};

const Sidebar = ({
    active_tab_tutorials,
    setActiveTabTutorial,
    setFAQSearchValue,
    faq_search_value,
}: TSidebarProps) => {
    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        debounce(() => {
            setFAQSearchValue(value);
        }, 700)();
    };

    const [search_filtered_list, setsearchFilteredList] = React.useState<TContentArray[]>(guide_content);
    const [search_faq_list, setsearchFAQList] = React.useState<TContentArray[]>(faq_content);
    const search_input = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        setsearchFAQList((search_input.current.value = ''));
        setsearchFilteredList(guide_content);
        setsearchFAQList(faq_content);
    }, [active_tab_tutorials]);

    React.useEffect(() => {
        const content_list = active_tab_tutorials === 0 ? guide_content : faq_content;
        const filtered_list = content_list.filter(data => {
            return content_list === guide_content
                ? data.content.toLowerCase().includes(faq_search_value)
                : data.title.toLowerCase().includes(faq_search_value);
        });
        return active_tab_tutorials === 0 ? setsearchFilteredList(filtered_list) : setsearchFAQList(filtered_list);
    }, [faq_search_value]);

    return (
        <div className='dc-tabs__wrapper'>
            <div className='dc-tabs__wrapper__group'>
                <Icon width='1.6rem' height='1.6rem' icon={'IcSearch'} />
                <input
                    ref={search_input}
                    type='text'
                    placeholder={localize('Search')}
                    className='dc-tabs__wrapper__group__search-input'
                    onChange={onSearch}
                />
            </div>
            <Tabs active_index={active_tab_tutorials} onTabItemClick={setActiveTabTutorial} top>
                <div label={localize('Guide')}>
                    <GuideContent guide_list={search_filtered_list} />
                </div>
                <div label={localize('FAQ')}>
                    <FAQContent faq_list={search_faq_list} />
                </div>
            </Tabs>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    active_tab_tutorials: dashboard.active_tab_tutorials,
    faq_search_value: dashboard.faq_search_value,
    setActiveTabTutorial: dashboard.setActiveTabTutorial,
    setFAQSearchValue: dashboard.setFAQSearchValue,
}))(Sidebar);
