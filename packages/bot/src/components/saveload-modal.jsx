import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import {
    Button,
    Checkbox,
    Modal,
    RadioGroup,
}                       from 'deriv-components';
import {
    Formik,
    Form,
    Field,
}                       from 'formik';
import { localize }     from 'deriv-translations';
import {
    ToolbarLocalIcon,
    ToolbarDriveIcon,
}                       from './Icons.jsx';
import { connect }      from '../stores/connect';
import '../assets/sass/google-drive.scss';
import '../assets/sass/saveload-modal.scss';

const initial_option = { is_local: true, save_as_collection: false };

const SaveLoadModal = ({
    button_status,
    handleFileChange,
    is_authorised,
    is_save_modal,
    is_saveload_modal_open,
    onConfirmSave,
    onDriveConnect,
    onLoadClick,
    toggleSaveLoadModal,
}) => {
    const title = localize(is_save_modal ? 'Save Bot' : 'Load Bot');

    return (
        <Modal
            title={title}
            className='modal--saveload'
            width='384px'
            is_open={is_saveload_modal_open}
            toggleModal={() => toggleSaveLoadModal()}
        >
            <Formik
                initialValues={initial_option}
                onSubmit={
                    is_save_modal ?
                        (values => onConfirmSave(values)) :
                        (values => onLoadClick(values))
                }
            >
                {
                    ({ values: { is_local, save_as_collection }, setFieldValue }) => (
                        <Form>
                            <div className='modal__content'>
                                <div className='modal__content-row'>
                                    <RadioGroup
                                        className='radio-group__saveload-type'
                                        name='is_local'
                                        items={[
                                            {
                                                id   : 'local',
                                                label: <IconRadio
                                                    text={localize('Local')}
                                                    icon={<ToolbarLocalIcon />}
                                                />,
                                                value: true,
                                            },
                                            {
                                                id   : 'drive',
                                                label: <IconRadio
                                                    text={'Google Drive'}
                                                    icon={<ToolbarDriveIcon />}
                                                    google_drive_connected={is_authorised}
                                                    onDriveConnect={onDriveConnect}
                                                />,
                                                value    : false,
                                                disabled : !is_authorised,
                                                className: classNames({
                                                    'dc-radio-group__item-disabled': !is_authorised,
                                                }),
                                            },
                                        ]}
                                        selected={is_authorised ? is_local : true}
                                        onToggle={() => setFieldValue('is_local', !is_local)}
                                    />
                                </div>
                                {
                                    is_save_modal ?
                                        <>
                                            <Field name='save_as_collection'>
                                                {({ field }) => (
                                                    <Checkbox
                                                        {...field}
                                                        onChange={() =>
                                                            setFieldValue('save_as_collection', !save_as_collection)
                                                        }
                                                        defaultChecked={save_as_collection}
                                                        label={localize('Save as collection')}
                                                        classNameLabel='saveload-type__checkbox-text'
                                                    />
                                                )}
                                            </Field>
                                            <div className='saveload-type__checkbox-description'>
                                                {localize('This option allows you to save your strategy as a collection of individual blocks which you can add to other strategies.')}
                                            </div>
                                        </>
                                        : <input
                                            type='file'
                                            id='files'
                                            accept='.xml'
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                }
                            </div>
                            <div className='modal__footer'>
                                <Button
                                    type='button'
                                    className='modal__footer--button'
                                    text={localize('Cancel')}
                                    onClick={() => toggleSaveLoadModal(is_save_modal)}
                                    secondary
                                />
                                <Button
                                    className='modal__footer--button'
                                    type='submit'
                                    is_loading={button_status === 1}
                                    is_submit_success={button_status === 2}
                                    text={localize('Continue')}
                                    primary
                                />
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </Modal>
    );
};

const IconRadio = ({
    icon,
    text,
    google_drive_connected,
    onDriveConnect,
}) => {
    const is_drive_radio = text === 'Google Drive';

    return (
        <div className='saveload-type__container'>
            <div className='saveload-type__radio'>
                {
                    icon &&
                    React.cloneElement(
                        icon,
                        { className: classNames('saveload-type__icon', icon.props.className) },
                    )
                }
                <p className={classNames(
                    'saveload-type__radio-text',
                    {
                        'saveload-type__radio-text--disabled':
                            is_drive_radio
                            &&
                            !google_drive_connected,
                    })}
                >
                    {localize(text)}
                </p>
            </div>
            {
                is_drive_radio &&
                <p
                    className='saveload-type__drive-status'
                    onClick={onDriveConnect}
                >
                    {
                        localize(google_drive_connected ?
                            localize('Disconnect')
                            :
                            localize('Connect'))
                    }
                </p>
            }
        </div>
    );
};

SaveLoadModal.propTypes = {
    button_status         : PropTypes.number,
    handleFileChange      : PropTypes.func,
    is_authorised         : PropTypes.bool,
    is_save_modal         : PropTypes.bool,
    is_saveload_modal_open: PropTypes.bool,
    onConfirmSave         : PropTypes.func,
    onDriveConnect        : PropTypes.func,
    onLoadClick           : PropTypes.func,
    toggleSaveLoadModal   : PropTypes.func,
};

export default connect(({ saveload, google_drive }) => ({
    button_status         : saveload.button_status,
    handleFileChange      : saveload.handleFileChange,
    is_authorised         : google_drive.is_authorised,
    is_save_modal         : saveload.is_save_modal,
    is_saveload_modal_open: saveload.is_saveload_modal_open,
    onConfirmSave         : saveload.onConfirmSave,
    onDriveConnect        : saveload.onDriveConnect,
    onLoadClick           : saveload.onLoadClick,
    toggleSaveLoadModal   : saveload.toggleSaveLoadModal,
}))(SaveLoadModal);
