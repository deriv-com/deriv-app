import React from 'react';
import { Dialog } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import ToolbarButton from './toolbar-button';
import WorkspaceGroup from './workspace-group';

const Toolbar = observer(() => {
    const { run_panel, save_modal, load_modal, toolbar, quick_strategy } = useDBotStore();
    const {
        has_redo_stack,
        has_undo_stack,
        is_dialog_open,
        closeResetDialog,
        onResetOkButtonClick: onOkButtonClick,
        onResetClick,
        onSortClick,
        onUndoClick,
        onZoomInOutClick,
    } = toolbar;
    const { toggleSaveModal } = save_modal;
    const { toggleLoadModal } = load_modal;
    const { loadDataStrategy } = quick_strategy;
    const { is_running } = run_panel;

    const confirm_button_text = is_running ? localize('Yes') : localize('OK');
    const cancel_button_text = is_running ? localize('No') : localize('Cancel');

    return (
        <React.Fragment>
            <div className='toolbar dashboard__toolbar' data-testid='dashboard__toolbar'>
                <div className='toolbar__section'>
                    {isMobile() && (
                        <ToolbarButton
                            popover_message={localize('Click here to start building your Deriv Bot.')}
                            button_id='db-toolbar__get-started-button'
                            button_classname='toolbar__btn toolbar__btn--icon toolbar__btn--start'
                            buttonOnClick={loadDataStrategy}
                            button_text={localize('Quick strategy')}
                        />
                    )}
                    <WorkspaceGroup
                        has_redo_stack={has_redo_stack}
                        has_undo_stack={has_undo_stack}
                        onResetClick={onResetClick}
                        onSortClick={onSortClick}
                        onUndoClick={onUndoClick}
                        onZoomInOutClick={onZoomInOutClick}
                        toggleLoadModal={toggleLoadModal}
                        toggleSaveModal={toggleSaveModal}
                    />
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
                        i18n_default_text='Deriv Bot will not proceed with any new trades. Any ongoing trades will be completed by our system. Any unsaved changes will be lost.<0>Note: Please check your statement to view completed transactions.</0>'
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
});

export default Toolbar;
