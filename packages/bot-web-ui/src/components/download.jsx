import React from 'react';
import { Button, DesktopWrapper, Icon } from '@deriv/components';
import PropTypes from 'prop-types';
import { connect } from '../stores/connect';
import '../assets/sass/download.scss';

const Download = ({ tab, onClickDownloadTransaction, onClickDownloadJournal, is_clear_stat_disabled }) => {
    let clickFunction;
    if (tab === 'transactions') {
        clickFunction = onClickDownloadTransaction;
    } else if (tab === 'journal') {
        clickFunction = onClickDownloadJournal;
    }
    return (
        <DesktopWrapper>
            <div className='download__container'>
                <Button
                    id='download-button'
                    is_disabled={is_clear_stat_disabled}
                    className='download__button'
                    icon={<Icon icon='IcDownload' className='download__icon' />}
                    onClick={clickFunction}
                />
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
