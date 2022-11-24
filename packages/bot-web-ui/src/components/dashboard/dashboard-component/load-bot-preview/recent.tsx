import classnames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RecentWorkspace from './recent-workspace';
import RootStore from 'Stores/index';
import DeleteDialog from './delete-dialog';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import './index.scss';

type TRecentComponent = {
    recent_strategies: [];
    toggleStrategies: (param: boolean) => void;
    dashboard_strategies: [];
    strategy_save_type: string;
    setDashboardStrategies: (strategies: []) => void;
};

const HEADERS = ['Name', 'Last modified', 'Status'];

const RecentComponent = ({
    toggleStrategies,
    dashboard_strategies,
    setDashboardStrategies,
    strategy_save_type,
}: TRecentComponent) => {
    React.useEffect(() => {
        toggleStrategies(true);
        setTimeout(() => {
            getSavedWorkspaces().then(recent_strategies => setDashboardStrategies(recent_strategies));
        }, 100);
    }, [strategy_save_type]);

    if (!dashboard_strategies?.length) return null;

    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div className='load-strategy__recent'>
                <div className='load-strategy__recent__files'>
                    <div className='load-strategy__title'>
                        <Localize i18n_default_text='Your Bots' />
                    </div>
                    <div className='load-strategy__recent__files__list'>
                        <div className='load-strategy__recent-item load-strategy__recent-item__loaded load-strategy__recent-item__loaded--first-child'>
                            {HEADERS.map(tab_name => {
                                return (
                                    <Text weight='bold' key={tab_name}>
                                        {tab_name}
                                    </Text>
                                );
                            })}
                        </div>
                        {dashboard_strategies.map((workspace, index) => {
                            return <RecentWorkspace key={workspace.id} workspace={workspace} index={index} />;
                        })}
                    </div>
                    <DeleteDialog setStrategies={setDashboardStrategies} />
                </div>
            </div>
        </div>
    );
};

const Recent = connect(({ load_modal, dashboard }: RootStore) => ({
    is_delete_modal_open: load_modal.is_delete_modal_open,
    toggleStrategies: load_modal.toggleStrategies,
    dashboard_strategies: load_modal.dashboard_strategies,
    setDashboardStrategies: load_modal.setDashboardStrategies,
    strategy_save_type: dashboard.strategy_save_type,
}))(RecentComponent);

export default Recent;
