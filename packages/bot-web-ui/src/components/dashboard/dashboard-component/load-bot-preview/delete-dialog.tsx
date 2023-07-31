import React from 'react';
import localForage from 'localforage';
import LZString from 'lz-string';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Dialog, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const DeleteDialog = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { is_delete_modal_open, onToggleDeleteDialog, selected_strategy_id, setDashboardStrategies } = load_modal;
    const { setOpenSettings } = dashboard;

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
});

export default DeleteDialog;
