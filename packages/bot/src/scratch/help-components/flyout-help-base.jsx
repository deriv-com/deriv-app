import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../stores/connect';

export const FlyoutVideo = (props) => {
    return (
        <iframe
            src={props.url}
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            height='200px'
            allowFullScreen
            width={'100%'}
        />
    );

};

const HelpBase = (props) => {
    const { onSequenceClick, title, children } = props;

    return (
        <React.Fragment>
            <div className='flyout__help-header'>
                <button className='flyout__item-btn flyout__item-btn-back' onClick={() => Blockly.derivWorkspace.reshowFlyout()}>← Back</button>
                <span className='flyout__help-title'>{title}</span>
            </div>
            <div className='flyout__help-content'>
                {children}
            </div>
            <div className='flyout__help-footer'>
                <button className='flyout__item-btn flyout__item-btn-previous' onClick={() => onSequenceClick(title, 'previous')}>Previous</button>
                <button className='flyout__item-btn flyout__item-btn-next' onClick={() => onSequenceClick(title, 'next')}>Next</button>
            </div>
        </React.Fragment>
    );
};

HelpBase.propTypes = {
    children       : PropTypes.any,
    onSequenceClick: PropTypes.func,
    title          : PropTypes.string,
};

export default connect(({ flyout }) => ({
    onSequenceClick: flyout.onSequenceClick,
}))(HelpBase);
