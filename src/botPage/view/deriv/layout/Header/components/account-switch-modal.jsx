import React from 'react';
import { translate } from '@i18n';
import PropTypes from 'prop-types';

const AccountSwitchModal = ({ is_bot_running, onClose, onAccept }) => (
    <div className='logout-dialog'>
        {is_bot_running ? (
            <div className='logout-dialog__warning-text'>
                <p>
                    {translate(
                        'Binary Bot will not place any new trades. Any trades already placed (but not expired) will be completed by our system. Any unsaved changes will be lost.'
                    )}
                </p>
                <p>
                    {translate(
                        'Note: Please see the Binary.com statement page for details of all confirmed transactions.'
                    )}
                </p>
            </div>
        ) : (
            <div className='logout-dialog__warning-text'>
                <p>{translate('Any unsaved changes will be lost.')}</p>
            </div>
        )}
        <div className='ui-dialog-buttonpane ui-widget-content ui-helper-clearfix'>
            <div className='ui-dialog-buttonset'>
                <button className='button-secondary' onClick={onClose}>
                    {translate('No')}
                </button>
                <button className='button-primary' onClick={onAccept}>
                    {translate('Yes')}
                </button>
            </div>
        </div>
    </div>
);

AccountSwitchModal.propTypes = {
    is_bot_running: PropTypes.bool,
    onClose: PropTypes.func,
    onAccept: PropTypes.func,
};

export default AccountSwitchModal;
