import { Button, Icon, Input, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Field, Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import Dialog from './dialog.jsx';
import LoadModal from './load-modal.jsx';
import SaveModal from './save-modal.jsx';
import TradeAnimation from './trade-animation.jsx';
import { tabs_title } from '../constants/bot-contents';
import { popover_zindex } from '../constants/z-indexes';
import { connect } from '../stores/connect';
import '../assets/sass/toolbar.scss';

const SearchBox = ({ is_search_loading, onSearch, onSearchBlur, onSearchClear, onSearchKeyUp }) => (
    <div className='toolbar__form'>
        <Formik initialValues={{ search: '' }} onSubmit={values => onSearch(values)}>
            {({ submitForm, values: { search }, setFieldValue }) => (
                <Form>
                    <Field name='search'>
                        {({ field }) => (
                            <Input
                                {...field}
                                className='toolbar__form-field'
                                type='text'
                                name='search'
                                placeholder={localize('Search block...')}
                                onKeyUp={() => onSearchKeyUp(submitForm)}
                                onFocus={submitForm}
                                onBlur={onSearchBlur}
                                trailing_icon={
                                    (search &&
                                        (is_search_loading ? (
                                            <div className='loader' />
                                        ) : (
                                            <Icon
                                                icon='IcCloseCircle'
                                                className='toolbar__btn--icon'
                                                onClick={() => onSearchClear(setFieldValue)}
                                                color='secondary'
                                            />
                                        ))) ||
                                    (!search && <Icon icon='IcSearch' color='disabled' />)
                                }
                            />
                        )}
                    </Field>
                </Form>
            )}
        </Formik>
    </div>
);

const BotNameBox = ({ onBotNameTyped, file_name }) => (
    <div className='toolbar__form'>
        <Formik
            enableReinitialize={true}
            initialValues={{ botname: file_name }}
            onSubmit={({ botname }) => onBotNameTyped(botname)}
        >
            {({ submitForm, setFieldValue }) => {
                return (
                    <Form>
                        <Field name='botname'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    className='toolbar__form-field'
                                    type='text'
                                    onKeyUp={({ target: { value } }) => {
                                        setFieldValue('botname', value, false);
                                        submitForm();
                                    }}
                                    label={localize('Bot name')}
                                    placeholder={localize('Untitled Bot')}
                                    trailing_icon={<Icon icon='IcEdit' />}
                                />
                            )}
                        </Field>
                    </Form>
                );
            }}
        </Formik>
    </div>
);

const WorkspaceGroup = ({
    has_redo_stack,
    has_undo_stack,
    onResetClick,
    onSortClick,
    onUndoClick,
    onZoomInOutClick,
    toggleLoadModal,
    toggleSaveModal,
}) => (
    <div className='toolbar__group toolbar__group-btn'>
        <Popover alignment='bottom' message={localize('Import')} zIndex={popover_zindex.TOOLBAR}>
            <Icon
                icon='IcFolderOpen'
                id='db-toolbar__import-button'
                className='toolbar__icon'
                onClick={() => toggleSaveLoadModal(false)}
            />
        </Popover>
        <Popover alignment='bottom' message={localize('Reset')} zIndex={popover_zindex.TOOLBAR}>
            <Icon icon='IcNewFile' id='db-toolbar__reset-button' className='toolbar__icon' onClick={onResetClick} />
        </Popover>
        <Popover alignment='bottom' message={localize('Save')} zIndex={popover_zindex.TOOLBAR}>
            <Icon
                icon='IcSave'
                id='db-toolbar__save-button'
                className='toolbar__icon'
                onClick={() => toggleSaveLoadModal(true)}
            />
        </Popover>
        <div className='vertical-divider' />
        <Popover alignment='bottom' message={localize('Undo')} zIndex={popover_zindex.TOOLBAR}>
            <Icon
                className='toolbar__icon'
                color={has_undo_stack ? undefined : 'disabled'}
                icon='IcUndo'
                id='db-toolbar__undo-button'
                onClick={() => onUndoClick(/* redo */ false)}
            />
            ️
        </Popover>
        <Popover alignment='bottom' message={localize('Redo')} zIndex={popover_zindex.TOOLBAR}>
            <Icon
                className='toolbar__icon'
                color={has_redo_stack ? undefined : 'disabled'}
                icon='IcRedo'
                id='db-toolbar__redo-button'
                onClick={() => onUndoClick(/* redo */ true)}
            />
        </Popover>
        <Popover alignment='bottom' message={localize('Sort')} zIndex={popover_zindex.TOOLBAR}>
            <Icon icon='IcSort' id='db-toolbar__sort-button' className='toolbar__icon' onClick={onSortClick} />
        </Popover>
        <Popover alignment='bottom' message={localize('Zoom in')} zIndex={popover_zindex.TOOLBAR}>
            <Icon
                icon='IcZoomIn'
                id='db-toolbar__zoom-in-button'
                className='toolbar__icon'
                onClick={() => onZoomInOutClick(true)}
            />
        </Popover>
        <Popover alignment='bottom' message={localize('Zoom out')} zIndex={popover_zindex.TOOLBAR}>
            <Icon
                icon='IcZoomOut'
                id='db-toolbar__zoom-out'
                className='toolbar__icon'
                onClick={() => onZoomInOutClick(false)}
            />
        </Popover>
    </div>
);

