// Download Journal and Transactions as CSV files

import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, DesktopWrapper } from '@deriv/components';
import '../assets/sass/download.scss';
import { connect } from '../stores/connect';

const Download = ({ onDownloadClick, is_clear_stat_disabled }) => {
    return (
        <DesktopWrapper>
            <div className='download__container'>
                <Button
                    id='download-button'
                    is_disabled={is_clear_stat_disabled}
                    className='download__button'
                    icon={<Icon icon='IcDownload' className='download__icon' />}
                    onClick={onDownloadClick}
                />
            </div>
        </DesktopWrapper>
    );
};

Download.propTypes = {
    onDownloadClick: PropTypes.func,
};

export default connect(({ download, run_panel }) => ({
    onDownloadClick: download.onDownloadClick,
    is_clear_stat_disabled: run_panel.is_clear_stat_disabled,
}))(Download);
