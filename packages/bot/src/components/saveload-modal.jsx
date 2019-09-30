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
import {
    ToolbarLocalIcon,
    ToolbarDriveIcon,
}                       from './Icons.jsx';
import { connect }      from '../stores/connect';
import { translate }    from '../utils/tools';
import                       '../assets/sass/saveload-modal.scss';
import                       '../assets/sass/google-drive.scss';

const initial_option = { is_local: true, save_as_collection: true };

const SaveLoadModal = ({
    button_status,
    clickedFileInput,
    handleFileChange,
    is_authorised,
    is_save_modal,
    is_saveload_modal_open,
    onConfirmSave,
    onDriveConnect,
    onLoadClick,
    toggleSaveLoadModal,
}) => {
    const title = is_save_modal ? 'Save Bot' : 'Load Bot';

    return (
        <Modal
            title={translate(title)}
            className='modal--saveload'
            is_open={is_saveload_modal_open}
            toggleModal={toggleSaveLoadModal}
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
                                                    text={translate('Local')}
                                                    icon={<ToolbarLocalIcon />}
                                                />,
                                                value: true,
                                            },
                                            {
                                                id   : 'Drive',
                                                label: <IconRadio
                                                    text={translate('Google Drive')}
                                                    icon={<ToolbarDriveIcon />}
                                                    google_drive_connected={is_authorised}
                                                    onDriveConnect={onDriveConnect}
                                                />,
                                                value    : false,
                                                disabled : !is_authorised,
                                                className: is_authorised ? '' : 'dc-radio-group__item-disabled',
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
                                                        label={translate('Save as collection')}
                                                        classNameLabel='saveload-type__checkbox-text'
                                                    />
                                                )}
                                            </Field>
                                            <div className='saveload-type__checkbox-description'>
                                                {translate('A collection allow you to save block as an individual part which can be add into other bot')}
                                            </div>
                                        </>
                                        :   <input
                                            type='file'
                                            id='files'
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                            onClick={clickedFileInput}
                                        />
                                }
                            </div>
                            <div className='modal__footer'>
                                <Button
                                    type='button'
                                    className={classNames(
                                        'save-load__button',
                                        'btn--secondary',
                                        'btn--secondary--orange',
                                    )}
                                    text={translate('Cancel')}
                                    onClick={() => toggleSaveLoadModal(is_save_modal)}
                                />
                                <Button
                                    type='submit'
                                    className={classNames(
                                        'save-load__button',
                                        'btn--primary',
                                        'btn--primary--orange',
                                    )}
                                    is_loading={button_status === 1}
                                    is_submit_success={button_status === 2}
                                    text={translate('Continue')}
                                />
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </Modal>
    );
};

const IconRadio = props => {
    const { icon, text, google_drive_connected, onDriveConnect } = props;
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
                <p className='saveload-type__text'>{translate(text)}</p>
            </div>
            {
                is_drive_radio &&
                <p className='saveload-type__drive-status' onClick={onDriveConnect}>{google_drive_connected ? 'Disconnect' : 'Connect'}</p>
            }
        </div>
    );
};

SaveLoadModal.propTypes = {
    button_status         : PropTypes.number,
    clickedFileInput      : PropTypes.func,
    handleFileChange      : PropTypes.func,
    is_authorised         : PropTypes.bool,
    is_save_modal         : PropTypes.any,
    is_saveload_modal_open: PropTypes.bool,
    onConfirmSave         : PropTypes.func,
    onDriveConnect        : PropTypes.func,
    onLoadClick           : PropTypes.func,
    toggleSaveLoadModal   : PropTypes.func,
};

export default connect(({ saveload, google_drive }) => ({
    button_status         : saveload.button_status,
    clickedFileInput      : saveload.clickedFileInput,
    handleFileChange      : saveload.handleFileChange,
    is_authorised         : google_drive.is_authorised,
    is_save_modal         : saveload.is_save_modal,
    is_saveload_modal_open: saveload.is_saveload_modal_open,
    onConfirmSave         : saveload.onConfirmSave,
    onDriveConnect        : saveload.onDriveConnect,
    onLoadClick           : saveload.onLoadClick,
    toggleSaveLoadModal   : saveload.toggleSaveLoadModal,
}))(SaveLoadModal);
