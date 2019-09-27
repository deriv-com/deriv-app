import classNames       from 'classnames';
import {
    Button,
    Checkbox,
    Modal,
}                       from 'deriv-components';
import {
    Formik,
    Form,
}                       from 'formik';
import PropTypes        from 'prop-types';
import React            from 'react';
// import {
//     LocalIcon,
//     DriveIcon,
// }                       from './Icons.jsx';
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
    // is_google_drive_connected,
    // onDriveConnect,
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
                            <div className='modal--content'>
                                {/* TODO <div className='modal--row'>
                                    <IconCheckbox
                                        onClick={() => setValues({ is_local: true, save_as_collection })}
                                        is_selected={is_local}
                                        icon={<LocalIcon />}
                                        text={translate('Local')}
                                    />
                                    <IconCheckbox
                                        onClick={
                                            () => isGoogleDriveConnected
                                            && setValues({ is_local: false, save_as_collection })
                                        }
                                        is_selected={!is_local}
                                        icon={<DriveIcon />}
                                        text={translate('Google Drive')}
                                        google_drive_connected={isGoogleDriveConnected}
                                        onDriveConnect={onDriveConnect}
                                    />
                                </div> */}
                                {
                                    is_save_modal ?
                                        <>
                                            <Checkbox
                                                onChange={() => setValues({
                                                    save_as_collection: !save_as_collection,
                                                    is_local,
                                                })}
                                                defaultChecked={save_as_collection}
                                                label={translate('Save as collection')}
                                                classNameLabel='saveload-type__checkbox-text'
                                            />
                                            <div className='saveload-type__checkbox-description'>
                                                {translate('A collection allow you to save block as an individual part which can be add into other bot')}
                                            </div>
                                        </> :
                                        <input type='file' id='files' style={{ display: 'none' }} onChange={handleFileChange} />
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

// const IconCheckbox = props => {
//     const { onClick, is_selected, icon, text, google_drive_connected, onDriveConnect } = props;
//     const is_drive_checkbox = text === 'Google Drive';

//     return (
//         <div className='saveload-type__container'>
//             <div
//                 className={
//                     classNames(
//                         'saveload-type__checkbox',
//                         is_drive_checkbox && !google_drive_connected ? 'saveload-type__checkbox-disable' : ''
//                     )
//                 }
//                 onClick={() => {
//                     const checkbox = document.getElementById(`saveload-type__checkbox-${is_drive_checkbox ? 'drive' : 'local'}`);
//                     checkbox.click();
//                 }}
//             >
//                 <Checkbox
//                     disabled={is_drive_checkbox && !google_drive_connected}
//                     id={`saveload-type__checkbox-${is_drive_checkbox ? 'drive' : 'local'}`}
//                     onChange={onClick}
//                     defaultChecked={is_selected}
//                     ref={ ref => {
//                         console.log(ref); // eslint-disable-line
//                         ref.checked = is_selected;
//                     }
//                     }
//                 />
//                 {
//                     icon &&
//                     React.cloneElement(
//                         icon,
//                         { className: classNames('saveload-type__icon', icon.props.className) },
//                     )
//                 }
//                 <p className='saveload-type__text'>{translate(text)}</p>
//             </div>
//             {
//                 is_drive_checkbox &&
//                 <p className='saveload-type__drive-status' onClick={onDriveConnect}>{google_drive_connected ? 'Disconnect' : 'Connect'}</p>
//             }
//         </div>
//     );
// };

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
