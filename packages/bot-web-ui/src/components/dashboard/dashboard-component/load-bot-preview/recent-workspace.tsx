import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { DesktopWrapper, Icon, MobileWrapper, Text } from '@deriv/components';
import classnames from 'classnames';
import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import './index.scss';
import { isMobile, isDesktop } from '@deriv/shared';
import { useComponentVisibility } from '../../hooks/useComponentVisibility';

type TRecentWorkspace = {
    active_tab: number;
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
    dashboard_strategies: [];
    setLoaderVisible: (param: boolean) => void;
    has_mobile_preview_loaded: boolean;
    setPreviewOnDialog: (has_mobile_preview_loaded: boolean) => void;
};

const RecentWorkspace = ({
    active_tab,
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
    setPreviewOnDialog,
}: TRecentWorkspace) => {
    React.useEffect(() => {
        if (dashboard_strategies && dashboard_strategies.length && index === 0) {
            setTimeout(() => {
                trigger_div_ref?.current?.click();
            }, 50);
        }
    }, []);

    const STRATEGY = {
        EDIT: 'edit',
        SAVE: 'save',
        DELETE: 'delete',
        PREVIEW: 'preview',
        PREVIEW_LIST: 'list',
    };

    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);

    const toggle_ref = React.useRef<HTMLDivElement>(null);
    const visible = useComponentVisibility(toggle_ref);

    const { setDropdownVisibility, is_dropdown_visible } = visible;

    const is_mobile = isMobile();

    const onToggleDropdown = e => {
        e.preventDefault();
        setDropdownVisibility(!is_dropdown_visible);
    };

    const viewRecentStrategy = (type: string) => {
        if (is_mobile && type === STRATEGY.PREVIEW_LIST) {
            setPreviewOnDialog(true);
            setTimeout(() => {
                previewRecentStrategy(workspace.id);
            }, 0); // made this async to give it a split second delay
        }
        if (selected_strategy_id !== workspace.id || (active_tab === 0 && type === STRATEGY.PREVIEW)) {
            previewRecentStrategy(workspace.id);
        }
        if (type === 'edit') {
            loadFileFromRecent();
            setActiveTab(1);
        } else if (type === 'save') {
            toggleSaveModal();
        } else if (type === 'delete') {
            onToggleDeleteDialog(true);
        }
    };
    const is_desktop = isDesktop();

    return (
        <>
            <div
                className={classnames('load-strategy__recent-item', {
                    'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
                    'load-strategy__recent-item__loaded': dashboard_strategies,
                    'load-strategy__recent-item--minimized': !!dashboard_strategies?.length && !is_desktop,
                })}
                key={workspace.id}
                ref={trigger_div_ref}
                onClick={e => {
                    e.stopPropagation(); //stop event bubbling for child element
                    if (is_dropdown_visible) setDropdownVisibility(false);
                    viewRecentStrategy(STRATEGY.PREVIEW);
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
                <DesktopWrapper>
                    <div className='load-strategy__recent-item__button'>
                        <div
                            className='load-strategy__recent-item__button'
                            onClick={() => {
                                viewRecentStrategy(STRATEGY.EDIT);
                            }}
                        >
                            <Icon icon='IcEdit' />
                        </div>
                        <div
                            className='load-strategy__recent-item__button'
                            onClick={() => {
                                viewRecentStrategy(STRATEGY.SAVE);
                            }}
                        >
                            <Icon icon='IcSave' />
                        </div>
                        <div
                            className='load-strategy__recent-item__button'
                            onClick={() => {
                                viewRecentStrategy(STRATEGY.DELETE);
                            }}
                        >
                            <Icon icon='IcDelete' />
                        </div>
                    </div>
                </DesktopWrapper>
                <MobileWrapper>
                    <div ref={toggle_ref} onClick={onToggleDropdown}>
                        <Icon icon='IcMenuDots' />
                    </div>
                    <div
                        className={classnames('load-strategy__recent-item__mobile', {
                            'load-strategy__recent-item__mobile--active':
                                selected_strategy_id === workspace.id && is_dropdown_visible,
                            'load-strategy__recent-item__mobile--min': dashboard_strategies.length <= 5,
                        })}
                    >
                        <div
                            className='load-strategy__recent-item__group'
                            onClick={() => {
                                viewRecentStrategy(STRATEGY.PREVIEW_LIST);
                            }}
                        >
                            <div>
                                <Icon icon='IcPreview' />
                            </div>
                            <Text
                                color='prominent'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Preview
                            </Text>
                        </div>
                        <div
                            onClick={() => {
                                viewRecentStrategy(STRATEGY.EDIT);
                            }}
                            className='load-strategy__recent-item__group'
                        >
                            <div>
                                <Icon icon='IcEdit' />
                            </div>
                            <Text
                                color='prominent'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Edit
                            </Text>
                        </div>
                        <div
                            onClick={() => {
                                viewRecentStrategy(STRATEGY.SAVE);
                            }}
                            className='load-strategy__recent-item__group'
                        >
                            <div>
                                <Icon icon='IcSave' />
                            </div>
                            <Text
                                color='prominent'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Save
                            </Text>
                        </div>
                        <div
                            onClick={() => {
                                viewRecentStrategy(STRATEGY.DELETE);
                            }}
                            className='load-strategy__recent-item__group'
                        >
                            <div>
                                <Icon icon='IcDelete' />
                            </div>
                            <Text
                                color='prominent'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Delete
                            </Text>
                        </div>
                    </div>
                </MobileWrapper>
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
    has_mobile_preview_loaded: dashboard.has_mobile_preview_loaded,
    setPreviewOnDialog: dashboard.setPreviewOnDialog,
    toggleSaveModal: save_modal.toggleSaveModal,
    onToggleDeleteDialog: load_modal.onToggleDeleteDialog,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    setActiveTab: dashboard.setActiveTab,
    recent_strategies: load_modal.recent_strategies,
    dashboard_strategies: load_modal.dashboard_strategies,
    active_tab: dashboard.active_tab,
    setLoaderVisible: dashboard.setLoaderVisible,
}))(RecentWorkspace);
