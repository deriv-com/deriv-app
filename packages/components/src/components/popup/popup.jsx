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
    header_contents_color,
    header_icon,
    renderFooter,
    renderHeader,
    should_show_popup,
    tab_icon_color,
    tabs_detail,
    title,
    togglePopupModal,
}) => {
    const header = () => {
        const render_header = typeof renderHeader === 'function' ? renderHeader() : null;
        return (
            <Header
                header={render_header}
                title={title}
                balance={balance}
                text_color={header_contents_color}
                header_icon={header_icon}
            />
        );
    };

    const render_footer = typeof renderFooter === 'function' ? renderFooter() : null;

    return (
        <Modal
            className='popup'
            close_icon_color={close_icon_color}
            has_header_border={false}
            header_backgound_color={header_backgound_color}
            height='636px'
            is_item_align_centered={false}
            is_open={should_show_popup}
            renderTitle={() => header()}
            toggleModal={togglePopupModal}
            width='776px'
        >
            <Modal.Body
                className={classNames('popup', {
                    [`popup--${className}`]: className,
                })}
            >
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
    header_contents_color: PropTypes.string,
    header_icon: PropTypes.string,
    should_show_popup: PropTypes.bool,
    tabs_detail: PropTypes.arrayOf(
        PropTypes.shape({
            render_body: PropTypes.func,
            icon: PropTypes.string,
            id: PropTypes.number,
            title: PropTypes.string,
        })
    ).isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    tab_icon_color: PropTypes.string,
    title: PropTypes.string,
    togglePopupModal: PropTypes.func,
};

export default Popup;
