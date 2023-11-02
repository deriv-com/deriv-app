import React from 'react';
import { Icon, Tabs } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { TContent } from './config';

type TTutorialsTabDesktop = {
    tutorial_tabs: TContent;
};

const TutorialsTabDesktop = observer(({ tutorial_tabs }: TTutorialsTabDesktop) => {
    const input_ref = React.useRef(null);
    const { dashboard } = useDBotStore();

    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue } = dashboard;
    const search = faq_search_value?.toLowerCase();

    const onSearch = event => setFAQSearchValue(event.target.value);
    const onFocusSearch = () => {
        setActiveTabTutorial(2);
        input_ref?.current?.focus();
    };
    const onCloseHandleSearch = () => {
        setFAQSearchValue('');
        setActiveTabTutorial(0);
    };

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
                <input
                    ref={input_ref}
                    data-testid='id-test-input-search'
                    type='text'
                    placeholder={localize('Search')}
                    className='dc-tabs__wrapper__group__search-input'
                    onChange={onSearch}
                    onFocus={onFocusSearch}
                    value={faq_search_value}
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
            <Tabs className='tutorials' active_index={active_tab_tutorials} onTabItemClick={setActiveTabTutorial} top>
                {tutorial_tabs.map(({ label, content }) => (
                    <div label={label} key={label}>
                        {content}
                    </div>
                ))}
            </Tabs>
        </div>
    );
});

export default TutorialsTabDesktop;
