import React from 'react';
import localForage from 'localforage';
import LZString from 'lz-string';
import { Analytics } from '@deriv/analytics';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Dialog, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { TStrategy } from 'Types';
import { useDBotStore } from 'Stores/useDBotStore';

const DeleteDialog = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const {
        is_delete_modal_open,
        onToggleDeleteDialog,
        selected_strategy_id,
        setDashboardStrategies,
        setSelectedStrategyId,
        loadStrategyToBuilder,
        previewed_strategy_id,
        setPreviewedStrategyId,
        refreshStrategiesTheme,
        resetBotBuilderStrategy,
    } = load_modal;
    const { setOpenSettings } = dashboard;

    const resetStrategiesAfterDelete = async (deleted_strategy_id: string, updated_workspaces: Array<TStrategy>) => {
        if (updated_workspaces.length) {
            const current_previewed_strategy = updated_workspaces?.filter(
                (strategy: TStrategy) => strategy.id === previewed_strategy_id
            );
            if (selected_strategy_id === deleted_strategy_id) {
                setSelectedStrategyId(updated_workspaces?.[0]?.id);
                // Change bot builder strategy to the first strategy in the list
                await loadStrategyToBuilder(updated_workspaces?.[0]);
            }
            if (current_previewed_strategy.length) {
                setPreviewedStrategyId(previewed_strategy_id);
                setSelectedStrategyId(previewed_strategy_id);
            } else {
                setPreviewedStrategyId(updated_workspaces?.[0]?.id);
            }
            // Change preview strategy to the one that was previously previewed
            await refreshStrategiesTheme();
        } else {
            resetBotBuilderStrategy();
        }
    };

    const removeBotStrategy = async (strategy_id: string) => {
        const workspaces = await getSavedWorkspaces();
        const updated_workspaces = workspaces.filter(
            (strategy_from_workspace: TStrategy) => strategy_from_workspace.id !== strategy_id
        );
        setDashboardStrategies(updated_workspaces);
        localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(updated_workspaces)));
        await resetStrategiesAfterDelete(strategy_id, updated_workspaces);
        onToggleDeleteDialog(false);
    };

    //this is to check after click of yes ir no on delete dailog send event to rudderstck
    const sentToRudderStack = (param: string) => {
        Analytics.trackEvent('ce_bot_builder_form', {
            delete_popup_respond: param,
            form_source: 'ce_bot_dashboard_form',
        });
    };

    const onHandleChange = (type: string, param: boolean) => {
        if (type === 'confirm') {
            removeBotStrategy(selected_strategy_id);
            setOpenSettings('delete', true);
            sentToRudderStack('yes');
        } else {
            sentToRudderStack('no');
        }
        onToggleDeleteDialog(param);
    };

    return (
        <div>
            <Dialog
                title={localize('Delete bot')}
                is_visible={is_delete_modal_open}
                confirm_button_text={localize('Yes, delete')}
                onConfirm={() => {
                    onHandleChange('confirm', false);
                    setOpenSettings('delete', true);
                }}
                cancel_button_text={localize('No')}
                onCancel={() => {
                    onHandleChange('cancel', false);
                }}
                is_mobile_full_width={false}
                className={'dc-dialog__delete-strategy--delete'}
                has_close_icon
            >
                <div>
                    <Text color='prominent' line_height='s' size='xs'>
                        {localize('Your bot will be permanently deleted when you hit ')}
                        <strong>{localize('Yes, delete.')}</strong>
                    </Text>
                </div>
                <div>
                    <Text color='prominent' line_height='xl' size='xs'>
                        {localize('Are you sure you want to delete it?')}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default DeleteDialog;
