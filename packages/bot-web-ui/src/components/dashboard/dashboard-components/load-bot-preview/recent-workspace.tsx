import classnames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TRecentWorkspace = {
    getRecentFileIcon: (string: string) => void;
    getSaveType: () => void;
    previewRecentStrategy: () => void;
    selected_strategy_id: string;
    workspace: { [key: string]: string };
    setFileLoaded: (param: boolean) => void;
    index: number;
    has_file_loaded: boolean;
    toggleSaveModal: () => void;
};

const RecentWorkspace = ({
    getRecentFileIcon,
    getSaveType,
    previewRecentStrategy,
    selected_strategy_id,
    workspace,
    index,
    has_file_loaded,
    setFileLoaded,
    toggleSaveModal,
}: TRecentWorkspace) => {
    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
        if (index === 0 && has_file_loaded === false) {
            trigger_div_ref?.current?.click();
        }
    }, [has_file_loaded]);
    return (
        <div
            className={classnames('load-strategy__recent-item', {
                'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
            })}
            ref={trigger_div_ref}
            key={workspace.id}
            onClick={
                selected_strategy_id === workspace.id
                    ? undefined
                    : () => {
                          previewRecentStrategy(workspace.id);
                          setFileLoaded(true);
                      }
            }
        >
            <div className='load-strategy__recent-item-text'>
                <div className='load-strategy__recent-item-title'>{workspace.name}</div>
            </div>
            <div className='load-strategy__recent-item-time'>{timeSince(workspace.timestamp)}</div>
            <div className='load-strategy__recent-item-location'>
                <Icon
                    icon={getRecentFileIcon(workspace.save_type)}
                    className={classnames({
                        'load-strategy__recent-icon--active': true || workspace.save_type === save_types.GOOGLE_DRIVE,
                    })}
                />
                <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
            </div>
            <div className='load-strategy__recent-button'>
                <Icon icon='IcEdit' />
                <Icon icon='IcSave' onClick={toggleSaveModal} />
                <Icon icon='IcDelete' />
            </div>
        </div>
    );
};

export default connect(({ load_modal, dashbaord, save_modal }: RootStore) => ({
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    previewRecentStrategy: load_modal.previewRecentStrategy,
    selected_strategy_id: load_modal.selected_strategy_id,
    setFileLoaded: dashbaord.setFileLoaded,
    has_file_loaded: dashbaord.has_file_loaded,
    toggleSaveModal: save_modal.toggleSaveModal,
}))(RecentWorkspace);
