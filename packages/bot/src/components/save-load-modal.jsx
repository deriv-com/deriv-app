import classNames       from 'classnames';
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
    LocalIcon,
    DriveIcon,
}                       from './Icons.jsx';
import { connect }      from '../stores/connect';
import { translate }    from '../utils/tools';
import                       '../assets/sass/saveload-modal.scss';

const initial_option = { is_local: true, save_as_collection: true };

const SaveLoadModal = ({
    onLoadClick,
    onConfirmSave,
    handleFileChange,
    is_save_modal,
    is_saveload_modal_open,
    toggleSaveLoadModal,
    isGoogleDriveConnected,
    onDriveConnect,
    handleFileChange,
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
                    ({ values: { is_local, save_as_collection }, setValues }) => (
                        <Form>
                            <div className='dc-modal-content__modal--saveload'>
                                <div className='dc-modal-row__modal--saveload'>
                                    <RadioGroup
                                        name='is_local'
                                        items={[
                                            {
                                                label: <IconRadio
                                                    text={translate('Local')}
                                                    icon={<LocalIcon />}
                                                    is_selected={is_local}
                                                />,
                                                value: true,
                                            },
                                            {
                                                label: <IconRadio
                                                    text={translate('Google Drive')}
                                                    icon={<DriveIcon />}
                                                    is_selected={!is_local}
                                                    google_drive_connected={isGoogleDriveConnected}
                                                    onDriveConnect={onDriveConnect}
                                                />,
                                                value    : false,
                                                disabled : !isGoogleDriveConnected,
                                                className: isGoogleDriveConnected ? '' : 'dc-radio-group__item-disabled',
                                            },
                                        ]}
                                        selected={is_local}
                                        onToggle={() => setValues({ is_local: !is_local, save_as_collection })}
                                    />
                                </div>
                                {
                                    is_save_modal ?
                                        <>
                                            <Field name='save_as_collection'>
                                                {({ field }) => (
                                                    <Checkbox
                                                        {...field}
                                                        onChange={() => setValues({
                                                            save_as_collection: !save_as_collection,
                                                            is_local,
                                                        })}
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
                                            onChange={e => handleFileChange(e)}
                                        />
                                }
                            </div>
                            <div className='modal--footer'>
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
    const { is_selected, icon, text, google_drive_connected, onDriveConnect } = props;
    const is_drive_radio = text === 'Google Drive';

    return (
        <div className={classNames(
            'saveload-type__container',
            is_selected ? 'saveload-type__container-selected' : ''
        )}
        >
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
    handleFileChange         : PropTypes.func,
    is_google_drive_connected: PropTypes.bool,
    is_save_modal            : PropTypes.bool,
    is_saveload_modal_open   : PropTypes.bool,
    onConfirmSave            : PropTypes.func,
    onLoadClick              : PropTypes.func,
    toggleSaveLoadModal      : PropTypes.func,
};

export default connect(({ toolbar }) => ({
    handleFileChange         : toolbar.handleFileChange,
    is_google_drive_connected: toolbar.is_google_drive_connected,
    is_save_modal            : toolbar.is_save_modal,
    is_saveload_modal_open   : toolbar.is_saveload_modal_open,
    onConfirmSave            : toolbar.onConfirmSave,
    onLoadClick              : toolbar.onLoadClick,
    toggleSaveLoadModal      : toolbar.toggleSaveLoadModal,
}))(SaveLoadModal);
