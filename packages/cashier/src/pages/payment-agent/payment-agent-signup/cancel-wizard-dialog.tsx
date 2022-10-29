import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';

type TCancelWizardDialogProps = {
    onConfirm: VoidFunction;
    onCancel: VoidFunction;
    is_visible: boolean;
};

const CancelWizardDialog = ({ onConfirm, onCancel, is_visible }: TCancelWizardDialogProps) => {
    return (
        <Dialog
            title={localize('Are you sure you want to cancel?')}
            confirm_button_text={localize('Yes, cancel')}
            cancel_button_text={localize('No, take me back')}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_visible={is_visible}
            has_close_icon
        >
            {localize('If you click Cancel, you’ll lose the inputs you’ve made so far.')}
        </Dialog>
    );
};

export { CancelWizardDialog };
