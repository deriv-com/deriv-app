import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

type TDeleteServerBot = {
    is_open: boolean;
    setVisibility: (is_open: boolean) => void;
    onDelete: () => void;
};

const DeleteServerBot: React.FC<TDeleteServerBot> = ({ is_open, setVisibility, onDelete }) => {
    return (
        <Dialog
            title={localize('Delete bot')}
            is_visible={is_open}
            confirm_button_text={localize('Yes, delete')}
            onConfirm={onDelete}
            cancel_button_text={localize('No')}
            onCancel={() => setVisibility(false)}
            is_mobile_full_width={false}
            className={'dc-dialog__delete-strategy--delete'}
            has_close_icon
        >
            <div>
                <Text color='prominent' line_height='s' size='xs'>
                    <Localize i18n_default_text='Your bot will be permanently deleted when you hit ' />
                    <strong>
                        <Localize i18n_default_text='Yes, delete.' />
                    </strong>
                </Text>
            </div>
            <div>
                <Text color='prominent' line_height='xl' size='xs'>
                    <Localize i18n_default_text='Are you sure you want to delete it?' />
                </Text>
            </div>
        </Dialog>
    );
};

export default DeleteServerBot;
