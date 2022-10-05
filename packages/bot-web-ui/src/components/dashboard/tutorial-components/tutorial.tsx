import React from 'react';
import { Tabs, Tab, Text, Accordion, Icon } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';
import { localize } from '@deriv/translations';
import { FAQ_QUESTIONS } from './tutorial_faq';

type DashboardProps = {
    active_tab_tutotials: number;
    faq_search_value: string;
    setActiveTabTutorial: (active_tab_tutotials: number) => void;
    setFAQSearchValue: (setFAQSearchValue: string) => void;
};

const Tutorial = ({ active_tab_tutotials, setActiveTabTutorial, setFAQSearchValue }: DashboardProps) => {
    return (
        <div className='dc-tabs__wrapper'>
            <input
                type='text'
                placeholder='Search'
                className='dc-tabs__wrapper__search_input'
                onChange={e => {
                    setFAQSearchValue(e.target.value);
                }}
            />
            <Tabs active_index={active_tab_tutotials} onTabItemClick={setActiveTabTutorial} top>
                {/* [Todo] needs to update tabs comIcDashBoardComponentsTabponent children instead of using label property */}

                <Tab label={localize('Guide')} />
                <Tab label={localize('FAQ')} id='id-bot-builder'>
                    <div className='dc-tabs__wrapper'>
                        <Text as='p' size={'s'} line_height='xl' className='dc-tabs__wrapper__faq_header' weight='bold'>
                            FAQ
                        </Text>
                        <Accordion
                            className='tutorial-faq'
                            list={FAQ_QUESTIONS.map(({ title, description }) => {
                                return {
                                    header: (
                                        <Text as='p' size={'s'} line_height='xl' className='faq_title' weight='bold'>
                                            {title}
                                        </Text>
                                    ),

                                    content: description.map((item, index) => {
                                        switch (item.type) {
                                            case 'text':
                                                return (
                                                    <Text
                                                        as='p'
                                                        size={'s'}
                                                        line_height='xxl'
                                                        className='faq_description'
                                                        text-weight='normal'
                                                        key={index}
                                                        dangerouslySetInnerHTML={{ __html: item.content }}
                                                    />
                                                );
                                            case 'image':
                                                return <img src={item.src} />;
                                            default:
                                                return null;
                                        }
                                    }),
                                };
                            })}
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
    active_tab_tutotials: store.dashbaord.active_tab_tutotials,
    faq_search_value: store.dashbaord.faq_search_value,
    setActiveTabTutorial: store.dashbaord.setActiveTabTutorial,
    setFAQSearchValue: store.dashbaord.setFAQSearchValue,
}))(Tutorial);
