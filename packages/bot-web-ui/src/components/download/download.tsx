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
    const { is_clear_stat_disabled } = run_panel;
    const { onClickDownloadTransaction, onClickDownloadJournal } = download;
    const { elements } = transactions;
    let disabled = false;
    let clickFunction, popover_message;
    if (tab === 'transactions') {
        clickFunction = onClickDownloadTransaction;
        popover_message = localize('Download your transaction history.');
        disabled = !elements.length;
    } else if (tab === 'journal') {
        clickFunction = onClickDownloadJournal;
        popover_message = localize('Download your journal.');
        disabled = is_clear_stat_disabled;
    }
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
                icon={<Icon icon='IcDownload' color={disabled ? 'disabled' : undefined} className='download__icon' />}
                text={localize('Download')}
                onClick={clickFunction}
            />
        </Popover>
    );
});

export default Download;
