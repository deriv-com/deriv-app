import { Button, Modal } from 'deriv-components';
import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';

import '../assets/sass/dialog.scss';

const Dialog = ({
    children,
    closeModal,
    is_open,
    title,
}) => {
    return (
        <Modal
            className='bot-dialog'
            is_open={is_open}
            has_close_icon={false}
            toggleModal={closeModal}
        >
            <div className='bot-dialog__content'>
                <div className='bot-dialog__header'>
                    {title}
                </div>
                <div className='bot-dialog__text'>
                    {children}
                </div>
                <Button
                    className={classNames(
                        'btn--primary',
                        'bot-dialog__ok-button'
                    )}
                    text={'Ok'}
                    onClick={closeModal}
                    has_effect
                />
                {/* Todo Add array to send more buttons if requierd */}
            </div>
        </Modal>
    );
};

Dialog.propTypes = {
    children  : PropTypes.node,
    closeModal: PropTypes.func,
    is_open   : PropTypes.bool,
    title     : PropTypes.string,
};

export default Dialog;
