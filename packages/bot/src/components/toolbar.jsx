import classNames           from 'classnames';
import {
    Button,
    Input,
    PopoverWrapper,
}                           from 'deriv-components';
import {
    Field,
    Formik,
    Form,
}                           from 'formik';
import PropTypes            from 'prop-types';
import React                from 'react';
import Dialog               from './dialog.jsx';
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
}                           from './Icons.jsx';
import SaveLoadModal        from './saveload-modal.jsx';
import TradeAnimation       from './trade-animation.jsx';
import { connect }          from '../stores/connect';
import { translate }        from '../utils/tools';
import                           '../assets/sass/scratch/toolbar.scss';

const SearchBox = ({ onSearch, onSearchClear, onSearchBlur }) => (
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
                                    placeholder={translate('Search block...')}
                                    onKeyUp={submitForm}
                                    onFocus={submitForm}
                                    onBlur={onSearchBlur}
                                    trailing_icon={
                                        search ?
                                            <ToolbarCloseIcon
                                                className='toolbar__btn--icon'
                                                onClick={() => onSearchClear(setFieldValue)}
                                            />
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
                                        label={translate('Bot name')}
                                        placeholder={translate('Untitled Bot')}
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
    is_stop_button_disabled,
    is_stop_button_visible,
    onResetClick,
    onUndoClick,
    onRedoClick,
    onRunClick,
    onSortClick,
    onZoomInOutClick,
    onStopClick,
    toggleSaveLoadModal,
}) => (
    <div className='toolbar__group toolbar__group-btn'>
        <PopoverWrapper
            alignment='bottom'
            message={translate('Import')}
        >
            <ToolbarOpenIcon className='toolbar__icon' onClick={() => toggleSaveLoadModal(false)} />
        </PopoverWrapper>
        <PopoverWrapper
            alignment='bottom'
            message={translate('Reset')}
        >
            <ToolbarNewFileIcon className='toolbar__icon' onClick={onResetClick} />
        </PopoverWrapper>
        <PopoverWrapper
            alignment='bottom'
            message={translate('Save')}
        >
            <ToolbarSaveIcon
                className='toolbar__icon'
                onClick={() => toggleSaveLoadModal(true)}
            />
        </PopoverWrapper>
        <div className='vertical-divider' />
        <PopoverWrapper
            alignment='bottom'
            message={translate('Undo')}
        >
            <ToolbarUndoIcon className='toolbar__icon' onClick={onUndoClick} />️
        </PopoverWrapper>
        <PopoverWrapper
            alignment='bottom'
            message={translate('Redo')}
        >
            <ToolbarRedoIcon className='toolbar__icon' onClick={onRedoClick} />
        </PopoverWrapper>
        <div className='vertical-divider' />
        {is_stop_button_visible ?
            <PopoverWrapper
                alignment='bottom'
                message={translate('Stop')}
            >
                <ToolbarStopIcon
                    className={classNames(
                        'toolbar__icon',
                        'toolbar__icon--stop',
                        { 'toolbar__icon--disabled': is_stop_button_disabled })}
                    onClick={onStopClick}
                />
            </PopoverWrapper>
            :
            <PopoverWrapper
                alignment='bottom'
                message={translate('Run')}
            >
                <ToolbarRunIcon className='toolbar__icon' onClick={onRunClick} />
            </PopoverWrapper>
        }
        <PopoverWrapper
            alignment='bottom'
            message={translate('Sort')}
        >
            <ToolbarReaarangeIcon className='toolbar__icon' onClick={onSortClick} />
        </PopoverWrapper>
        <PopoverWrapper
            alignment='bottom'
            message={translate('Zoom in')}
        >
            <ToolbarZoomInIcon className='toolbar__icon' onClick={() => onZoomInOutClick(true)} />
        </PopoverWrapper>
        <PopoverWrapper
            alignment='bottom'
            message={translate('Zoom out')}
        >
            <ToolbarZoomOutIcon className='toolbar__icon' onClick={() => onZoomInOutClick(false)} />
        </PopoverWrapper>
    </div>
);

