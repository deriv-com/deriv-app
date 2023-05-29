import classnames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';

type TRecentWorkspaceProps = {
    getRecentFileIcon: (workspace_type: string) => string;
    getSaveType: (workspace_type: string) => string;
    previewRecentStrategy: (workspaceId: string) => void;
    selected_strategy_id: string;
    workspace: { [key: string]: any };
};

const RecentWorkspace = ({
    getRecentFileIcon,
    getSaveType,
    previewRecentStrategy,
    selected_strategy_id,
    workspace,
}: TRecentWorkspaceProps) => {
    return (
        <div
            className={classnames('load-strategy__recent-item load-dialog', {
                'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
            })}
            key={workspace.id}
            onClick={selected_strategy_id === workspace.id ? undefined : () => previewRecentStrategy(workspace.id)}
        >
            <div className='load-strategy__recent-item-text load-dialog'>
                <div className='load-strategy__recent-item-title'>{workspace.name}</div>
                <div className='load-strategy__recent-item-time'>{timeSince(workspace.timestamp)}</div>
            </div>
            <div className='load-strategy__recent-item-location load-dialog'>
                <Icon
                    icon={getRecentFileIcon(workspace.save_type)}
                    className={classnames({
                        'load-strategy__recent-icon--active': workspace.save_type === save_types.GOOGLE_DRIVE,
                    })}
                />
                <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
            </div>
        </div>
    );
};

export default connect(({ load_modal }: RootStore) => ({
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    previewRecentStrategy: load_modal.previewRecentStrategy,
    selected_strategy_id: load_modal.selected_strategy_id,
}))(RecentWorkspace);
