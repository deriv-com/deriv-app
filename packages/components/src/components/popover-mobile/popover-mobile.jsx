import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import Button from '../button/button';
import Modal from '../modal/modal';
import Popover from '../popover/popover.jsx';
import Text from '../text/text';
import './popover-mobile.scss';

const PopoverMobile = ({
    button_text,
    children,
    className,
    desktop_alignment,
    is_open,
    message,
    modal_props,
    popover_props,
    renderMessage,
    setIsOpen,
    title,
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
            <Popover message={message} alignment={desktop_alignment} {...popover_props}>
                {children}
            </Popover>
        </div>
    );
};

PopoverMobile.propTypes = {
    button_text: PropTypes.string,
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    desktop_alignment: PropTypes.string,
    is_open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    modal_props: PropTypes.object,
    popover_props: PropTypes.object,
    renderMessage: PropTypes.object,
    setIsOpen: PropTypes.func.isRequired,
    title: PropTypes.string,
};

export default PopoverMobile;
