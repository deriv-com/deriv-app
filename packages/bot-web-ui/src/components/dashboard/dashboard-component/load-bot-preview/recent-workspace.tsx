import React from 'react';
import classnames from 'classnames';

import { Analytics } from '@deriv/analytics'; //BotTActions need to add after anaytics merge
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { DesktopWrapper, Icon, MobileWrapper, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { waitForDomElement } from 'Utils/dom-observer';

import { useComponentVisibility } from '../../hooks/useComponentVisibility';

import { CONTEXT_MENU_MOBILE, MENU_DESKTOP, STRATEGY } from './constants';

import './index.scss';

type TRecentWorkspace = {
    index: number;
    workspace: { [key: string]: string };
    updateBotName: (name: string) => void;
};

const RecentWorkspace = observer(({ workspace, index }: TRecentWorkspace) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard, load_modal, save_modal } = useDBotStore();
    const { active_tab, setActiveTab, setPreviewOnDialog } = dashboard;
    const { toggleSaveModal, updateBotName } = save_modal;
    const {
        dashboard_strategies = [],
        getRecentFileIcon,
        getSaveType,
        getSelectedStrategyID,
        loadFileFromRecent,
        onToggleDeleteDialog,
        previewRecentStrategy,
        previewed_strategy_id,
        selected_strategy_id,
        setSelectedStrategyId,
        setPreviewedStrategyId,
    } = load_modal;

    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);
    const toggle_ref = React.useRef<HTMLInputElement>(null);
    const is_div_triggered_once = React.useRef<boolean>(false);
    const visible = useComponentVisibility(toggle_ref);
    const { setDropdownVisibility, is_dropdown_visible } = visible;
    const is_desktop = isDesktop();

    const sendToRudderStack = (action: BotTActions) => {
        Analytics.trackEvent('ce_bot_builder_form', {
            action,
            form_source: 'ce_bot_dashboard_form',
            bot_last_modified_time: dashboard_strategies?.[0]?.timestamp,
        });
    };

    React.useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const select_first_strategy = dashboard_strategies?.length && index === 0 && !is_div_triggered_once.current;

        if (select_first_strategy) {
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

    const handleInit = () => {
        setPreviewedStrategyId(workspace?.id);
        // Fires for desktop
        if (active_tab === 0) {
            previewRecentStrategy(workspace.id);
        }
    };

    const handlePreviewList = () => {
        setPreviewedStrategyId(workspace.id);
        // Fires for mobile on clicking preview button
        if (is_mobile) {
            setPreviewOnDialog(true);
            const dashboard_tab_dom_element = document.getElementsByClassName('tab__dashboard')?.[0];
            waitForDomElement('#load-strategy__blockly-container', dashboard_tab_dom_element).then(() => {
                previewRecentStrategy(workspace.id);
            });
        }
        Analytics.trackEvent('ce_bot_builder_form', {
            action: 'open',
            form_source: 'bot_dashboard_form-open',
        });
    };

    const handleEdit = async () => {
        await loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
        Analytics.trackEvent('ce_bot_builder_form', {
            action: 'close',
            form_source: 'bot_dashboard_form-edit',
        });
    };

    const handleSave = () => {
        /* Send the event on rudderstack on strategy save */
        Analytics.trackEvent('ce_bot_dashboard_form', {
            bot_name: workspace?.name,
            form_source: 'ce_bot_dashboard_form',
        });
        updateBotName(workspace?.name);
        toggleSaveModal();
        sendToRudderStack('save_your_bot');
    };

    const viewRecentStrategy = async (type: string) => {
        setSelectedStrategyId(workspace.id);

        switch (type) {
            case STRATEGY.INIT:
                // Fires for desktop preview
                handleInit();
                sendToRudderStack('choose_your_bot');
                break;

            case STRATEGY.PREVIEW_LIST:
                // Fires for mobile preview
                handlePreviewList();
                sendToRudderStack('choose_your_bot');
                break;

            case STRATEGY.EDIT:
                await handleEdit();
                sendToRudderStack('edit_your_bot');
                break;

            case STRATEGY.SAVE:
                handleSave();
                sendToRudderStack('save_your_bot');
                break;

            case STRATEGY.DELETE:
                onToggleDeleteDialog(true);
                sendToRudderStack('delete_your_bot');
                break;

            default:
                break;
        }
    };

    const is_active_mobile = selected_strategy_id === workspace.id && is_dropdown_visible;
    const text_size = is_desktop ? 'xs' : 'xxs';

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
                    <Text align='left' as='p' size={text_size} line_height='l'>
                        {workspace.name}
                    </Text>
                </div>
            </div>
            <div className='load-strategy__recent-item-time'>
                <Text align='left' as='p' size={text_size} line_height='l'>
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
                    <Text align='left' as='p' size={text_size} line_height='l'>
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
});

export default RecentWorkspace;
