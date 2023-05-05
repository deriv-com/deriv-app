import React from 'react';
import { Dialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import WorkspaceGroup from './workspace-group';
import ToolbarButton from './toolbar-button';
import { isMobile } from '@deriv/shared';

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
    toggleLoadModal: () => void;
    toggleSaveModal: () => void;
    loadDataStrategy: () => void;
};

const Toolbar = (props: TToolbar) => {
    const { is_running, is_dialog_open, onOkButtonClick, closeResetDialog } = props;
    const confirm_button_text = is_running ? localize('Yes') : localize('OK');
    const cancel_button_text = is_running ? localize('No') : localize('Cancel');

    return (
        <React.Fragment>
            <div className='toolbar dashboard__toolbar' data-testid='dashboard__toolbar'>
                <div className='toolbar__section'>
                    {isMobile() && (
                        <ToolbarButton
                            popover_message={localize('Click here to start building your DBot.')}
                            button_id='db-toolbar__get-started-button'
                            button_classname='toolbar__btn toolbar__btn--icon toolbar__btn--start'
                            buttonOnClick={props.loadDataStrategy}
                            button_text={localize('Quick strategy')}
                        />
                    )}
                    <WorkspaceGroup {...props} />
                </div>
            </div>
            <Dialog
                portal_element_id='modal_root'
                title={localize('Are you sure?')}
                is_visible={is_dialog_open}
                confirm_button_text={confirm_button_text}
                onConfirm={onOkButtonClick}
                cancel_button_text={cancel_button_text}
                onCancel={closeResetDialog}
                is_mobile_full_width={false}
                className={'toolbar__dialog'}
                has_close_icon
            >
                {is_running ? (
                    <Localize
                        i18n_default_text='DBot will not proceed with any new trades. Any ongoing trades will be completed by our system. Any unsaved changes will be lost.<0>Note: Please check your statement to view completed transactions.</0>'
                        components={[
                            <div
                                key={0}
                                className='toolbar__dialog-text--second'
                                data-testid='toolbar__dialog-text--second'
                            />,
                        ]}
                    />
                ) : (
                    localize('Any unsaved changes will be lost.')
                )}
            </Dialog>
        </React.Fragment>
    );
};

export default connect(({ blockly_store, run_panel, save_modal, load_modal, toolbar, quick_strategy }: RootStore) => ({
    active_tab: blockly_store.active_tab,
    file_name: toolbar.file_name,
    has_redo_stack: toolbar.has_redo_stack,
    has_undo_stack: toolbar.has_undo_stack,
    is_dialog_open: toolbar.is_dialog_open,
    is_drawer_open: run_panel.is_drawer_open,
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
    loadDataStrategy: quick_strategy.loadDataStrategy,
}))(Toolbar);
