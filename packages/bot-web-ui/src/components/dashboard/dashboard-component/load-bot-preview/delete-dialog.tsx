import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import LZString from 'lz-string';
import localForage from 'localforage';

type TDeleteDialog = {
    is_running: boolean;
    is_delete_modal_open: boolean;
    onToggleDeleteDialog: (param: boolean) => void;
    removeBotStrategy: (param: string) => void;
    selected_strategy_id: string;
    setStrategies: (param: string[]) => void;
    setDashboardStrategies: (param: string[]) => void;
    dashboard_strategies: [];
};

const DeleteDialog = ({
    is_delete_modal_open,
    is_running,
    selected_strategy_id,
    onToggleDeleteDialog,
    setDashboardStrategies,
    dashboard_strategies,
}: TDeleteDialog) => {
    const removeBotStrategy = async (strategy_id: string) => {
        const workspaces = await getSavedWorkspaces();
        workspaces.map((strategy_from_workspace: string[] | { [key: string]: string }, index: number) => {
            if (strategy_from_workspace.id === strategy_id) {
                if (index > -1) {
                    workspaces.splice(index, 1);
                }
                setDashboardStrategies(workspaces);
                localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspaces)));
                onToggleDeleteDialog(false);
            }
        });
    };

    const onHandleChange = (type: string, param: boolean) => {
        if (type === 'confirm') {
            removeBotStrategy(selected_strategy_id);
        }
        onToggleDeleteDialog(param);
    };

    return (
        <div>
            <Dialog
                title={localize('Delete bot')}
                is_visible={is_delete_modal_open}
                confirm_button_text={is_running ? localize('Yes') : localize('Yes, delete')}
                onConfirm={() => {
                    onHandleChange('confirm', false);
                }}
                cancel_button_text={is_running ? localize('No') : localize('Cancel')}
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
                    <Text color='prominent' line_height='s' size='xs'>
                        {localize('Are you sure you want to delete it?')}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
};

export default connect(({ toolbar, load_modal }) => ({
    is_dialog_open: toolbar.is_dialog_open,
    is_delete_modal_open: load_modal.is_delete_modal_open,
    onToggleDeleteDialog: load_modal.onToggleDeleteDialog,
    selected_strategy_id: load_modal.selected_strategy_id,
    setDashboardStrategies: load_modal.setDashboardStrategies,
    dashboard_strategies: load_modal.dashboard_strategies,
}))(DeleteDialog);
