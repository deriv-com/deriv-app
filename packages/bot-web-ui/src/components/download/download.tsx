import React from 'react';
import { Button, Icon, Popover } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

type TDownloadProps = {
    tab: string;
};

const Download = observer(({ tab }: TDownloadProps) => {
    const { download, run_panel, transactions } = useDBotStore();
    const { is_clear_stat_disabled, is_running } = run_panel;
    const { onClickDownloadTransaction, onClickDownloadJournal } = download;
    const { transactions: transaction_list } = transactions;
    let disabled = false;
    let clickFunction, popover_message;
    if (tab === 'transactions') {
        clickFunction = onClickDownloadTransaction;
        disabled = !transaction_list.length || is_running;
        popover_message = localize('Download your transaction history.');
        if (!transaction_list.length) popover_message = localize('No transaction or activity yet.');
    } else if (tab === 'journal') {
        clickFunction = onClickDownloadJournal;
        popover_message = localize('Download your journal.');
        disabled = is_clear_stat_disabled;
        if (disabled) popover_message = localize('No transaction or activity yet.');
    }
    if (is_running) popover_message = localize('Download is unavailable while your bot is running.');

    return (
        <Popover
            className='run-panel__info'
            classNameBubble='run-panel__info--bubble'
            alignment='bottom'
            message={popover_message}
            zIndex='5'
        >
            <Button
                id='download-button'
                is_disabled={disabled}
                className='download__button'
                icon={
                    <Icon icon='IcDbotDownload' color={disabled ? 'disabled' : undefined} className='download__icon' />
                }
                text={localize('Download')}
                onClick={clickFunction}
                secondary
            />
        </Popover>
    );
});

export default Download;
