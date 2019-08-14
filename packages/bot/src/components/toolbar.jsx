import React from 'react';
import { connect } from '../stores/connect';

const Toolbar = props => {
    const {
        onResetClick,
        onBrowseClick,
        onSaveClick,
        onGoogleDriveClick,
        onUndoClick,
        onRedoClick,
        onZoomInClick,
        onZoomOutClick,
        onSortClick,
    } = props;

    const toolbar_btn = [
        { id: 'resetButton', text: 'reset', action: onResetClick },
        { id: 'load-xml', text: 'browse', action: onBrowseClick },
        { id: 'save-xml', text: 'save', action: onSaveClick },
        { id: 'integration', text: 'google drive', action: onGoogleDriveClick },
        { id: 'undo', text: 'undo', action: onUndoClick },
        { id: 'redo', text: 'redo', action: onRedoClick },
        { id: 'zoomIn', text: 'zoom in', action: onZoomInClick },
        { id: 'zoomOut', text: 'zoom out', action: onZoomOutClick },
        { id: 'sort', text: 'sort', action: onSortClick },
    ];

    return (
        <div id='toolbox' className='actions_menu show-on-load'>
            {
                toolbar_btn.map(btn => {
                    const { id, text, action } = btn;
                    return <button key={id} id={id} className='toolbox-button' onClick={action}>{text}</button>;
                })
            }
        </div>
    );
};

export default connect(({ toolbar }) => ({
    onResetClick      : toolbar.onResetClick,
    onBrowseClick     : toolbar.onBrowseClick,
    onSaveClick       : toolbar.onSaveClick,
    onGoogleDriveClick: toolbar.onGoogleDriveClick,
    onUndoClick       : toolbar.onUndoClick,
    onRedoClick       : toolbar.onRedoClick,
    handleFileChange  : toolbar.handleFileChange,
    onConfirmSave     : toolbar.onConfirmSave,
    onZoomInClick     : toolbar.onZoomInClick,
    onZoomOutClick    : toolbar.onZoomOutClick,
    onSortClick       : toolbar.onSortClick,
}))(Toolbar);
