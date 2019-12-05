import classNames         from 'classnames';
import {
    Button,
    Input,
    Popover,
}                         from 'deriv-components';
import {
    Field,
    Formik,
    Form,
}                         from 'formik';
import PropTypes          from 'prop-types';
import React              from 'react';
import { localize }       from 'deriv-translations';
import Dialog             from './dialog.jsx';
import {
    ToolbarCloseIcon,
    ToolbarNewFileIcon,
    ToolbarOpenIcon,
    ToolbarReaarangeIcon,
    ToolbarRedoIcon,
    ToolbarRenameIcon,
    ToolbarRunIcon,
    ToolbarSaveIcon,
    ToolbarSearchIcon,
    ToolbarStartIcon,
    ToolbarStopIcon,
    ToolbarUndoIcon,
    ToolbarZoomInIcon,
    ToolbarZoomOutIcon,
}                          from './Icons.jsx';
import SaveLoadModal       from './saveload-modal.jsx';
import TradeAnimation      from './trade-animation.jsx';
import { connect }         from '../stores/connect';
import                          '../assets/sass/scratch/toolbar.scss';

const SearchBox = ({
    is_search_loading,
    onSearch,
    onSearchClear,
    onSearchBlur,
    onSearchKeyUp,
}) => (
    <div className='toolbar__form'>
        <Formik
            initialValues={{ search: '' }}
            onSubmit={values => onSearch(values)}
        >
            {
                ({ submitForm, values: { search }, setFieldValue }) => (
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
                                        search ?
                                            (is_search_loading ?
                                                <div className='loader' /> :
                                                <ToolbarCloseIcon
                                                    className='toolbar__btn--icon'
                                                    onClick={() => onSearchClear(setFieldValue)}
                                                />
                                            )
                                            : <ToolbarSearchIcon />
                                    }
                                />
                            )}
                        </Field>
                    </Form>
                )
            }
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
            {
                ({ submitForm, setFieldValue }) => {
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
                                        trailing_icon={
                                            <ToolbarRenameIcon />
                                        }
                                    />
                                )}
                            </Field>
                        </Form>
                    );
                }
            }
        </Formik>
    </div>
);

const ButtonGroup = ({
    has_redo_stack,
    has_undo_stack,
    is_stop_button_disabled,
    is_stop_button_visible,
    onResetClick,
    onRunClick,
    onSortClick,
    onUndoClick,
    onZoomInOutClick,
    onStopClick,
    toggleSaveLoadModal,
}) => (
    <div className='toolbar__group toolbar__group-btn'>
        <Popover
            alignment='bottom'
            message={localize('Import')}
        >
            <ToolbarOpenIcon
                className='toolbar__icon'
                onClick={() => toggleSaveLoadModal(false)}
            />
        </Popover>
        <Popover
            alignment='bottom'
            message={localize('Reset')}
        >
            <ToolbarNewFileIcon
                className='toolbar__icon'
                onClick={onResetClick}
            />
        </Popover>
        <Popover
            alignment='bottom'
            message={localize('Save')}
        >
            <ToolbarSaveIcon
                className='toolbar__icon'
                onClick={() => toggleSaveLoadModal(true)}
            />
        </Popover>
        <div className='vertical-divider' />
        <Popover
            alignment='bottom'
            message={localize('Undo')}
        >
            <ToolbarUndoIcon
                className={classNames(
                    'toolbar__icon',
                    'toolbar__icon-undo',
                    { 'toolbar__icon--disabled': !has_undo_stack })}
                onClick={() => onUndoClick(/* redo */ false)}
            />️
        </Popover>
        <Popover
            alignment='bottom'
            message={localize('Redo')}
        >
            <ToolbarRedoIcon
                className={classNames(
                    'toolbar__icon',
                    'toolbar__icon-redo',
                    { 'toolbar__icon--disabled': !has_redo_stack })}
                onClick={() => onUndoClick(/* redo */ true)}
            />️
        </Popover>
        <div className='vertical-divider' />
        {is_stop_button_visible ?
            <Popover
                alignment='bottom'
                message={localize('Stop')}
            >
                <ToolbarStopIcon
                    className={classNames(
                        'toolbar__icon',
                        'toolbar__icon-stop',
                        { 'toolbar__icon--disabled': is_stop_button_disabled })}
                    onClick={onStopClick}
                />
            </Popover>
            :
            <Popover
                alignment='bottom'
                message={localize('Run')}
            >
                <ToolbarRunIcon
                    className='toolbar__icon'
                    onClick={onRunClick}
                />
            </Popover>
        }
        <Popover
            alignment='bottom'
            message={localize('Sort')}
        >
            <ToolbarReaarangeIcon
                className='toolbar__icon'
                onClick={onSortClick}
            />
        </Popover>
        <Popover
            alignment='bottom'
            message={localize('Zoom in')}
        >
            <ToolbarZoomInIcon
                className='toolbar__icon'
                onClick={() => onZoomInOutClick(true)}
            />
        </Popover>
        <Popover
            alignment='bottom'
            message={localize('Zoom out')}
        >
            <ToolbarZoomOutIcon
                className='toolbar__icon'
                onClick={() => onZoomInOutClick(false)}
            />
        </Popover>
    </div>
);

