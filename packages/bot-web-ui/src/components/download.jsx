import React from 'react';
import { Button, DesktopWrapper, Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import PropTypes from 'prop-types';
import { connect } from '../stores/connect';
import '../assets/sass/download.scss';

const Download = ({ tab, onClickDownloadTransaction, onClickDownloadJournal, is_clear_stat_disabled }) => {
    let click_function, popover_message;
    if (tab === 'transactions') {
        click_function = onClickDownloadTransaction;
        popover_message = localize('Download your transaction history.');
    } else if (tab === 'journal') {
        click_function = onClickDownloadJournal;
        popover_message = localize('Download your journal.');
    }
    return (
        <DesktopWrapper>
            <div className='download__container'>
                <Popover
                    className='run-panel__info'
                    classNameBubble='run-panel__info--bubble'
                    alignment='bottom'
                    message={popover_message}
                    zIndex={4}
                >
                    <Button
                        id='download-button'
                        is_disabled={is_clear_stat_disabled}
                        className='download__button'
                        icon={<Icon icon='IcDownload' className='download__icon' />}
                        onClick={click_function}
                    />
                </Popover>
            </div>
        </DesktopWrapper>
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
