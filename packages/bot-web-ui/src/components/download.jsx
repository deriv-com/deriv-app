import React from 'react';
import { Button, DesktopWrapper, Icon } from '@deriv/components';
import PropTypes from 'prop-types';
import { connect } from '../stores/connect';
import '../assets/sass/download.scss';

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
    is_clear_stat_disabled: PropTypes.bool,
};

export default connect(({ download, run_panel }) => ({
    onDownloadClick: download.onDownloadClick,
    is_clear_stat_disabled: run_panel.is_clear_stat_disabled,
}))(Download);
