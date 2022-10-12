import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import Cards from './cards';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import Local from './load-bot-preview/local';
import AppStore from 'Stores/app-store';

type TDashboardProps = {
    app: AppStore;
};

const Dashboard = ({ app }: TDashboardProps) => {
    const { onMount, onUnmount } = app;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);
    return (
        <div style={{ display: 'flex' }}>
            <div className='dc-tabs__content_group' style={{ width: '50%', padding: '2.4rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <Text align='center' color='prominent' line_height='s' size='s'>
                        {localize('Load or build your bot')}
                    </Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Text align='center' color='prominent' line_height='s' size='s'>
                        {localize(
                            'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                        )}
                    </Text>
                </div>
                <Cards />
            </div>
            <div style={{ width: '50%' }}>
                <Local />
            </div>
        </div>
    );
};

export default connect(({ dashboard, app, blockly_store }: RootStore) => ({
    active_tab: dashboard.active_tab,
    setActiveTab: dashboard.setActiveTab,
    onMount: blockly_store.onMount,
    onUnmount: blockly_store.onUnmount,
    app,
}))(Dashboard);
