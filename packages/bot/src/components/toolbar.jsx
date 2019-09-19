import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    Button,
    Input,
}                           from 'deriv-components';
import {
    Field,
    Formik,
    Form,
}                           from 'formik';
import {
    StartIcon,
    CloseIcon,
    SearchIcon,
    RenameIcon,
    OpenIcon,
    NewFileIcon,
    SaveIcon,
    UndoIcon,
    RedoIcon,
    PerformIcon,
    ReaarangeIcon,
    ZoomInIcon,
    ZoomOutIcon,
}                           from './Icons.jsx';
import SaveLoadModal        from './save-load-modal.jsx';
import { connect }          from '../stores/connect';
import { translate }        from '../utils/tools';
import                           '../assets/sass/scratch/toolbar.scss';

const initial_search_value = { search: '' };
const initial_botname_value = { botname: 'Untitled Bot' };

const Toolbar = ({
    onToolboxToggle,
    onSearch,
    onSearchBlur,
    onSearchClear,
    onBotNameTyped,
    onResetClick,
    toggleSaveLoadModal,
    // onGoogleDriveClick,
    onUndoClick,
    onRedoClick,
    onZoomInOutClick,
    onSortClick,
    onRunClick,
}) => {

    // const toolbar_element = [
    //     { id: 'start', type: 'button', text: 'Start', action: onToolboxToggle },
    //     {
    //         id      : 'toolbar-action', type    : 'button-group', children: [
    //             { id: 'reset-button', text: 'reset', action: onResetClick },
    //             { id: 'load-xml', text: 'browse', action: onBrowseClick },
    //             { id: 'save-xml', text: 'save', action: onSaveClick },
    //             { id: 'integration', text: 'google drive', action: onGoogleDriveClick },
    //             { type: 'divider' },
    //             { id: 'undo', text: 'undo', action: onUndoClick },
    //             { id: 'redo', text: 'redo', action: onRedoClick },
    //             { type: 'divider' },
    //             { id: 'zoomIn', text: 'zoom in', action: onZoomInClick },
    //             { id: 'zoomOut', text: 'zoom out', action: onZoomOutClick },
    //             { id: 'sort', text: 'sort', action: onSortClick },
    //         ],
    //     },
    // ];

    return (
        <div
            className='toolbar'
        >
            <div className='toolbar__section'>
                <Button
                    id='start'
                    className={classNames(
                        'btn--primary',
                        'toolbar__btn-icon',
                    )}
                    has_effect
                    onClick={onToolboxToggle}
                >
                    <StartIcon />
                    <span
                        className='toolbar__btn-icon-text'
                    >{translate('Start')}
                    </span>
                </Button>
                <div className='toolbar__form'>
                    <Formik
                        initialValues={initial_search_value}
                        onSubmit={values => onSearch(values)}
                    >
                        {
                            ({ submitForm, values: { search }, setValues }) => (
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
                                                        <CloseIcon
                                                            className='toolbar__btn-icon'
                                                            onClick={() => onSearchClear(setValues)}
                                                        />
                                                        : <SearchIcon />
                                                }
                                            />
                                        )}
                                    </Field>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
                <div className='toolbar__form'>
                    <Formik
                        initialValues={initial_botname_value}
                        onSubmit={values => onBotNameTyped(values)}
                    >
                        {
                            ({ submitForm }) => (
                                <Form>
                                    <Field name='botname'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                className='toolbar__form-field'
                                                type='text'
                                                name='botname'
                                                onKeyUp={submitForm}
                                                label={translate('Bot name')}
                                                trailing_icon={
                                                    <RenameIcon />
                                                }
                                            />
                                        )}
                                    </Field>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
                <div className='toolbar__group toolbar__group-btn'>
                    <OpenIcon className='toolbar__icon' onClick={() => toggleSaveLoadModal(false)} />
                    <NewFileIcon className='toolbar__icon' onClick={onResetClick} />
                    <SaveIcon className='toolbar__icon' onClick={() => toggleSaveLoadModal(true)} />
                    <div className='vertical-divider' />
                    <UndoIcon  className='toolbar__icon' onClick={onUndoClick} />️
                    <RedoIcon className='toolbar__icon' onClick={onRedoClick} />
                    <div className='vertical-divider' />
                    <PerformIcon className='toolbar__icon' onClick={onRunClick} />
                    <ReaarangeIcon className='toolbar__icon' onClick={onSortClick} />
                    <ZoomInIcon className='toolbar__icon' onClick={() => onZoomInOutClick(true)} />
                    <ZoomOutIcon className='toolbar__icon' onClick={() => onZoomInOutClick(false)} />
                </div>
            </div>
            <SaveLoadModal />
        </div>
    );
};

Toolbar.propTypes = {
    onBotNameTyped     : PropTypes.func,
    onGoogleDriveClick : PropTypes.func,
    onRedoClick        : PropTypes.func,
    onResetClick       : PropTypes.func,
    onRunClick         : PropTypes.func,
    onSearch           : PropTypes.func,
    onSearchBlur       : PropTypes.func,
    onSearchClear      : PropTypes.func,
    onSortClick        : PropTypes.func,
    onToolboxToggle    : PropTypes.func,
    onUndoClick        : PropTypes.func,
    onZoomInOutClick   : PropTypes.func,
    toggleSaveLoadModal: PropTypes.func,
};

export default connect(({ toolbar }) => ({
    onToolboxToggle    : toolbar.onToolboxToggle,
    onRunClick         : toolbar.onRunClick,
    toggleSaveLoadModal: toolbar.toggleSaveLoadModal,
    onSearch           : toolbar.onSearch,
    onSearchBlur       : toolbar.onSearchBlur,
    onSearchClear      : toolbar.onSearchClear,
    onBotNameTyped     : toolbar.onBotNameTyped,
    onResetClick       : toolbar.onResetClick,
    onGoogleDriveClick : toolbar.onGoogleDriveClick,
    onUndoClick        : toolbar.onUndoClick,
    onRedoClick        : toolbar.onRedoClick,
    onZoomInOutClick   : toolbar.onZoomInOutClick,
    onSortClick        : toolbar.onSortClick,
}))(Toolbar);
