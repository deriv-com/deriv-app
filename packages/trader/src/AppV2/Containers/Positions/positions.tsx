import React from 'react';
import { Localize } from '@deriv/translations';
import { Tab } from '@deriv-com/quill-ui';
import BottomNav from 'AppV2/Components/BottomNav';
import PositionsContent from './positions-content';

const Positions = () => {
    // TODO: move to utils
    const getPositionURLParams = () => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.toString()) {
            const current_opened_tab = [...searchParams.values()];
            return current_opened_tab[0] === 'open' ? 0 : 1;
        }
        return 0;
    };
    // TODO: move to utils
    const setPositionURLParams = (new_value: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('tab_name', new_value);
        if (searchParams.toString()) {
            const newQuery = `${window.location.pathname}?${searchParams.toString()}`;
            window.history.replaceState({}, document.title, newQuery);
            // history.push(newQuery);
        }
    };

    const [hasButtonsDemo, setHasButtonsDemo] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState(getPositionURLParams() || 0);

    const tabs = [
        {
            id: 'open',
            title: <Localize i18n_default_text='Open' />,
            content: <PositionsContent hasButtonsDemo={hasButtonsDemo} setHasButtonsDemo={setHasButtonsDemo} />,
        },
        {
            id: 'closed',
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
                    size='md'
                    className='positions-page__tabs'
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
