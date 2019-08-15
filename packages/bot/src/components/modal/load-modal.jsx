import React from 'react';
import Modal from './base-modal.jsx';
import { connect } from '../../stores/connect';
import { translate } from '../../utils/tools';

const LoadModal = props => {
    const { onSaveLoadTypeChange, onLoadClick, handleFileChange, openLoadModal, closeLoadModal } = props;

    return (
        <Modal title={translate('Load Blocks')} id='load-modal' isOpen={openLoadModal} onClose={closeLoadModal}>
            <form
                id='load-form'
                action='javascript:;' // eslint-disable-line no-script-url
                onSubmit={e => onLoadClick(e)}
            >
                <div className='center-text input-row'>
                    <span className='integration-option'>
                        <input
                            type='radio'
                            id='load-local'
                            name='load-option'
                            value='local'
                            defaultChecked={true}
                            onChange={e => onSaveLoadTypeChange(e)}
                        />
                        <label htmlFor='load-local'>{translate('My computer')}</label>
                    </span>
                    <span className='integration-option invisible'>
                        <input
                            type='radio'
                            id='load-google-drive'
                            name='load-option'
                            value='google-drive'
                            onChange={e => onSaveLoadTypeChange(e)}
                        />
                        <label htmlFor='load-google-drive'>{translate('Google Drive')}</label>
                    </span>
                </div>
                <div className='center-text input-row last'>
                    <button
                        id='load-strategy'
                        type='submit'
                    >
                        {translate('Load')}
                    </button>
                </div>
            </form>
            <input type='file' id='files' style={{ display: 'none' }} onChange={e => handleFileChange(e)} />
        </Modal>
    );
};

export default connect(({ toolbar }) => ({
    onLoadClick         : toolbar.onLoadClick,
    onSaveLoadTypeChange: toolbar.onSaveLoadTypeChange,
    handleFileChange    : toolbar.handleFileChange,
    openLoadModal       : toolbar.openLoadModal,
    closeLoadModal      : toolbar.closeLoadModal,
}))(LoadModal);
