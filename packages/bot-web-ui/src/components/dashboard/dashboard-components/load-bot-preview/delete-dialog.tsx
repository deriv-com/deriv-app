import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

type TDeleteDialog = {
    is_running: boolean;
    is_delete_modal_open: boolean;
    onConfirmDeleteDialog: () => void;
    onCancelDialogDialog: () => void;
};

const DeleteDialog = ({
    is_delete_modal_open,
    is_running,
    onConfirmDeleteDialog,
    onCancelDialogDialog,
}: TDeleteDialog) => {
    return (
        <div>
            <Dialog
                title={localize('Delete bot')}
                is_visible={is_delete_modal_open}
                confirm_button_text={is_running ? localize('Yes') : localize('Yes, delete')}
                onConfirm={onConfirmDeleteDialog}
                cancel_button_text={is_running ? localize('No') : localize('Cancel')}
                onCancel={onCancelDialogDialog}
                is_mobile_full_width={false}
                className={'dc-dialog__delete-strategy--fixed'}
                has_close_icon
            >
                <div style={{ marginBottom: '1rem' }}>
                    <Text color='prominent' line_height='s' size='xs'>
                        Your bot will be permanently deleted when you hit <strong>Yes, delete.</strong>
                    </Text>
                </div>
                <div>
                    <Text color='prominent' line_height='s' size='xs'>
                        Are you sure you want to delete it?
                    </Text>
                </div>
            </Dialog>
        </div>
    );
};

export default connect(({ toolbar, run_panel, dashboard, load_modal }) => ({
    is_dialog_open: toolbar.is_dialog_open,
    is_delete_modal_open: load_modal.is_delete_modal_open,
    onConfirmDeleteDialog: load_modal.onConfirmDeleteDialog,
    selected_strategy_id: load_modal.selected_strategy_id,
}))(DeleteDialog);
