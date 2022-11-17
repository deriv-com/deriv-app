import classnames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
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
    setDashboardStrategies: (strategies: []) => void;
};

const RecentComponent = ({ toggleStrategies, dashboard_strategies, setDashboardStrategies }: TRecentComponent) => {
    React.useEffect(() => {
        toggleStrategies(true);
        getSavedWorkspaces().then(load_recent_strategies => {
            setDashboardStrategies(load_recent_strategies);
        });
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
    is_delete_modal_open: load_modal.is_delete_modal_open,
    toggleStrategies: load_modal.toggleStrategies,
    dashboard_strategies: load_modal.dashboard_strategies,
    setDashboardStrategies: load_modal.setDashboardStrategies,
}))(RecentComponent);

export default Recent;
