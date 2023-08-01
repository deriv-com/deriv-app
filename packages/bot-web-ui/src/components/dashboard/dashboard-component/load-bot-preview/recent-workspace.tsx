import React from 'react';
import classnames from 'classnames';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { DesktopWrapper, Icon, MobileWrapper, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { DBOT_TABS } from 'Constants/bot-contents';
import { waitForDomElement } from 'Utils/dom-observer';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { useComponentVisibility } from '../../hooks/useComponentVisibility';
import { CONTEXT_MENU_MOBILE, MENU_DESKTOP, STRATEGY } from './constants';
import './index.scss';

type TRecentWorkspace = {
    active_tab: number;
    dashboard_strategies: [];
    getRecentFileIcon: (string: string) => string;
    getSaveType: (type: string) => string;
    index: number;
    getSelectedStrategyID: (current_workspace_id: string) => void;
    loadFileFromRecent: () => void;
    onToggleDeleteDialog: (is_delete_modal_open: boolean) => void;
    previewRecentStrategy: (workspaceId: string) => void;
    previewed_strategy_id: string;
    setSelectedStrategyId: (workspaceId: string) => void;
    selected_strategy_id: string;
    setActiveTab: (active_tab: number) => void;
    setPreviewedStrategyId: (id: string) => void;
    setPreviewOnDialog: (has_mobile_preview_loaded: boolean) => void;
    toggleSaveModal: () => void;
    workspace: { [key: string]: string };
    updateBotName: (name: string) => void;
};

const RecentWorkspace = ({
    active_tab,
    dashboard_strategies,
    getRecentFileIcon,
    getSaveType,
    index,
    loadFileFromRecent,
    onToggleDeleteDialog,
    previewRecentStrategy,
    previewed_strategy_id,
    setPreviewedStrategyId,
    setSelectedStrategyId,
    selected_strategy_id,
    getSelectedStrategyID,
    setActiveTab,
    setPreviewOnDialog,
    toggleSaveModal,
    workspace,
    updateBotName,
}: TRecentWorkspace) => {
    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);
    const toggle_ref = React.useRef<HTMLInputElement>(null);
    const is_div_triggered_once = React.useRef<boolean>(false);
    const visible = useComponentVisibility(toggle_ref);
    const { setDropdownVisibility, is_dropdown_visible } = visible;
    const is_mobile = isMobile();
    const is_desktop = isDesktop();

    React.useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (dashboard_strategies && dashboard_strategies.length && index === 0 && !is_div_triggered_once.current) {
            timer = setTimeout(() => {
                is_div_triggered_once.current = true;
                trigger_div_ref?.current?.click();
            }, 50);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dashboard_strategies, index]);

    const onToggleDropdown = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setDropdownVisibility(!is_dropdown_visible);
        setSelectedStrategyId(workspace.id);
    };

    const viewRecentStrategy = async (type: string) => {
        setSelectedStrategyId(workspace.id);
        switch (type) {
            case STRATEGY.INIT: {
                setPreviewedStrategyId(workspace?.id);
                // Fires for desktop
                if (active_tab === 0) {
                    previewRecentStrategy(workspace.id);
                }
                break;
            }
            case STRATEGY.PREVIEW_LIST: {
                setPreviewedStrategyId(workspace.id);
                // Fires for mobile on clicking preview button
                if (is_mobile) setPreviewOnDialog(true);
                await waitForDomElement('#load-strategy__blockly-container');
                previewRecentStrategy(workspace.id);
                break;
            }
            case STRATEGY.EDIT: {
                loadFileFromRecent();
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                break;
            }
            case STRATEGY.SAVE: {
                updateBotName(workspace?.name);
                toggleSaveModal();
                break;
            }
            case STRATEGY.DELETE: {
                onToggleDeleteDialog(true);
                break;
            }
            default:
                break;
        }
    };

    const is_active_mobile = selected_strategy_id === workspace.id && is_dropdown_visible;

    return (
        <div
            className={classnames('load-strategy__recent-item', {
                'load-strategy__recent-item--selected': previewed_strategy_id === workspace.id,
                'load-strategy__recent-item__loaded': dashboard_strategies,
                'load-strategy__recent-item--minimized': !!dashboard_strategies?.length && !is_desktop,
            })}
            key={workspace.id}
            ref={trigger_div_ref}
            onClick={e => {
                e.stopPropagation(); //stop event bubbling for child element
                if (is_dropdown_visible) setDropdownVisibility(false);
                getSelectedStrategyID(workspace.id);
                viewRecentStrategy(STRATEGY.INIT);
            }}
        >
            <div className='load-strategy__recent-item-text'>
                <div className='load-strategy__recent-item-title'>
                    <Text align='left' as='p' size={is_desktop ? 'xs' : 'xxs'} line_height='l'>
                        {workspace.name}
                    </Text>
                </div>
            </div>
            <div className='load-strategy__recent-item-time'>
                <Text align='left' as='p' size={is_desktop ? 'xs' : 'xxs'} line_height='l'>
                    {timeSince(workspace.timestamp)}
                </Text>
            </div>
            <div className='load-strategy__recent-item-location'>
                <Icon
                    icon={getRecentFileIcon(workspace.save_type)}
                    className={classnames({
                        'load-strategy__recent-icon--active': workspace.save_type === save_types.GOOGLE_DRIVE,
                    })}
                />
                <div className='load-strategy__recent-item-saved'>
                    <Text align='left' as='p' size={is_desktop ? 'xs' : 'xxs'} line_height='l'>
                        {getSaveType(workspace.save_type)}
                    </Text>
                </div>
            </div>
            <DesktopWrapper>
                <div className='load-strategy__recent-item__button'>
                    {MENU_DESKTOP.map(item => (
                        <div
                            key={item.type}
                            className='load-strategy__recent-item__button'
                            onClick={e => {
                                e.stopPropagation();
                                viewRecentStrategy(item.type);
                            }}
                        >
                            <Icon icon={item.icon} />
                        </div>
                    ))}
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div ref={toggle_ref} onClick={onToggleDropdown}>
                    <Icon icon='IcMenuDots' />
                </div>
                <div
                    className={classnames('load-strategy__recent-item__mobile', {
                        'load-strategy__recent-item__mobile--active': is_active_mobile,
                        'load-strategy__recent-item__mobile--min': dashboard_strategies.length <= 5,
                    })}
                >
                    {CONTEXT_MENU_MOBILE.map(item => (
                        <div
                            key={item.type}
                            className='load-strategy__recent-item__group'
                            onClick={e => {
                                e.stopPropagation();
                                viewRecentStrategy(item.type);
                            }}
                        >
                            <div>
                                <Icon icon={item.icon} />
                            </div>
                            <Text
                                color='prominent'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                {item.label}
                            </Text>
                        </div>
                    ))}
                </div>
            </MobileWrapper>
        </div>
    );
};

export default connect(({ load_modal, dashboard, save_modal }: RootStore) => ({
    active_tab: dashboard.active_tab,
    dashboard_strategies: load_modal.dashboard_strategies,
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    getSelectedStrategyID: load_modal.getSelectedStrategyID,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    onToggleDeleteDialog: load_modal.onToggleDeleteDialog,
    previewRecentStrategy: load_modal.previewRecentStrategy,
    previewed_strategy_id: load_modal.previewed_strategy_id,
    setPreviewedStrategyId: load_modal.setPreviewedStrategyId,
    setSelectedStrategyId: load_modal.setSelectedStrategyId,
    selected_strategy_id: load_modal.selected_strategy_id,
    setActiveTab: dashboard.setActiveTab,
    setPreviewOnDialog: dashboard.setPreviewOnDialog,
    toggleSaveModal: save_modal.toggleSaveModal,
    updateBotName: save_modal.updateBotName,
}))(RecentWorkspace);
