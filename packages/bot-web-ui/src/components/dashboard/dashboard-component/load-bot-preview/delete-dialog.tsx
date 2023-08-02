import React from 'react';
import localForage from 'localforage';
import LZString from 'lz-string';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TStrategy } from 'Types';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TDeleteDialog = {
    is_delete_modal_open: boolean;
    onToggleDeleteDialog: (param: boolean) => void;
    previewed_strategy_id: string;
    loadStrategyToBuilder: (param: TStrategy) => void;
    removeBotStrategy: (param: string) => void;
    setSelectedStrategyId: (id: string) => void;
    selected_strategy_id: string;
    setDashboardStrategies: (param: string[]) => void;
    setStrategies: (param: string[]) => void;
    setPreviewedStrategyId: (param: string) => void;
    setOpenSettings: (toast_message: string, show_toast: boolean) => void;
    resetBotBuilderStrategy: () => void;
    refreshStrategiesTheme: () => void;
};

const DeleteDialog = ({
    is_delete_modal_open,
    onToggleDeleteDialog,
    previewed_strategy_id,
    loadStrategyToBuilder,
    setSelectedStrategyId,
    selected_strategy_id,
    setDashboardStrategies,
    setPreviewedStrategyId,
    setOpenSettings,
    resetBotBuilderStrategy,
    refreshStrategiesTheme,
}: TDeleteDialog) => {
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

    const onHandleChange = (type: string, param: boolean) => {
        if (type === 'confirm') {
            removeBotStrategy(selected_strategy_id);
            setOpenSettings('delete', true);
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
};

export default connect(({ toolbar, load_modal, dashboard }: RootStore) => ({
    is_dialog_open: toolbar.is_dialog_open,
    is_delete_modal_open: load_modal.is_delete_modal_open,
    onToggleDeleteDialog: load_modal.onToggleDeleteDialog,
    previewed_strategy_id: load_modal.previewed_strategy_id,
    loadStrategyToBuilder: load_modal.loadStrategyToBuilder,
    setSelectedStrategyId: load_modal.setSelectedStrategyId,
    selected_strategy_id: load_modal.selected_strategy_id,
    setDashboardStrategies: load_modal.setDashboardStrategies,
    setPreviewedStrategyId: load_modal.setPreviewedStrategyId,
    setOpenSettings: dashboard.setOpenSettings,
    resetBotBuilderStrategy: load_modal.resetBotBuilderStrategy,
    refreshStrategiesTheme: load_modal.refreshStrategiesTheme,
}))(DeleteDialog);
