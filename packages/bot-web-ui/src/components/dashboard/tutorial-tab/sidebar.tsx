import React from 'react';
import { Tabs, Tab, Icon } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';
import GuideContent from './guide-content';
import debounce from 'lodash.debounce';
import './sidebar.scss';

type DashboardProps = {
    active_tab_tutotials: number;
    faq_search_value: string;
    setActiveTabTutorial: (active_tab_tutotials: number) => void;
    setFAQSearchValue: (setFAQSearchValue: string) => void;
};

const Sidebar = ({ active_tab_tutotials, setActiveTabTutorial, setFAQSearchValue }: DashboardProps) => {
    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        debounce(() => {
            setFAQSearchValue(value);
        }, 700)();
    };

    return (
        <div className='dc-tabs__wrapper'>
            <div className='dc-tabs__wrapper__group'>
                <Icon width='1.6rem' height='1.6rem' icon={'IcSearch'} />
                <input
                    type='text'
                    placeholder='Search'
                    className='dc-tabs__wrapper__group--search_input'
                    onChange={onSearch}
                />
            </div>
            <Tabs active_index={active_tab_tutotials} onTabItemClick={setActiveTabTutorial} top>
                <Tab label={localize('Guide')}>
                    <GuideContent />
                </Tab>
                <Tab label={localize('FAQ')} id='id-bot-builder'>
                    {localize('FAQ Description')}
                </Tab>
            </Tabs>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    active_tab_tutotials: dashboard.active_tab_tutotials,
    faq_search_value: dashboard.faq_search_value,
    setActiveTabTutorial: dashboard.setActiveTabTutorial,
    setFAQSearchValue: dashboard.setFAQSearchValue,
}))(Sidebar);
