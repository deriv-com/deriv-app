import React from 'react';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TWorkspace } from 'Stores/load-modal-store';
import DeleteDialog from './delete-dialog';
import './index.scss';
import RecentWorkspace from './recent-workspace';

type TRecentComponent = {
    dashboard_strategies: Array<TWorkspace>;
    setDashboardStrategies: (strategies: Array<TWorkspace>) => void;
};

const HEADERS = ['Bot name', 'Last modified', 'Status'];

const RecentComponent = ({ dashboard_strategies, setDashboardStrategies }: TRecentComponent) => {
    React.useEffect(() => {
        getSavedWorkspaces().then(recent_strategies => setDashboardStrategies(recent_strategies));
    }, []);

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
                                    <Text size='xs' weight='bold' key={tab_name}>
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

const Recent = connect(({ load_modal }: RootStore) => ({
    dashboard_strategies: load_modal.dashboard_strategies,
    setDashboardStrategies: load_modal.setDashboardStrategies,
}))(RecentComponent);

export default Recent;
