import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';

type TDeleteServerBot = {
    is_open: boolean;
    setVisibility: (is_open: boolean) => void;
};

const ClearJournalTransactions = observer(({ is_open, setVisibility }: TDeleteServerBot) => {
    const { server_bot } = useDBotStore();
    const { resetJournal, resetTransactions } = server_bot;
    const onOkButtonClick = () => {
        resetJournal();
        resetTransactions();
        setVisibility(false);
    };

    return (
        <Dialog
            title={localize('Are you sure?')}
            is_visible={is_open}
            confirm_button_text={localize('Ok')}
            onConfirm={onOkButtonClick}
            cancel_button_text={localize('Cancel')}
            onCancel={() => setVisibility(false)}
            onClose={() => setVisibility(false)}
            is_mobile_full_width={false}
            className={'dc-dialog__wrapper--fixed'}
            portal_element_id='modal_root'
            has_close_icon
        >
            <Text color='prominent' line_height='xl' size='xs'>
                <Localize i18n_default_text='This will clear all data in the summary and journal panels. All counters will be reset to zero.' />
            </Text>
        </Dialog>
    );
});

export default ClearJournalTransactions;
