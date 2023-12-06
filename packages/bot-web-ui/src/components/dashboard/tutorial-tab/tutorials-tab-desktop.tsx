import React from 'react';
import { Icon, Tabs } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TContent } from './config';
import classNames from 'classnames';
import SearchInput from './common/search-input';

type TTutorialsTabDesktop = {
    tutorial_tabs: TContent;
    prev_active_tutorials: number;
};

const TutorialsTabDesktop = observer(({ tutorial_tabs, prev_active_tutorials }: TTutorialsTabDesktop) => {
    const { dashboard } = useDBotStore();

    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue, resetTutorialTabContent } =
        dashboard;
    const search = faq_search_value?.toLowerCase();

    const onCloseHandleSearch = () => {
        setFAQSearchValue('');
        resetTutorialTabContent();
        setActiveTabTutorial(prev_active_tutorials);
    };

    React.useEffect(() => {
        if (faq_search_value !== '') {
            setActiveTabTutorial(2);
        }
    }, [active_tab_tutorials]);

    return (
        <div className='dc-tabs__wrapper'>
            <div className='dc-tabs__wrapper__group'>
                <Icon
                    className='search-icon'
                    data_testid='id-test-search'
                    width='1.6rem'
                    height='1.6rem'
                    icon='IcSearch'
                />
                <SearchInput
                    faq_value={faq_search_value}
                    setFaqSearchContent={setFAQSearchValue}
                    prev_active_tutorials={prev_active_tutorials}
                />
                {search && (
                    <Icon
                        className='close-icon'
                        data_testid='id-test-close'
                        width='1.6rem'
                        height='1.6rem'
                        icon='IcDbotClose'
                        onClick={onCloseHandleSearch}
                    />
                )}
            </div>
            <Tabs
                className={classNames('tutorials', {
                    'tutorials-guide': prev_active_tutorials === 0,
                    'tutorials-faq': prev_active_tutorials === 1,
                    'tutorials-search': active_tab_tutorials === 2,
                })}
                active_index={active_tab_tutorials}
                onTabItemClick={setActiveTabTutorial}
                top
            >
                {tutorial_tabs.map(
                    ({ label, content }) =>
                        content && (
                            <div label={label} key={`${content}_${label}`}>
                                {content}
                            </div>
                        )
                )}
            </Tabs>
        </div>
    );
});

export default TutorialsTabDesktop;
