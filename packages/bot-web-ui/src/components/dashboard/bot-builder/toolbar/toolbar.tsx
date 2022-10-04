import { Button, Icon, Popover, Dialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import LoadModal from 'Components/load-modal';
import SaveModal from 'Components/save-modal';
import { tabs_title } from 'Constants/bot-contents';
import { popover_zindex } from 'Constants/z-indexes';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TIconButton = {
    popover_message: string;
    icon: string;
    icon_id: string;
    iconOnClick: () => void;
    icon_color?: string;
};

const IconButton = ({ popover_message, icon, icon_id, icon_color, iconOnClick }: TIconButton) => (
    <Popover alignment='bottom' message={popover_message} zIndex={popover_zindex.TOOLBAR} should_disable_pointer_events>
        <Icon
            icon={icon}
            id={icon_id}
            className='toolbar__icon'
            onClick={iconOnClick}
            {...(icon_color ? { color: icon_color } : null)}
        />
    </Popover>
);

type TToolbarButton = {
    popover_message?: string;
    button_id: string;
    button_classname: string;
    buttonOnClick: () => void;
    icon: React.ReactElement;
    button_text: string;
};

const ToolbarButton = ({
    popover_message,
    button_id,
    button_classname,
    buttonOnClick,
    icon,
    button_text,
}: TToolbarButton) => (
    <Popover alignment='bottom' message={popover_message} should_disable_pointer_events>
        <Button id={button_id} className={button_classname} has_effect onClick={buttonOnClick} icon={icon} green>
            {button_text}
        </Button>
    </Popover>
);

type TWorkspaceGroup = {
    has_redo_stack: boolean;
    has_undo_stack: boolean;
    onResetClick: () => void;
    onSortClick: () => void;
    onUndoClick: (param?: boolean) => void;
    onZoomInOutClick: (param?: boolean) => void;
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
    toggleLoadModal,
    toggleSaveModal,
}: TWorkspaceGroup) => (
    <div className='toolbar__group toolbar__group-btn'>
        <IconButton
            popover_message={localize('Reset')}
            icon='IcReset'
            icon_id='db-toolbar__reset-button'
            iconOnClick={onResetClick}
        />
        <IconButton
            popover_message={localize('Import')}
            icon='IcFolderOpen'
            icon_id='db-toolbar__import-button'
            iconOnClick={toggleLoadModal}
        />
        <IconButton
            popover_message={localize('Save')}
            icon='IcSave'
            icon_id='db-toolbar__save-button'
            iconOnClick={toggleSaveModal}
        />
        <div className='vertical-divider' />
        <IconButton
            popover_message={localize('Undo')}
            icon='IcUndo'
            icon_id='db-toolbar__undo-button'
            icon_color={has_undo_stack ? undefined : 'disabled'}
            iconOnClick={() => onUndoClick(/* redo */ false)}
        />
        <IconButton
            popover_message={localize('Redo')}
            icon='IcRedo'
            icon_id='db-toolbar__redo-button'
            icon_color={has_redo_stack ? undefined : 'disabled'}
            iconOnClick={() => onUndoClick(/* redo */ true)}
        />
        <IconButton
            popover_message={localize('Sort')}
            icon='IcSort'
            icon_id='db-toolbar__sort-button'
            iconOnClick={onSortClick}
        />
        <IconButton
            popover_message={localize('Zoom in')}
            icon='IcZoomIn'
            icon_id='db-toolbar__zoom-in-button'
            iconOnClick={() => onZoomInOutClick(/* in */ true)}
        />
        <IconButton
            popover_message={localize('Zoom out')}
            icon='IcZoomOut'
            icon_id='db-toolbar__zoom-out'
            iconOnClick={() => onZoomInOutClick(/* in */ false)}
        />
    </div>
);

type TToolbar = {
    active_tab: string;
    file_name: string;
    has_redo_stack: boolean;
    has_undo_stack: boolean;
    is_dialog_open: boolean;
    is_drawer_open: boolean;
    is_running: boolean;
    is_stop_button_disabled: boolean;
    is_stop_button_visible: boolean;
    closeResetDialog: () => void;
    onOkButtonClick: () => void;
    onResetClick: () => void;
    onRunButtonClick: () => void;
    onSortClick: () => void;
    onUndoClick: () => void;
    onZoomInOutClick: () => void;
    toggleSaveLoadModal: () => void;
    is_mobile: boolean;
    toggleStrategyModal: () => void;
    toggleLoadModal: () => void;
    toggleSaveModal: () => void;
};

