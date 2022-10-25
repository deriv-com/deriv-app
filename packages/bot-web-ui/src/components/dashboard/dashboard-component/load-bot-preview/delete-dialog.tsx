import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

type TDeleteDialog = {
    is_running: boolean;
    is_delete_modal_open: boolean;
    onToggleDeleteDialog: (type: string, param: boolean) => void;
};

const DeleteDialog = ({ is_delete_modal_open, is_running, onToggleDeleteDialog }: TDeleteDialog) => {
    const onHandleChange = (type: string, param: boolean) => {
        onToggleDeleteDialog(type, false);
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
}))(DeleteDialog);
