import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import {
    Button,
    Checkbox,
    Modal,
}                       from 'deriv-components';
import {
    Formik,
    Form,
}                       from 'formik';
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
    isSaveModal,
    isModalOpen,
    toggleSaveLoadModal,
    // isGoogleDriveConnected,
    // onDriveConnect,
}) => {
    const title = isSaveModal ? 'Save Bot' : 'Load Bot';

    return (
        <Modal
            title={translate(title)}
            className='modal--saveload'
            is_open={isModalOpen}
            toggleModal={toggleSaveLoadModal}
        >
            <Formik
                initialValues={initial_option}
                onSubmit={
                    isSaveModal ?
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
                                    isSaveModal ?
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
                                        <input type='file' id='files' style={{ display: 'none' }} onChange={e => handleFileChange(e)} />
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
                                    onClick={toggleSaveLoadModal}
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
    handleFileChange      : PropTypes.func,
    isGoogleDriveConnected: PropTypes.bool,
    isModalOpen           : PropTypes.bool,
    isSaveModal           : PropTypes.any,
    onConfirmSave         : PropTypes.func,
    onDriveConnect        : PropTypes.func,
    onLoadClick           : PropTypes.func,
    toggleSaveLoadModal   : PropTypes.func,
};

export default connect(({ toolbar }) => ({
    onLoadClick           : toolbar.onLoadClick,
    onConfirmSave         : toolbar.onConfirmSave,
    onDriveConnect        : toolbar.onDriveConnect,
    isGoogleDriveConnected: toolbar.isGoogleDriveConnected,
    isSaveModal           : toolbar.isSaveModal,
    isModalOpen           : toolbar.isModalOpen,
    toggleSaveLoadModal   : toolbar.toggleSaveLoadModal,
    handleFileChange      : toolbar.handleFileChange,
}))(SaveLoadModal);
