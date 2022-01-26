import classNames from 'classnames';
import React from 'react';
import { isMobile } from '@deriv/shared';
import Modal from '../modal/modal.jsx';
import Button from '../button/button.jsx';
import Popover from '../popover/popover.jsx';
import Text from '../text/text.jsx';
import './popover-mobile.scss';

type PopoverMobileProps = {
    button_text: string;
    children: React.ReactNode;
    className: string;
    desktop_alignment: string;
    is_open: boolean;
    message: string;
    modal_props: unknown;
    popover_props: unknown;
    renderMessage: unknown;
    setIsOpen: () => void;
    title: string;
};

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
}: PopoverMobileProps) => {
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

export default PopoverMobile;