const Toolbar = props => {
    const {
        active_tab,
        is_dialog_open,
        is_drawer_open,
        is_stop_button_disabled,
        is_stop_button_visible,
        onOkButtonClick,
        onCancelButtonClick,
        onRunButtonClick,
        onStopButtonClick,
        onToolboxToggle,
    } = props;

    return (
        <div className='toolbar'>
            <div className='toolbar__section'>
                <Popover
                    alignment='bottom'
                    classNameBubble='toolbar__bubble'
                    message={localize('Click here to start building your DBot.')}
                >
                    <Button
                        id='db-toolbar__get-started-button'
                        className='toolbar__btn--icon toolbar__btn--start'
                        has_effect
                        onClick={onToolboxToggle}
                        icon={<Icon icon='IcPuzzle' color='active' />}
                        green
                    >
                        {localize('Get started')}
                    </Button>
                </Popover>
                {active_tab === tabs_title.WORKSPACE && <SearchBox {...props} />}
                <BotNameBox {...props} />
                {active_tab === tabs_title.WORKSPACE && <WorkspaceGroup {...props} />}
            </div>
            {!is_drawer_open && (
                <div className='toolbar__section'>
                    {is_stop_button_visible ? (
                        <Button
                            className='toolbar__btn'
                            is_disabled={is_stop_button_disabled}
                            text={localize('Stop bot')}
                            icon={<Icon icon='IcPause' className='run-panel__button--icon' color='active' />}
                            onClick={onStopButtonClick}
                            has_effect
                            primary
                        />
                    ) : (
                        <Button
                            className='toolbar__btn'
                            text={localize('Run bot')}
                            icon={<Icon icon='IcPlay' className='run-panel__button--icon' color='active' />}
                            onClick={onRunButtonClick}
                            has_effect
                            green
                        />
                    )}
                    <TradeAnimation className='toolbar__animation' should_show_overlay={true} />
                </div>
            )}
            <SaveModal />
            <LoadModal />
            <Dialog
                title={localize('Are you sure?')}
                is_open={is_dialog_open}
                onOkButtonClick={onOkButtonClick}
                onCancelButtonClick={onCancelButtonClick}
            >
                {localize('Any unsaved changes will be lost.')}
            </Dialog>
        </div>
    );
};

Toolbar.propTypes = {
    active_tab: PropTypes.string,
    file_name: PropTypes.string,
    has_redo_stack: PropTypes.bool,
    has_undo_stack: PropTypes.bool,
    is_dialog_open: PropTypes.bool,
    is_drawer_open: PropTypes.bool,
    is_search_loading: PropTypes.bool,
    is_stop_button_disabled: PropTypes.bool,
    is_stop_button_visible: PropTypes.bool,
    onBotNameTyped: PropTypes.func,
    onCancelButtonClick: PropTypes.func,
    onGoogleDriveClick: PropTypes.func,
    onOkButtonClick: PropTypes.func,
    onResetClick: PropTypes.func,
    onRunButtonClick: PropTypes.func,
    onSearch: PropTypes.func,
    onSearchBlur: PropTypes.func,
    onSearchClear: PropTypes.func,
    onSearchKeyUp: PropTypes.func,
    onSortClick: PropTypes.func,
    onStopButtonClick: PropTypes.func,
    onToolboxToggle: PropTypes.func,
    onUndoClick: PropTypes.func,
    onZoomInOutClick: PropTypes.func,
    toggleSaveLoadModal: PropTypes.func,
};

export default connect(({ main_content, run_panel, save_modal, load_modal, toolbar }) => ({
    active_tab: main_content.active_tab,
    file_name: toolbar.file_name,
    has_redo_stack: toolbar.has_redo_stack,
    has_undo_stack: toolbar.has_undo_stack,
    is_dialog_open: toolbar.is_dialog_open,
    is_drawer_open: run_panel.is_drawer_open,
    is_search_loading: toolbar.is_search_loading,
    is_stop_button_disabled: run_panel.is_stop_button_disabled,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    onBotNameTyped: toolbar.onBotNameTyped,
    onCancelButtonClick: toolbar.onResetCancelButtonClick,
    onGoogleDriveClick: toolbar.onGoogleDriveClick,
    onOkButtonClick: toolbar.onResetOkButtonClick,
    onResetClick: toolbar.onResetClick,
    onRunButtonClick: run_panel.onRunButtonClick,
    onSearch: toolbar.onSearch,
    onSearchBlur: toolbar.onSearchBlur,
    onSearchClear: toolbar.onSearchClear,
    onSearchKeyUp: toolbar.onSearchKeyUp,
    onSortClick: toolbar.onSortClick,
    onStopButtonClick: run_panel.onStopButtonClick,
    onToolboxToggle: toolbar.onToolboxToggle,
    onUndoClick: toolbar.onUndoClick,
    onZoomInOutClick: toolbar.onZoomInOutClick,
    toggleLoadModal: load_modal.toggleLoadModal,
    toggleSaveModal: save_modal.toggleSaveModal,
}))(Toolbar);
