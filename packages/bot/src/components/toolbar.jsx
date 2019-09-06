import React            from 'react';
import PropTypes        from 'prop-types';
import classNames       from 'classnames';
import {
    Button,
    Input,
    Form }              from 'deriv-components';
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
} from './Icons.jsx';
import StatusProgress   from './status-progress.jsx';
import { connect }      from '../stores/connect';
import { translate }    from '../utils/tools';

const initial_search_value = { search: '' };
const initial_botname_value = { botname: 'Untitled Bot' };

const Toolbar = props => {
    const {
        onStartClick,
        onSearch,
        onSearchBlur,
        onSearchClear,
        onBotnameTyped,
        onResetClick,
        onBrowseClick,
        onSaveClick,
        // onGoogleDriveClick,
        onUndoClick,
        onRedoClick,
        onZoomInOutClick,
        onSortClick,
        onRunClick,
        contractStatus,
    } = props;

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
                    <Form
                        initialValues={initial_search_value}
                        onSubmit={values => onSearch(values)}
                    >
                        {
                            ({ submitForm, values: { search }, setValues }) => (
                                <Input
                                    className='toolbar__form-field'
                                    type='text'
                                    name='search'
                                    label={translate('Search block...')}
                                    placeholder={translate('Search block...')}
                                    onKeyUp={submitForm}
                                    onFocus={submitForm}
                                    onBlur={onSearchBlur}
                                    trailing_icon={
                                        search ?
                                            <button className='toolbar__btn-icon' onClick={() => onSearchClear(setValues)}><CloseIcon /></button> :
                                            <SearchIcon />
                                    }
                                />
                            )
                        }
                    </Form>
                </div>
                <div className='toolbar__form'>
                    <Form
                        initialValues={initial_botname_value}
                        onSubmit={values => onBotnameTyped(values)}
                    >
                        {
                            ({ submitForm }) => (
                                <Input
                                    className='toolbar__form-field'
                                    type='text'
                                    name='botname'
                                    onKeyUp={submitForm}
                                    label={translate('Bot name')}
                                    trailing_icon={
                                        <RenameIcon />
                                    }
                                />
                            )
                        }
                    </Form>
                </div>
                <div className='toolbar__group toolbar__group-btn'>
                    <button className='toolbar__btn-icon' onClick={onBrowseClick}><OpenIcon /></button>
                    <button className='toolbar__btn-icon' onClick={onResetClick}><NewFileIcon /></button>
                    <button className='toolbar__btn-icon' onClick={onSaveClick}><SaveIcon /></button>
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
            <div className='toolbar__section'>
                <StatusProgress status={contractStatus} />
            </div>
        </div>
    );
};

Toolbar.propTypes = {
    contractStatus    : PropTypes.string,
    handleFileChange  : PropTypes.func,
    onBrowseClick     : PropTypes.func,
    onConfirmSave     : PropTypes.func,
    onGoogleDriveClick: PropTypes.func,
    onRedoClick       : PropTypes.func,
    onResetClick      : PropTypes.func,
    onRunClick        : PropTypes.func,
    onSaveClick       : PropTypes.func,
    onSearch          : PropTypes.func,
    onSearchBlur      : PropTypes.func,
    onSearchClear     : PropTypes.func,
    onSortClick       : PropTypes.func,
    onStartClick      : PropTypes.func,
    onUndoClick       : PropTypes.func,
    onZoomInOutClick  : PropTypes.func,
};

export default connect(({ toolbar }) => ({
    onStartClick      : toolbar.onStartClick,
    onRunClick        : toolbar.onRunClick,
    contractStatus    : toolbar.contractStatus,
    onSearch          : toolbar.onSearch,
    onSearchBlur      : toolbar.onSearchBlur,
    onSearchClear     : toolbar.onSearchClear,
    onBotnameTyped    : toolbar.onBotnameTyped,
    onResetClick      : toolbar.onResetClick,
    onBrowseClick     : toolbar.onBrowseClick,
    onSaveClick       : toolbar.onSaveClick,
    onGoogleDriveClick: toolbar.onGoogleDriveClick,
    onUndoClick       : toolbar.onUndoClick,
    onRedoClick       : toolbar.onRedoClick,
    handleFileChange  : toolbar.handleFileChange,
    onConfirmSave     : toolbar.onConfirmSave,
    onZoomInOutClick  : toolbar.onZoomInOutClick,
    onSortClick       : toolbar.onSortClick,
}))(Toolbar);
