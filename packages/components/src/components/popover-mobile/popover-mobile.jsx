import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import Modal from '../modal/modal.jsx';
import Button from '../button/button.jsx';
import Popover from '../popover/popover.jsx';
import Text from '../text/text.jsx';
import './popover-mobile.scss';

const PopoverMobile = ({
    className,
    is_open,
    setIsOpen,
    children,
    message,
    renderMessage,
    title,
    popover_props,
    modal_props,
    button_text,
}) => {
    if (isMobile()) {
        return (
            <div className={classNames('dc-popover-mobile', className)}>
                {React.cloneElement(React.Children.only(children), { onClick: () => setIsOpen(!is_open) })}
                <Modal
                    className={classNames('dc-popover-mobile__modal', {
                        [`dc-popover-mobile__modal--${className}`]: className,
                    })}
                    has_close_icon={false}
                    is_confirmation_modal
                    is_open={is_open}
                    title={title}
                    toggleModal={() => setIsOpen(!is_open)}
                    {...modal_props}
                >
                    <Modal.Body>
                        {renderMessage ? (
                            renderMessage()
                        ) : (
                            <Text as='p' size='xxs' line_height='m' color='prominent'>
                                {message}
                            </Text>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button large onClick={() => setIsOpen(false)} primary text={button_text} />
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    return (
        <div className={classNames('dc-popover-mobile', className)}>
            <Popover message={message} {...popover_props}>
                {children}
            </Popover>
        </div>
    );
};

PopoverMobile.propTypes = {
    className: PropTypes.string,
    is_open: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
    popover_props: PropTypes.object,
    modal_props: PropTypes.object,
};

export default PopoverMobile;