const Toolbar = (props) => {
    const {
        is_dialog_open,
        is_drawer_open,
        onOkButtonClick,
        onCancelButtonClick,
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
                        id='start'
                        className='toolbar__btn--icon toolbar__btn--start'
                        has_effect
                        onClick={onToolboxToggle}
                        icon={<ToolbarStartIcon />}
                        green
                    >
                        {localize('Get started')}
                    </Button>
                </Popover>
                <SearchBox {...props} />
                <BotNameBox {...props} />
                <ButtonGroup {...props} />
            </div>
            <div className='toolbar__section'>
                <TradeAnimation
                    className={classNames(
                        'toolbar__animation',
                        { 'animation--hidden': is_drawer_open }
                    )}
                    should_show_overlay={true}
                />

            </div>
            <SaveLoadModal />
            {is_dialog_open &&
            <Dialog
                title={localize('Are you sure?')}
                is_open={is_dialog_open}
                onOkButtonClick={onOkButtonClick}
                onCancelButtonClick={onCancelButtonClick}
            >
                {localize('Any unsaved changes will be lost.')}
            </Dialog>
            }
        </div>
    );
};

Toolbar.propTypes = {
    file_name              : PropTypes.string,
    has_redo_stack         : PropTypes.bool,
    has_undo_stack         : PropTypes.bool,
    is_dialog_open         : PropTypes.bool,
    is_drawer_open         : PropTypes.bool,
    is_search_loading      : PropTypes.bool,
    is_stop_button_disabled: PropTypes.bool,
    is_stop_button_visible : PropTypes.bool,
    onBotNameTyped         : PropTypes.func,
    onCancelButtonClick    : PropTypes.func,
    onGoogleDriveClick     : PropTypes.func,
    onOkButtonClick        : PropTypes.func,
    onResetClick           : PropTypes.func,
    onRunClick             : PropTypes.func,
    onSearch               : PropTypes.func,
    onSearchBlur           : PropTypes.func,
    onSearchClear          : PropTypes.func,
    onSearchKeyUp          : PropTypes.func,
    onSortClick            : PropTypes.func,
    onStopClick            : PropTypes.func,
    onToolboxToggle        : PropTypes.func,
    onUndoClick            : PropTypes.func,
    onZoomInOutClick       : PropTypes.func,
    toggleSaveLoadModal    : PropTypes.func,
};

export default connect(({ run_panel, saveload, toolbar }) => ({
    file_name              : toolbar.file_name,
    has_redo_stack         : toolbar.has_redo_stack,
    has_undo_stack         : toolbar.has_undo_stack,
    is_dialog_open         : toolbar.is_dialog_open,
    is_drawer_open         : run_panel.is_drawer_open,
    is_search_loading      : toolbar.is_search_loading,
    is_stop_button_disabled: run_panel.is_stop_button_disabled,
    is_stop_button_visible : run_panel.is_stop_button_visible,
    onBotNameTyped         : toolbar.onBotNameTyped,
    onCancelButtonClick    : toolbar.onResetCancelButtonClick,
    onGoogleDriveClick     : toolbar.onGoogleDriveClick,
    onOkButtonClick        : toolbar.onResetOkButtonClick,
    onResetClick           : toolbar.onResetClick,
    onRunClick             : toolbar.onRunClick,
    onSearch               : toolbar.onSearch,
    onSearchBlur           : toolbar.onSearchBlur,
    onSearchClear          : toolbar.onSearchClear,
    onSearchKeyUp          : toolbar.onSearchKeyUp,
    onSortClick            : toolbar.onSortClick,
    onStopClick            : toolbar.onStopClick,
    onToolboxToggle        : toolbar.onToolboxToggle,
    onUndoClick            : toolbar.onUndoClick,
    onZoomInOutClick       : toolbar.onZoomInOutClick,
    toggleSaveLoadModal    : saveload.toggleSaveLoadModal,
}))(Toolbar);
