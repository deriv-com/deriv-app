import React from 'react';
import Modal from './base-modal.jsx';
import { connect } from '../../stores/connect';
import { translate } from '../../utils/lang/i18n';

const SaveModal = props => {
    const { onSaveLoadTypeChange, onConfirmSave, openSaveModal, closeSaveModal } = props;

    return (
        <Modal title='Save' id='save-modal' isOpen={openSaveModal} onClose={closeSaveModal}>
            <form
                id='save-dialog'
                action='javascript:;' // eslint-disable-line no-script-url
                onSubmit={onConfirmSave}
                className='dialog-content'
            >
                <div className='input-row'>
                    <input
                        id='save-filename'
                        name='save-filename'
                        title='Choose filename for your blocks'
                        type='text'
                        defaultValue='binary-bot'
                        data-lpignore='true'
                        autoComplete='false'
                    />
                </div>
                <div className='input-row center-text'>
                    <span className='integration-option'>
                        <input
                            type='radio'
                            id='save-local'
                            name='save-option'
                            value='local'
                            defaultChecked={true}
                            onChange={e => onSaveLoadTypeChange(e)}
                        />
                        <label htmlFor='save-local'>{translate('My computer')}</label>
                    </span>
                    <span className='integration-option invisible'>
                        <input
                            type='radio'
                            id='save-google-drive'
                            name='save-option'
                            value='google-drive'
                            onChange={e => onSaveLoadTypeChange(e)}
                        />
                        <label htmlFor='save-google-drive'>Google Drive</label>
                    </span>
                </div>
                <div id='collection' className='input-row'>
                    <input
                        title={translate(
                            'Save your blocks individually in a collection. They will be added to your existing workspace (main blocks will be replaced) when loaded.'
                        )}
                        name='save-is-collection'
                        id='save-is-collection'
                        type='checkbox'
                    />
                    <label
                        title={translate(
                            'Save your blocks individually in a collection. They will be added to your existing workspace (main blocks will be replaced) when loaded.'
                        )}
                        htmlFor='save-is-collection'
                    >
                        {translate('Save as collection')}
                    </label>
                    <div className='description'>
                        {translate('Save your blocks and settings for re-use in other strategies')}
                    </div>
                </div>
                <div className='center-text input-row last'>
                    <button
                        type='submit'
                    >
                        {translate('Save')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default connect(({ toolbar }) => ({
    onConfirmSave       : toolbar.onConfirmSave,
    onSaveLoadTypeChange: toolbar.onSaveLoadTypeChange,
    openSaveModal       : toolbar.openSaveModal,
    closeSaveModal      : toolbar.closeSaveModal,
}))(SaveModal);
