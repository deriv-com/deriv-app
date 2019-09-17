import React                from 'react';
import PropTypes            from 'prop-types';
import classNames           from 'classnames';
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

const initial_search_value = { search: '' };
const initial_botname_value = { botname: 'Untitled Bot' };

const Toolbar = ({
    onStartClick,
    onSearch,
    onSearchBlur,
    onSearchClear,
    onBotnameTyped,
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
    //     { id: 'start', type: 'button', text: 'Start', action: onStartClick },
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
            id='toolbar'
            className='toolbar'
        >
            <div className='toolbar__section'>
                <Button
                    id={'start'}
                    className={classNames(
                        'toolbar__btn',
                        'btn--primary',
                        'btn--icon',
                    )}
                    has_effect
                    onClick={onStartClick}
                >
                    <StartIcon />
                    <span
                        className={classNames(
                            'btn--icon-text'
                        )}
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
                        onSubmit={values => onBotnameTyped(values)}
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
                    <button className='toolbar__btn-icon' onClick={() => toggleSaveLoadModal(false)}><OpenIcon /></button>
                    <button className='toolbar__btn-icon' onClick={onResetClick}><NewFileIcon /></button>
                    <button className='toolbar__btn-icon' onClick={() => toggleSaveLoadModal(true)}><SaveIcon /></button>
                    <div className='vd' />
                    <button className='toolbar__btn-icon' onClick={onUndoClick}><UndoIcon />️</button>
                    <button className='toolbar__btn-icon' onClick={onRedoClick}><RedoIcon /></button>
                    <div className='vd' />
                    <button className='toolbar__btn-icon' onClick={onRunClick}><PerformIcon /></button>
                    <button className='toolbar__btn-icon' onClick={onSortClick}><ReaarangeIcon /></button>
                    <button className='toolbar__btn-icon' onClick={() => onZoomInOutClick(true)}><ZoomInIcon /></button>
                    <button className='toolbar__btn-icon' onClick={() => onZoomInOutClick(false)}><ZoomOutIcon /></button>
                </div>
            </div>
            <SaveLoadModal />
        </div>
    );
};

Toolbar.propTypes = {
    onGoogleDriveClick : PropTypes.func,
    onRedoClick        : PropTypes.func,
    onResetClick       : PropTypes.func,
    onRunClick         : PropTypes.func,
    onSearch           : PropTypes.func,
    onSearchBlur       : PropTypes.func,
    onSearchClear      : PropTypes.func,
    onSortClick        : PropTypes.func,
    onStartClick       : PropTypes.func,
    onUndoClick        : PropTypes.func,
    onZoomInOutClick   : PropTypes.func,
    toggleSaveLoadModal: PropTypes.func,
};

export default connect(({ toolbar }) => ({
    onStartClick       : toolbar.onStartClick,
    onRunClick         : toolbar.onRunClick,
    toggleSaveLoadModal: toolbar.toggleSaveLoadModal,
    onSearch           : toolbar.onSearch,
    onSearchBlur       : toolbar.onSearchBlur,
    onSearchClear      : toolbar.onSearchClear,
    onBotnameTyped     : toolbar.onBotnameTyped,
    onResetClick       : toolbar.onResetClick,
    onGoogleDriveClick : toolbar.onGoogleDriveClick,
    onUndoClick        : toolbar.onUndoClick,
    onRedoClick        : toolbar.onRedoClick,
    onZoomInOutClick   : toolbar.onZoomInOutClick,
    onSortClick        : toolbar.onSortClick,
}))(Toolbar);
