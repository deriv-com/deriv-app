import classnames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { connect } from 'Stores/connect';

type RecentWorkspaceProps = {
    getRecentFileIcon: () => void;
    getSaveType: () => void;
    previewRecentStrategy: () => void;
    selected_strategy_id: string;
};

const RecentWorkspace = ({
    getRecentFileIcon,
    getSaveType,
    previewRecentStrategy,
    selected_strategy_id,
    workspace,
}: RecentWorkspaceProps) => {
    return (
        <div
            className={classnames('load-strategy__recent-item', {
                'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
            })}
            key={workspace.id}
            onClick={selected_strategy_id === workspace.id ? undefined : () => previewRecentStrategy(workspace.id)}
        >
            <div className='load-strategy__recent-item-text'>
                <div className='load-strategy__recent-item-title'>{workspace.name}</div>
                <div className='load-strategy__recent-item-time'>{timeSince(workspace.timestamp)}</div>
            </div>
            <div className='load-strategy__recent-item-location'>
                <Icon
                    icon={getRecentFileIcon(workspace.save_type)}
                    className={classnames({
                        'load-strategy__recent-icon--active': true || workspace.save_type === save_types.GOOGLE_DRIVE,
                    })}
                />
                <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
            </div>
        </div>
    );
};

export default connect(({ load_modal }) => ({
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    previewRecentStrategy: load_modal.previewRecentStrategy,
    selected_strategy_id: load_modal.selected_strategy_id,
}))(RecentWorkspace);
