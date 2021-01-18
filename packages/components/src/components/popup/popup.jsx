import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Body from './popup-body.jsx';
import Footer from './popup-footer.jsx';
import Header from './popup-header.jsx';
import Modal from '../modal';

const Popup = ({
    active_tab_icon_color,
    balance,
    className,
    close_icon_color,
    header_backgound_color,
    header_button_text,
    header_contents_color,
    header_icon,
    onHeaderButtonClick,
    renderFooter,
    should_show_popup,
    tab_icon_color,
    tabs_detail,
    title,
    togglePopupModal,
}) => {
    const header = () => {
        return (
            <Header
                button_text={header_button_text}
                title={title}
                balance={balance}
                text_color={header_contents_color}
                header_icon={header_icon}
                onButtonClick={onHeaderButtonClick}
            />
        );
    };

    const render_footer = typeof renderFooter === 'function' ? renderFooter() : null;

    return (
        <Modal
            className='popup'
            close_icon_color={close_icon_color}
            do_not_show_header_border
            header_backgound_color={header_backgound_color}
            height='636px'
            do_not_center_header_items
            is_open={should_show_popup}
            renderTitle={() => header()}
            toggleModal={togglePopupModal}
            width='776px'
        >
            <Modal.Body className='dc-popup__body'>
                <Body
                    active_tab_icon_color={active_tab_icon_color}
                    background_color={header_backgound_color}
                    tab_icon_color={tab_icon_color}
                    tabs_detail={tabs_detail}
                />
            </Modal.Body>
            {render_footer && (
                <Modal.Footer
                    has_separator
                    className={classNames({
                        [`popup--${className}`]: className,
                    })}
                >
                    <Footer>{render_footer}</Footer>
                </Modal.Footer>
            )}
        </Modal>
    );
};

Popup.propTypes = {
    active_tab_icon_color: PropTypes.string,
    balance: PropTypes.string,
    className: PropTypes.string,
    close_icon_color: PropTypes.string,
    header_backgound_color: PropTypes.string,
    header_button_text: PropTypes.string,
    header_contents_color: PropTypes.string,
    header_icon: PropTypes.string,
    onHeaderButtonClick: PropTypes.func,
    renderFooter: PropTypes.func,
    should_show_popup: PropTypes.bool,
    tab_icon_color: PropTypes.string,
    tabs_detail: PropTypes.arrayOf(
        PropTypes.shape({
            render_body: PropTypes.func,
            icon: PropTypes.string,
            id: PropTypes.number,
            title: PropTypes.string,
        })
    ).isRequired,
    title: PropTypes.string,
    togglePopupModal: PropTypes.func,
};

export default Popup;
