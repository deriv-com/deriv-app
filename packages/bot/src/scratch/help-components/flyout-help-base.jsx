import React            from 'react';
import FlyoutStore      from '../../stores/flyout-store';
import { connect }      from '../../stores/connect';

export const FlyoutVideo = (props) => {
    return (
        <iframe
            src={props.url}
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            width={'100%'}
        />
    );

};

const HelpBase = (props) => {
    const { onSequenceClick } = props;

    return (
        <React.Fragment>
            <div className='flyout__help-header'>
                <button className='flyout__item-back' onClick={() => FlyoutStore.onBackClick()}>← Back</button>
                &nbsp;<span><b>{props.title}</b></span>
            </div>
            <div className='flyout__help-content'>
                {props.children}
            </div>
            <div className='flyour__help-footer'>
                <button className='flyout__item-previous' onClick={() => onSequenceClick(props.title, 'previous')}>Previous</button>
                <button className='flyout__item-next' onClick={() => onSequenceClick(props.title, 'next')}>Next</button>
            </div>
        </React.Fragment>
    );
};

export default connect(({ flyout }) => ({
    onSequenceClick: flyout.onSequenceClick,
}))(HelpBase);
