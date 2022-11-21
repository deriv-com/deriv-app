import classnames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import './index.scss';
import Condition from 'yup/lib/Condition';

type TRecentWorkspace = {
    getRecentFileIcon: (string: string) => void;
    getSaveType: (type: string) => string;
    previewRecentStrategy: (workspaceId: string) => void;
    selected_strategy_id: string;
    workspace: { [key: string]: string };
    setFileLoaded: (param: boolean) => void;
    index: number;
    has_file_loaded: boolean;
    recent_strategies: boolean;
    toggleSaveModal: () => void;
    onToggleDeleteDialog: (is_delete_modal_open: boolean) => void;
    loadFileFromRecent: () => void;
    setActiveTab: (active_tab: number) => void;
    toggleStrategies: (param: boolean) => void;
    is_delete_modal_open: boolean;
    dashboard_strategies: [];
    setLoaderVisible: (param: boolean) => void;
};

const RecentWorkspace = ({
    getRecentFileIcon,
    getSaveType,
    previewRecentStrategy,
    selected_strategy_id,
    workspace,
    index,
    setFileLoaded,
    toggleSaveModal,
    loadFileFromRecent,
    onToggleDeleteDialog,
    setActiveTab,
    dashboard_strategies,
}: TRecentWorkspace) => {
    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (dashboard_strategies && dashboard_strategies.length && index === 0) {
            setTimeout(() => {
                trigger_div_ref?.current?.click();
            }, 0);
        }
    }, []);

    return (
        <>
            <div
                className={classnames('load-strategy__recent-item', {
                    'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
                    'load-strategy__recent-item__loaded': dashboard_strategies,
                })}
                key={workspace.id}
                ref={trigger_div_ref}
                onClick={() => {
                    previewRecentStrategy(workspace.id);
                    setFileLoaded(true);
                }}
            >
                <div className='load-strategy__recent-item-text'>
                    <div className='load-strategy__recent-item-title'>{workspace.name}</div>
                </div>
                <div className='load-strategy__recent-item-time'>{timeSince(workspace.timestamp)}</div>
                <div className='load-strategy__recent-item-location'>
                    <Icon
                        icon={getRecentFileIcon(workspace.save_type)}
                        className={classnames({
                            'load-strategy__recent-icon--active': workspace.save_type === save_types.GOOGLE_DRIVE,
                        })}
                    />
                    <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
                </div>
                <div className='load-strategy__recent-item__button'>
                    <div
                        className='load-strategy__recent-item__button'
                        onClick={() => {
                            setActiveTab(1);
                            loadFileFromRecent();
                        }}
                    >
                        <Icon icon='IcEdit' />
                    </div>
                    <div
                        className='load-strategy__recent-item__button'
                        onClick={() => {
                            toggleSaveModal();
                        }}
                    >
                        <Icon icon='IcSave' />
                    </div>
                    <div
                        className='load-strategy__recent-item__button'
                        onClick={e => {
                            onToggleDeleteDialog(true);
                        }}
                    >
                        <Icon icon='IcDelete' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default connect(({ load_modal, dashboard, save_modal }: RootStore) => ({
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    previewRecentStrategy: load_modal.previewRecentStrategy,
    selected_strategy_id: load_modal.selected_strategy_id,
    setFileLoaded: dashboard.setFileLoaded,
    has_file_loaded: dashboard.has_file_loaded,
    toggleSaveModal: save_modal.toggleSaveModal,
    toggleStrategies: load_modal.toggleStrategies,
    onToggleDeleteDialog: load_modal.onToggleDeleteDialog,
    is_delete_modal_open: load_modal.is_delete_modal_open,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    setActiveTab: dashboard.setActiveTab,
    recent_strategies: load_modal.recent_strategies,
    dashboard_strategies: load_modal.dashboard_strategies,
    active_tab: dashboard.active_tab,
    setLoaderVisible: dashboard.setLoaderVisible,
}))(RecentWorkspace);
