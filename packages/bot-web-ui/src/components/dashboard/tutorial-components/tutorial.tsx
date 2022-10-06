import React from 'react';
import { Tabs, Tab, Text, Accordion } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';
import { localize } from '@deriv/translations';
import { faq_questions } from './tutorial_faq';

type DashboardProps = {
    active_tab_tutorials: number;
    faq_search_value: string;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (setFAQSearchValue: string) => void;
};

const FAQ = ({ item }) => {
    const { type, content, index } = item;
    if (type === 'image') {
        return <img src={item.src} />;
    }
    return (
        <Text
            as='p'
            line_height='xxl'
            className='faq__description'
            weight='normal'
            key={index}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

const Tutorial = ({ active_tab_tutorials, setActiveTabTutorial, setFAQSearchValue }: DashboardProps) => {
    const faqList = ({ title, description }, index) => {
        return {
            header: (
                <Text as='p' line_height='xl' className='faq__title' weight='bold' key={index}>
                    {title}
                </Text>
            ),

            content: description.map((item, key) => <FAQ item={item} key={key} />),
        };
    };
    return (
        <div className='dc-tabs__wrapper'>
            <input
                type='text'
                placeholder='Search'
                className='dc-tabs__wrapper__search-input'
                onChange={e => {
                    setFAQSearchValue(e.target.value);
                }}
            />
            <Tabs active_index={active_tab_tutorials} onTabItemClick={setActiveTabTutorial} top>
                {/* [Todo] needs to update tabs comIcDashBoardComponentsTabponent children instead of using label property */}

                <Tab label={localize('Guide')} />
                <Tab label={localize('FAQ')}>
                    <div className='dc-tabs__wrapper'>
                        <Text as='p' line_height='xl' className='dc-tabs__wrapper__faq-header' weight='bold'>
                            FAQ
                        </Text>
                        <Accordion
                            className='tutorial-faq'
                            list={faq_questions.map(faqList)}
                            icon_close=''
                            icon_open=''
                        />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default connect((store: RootStore) => ({
    active_tab_tutorials: store.dashbaord.active_tab_tutorials,
    faq_search_value: store.dashbaord.faq_search_value,
    setActiveTabTutorial: store.dashbaord.setActiveTabTutorial,
    setFAQSearchValue: store.dashbaord.setFAQSearchValue,
}))(Tutorial);
