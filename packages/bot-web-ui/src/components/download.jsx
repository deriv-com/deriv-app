// Download Journal and Transactions as CSV files

import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon } from '@deriv/components';
import '../assets/sass/download.scss';
import { connect } from '../stores/connect';

const Download = ({ onDownloadClick }) => {
    return (
        <div className='download__container'>
            <Button
                id='download-button'
                className='download__button'
                icon={<Icon icon='IcDownload' className='download__icon' />}
                onClick={onDownloadClick}
            />
        </div>
    );
};

Download.propTypes = {
    onDownloadClick: PropTypes.func,
};

export default connect(({ download }) => ({
    onDownloadClick: download.onDownloadClick,
}))(Download);
