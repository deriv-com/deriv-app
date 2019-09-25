import {
    Button,
    Input,
}                           from 'deriv-components';
import {
    Field,
    Formik,
    Form,
}                           from 'formik';
import PropTypes            from 'prop-types';
import React                from 'react';
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
const initial_botname_value = { botname: '' };

const SearchBox = ({ onSearch, onSearchClear, onSearchBlur }) => (
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
);

const BotNameBox = ({ onBotNameTyped, file_name }) => (
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
                                    value={file_name}
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
);

const ButtonGroup = ({
    toggleSaveLoadModal,
    onResetClick,
    onUndoClick,
    onRedoClick,
    onRunClick,
    onSortClick,
    onZoomInOutClick,
}) => (
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
);

const Toolbar = ({
    file_name,
    onToolboxToggle,
    onSearch,
    onSearchBlur,
    onSearchClear,
    onBotNameTyped,
    toggleSaveLoadModal,
    // onGoogleDriveClick,
    onResetClick,
    onUndoClick,
    onRedoClick,
    onZoomInOutClick,
    onSortClick,
    onRunClick,
}) => {

    return (
        <div
            className='toolbar'
        >
            <div className='toolbar__section'>
                <Button
                    id='start'
                    className= 'btn--primary toolbar__btn-icon'
                    has_effect
                    onClick={onToolboxToggle}
                >
                    <StartIcon />
                    <span
                        className='toolbar__btn-icon-text'
                    >{translate('Start')}
                    </span>
                </Button>
                <SearchBox
                    onSearch={onSearch}
                    onSearchClear={onSearchClear}
                    onSearchBlur={onSearchBlur}
                />
                <BotNameBox
                    onBotNameTyped={onBotNameTyped}
                    file_name={file_name}
                />
                <ButtonGroup
                    toggleSaveLoadModal={toggleSaveLoadModal}
                    onResetClick={onResetClick}
                    onUndoClick={onUndoClick}
                    onRedoClick={onRedoClick}
                    onZoomInOutClick={onZoomInOutClick}
                    onSortClick={onSortClick}
                    onRunClick={onRunClick}
                />
            </div>
            <SaveLoadModal />
        </div>
    );
};

Toolbar.propTypes = {
    file_name          : PropTypes.string,
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
    file_name          : toolbar.file_name,
    onBotNameTyped     : toolbar.onBotNameTyped,
    onGoogleDriveClick : toolbar.onGoogleDriveClick,
    onRedoClick        : toolbar.onRedoClick,
    onResetClick       : toolbar.onResetClick,
    onRunClick         : toolbar.onRunClick,
    onSearch           : toolbar.onSearch,
    onSearchBlur       : toolbar.onSearchBlur,
    onSearchClear      : toolbar.onSearchClear,
    onSortClick        : toolbar.onSortClick,
    onToolboxToggle    : toolbar.onToolboxToggle,
    onUndoClick        : toolbar.onUndoClick,
    onZoomInOutClick   : toolbar.onZoomInOutClick,
    toggleSaveLoadModal: toolbar.toggleSaveLoadModal,
}))(Toolbar);