const Toolbar = (props: TToolbar) => {
    const {
        is_mobile,
        is_running,
        active_tab,
        is_dialog_open,
        onOkButtonClick,
        closeResetDialog,
        toggleStrategyModal,
        toggleLoadModal,
        toggleSaveModal,
    } = props;

    return (
        <>
            {is_mobile ? (
                <div className='toolbar'>
                    <div className='toolbar__section'>
                        <ToolbarButton
                            button_id='db-toolbar__import-button--mobile'
                            button_classname='toolbar__btn--icon'
                            buttonOnClick={toggleLoadModal}
                            icon={<Icon icon='IcFolderOpenFilled' color='active' />}
                            button_text={localize('Load')}
                        />
                        <ToolbarButton
                            button_id='db-toolbar__quick-strategy-button--mobile'
                            button_classname='toolbar__btn--icon'
                            buttonOnClick={toggleStrategyModal}
                            icon={<Icon icon='IcPuzzle' color='active' />}
                            button_text={localize('Quick')}
                        />
                        <ToolbarButton
                            button_id='db-toolbar__save-button--mobile'
                            button_classname='toolbar__btn--icon'
                            buttonOnClick={toggleSaveModal}
                            icon={<Icon icon='IcSaveFilled' color='active' />}
                            button_text={localize('Save')}
                        />
                    </div>
                </div>
            ) : (
                <div className='toolbar dashboard__toolbar'>
                    <div className='toolbar__section'>
                        {active_tab === tabs_title.WORKSPACE && <WorkspaceGroup {...props} />}
                    </div>
                </div>
            )}
            <SaveModal />
            <LoadModal />
            <Dialog
                title={localize('Are you sure?')}
                is_visible={is_dialog_open}
                confirm_button_text={is_running ? localize('Yes') : localize('OK')}
                onConfirm={onOkButtonClick}
                cancel_button_text={is_running ? localize('No') : localize('Cancel')}
                onCancel={closeResetDialog}
                is_mobile_full_width={false}
                className={'toolbar__dialog dc-dialog__wrapper--fixed'}
                has_close_icon
            >
                {is_running ? (
                    <Localize
                        i18n_default_text='DBot will not proceed with any new trades. Any ongoing trades will be completed by our system. Any unsaved changes will be lost.<0>Note: Please check your statement to view completed transactions.</0>'
                        components={[<div key={0} className='toolbar__dialog-text--second' />]}
                    />
                ) : (
                    localize('Any unsaved changes will be lost.')
                )}
            </Dialog>
        </>
    );
};

export default connect(
    ({ blockly_store, run_panel, save_modal, load_modal, toolbar, ui, quick_strategy }: RootStore) => ({
        active_tab: blockly_store.active_tab,
        file_name: toolbar.file_name,
        has_redo_stack: toolbar.has_redo_stack,
        has_undo_stack: toolbar.has_undo_stack,
        is_dialog_open: toolbar.is_dialog_open,
        is_drawer_open: run_panel.is_drawer_open,
        is_mobile: ui.is_mobile,
        is_running: run_panel.is_running,
        is_stop_button_disabled: run_panel.is_stop_button_disabled,
        is_stop_button_visible: run_panel.is_stop_button_visible,
        closeResetDialog: toolbar.closeResetDialog,
        onOkButtonClick: toolbar.onResetOkButtonClick,
        onResetClick: toolbar.onResetClick,
        onRunButtonClick: run_panel.onRunButtonClick,
        onSortClick: toolbar.onSortClick,
        onUndoClick: toolbar.onUndoClick,
        onZoomInOutClick: toolbar.onZoomInOutClick,
        toggleLoadModal: load_modal.toggleLoadModal,
        toggleSaveModal: save_modal.toggleSaveModal,
        toggleStrategyModal: quick_strategy.toggleStrategyModal,
    })
)(Toolbar);