const Toolbar = ({
    file_name,
    is_dialog_open,
    is_drawer_open,
    is_stop_button_disabled,
    is_stop_button_visible,
    onBotNameTyped,
    onOkButtonClick,
    onCancelButtonClick,
    onRedoClick,
    onResetClick,
    onRunClick,
    onSearch,
    onSearchBlur,
    onSearchClear,
    onSortClick,
    onStopClick,
    onToolboxToggle,
    onUndoClick,
    onZoomInOutClick,
    toggleSaveLoadModal,
}) => (
    <div className='toolbar'>
        <div className='toolbar__section'>
            <PopoverWrapper
                alignment='bottom'
                classNameBubble='toolbar__bubble'
                message={translate('Click here to start building your DBot.')}
            >
                <Button
                    id='start'
                    className='toolbar__btn--icon toolbar__btn--start'
                    has_effect
                    onClick={onToolboxToggle}
                    icon={<ToolbarStartIcon />}
                    green
                >
                    {translate('Get started')}
                </Button>
            </PopoverWrapper>
            <SearchBox
                onSearch={onSearch}
                onSearchClear={onSearchClear}
                onSearchBlur={onSearchBlur}
            />
            <BotNameBox
                file_name={file_name}
                onBotNameTyped={onBotNameTyped}
            />
            <ButtonGroup
                is_stop_button_disabled={is_stop_button_disabled}
                is_stop_button_visible={is_stop_button_visible}
                onRedoClick={onRedoClick}
                onResetClick={onResetClick}
                onRunClick={onRunClick}
                onSortClick={onSortClick}
                onStopClick={onStopClick}
                onUndoClick={onUndoClick}
                onZoomInOutClick={onZoomInOutClick}
                toggleSaveLoadModal={toggleSaveLoadModal}
            />
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
            title={translate('Are you sure?')}
            is_open={is_dialog_open}
            onOkButtonClick={onOkButtonClick}
            onCancelButtonClick={onCancelButtonClick}
        >
            {translate('Any unsaved changes will be lost.')}
        </Dialog>
        }
    </div>
);

Toolbar.propTypes = {
    file_name              : PropTypes.string,
    is_dialog_open         : PropTypes.bool,
    is_drawer_open         : PropTypes.bool,
    is_stop_button_disabled: PropTypes.bool,
    is_stop_button_visible : PropTypes.bool,
    onBotNameTyped         : PropTypes.func,
    onCancelButtonClick    : PropTypes.func,
    onGoogleDriveClick     : PropTypes.func,
    onOkButtonClick        : PropTypes.func,
    onRedoClick            : PropTypes.func,
    onResetClick           : PropTypes.func,
    onRunClick             : PropTypes.func,
    onSearch               : PropTypes.func,
    onSearchBlur           : PropTypes.func,
    onSearchClear          : PropTypes.func,
    onSortClick            : PropTypes.func,
    onStopClick            : PropTypes.func,
    onToolboxToggle        : PropTypes.func,
    onUndoClick            : PropTypes.func,
    onZoomInOutClick       : PropTypes.func,
    toggleSaveLoadModal    : PropTypes.func,
};

export default connect(({ run_panel, saveload, toolbar }) => ({
    file_name              : toolbar.file_name,
    is_dialog_open         : toolbar.is_dialog_open,
    is_drawer_open         : run_panel.is_drawer_open,
    is_stop_button_disabled: run_panel.is_stop_button_disabled,
    is_stop_button_visible : run_panel.is_stop_button_visible,
    onBotNameTyped         : toolbar.onBotNameTyped,
    onCancelButtonClick    : toolbar.onResetCancelButtonClick,
    onGoogleDriveClick     : toolbar.onGoogleDriveClick,
    onOkButtonClick        : toolbar.onResetOkButtonClick,
    onRedoClick            : toolbar.onRedoClick,
    onResetClick           : toolbar.onResetClick,
    onRunClick             : toolbar.onRunClick,
    onSearch               : toolbar.onSearch,
    onSearchBlur           : toolbar.onSearchBlur,
    onSearchClear          : toolbar.onSearchClear,
    onSortClick            : toolbar.onSortClick,
    onStopClick            : toolbar.onStopClick,
    onToolboxToggle        : toolbar.onToolboxToggle,
    onUndoClick            : toolbar.onUndoClick,
    onZoomInOutClick       : toolbar.onZoomInOutClick,
    toggleSaveLoadModal    : saveload.toggleSaveLoadModal,
}))(Toolbar);
