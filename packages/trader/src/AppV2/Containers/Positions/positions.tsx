import React from 'react';
import { Localize } from '@deriv/translations';
import { getPositionsV2TabIndexFromURL } from '@deriv/shared';
import { Tab } from '@deriv-com/quill-ui';
import { setPositionURLParams, TAB_NAME } from 'AppV2/Utils/positions-utils';
import BottomNav from 'AppV2/Components/BottomNav';
import PositionsContent from './positions-content';

const Positions = () => {
    const [hasButtonsDemo, setHasButtonsDemo] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState(getPositionsV2TabIndexFromURL());

    const tabs = [
        {
            id: TAB_NAME.OPEN.toLowerCase(),
            title: <Localize i18n_default_text='Open' />,
            content: <PositionsContent hasButtonsDemo={hasButtonsDemo} setHasButtonsDemo={setHasButtonsDemo} />,
        },
        {
            id: TAB_NAME.CLOSED.toLowerCase(),
            title: <Localize i18n_default_text='Closed' />,
            content: <PositionsContent isClosedTab />,
        },
    ];

    const onChangeTab = (new_active_tab: number) => {
        setActiveTab(new_active_tab);
        setPositionURLParams(tabs[new_active_tab].id);
    };

    React.useEffect(() => {
        setPositionURLParams(tabs[activeTab].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav>
            <div className='positions-page'>
                <Tab.Container
                    contentStyle='fill'
                    className='positions-page__tabs'
                    size='md'
                    selectedTabIndex={activeTab}
                    onChangeTab={onChangeTab}
                >
                    <Tab.List>
                        {tabs.map(({ id, title }) => (
                            <Tab.Trigger key={id}>{title}</Tab.Trigger>
                        ))}
                    </Tab.List>
                    <Tab.Content className='positions-page__tabs-content'>
                        {tabs.map(({ id, content }) => (
                            <Tab.Panel key={id}>{content}</Tab.Panel>
                        ))}
                    </Tab.Content>
                </Tab.Container>
            </div>
        </BottomNav>
    );
};

export default Positions;
