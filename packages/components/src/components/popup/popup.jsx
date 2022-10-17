import * as React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';
import PopupBody from './popup-body.jsx';
import PopupContext from './popup-context';
import PopupHeader from './popup-header.jsx';
import PopupOverlay from './popup-overlay.jsx';
import PopupOverlayContainer from './popup-overlay-container.jsx';
import MobileFullPageModal from '../mobile-full-page-modal';
import Modal from '../modal';

const Popup = ({
    Component,
    active_tab_icon_color,
    balance,
    close_icon_color,
    currency,
    header_background_color,
    header_banner_text,
    header_big_text,
    header_button_text,
    header_contents_color,
    header_icon,
    onHeaderButtonClick,
    should_show_popup,
    tab_icon_color,
    tabs_detail,
    title,
    togglePopupModal,
}) => {
    const [overlay_ref, setOverlayRef] = React.useState(null);
    const [is_overlay_shown, setIsOverlayShown] = React.useState(false);
    const context_value = {
        Component,
        active_tab_icon_color,
        balance,
        close_icon_color,
        currency,
        header_background_color,
        header_banner_text,
        header_big_text,
        header_button_text,
        header_contents_color,
        header_icon,
        is_overlay_shown,
        onHeaderButtonClick,
        overlay_ref,
        setIsOverlayShown,
        tab_icon_color,
        tabs_detail,
        title,
        togglePopupModal,
    };

    if (isMobile()) {
        return createPortal(
            <PopupContext.Provider value={context_value}>
                <div className='dc-popup'>
                    <MobileFullPageModal
                        container_children={<PopupOverlayContainer refSetter={ref => setOverlayRef(ref)} />}
                        header_background_color={header_background_color}
                        height_offset='39px'
                        is_flex
                        is_popup
                        is_modal_open={should_show_popup}
                        onClickClose={togglePopupModal}
                        page_header_className='dc-popup__mobile-full-page-modal-header'
                        page_overlay
                        renderPageHeader={PopupHeader}
                        should_header_stick_body
                    >
                        <Modal.Body className='dc-popup__body'>
                            <PopupBody />
                        </Modal.Body>
                    </MobileFullPageModal>
                </div>
            </PopupContext.Provider>,
            document.getElementById('popup_root')
        );
    }

    return (
        <PopupContext.Provider value={context_value}>
            <div className='dc-popup'>
                <Modal
                    className='popup'
                    has_close_icon={false}
                    header={<PopupHeader />}
                    header_background_color={header_background_color}
                    header_icon={close_icon_color}
                    height='636px'
                    is_open={should_show_popup}
                    should_header_stick_body
                    toggleModal={togglePopupModal}
                    width='776px'
                >
                    <Modal.Body className='dc-popup__body'>
                        <PopupBody />
                    </Modal.Body>
                    <PopupOverlayContainer refSetter={ref => setOverlayRef(ref)} />
                </Modal>
            </div>
        </PopupContext.Provider>
    );
};

Popup.Overlay = PopupOverlay;

Popup.propTypes = {
    active_tab_icon_color: PropTypes.string,
    balance: PropTypes.number,
    close_icon_color: PropTypes.string,
    header_background_color: PropTypes.string,
    header_banner_text: PropTypes.string,
    header_big_text: PropTypes.string,
    header_button_text: PropTypes.string,
    header_contents_color: PropTypes.string,
    header_icon: PropTypes.string,
    onHeaderButtonClick: PropTypes.func,
    should_show_popup: PropTypes.bool,
    tab_icon_color: PropTypes.string,
    tabs_detail: PropTypes.arrayOf(
        PropTypes.shape({
            has_footer_separator: PropTypes.bool,
            renderBody: PropTypes.func,
            renderFooter: PropTypes.func,
            icon: PropTypes.string,
            id: PropTypes.number,
            title: PropTypes.string,
        })
    ),
    title: PropTypes.string,
    togglePopupModal: PropTypes.func,
    Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.node]),
    currency: PropTypes.string,
};

export default Popup;
