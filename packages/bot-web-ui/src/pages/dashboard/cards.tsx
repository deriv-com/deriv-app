import React from 'react';
import classNames from 'classnames';
import { Dialog, Icon, MobileFullPageModal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendOpenEvent } from '../../analytics/rudderstack-common-events';
import { rudderStackSendDashboardClickEvent } from '../../analytics/rudderstack-dashboard';
import DashboardBotList from './load-bot-preview/dashboard-bot-list';
import GoogleDrive from './load-bot-preview/google-drive';

type TCardProps = {
    has_dashboard_strategies: boolean;
    is_mobile: boolean;
};

type TCardArray = {
    type: string;
    icon: string;
    content: string;
    method: () => void;
};

const Cards = observer(({ is_mobile, has_dashboard_strategies }: TCardProps) => {
    const { dashboard, load_modal, quick_strategy } = useDBotStore();
    const { toggleLoadModal, setActiveTabIndex } = load_modal;
    const { ui } = useStore();
    const { is_desktop } = ui;
    const { onCloseDialog, dialog_options, is_dialog_open, setActiveTab, setPreviewOnPopup } = dashboard;
    const { setFormVisibility } = quick_strategy;

    const openGoogleDriveDialog = () => {
        toggleLoadModal();
        setActiveTabIndex(is_mobile ? 1 : 2);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const openFileLoader = () => {
        toggleLoadModal();
        setActiveTabIndex(is_mobile ? 0 : 1);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const actions: TCardArray[] = [
        {
            type: 'my-computer',
            icon: is_mobile ? 'IcLocal' : 'IcMyComputer',
            content: is_mobile ? localize('Local') : localize('My computer'),
            method: () => {
                openFileLoader();
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'load_strategy',
                    load_strategy_tab: 'local',
                });
            },
        },
        {
            type: 'google-drive',
            icon: 'IcGoogleDriveDbot',
            content: localize('Google Drive'),
            method: () => {
                openGoogleDriveDialog();
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'load_strategy',
                    load_strategy_tab: 'google drive',
                });
            },
        },
        {
            type: 'bot-builder',
            icon: 'IcBotBuilder',
            content: localize('Bot Builder'),
            method: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                rudderStackSendDashboardClickEvent({
                    dashboard_click_name: 'bot_builder',
                    subpage_name: 'bot_builder',
                });
            },
        },
        {
            type: 'quick-strategy',
            icon: 'IcQuickStrategy',
            content: localize('Quick strategy'),
            method: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                setFormVisibility(true);
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'quick_strategy',
                });
            },
        },
    ];

    return React.useMemo(
        () => (
            <div
                className={classNames('tab__dashboard__table', {
                    'tab__dashboard__table--minimized': has_dashboard_strategies && is_mobile,
                })}
            >
                <div
                    className={classNames('tab__dashboard__table__tiles', {
                        'tab__dashboard__table__tiles--minimized': has_dashboard_strategies && is_mobile,
                    })}
                    id='tab__dashboard__table__tiles'
                >
                    {actions.map(icons => {
                        const { icon, content, method } = icons;
                        return (
                            <div
                                key={content}
                                className={classNames('tab__dashboard__table__block', {
                                    'tab__dashboard__table__block--minimized': has_dashboard_strategies && is_mobile,
                                })}
                            >
                                <Icon
                                    className={classNames('tab__dashboard__table__images', {
                                        'tab__dashboard__table__images--minimized': has_dashboard_strategies,
                                    })}
                                    width='8rem'
                                    height='8rem'
                                    icon={icon}
                                    id={icon}
                                    onClick={() => {
                                        method();
                                    }}
                                />
                                <Text color='prominent' size={is_mobile ? 'xxs' : 'xs'}>
                                    {content}
                                </Text>
                            </div>
                        );
                    })}

                    {is_desktop ? (
                        <Dialog
                            title={dialog_options.title}
                            is_visible={is_dialog_open}
                            onCancel={onCloseDialog}
                            is_mobile_full_width
                            className='dc-dialog__wrapper--google-drive'
                            has_close_icon
                        >
                            <GoogleDrive />
                        </Dialog>
                    ) : (
                        <MobileFullPageModal
                            is_modal_open={is_dialog_open}
                            className='load-strategy__wrapper'
                            header={localize('Load strategy')}
                            onClickClose={() => {
                                setPreviewOnPopup(false);
                                onCloseDialog();
                            }}
                            height_offset='80px'
                            page_overlay
                        >
                            <div label='Google Drive' className='google-drive-label'>
                                <GoogleDrive />
                            </div>
                        </MobileFullPageModal>
                    )}
                </div>
                <DashboardBotList />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [is_dialog_open, has_dashboard_strategies]
    );
});

export default Cards;
