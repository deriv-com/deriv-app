import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import ToolbarIcon from './toolbar-icon';

type TWorkspaceGroup = {
    has_redo_stack: boolean;
    has_undo_stack: boolean;
    onResetClick: () => void;
    onSortClick: () => void;
    onUndoClick: (param?: boolean) => void;
    onZoomInOutClick: (param?: boolean) => void;
    setPreviewOnPopup: (param: boolean) => void;
    toggleLoadModal: () => void;
    toggleSaveModal: () => void;
};

const WorkspaceGroup = ({
    has_redo_stack,
    has_undo_stack,
    onResetClick,
    onSortClick,
    onUndoClick,
    onZoomInOutClick,
    setPreviewOnPopup,
    toggleLoadModal,
    toggleSaveModal,
}: TWorkspaceGroup) => (
    <div className='toolbar__group toolbar__group-btn'>
        <ToolbarIcon
            popover_message={localize('Reset')}
            icon='IcReset'
            icon_id='db-toolbar__reset-button'
            action={onResetClick}
        />
        <ToolbarIcon
            popover_message={localize('Import')}
            icon='IcFolderOpen'
            icon_id='db-toolbar__import-button'
            action={() => {
                setPreviewOnPopup(true);
                toggleLoadModal();
            }}
        />
        <ToolbarIcon
            popover_message={localize('Save')}
            icon='IcSave'
            icon_id='db-toolbar__save-button'
            action={toggleSaveModal}
        />
        <div className='vertical-divider' />
        <ToolbarIcon
            popover_message={localize('Undo')}
            icon='IcUndo'
            icon_id='db-toolbar__undo-button'
            icon_color={has_undo_stack ? undefined : 'disabled'}
            action={() => onUndoClick(/* redo */ false)}
        />
        <ToolbarIcon
            popover_message={localize('Redo')}
            icon='IcRedo'
            icon_id='db-toolbar__redo-button'
            icon_color={has_redo_stack ? undefined : 'disabled'}
            action={() => onUndoClick(/* redo */ true)}
        />
        <ToolbarIcon
            popover_message={localize('Sort')}
            icon='IcSort'
            icon_id='db-toolbar__sort-button'
            action={onSortClick}
        />
        <ToolbarIcon
            popover_message={localize('Zoom in')}
            icon='IcZoomIn'
            icon_id='db-toolbar__zoom-in-button'
            action={() => onZoomInOutClick(/* in */ true)}
        />
        <ToolbarIcon
            popover_message={localize('Zoom out')}
            icon='IcZoomOut'
            icon_id='db-toolbar__zoom-out'
            action={() => onZoomInOutClick(/* in */ false)}
        />
    </div>
);

export default connect(({ dashboard }: RootStore) => ({
    setPreviewOnPopup: dashboard.setPreviewOnPopup,
}))(WorkspaceGroup);
