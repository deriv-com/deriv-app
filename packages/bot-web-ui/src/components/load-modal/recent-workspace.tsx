import React from 'react';
import classnames from 'classnames';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { Icon } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type TRecentWorkspaceProps = {
    workspace: { [key: string]: any };
};

const RecentWorkspace = observer(({ workspace }: TRecentWorkspaceProps) => {
    const { load_modal } = useDBotStore();
    const { getRecentFileIcon, getSaveType, previewRecentStrategy, selected_strategy_id } = load_modal;
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
});

export default RecentWorkspace;
