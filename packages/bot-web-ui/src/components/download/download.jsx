import React from 'react';
import { Button, Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import PropTypes from 'prop-types';
import { connect } from 'Stores/connect';

const Download = ({ tab, onClickDownloadTransaction, onClickDownloadJournal, is_clear_stat_disabled }) => {
    let clickFunction, popover_message;
    if (tab === 'transactions') {
        clickFunction = onClickDownloadTransaction;
        popover_message = localize('Download your transaction history.');
    } else if (tab === 'journal') {
        clickFunction = onClickDownloadJournal;
        popover_message = localize('Download your journal.');
    }
    return (
        <Popover
            className='run-panel__info'
            classNameBubble='run-panel__info--bubble'
            alignment='bottom'
            message={popover_message}
            zIndex={5}
        >
            <Button
                id='download-button'
                is_disabled={is_clear_stat_disabled}
                className='download__button'
                icon={
                    <Icon icon='IcDownload' color={is_clear_stat_disabled && 'disabled'} className='download__icon' />
                }
                onClick={clickFunction}
            />
        </Popover>
    );
};

Download.propTypes = {
    onClickDownloadTransaction: PropTypes.func,
    onClickDownloadJournal: PropTypes.func,
    tab: PropTypes.string,
    is_clear_stat_disabled: PropTypes.bool,
};

export default connect(({ download, run_panel }) => ({
    onClickDownloadTransaction: download.onClickDownloadTransaction,
    onClickDownloadJournal: download.onClickDownloadJournal,
    is_clear_stat_disabled: run_panel.is_clear_stat_disabled,
}))(Download);
